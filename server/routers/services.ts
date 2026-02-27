import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "../db";
import { services } from "../../drizzle/schema";
import { protectedProcedure, router } from "../_core/trpc";

export const servicesRouter = router({
  // List all services for a client
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db
      .select()
      .from(services)
      .where(eq(services.clientId, ctx.user.clientId))
      .orderBy(desc(services.createdAt));

    return result;
  }),

  // Get single service
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(services)
        .where(
          and(
            eq(services.id, input.id),
            eq(services.clientId, ctx.user.clientId)
          )
        )
        .limit(1);

      if (!result[0]) {
        throw new Error("Service not found");
      }

      return result[0];
    }),

  // Create new service
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.string().optional(),
        benefits: z.string().optional(),
        targetPersonas: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(services).values({
        clientId: ctx.user.clientId,
        name: input.name,
        description: input.description || null,
        category: input.category || null,
        benefits: input.benefits || null,
        targetPersonas: input.targetPersonas || null,
        createdBy: ctx.user.id,
      });

      const insertedId = Number(result.insertId);

      const created = await db
        .select()
        .from(services)
        .where(eq(services.id, insertedId))
        .limit(1);

      return created[0];
    }),

  // Update service
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        benefits: z.string().optional(),
        targetPersonas: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updates } = input;

      await db
        .update(services)
        .set(updates)
        .where(
          and(
            eq(services.id, id),
            eq(services.clientId, ctx.user.clientId)
          )
        );

      const updated = await db
        .select()
        .from(services)
        .where(eq(services.id, id))
        .limit(1);

      return updated[0];
    }),

  // Delete service
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(services)
        .where(
          and(
            eq(services.id, input.id),
            eq(services.clientId, ctx.user.clientId)
          )
        );

      return { success: true };
    }),
});
