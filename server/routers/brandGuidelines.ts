import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { brandGuidelines } from "../../drizzle/schema";
import { protectedProcedure, router } from "../_core/trpc";

export const brandGuidelinesRouter = router({
  // Get brand guidelines for current client (one per client)
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db
      .select()
      .from(brandGuidelines)
      .where(eq(brandGuidelines.clientId, ctx.user.clientId))
      .limit(1);

    return result[0] || null;
  }),

  // Create or update brand guidelines
  upsert: protectedProcedure
    .input(
      z.object({
        tagline: z.string().optional(),
        positioningStatement: z.string().optional(),
        brandVoice: z.string().optional(),
        toneGuidelines: z.string().optional(),
        keyMessages: z.string().optional(),
        messagingPillars: z.string().optional(),
        valueProposition: z.string().optional(),
        languageDos: z.string().optional(),
        languageDonts: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if guidelines already exist
      const existing = await db
        .select()
        .from(brandGuidelines)
        .where(eq(brandGuidelines.clientId, ctx.user.clientId))
        .limit(1);

      if (existing[0]) {
        // Update existing
        await db
          .update(brandGuidelines)
          .set(input)
          .where(eq(brandGuidelines.id, existing[0].id));

        const updated = await db
          .select()
          .from(brandGuidelines)
          .where(eq(brandGuidelines.id, existing[0].id))
          .limit(1);

        return updated[0];
      } else {
        // Create new
        const result = await db.insert(brandGuidelines).values({
          clientId: ctx.user.clientId,
          ...input,
          createdBy: ctx.user.id,
        });

        const insertedId = Number(result.insertId);

        const created = await db
          .select()
          .from(brandGuidelines)
          .where(eq(brandGuidelines.id, insertedId))
          .limit(1);

        return created[0];
      }
    }),
});
