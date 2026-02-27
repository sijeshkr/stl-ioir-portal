import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";
import { serialize } from "cookie";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this");
const COOKIE_NAME = "auth_session";

// Helper to generate JWT token
async function generateToken(userId: number, email: string) {
  return await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

// Helper to set auth cookie
function setAuthCookie(token: string) {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export const customAuthRouter = router({
  // Register new user
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(input.password, 10);

      // Create user
      const [newUser] = await db.insert(users).values({
        name: input.name,
        email: input.email,
        passwordHash,
        loginMethod: "email",
        emailVerified: false,
        role: "client_viewer",
      });

      // Generate token
      const token = await generateToken(newUser.insertId, input.email);

      // Set cookie
      ctx.res?.setHeader("Set-Cookie", setAuthCookie(token));

      return {
        success: true,
        user: {
          id: newUser.insertId,
          name: input.name,
          email: input.email,
        },
      };
    }),

  // Login existing user
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Find user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Check if user uses email/password login
      if (user.loginMethod !== "email" || !user.passwordHash) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This account uses a different login method",
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);

      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Update last signed in
      await db
        .update(users)
        .set({ lastSignedIn: new Date() })
        .where(eq(users.id, user.id));

      // Generate token
      const token = await generateToken(user.id, user.email!);

      // Set cookie
      ctx.res?.setHeader("Set-Cookie", setAuthCookie(token));

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    }),

  // Logout user
  logout: publicProcedure.mutation(async ({ ctx }) => {
    // Clear cookie
    ctx.res?.setHeader(
      "Set-Cookie",
      serialize(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      })
    );

    return { success: true };
  }),

  // Request password reset
  requestPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Find user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (!user || user.loginMethod !== "email") {
        // Don't reveal if user exists for security
        return { success: true, message: "If the email exists, a reset link has been sent" };
      }

      // Generate reset token
      const resetToken = await generateToken(user.id, user.email!);
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Save reset token
      await db
        .update(users)
        .set({
          resetToken,
          resetTokenExpiry,
        })
        .where(eq(users.id, user.id));

      // TODO: Send email with reset link
      // For now, we'll just return the token (in production, send via email)
      console.log(`Password reset token for ${input.email}: ${resetToken}`);

      return {
        success: true,
        message: "If the email exists, a reset link has been sent",
        // Remove this in production:
        resetToken, // Only for development/testing
      };
    }),

  // Reset password with token
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, "Reset token is required"),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Verify token
      let payload;
      try {
        const { payload: jwtPayload } = await jwtVerify(input.token, JWT_SECRET);
        payload = jwtPayload;
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid or expired reset token",
        });
      }

      // Find user with matching token
      const [user] = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.id, payload.userId as number),
            eq(users.resetToken, input.token)
          )
        )
        .limit(1);

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid or expired reset token",
        });
      }

      // Check if token is expired
      if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Reset token has expired",
        });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(input.newPassword, 10);

      // Update password and clear reset token
      await db
        .update(users)
        .set({
          passwordHash,
          resetToken: null,
          resetTokenExpiry: null,
        })
        .where(eq(users.id, user.id));

      return {
        success: true,
        message: "Password has been reset successfully",
      };
    }),

  // Get current user (for auth context)
  me: publicProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    // Get token from cookie
    const cookies = ctx.req?.headers.cookie?.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const token = cookies?.[COOKIE_NAME];

    if (!token) {
      return null;
    }

    try {
      // Verify token
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // Get user from database
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.userId as number))
        .limit(1);

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      };
    } catch (error) {
      return null;
    }
  }),
});
