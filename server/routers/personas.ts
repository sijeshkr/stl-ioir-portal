import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "../db";
import { personas } from "../../drizzle/schema";
import { protectedProcedure, router } from "../_core/trpc";

export const personasRouter = router({
  // List all personas for a client
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db
      .select()
      .from(personas)
      .where(eq(personas.clientId, ctx.user.clientId))
      .orderBy(desc(personas.createdAt));

    return result;
  }),

  // Get single persona
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(personas)
        .where(
          and(
            eq(personas.id, input.id),
            eq(personas.clientId, ctx.user.clientId)
          )
        )
        .limit(1);

      if (!result[0]) {
        throw new Error("Persona not found");
      }

      return result[0];
    }),

  // Create new persona
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        demographics: z.string().optional(),
        psychographics: z.string().optional(),
        painPoints: z.string().optional(),
        goals: z.string().optional(),
        preferredChannels: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(personas).values({
        clientId: ctx.user.clientId,
        name: input.name,
        description: input.description || null,
        demographics: input.demographics || null,
        psychographics: input.psychographics || null,
        painPoints: input.painPoints || null,
        goals: input.goals || null,
        preferredChannels: input.preferredChannels || null,
        createdBy: ctx.user.id,
      });

      const insertedId = Number(result.insertId);

      const created = await db
        .select()
        .from(personas)
        .where(eq(personas.id, insertedId))
        .limit(1);

      return created[0];
    }),

  // Update persona
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        demographics: z.string().optional(),
        psychographics: z.string().optional(),
        painPoints: z.string().optional(),
        goals: z.string().optional(),
        preferredChannels: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updates } = input;

      await db
        .update(personas)
        .set(updates)
        .where(
          and(
            eq(personas.id, id),
            eq(personas.clientId, ctx.user.clientId)
          )
        );

      const updated = await db
        .select()
        .from(personas)
        .where(eq(personas.id, id))
        .limit(1);

      return updated[0];
    }),

  // Delete persona
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(personas)
        .where(
          and(
            eq(personas.id, input.id),
            eq(personas.clientId, ctx.user.clientId)
          )
        );

      return { success: true };
    }),
});
