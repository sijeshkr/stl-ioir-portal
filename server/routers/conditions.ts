import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "../db";
import { conditions } from "../../drizzle/schema";
import { protectedProcedure, router } from "../_core/trpc";

export const conditionsRouter = router({
  // List all conditions for a client
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db
      .select()
      .from(conditions)
      .where(eq(conditions.clientId, ctx.user.clientId))
      .orderBy(desc(conditions.createdAt));

    return result;
  }),

  // Get single condition
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(conditions)
        .where(
          and(
            eq(conditions.id, input.id),
            eq(conditions.clientId, ctx.user.clientId)
          )
        )
        .limit(1);

      if (!result[0]) {
        throw new Error("Condition not found");
      }

      return result[0];
    }),

  // Create new condition
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        symptoms: z.string().optional(),
        treatments: z.string().optional(),
        relatedServices: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(conditions).values({
        clientId: ctx.user.clientId,
        name: input.name,
        description: input.description || null,
        symptoms: input.symptoms || null,
        treatments: input.treatments || null,
        relatedServices: input.relatedServices || null,
        createdBy: ctx.user.id,
      });

      const insertedId = Number(result.insertId);

      const created = await db
        .select()
        .from(conditions)
        .where(eq(conditions.id, insertedId))
        .limit(1);

      return created[0];
    }),

  // Update condition
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        symptoms: z.string().optional(),
        treatments: z.string().optional(),
        relatedServices: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updates } = input;

      await db
        .update(conditions)
        .set(updates)
        .where(
          and(
            eq(conditions.id, id),
            eq(conditions.clientId, ctx.user.clientId)
          )
        );

      const updated = await db
        .select()
        .from(conditions)
        .where(eq(conditions.id, id))
        .limit(1);

      return updated[0];
    }),

  // Delete condition
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(conditions)
        .where(
          and(
            eq(conditions.id, input.id),
            eq(conditions.clientId, ctx.user.clientId)
          )
        );

      return { success: true };
    }),
});
