import { z } from "zod";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { getDb } from "../db";
import { contentCalendarTopics, content } from "../../drizzle/schema";
import { protectedProcedure, router } from "../_core/trpc";

export const contentCalendarRouter = router({
  // List all topics for a monthly plan
  list: protectedProcedure
    .input(
      z.object({
        monthlyPlanId: z.number().optional(),
        startDate: z.string().optional(), // YYYY-MM-DD
        endDate: z.string().optional(),   // YYYY-MM-DD
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(contentCalendarTopics.clientId, ctx.user.clientId)];
      
      if (input.monthlyPlanId) {
        conditions.push(eq(contentCalendarTopics.monthlyPlanId, input.monthlyPlanId));
      }
      
      if (input.startDate) {
        conditions.push(gte(contentCalendarTopics.scheduledDate, input.startDate));
      }
      
      if (input.endDate) {
        conditions.push(lte(contentCalendarTopics.scheduledDate, input.endDate));
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const topics = await db
        .select()
        .from(contentCalendarTopics)
        .where(and(...conditions))
        .orderBy(contentCalendarTopics.scheduledDate);

      return topics;
    }),

  // Get single topic with linked content
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const topic = await db
        .select()
        .from(contentCalendarTopics)
        .where(
          and(
            eq(contentCalendarTopics.id, input.id),
            eq(contentCalendarTopics.clientId, ctx.user.clientId)
          )
        )
        .limit(1);

      if (!topic[0]) {
        throw new Error("Topic not found");
      }

      // Get linked content if exists
      let linkedContent = null;
      if (topic[0].contentId) {
        const contentResult = await db
          .select()
          .from(content)
          .where(eq(content.id, topic[0].contentId))
          .limit(1);
        linkedContent = contentResult[0] || null;
      }

      return {
        ...topic[0],
        linkedContent,
      };
    }),

  // Create new topic
  create: protectedProcedure
    .input(
      z.object({
        monthlyPlanId: z.number(),
        strategyId: z.number().optional(),
        scheduledDate: z.string(), // YYYY-MM-DD
        topicTitle: z.string().min(1),
        cta: z.string().optional(),
        audience: z.string().optional(),
        platform: z.enum(["linkedin", "facebook", "instagram", "twitter", "tiktok", "youtube", "blog", "newsletter", "gmb"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(contentCalendarTopics).values({
        clientId: ctx.user.clientId,
        monthlyPlanId: input.monthlyPlanId,
        strategyId: input.strategyId || null,
        scheduledDate: input.scheduledDate,
        topicTitle: input.topicTitle,
        cta: input.cta || null,
        audience: input.audience || null,
        platform: input.platform,
        notes: input.notes || null,
        status: "planned",
        createdBy: ctx.user.id,
      });

      const insertedId = Number(result.insertId);

      // Fetch and return the created topic
      const created = await db
        .select()
        .from(contentCalendarTopics)
        .where(eq(contentCalendarTopics.id, insertedId))
        .limit(1);

      return created[0];
    }),

  // Update topic
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        scheduledDate: z.string().optional(),
        topicTitle: z.string().optional(),
        cta: z.string().optional(),
        audience: z.string().optional(),
        platform: z.enum(["linkedin", "facebook", "instagram", "twitter", "tiktok", "youtube", "blog", "newsletter", "gmb"]).optional(),
        status: z.enum(["planned", "in_progress", "completed", "published"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updates } = input;

      await db
        .update(contentCalendarTopics)
        .set(updates)
        .where(
          and(
            eq(contentCalendarTopics.id, id),
            eq(contentCalendarTopics.clientId, ctx.user.clientId)
          )
        );

      return { success: true };
    }),

  // Delete topic
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(contentCalendarTopics)
        .where(
          and(
            eq(contentCalendarTopics.id, input.id),
            eq(contentCalendarTopics.clientId, ctx.user.clientId)
          )
        );

      return { success: true };
    }),

  // Update topic status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["planned", "in_progress", "completed", "published"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(contentCalendarTopics)
        .set({ status: input.status })
        .where(
          and(
            eq(contentCalendarTopics.id, input.id),
            eq(contentCalendarTopics.clientId, ctx.user.clientId)
          )
        );

      // Fetch and return the updated topic
      const updated = await db
        .select()
        .from(contentCalendarTopics)
        .where(eq(contentCalendarTopics.id, input.id))
        .limit(1);

      return updated[0];
    }),

  // Link topic to content (when user starts creating content from topic)
  linkToContent: protectedProcedure
    .input(
      z.object({
        topicId: z.number(),
        contentId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(contentCalendarTopics)
        .set({
          contentId: input.contentId,
          status: "in_progress",
        })
        .where(
          and(
            eq(contentCalendarTopics.id, input.topicId),
            eq(contentCalendarTopics.clientId, ctx.user.clientId)
          )
        );

      return { success: true };
    }),
});
