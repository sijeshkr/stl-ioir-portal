import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { monthlyPlans, monthlyPlanStrategies, contentScope } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export const monthlyPlansRouter = router({
  // List all monthly plans for a client
  list: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const plans = await db
        .select()
        .from(monthlyPlans)
        .where(eq(monthlyPlans.clientId, input.clientId))
        .orderBy(desc(monthlyPlans.createdAt));

      return plans;
    }),

  // Get a single monthly plan with strategies and scope
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const plan = await db
        .select()
        .from(monthlyPlans)
        .where(eq(monthlyPlans.id, input.id))
        .limit(1);

      if (!plan[0]) throw new Error("Monthly plan not found");

      // Get associated strategies
      const strategies = await db
        .select()
        .from(monthlyPlanStrategies)
        .where(eq(monthlyPlanStrategies.monthlyPlanId, input.id));

      // Get content scope
      const scope = await db
        .select()
        .from(contentScope)
        .where(eq(contentScope.monthlyPlanId, input.id));

      return {
        ...plan[0],
        strategies,
        scope,
      };
    }),

  // Create a new monthly plan
  create: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        name: z.string(),
        month: z.string(), // YYYY-MM format
        startDate: z.string(),
        endDate: z.string(),
        notes: z.string().optional(),
        strategies: z.array(
          z.object({
            strategyId: z.number(),
            allocation: z.number(), // percentage 0-100
          })
        ),
        scope: z.array(
          z.object({
            platform: z.string(),
            contentType: z.string(),
            quantity: z.number(),
            budget: z.number().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Create monthly plan
      const [plan] = await db.insert(monthlyPlans).values({
        clientId: input.clientId,
        name: input.name,
        month: input.month,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        status: "draft",
        notes: input.notes || null,
        createdBy: ctx.user!.id,
      });

      const planId = plan.insertId;

      // Add strategies
      if (input.strategies.length > 0) {
        await db.insert(monthlyPlanStrategies).values(
          input.strategies.map((s) => ({
            monthlyPlanId: planId,
            strategyId: s.strategyId,
            allocation: s.allocation,
          }))
        );
      }

      // Add content scope
      if (input.scope.length > 0) {
        await db.insert(contentScope).values(
          input.scope.map((s) => ({
            monthlyPlanId: planId,
            platform: s.platform,
            contentType: s.contentType,
            quantity: s.quantity,
            budget: s.budget || null,
          }))
        );
      }

      return { id: planId };
    }),

  // Update monthly plan
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["draft", "pending_approval", "approved", "locked"]).optional(),
        strategies: z
          .array(
            z.object({
              strategyId: z.number(),
              allocation: z.number(),
            })
          )
          .optional(),
        scope: z
          .array(
            z.object({
              platform: z.string(),
              contentType: z.string(),
              quantity: z.number(),
              budget: z.number().optional(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.startDate) updateData.startDate = new Date(input.startDate);
      if (input.endDate) updateData.endDate = new Date(input.endDate);
      if (input.notes !== undefined) updateData.notes = input.notes;
      if (input.status) updateData.status = input.status;

      if (Object.keys(updateData).length > 0) {
        await db
          .update(monthlyPlans)
          .set(updateData)
          .where(eq(monthlyPlans.id, input.id));
      }

      // Update strategies if provided
      if (input.strategies) {
        // Delete existing strategies
        await db
          .delete(monthlyPlanStrategies)
          .where(eq(monthlyPlanStrategies.monthlyPlanId, input.id));

        // Insert new strategies
        if (input.strategies.length > 0) {
          await db.insert(monthlyPlanStrategies).values(
            input.strategies.map((s) => ({
              monthlyPlanId: input.id,
              strategyId: s.strategyId,
              allocation: s.allocation,
            }))
          );
        }
      }

      // Update scope if provided
      if (input.scope) {
        // Delete existing scope
        await db.delete(contentScope).where(eq(contentScope.monthlyPlanId, input.id));

        // Insert new scope
        if (input.scope.length > 0) {
          await db.insert(contentScope).values(
            input.scope.map((s) => ({
              monthlyPlanId: input.id,
              platform: s.platform,
              contentType: s.contentType,
              quantity: s.quantity,
              budget: s.budget || null,
            }))
          );
        }
      }

      return { success: true };
    }),

  // Approve monthly plan (client approval)
  approve: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(monthlyPlans)
        .set({
          status: "approved",
          approvedBy: ctx.user!.id,
          approvedAt: new Date(),
        })
        .where(eq(monthlyPlans.id, input.id));

      return { success: true };
    }),

  // Lock monthly plan (prevent further changes)
  lock: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(monthlyPlans)
        .set({ status: "locked" })
        .where(eq(monthlyPlans.id, input.id));

      return { success: true };
    }),

  // Delete monthly plan
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Delete associated data first
      await db
        .delete(monthlyPlanStrategies)
        .where(eq(monthlyPlanStrategies.monthlyPlanId, input.id));
      await db.delete(contentScope).where(eq(contentScope.monthlyPlanId, input.id));

      // Delete the plan
      await db.delete(monthlyPlans).where(eq(monthlyPlans.id, input.id));

      return { success: true };
    }),
});
