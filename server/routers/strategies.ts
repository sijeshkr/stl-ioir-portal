import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { strategies, strategyPersonas, strategyServices, strategyConditions } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const strategiesRouter = router({
  // List all strategies for a client
  list: protectedProcedure
    .input(z.object({
      clientId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const result = await db
        .select()
        .from(strategies)
        .where(eq(strategies.clientId, input.clientId))
        .orderBy(desc(strategies.createdAt));

      return result;
    }),

  // Get single strategy with all related data
  get: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [strategy] = await db
        .select()
        .from(strategies)
        .where(eq(strategies.id, input.id))
        .limit(1);

      if (!strategy) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Strategy not found" });
      }

      // Get related personas, services, conditions
      const personas = await db
        .select()
        .from(strategyPersonas)
        .where(eq(strategyPersonas.strategyId, input.id))
        .orderBy(strategyPersonas.sortOrder);

      const services = await db
        .select()
        .from(strategyServices)
        .where(eq(strategyServices.strategyId, input.id))
        .orderBy(strategyServices.sortOrder);

      const conditions = await db
        .select()
        .from(strategyConditions)
        .where(eq(strategyConditions.strategyId, input.id))
        .orderBy(strategyConditions.sortOrder);

      return {
        ...strategy,
        personas,
        services,
        conditions,
      };
    }),

  // Create new strategy
  create: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      name: z.string().min(1),
      version: z.string().default("1.0"),
      isDefault: z.boolean().default(false),
      funnelConfig: z.string().optional(),
      platformAllocation: z.string().optional(),
      budgetAllocation: z.string().optional(),
      timeline: z.string().optional(),
      notes: z.string().optional(),
      personas: z.array(z.object({
        name: z.string(),
        description: z.string().optional(),
        demographics: z.string().optional(),
        painPoints: z.string().optional(),
        goals: z.string().optional(),
      })).optional(),
      services: z.array(z.object({
        name: z.string(),
        description: z.string().optional(),
      })).optional(),
      conditions: z.array(z.object({
        name: z.string(),
        description: z.string().optional(),
      })).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Create strategy
      const [result] = await db.insert(strategies).values({
        clientId: input.clientId,
        name: input.name,
        version: input.version,
        isDefault: input.isDefault,
        funnelConfig: input.funnelConfig,
        platformAllocation: input.platformAllocation,
        budgetAllocation: input.budgetAllocation,
        timeline: input.timeline,
        notes: input.notes,
        createdBy: ctx.user.id,
        status: "draft",
      });

      const strategyId = Number(result.insertId);

      // Insert personas
      if (input.personas && input.personas.length > 0) {
        await db.insert(strategyPersonas).values(
          input.personas.map((p, index) => ({
            strategyId,
            name: p.name,
            description: p.description || null,
            demographics: p.demographics || null,
            painPoints: p.painPoints || null,
            goals: p.goals || null,
            sortOrder: index,
          }))
        );
      }

      // Insert services
      if (input.services && input.services.length > 0) {
        await db.insert(strategyServices).values(
          input.services.map((s, index) => ({
            strategyId,
            name: s.name,
            description: s.description || null,
            sortOrder: index,
          }))
        );
      }

      // Insert conditions
      if (input.conditions && input.conditions.length > 0) {
        await db.insert(strategyConditions).values(
          input.conditions.map((c, index) => ({
            strategyId,
            name: c.name,
            description: c.description || null,
            sortOrder: index,
          }))
        );
      }

      return { id: strategyId };
    }),

  // Update strategy
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      version: z.string().optional(),
      isDefault: z.boolean().optional(),
      funnelConfig: z.string().optional(),
      platformAllocation: z.string().optional(),
      budgetAllocation: z.string().optional(),
      timeline: z.string().optional(),
      notes: z.string().optional(),
      status: z.enum(["draft", "pending_approval", "approved", "archived"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const { id, ...updates } = input;

      await db
        .update(strategies)
        .set(updates)
        .where(eq(strategies.id, id));

      return { success: true };
    }),

  // Approve strategy
  approve: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .update(strategies)
        .set({
          status: "approved",
          approvedBy: ctx.user.id,
          approvedAt: new Date(),
        })
        .where(eq(strategies.id, input.id));

      return { success: true };
    }),

  // Clone strategy
  clone: protectedProcedure
    .input(z.object({
      id: z.number(),
      newName: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get original strategy
      const [original] = await db
        .select()
        .from(strategies)
        .where(eq(strategies.id, input.id))
        .limit(1);

      if (!original) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Strategy not found" });
      }

      // Create new strategy
      const [result] = await db.insert(strategies).values({
        clientId: original.clientId,
        name: input.newName,
        version: "1.0",
        isDefault: false,
        funnelConfig: original.funnelConfig,
        platformAllocation: original.platformAllocation,
        budgetAllocation: original.budgetAllocation,
        timeline: original.timeline,
        notes: original.notes,
        createdBy: ctx.user.id,
        status: "draft",
      });

      const newStrategyId = Number(result.insertId);

      // Clone personas
      const personas = await db
        .select()
        .from(strategyPersonas)
        .where(eq(strategyPersonas.strategyId, input.id));

      if (personas.length > 0) {
        await db.insert(strategyPersonas).values(
          personas.map(p => ({
            strategyId: newStrategyId,
            name: p.name,
            description: p.description,
            demographics: p.demographics,
            painPoints: p.painPoints,
            goals: p.goals,
            sortOrder: p.sortOrder,
          }))
        );
      }

      // Clone services
      const services = await db
        .select()
        .from(strategyServices)
        .where(eq(strategyServices.strategyId, input.id));

      if (services.length > 0) {
        await db.insert(strategyServices).values(
          services.map(s => ({
            strategyId: newStrategyId,
            name: s.name,
            description: s.description,
            sortOrder: s.sortOrder,
          }))
        );
      }

      // Clone conditions
      const conditions = await db
        .select()
        .from(strategyConditions)
        .where(eq(strategyConditions.strategyId, input.id));

      if (conditions.length > 0) {
        await db.insert(strategyConditions).values(
          conditions.map(c => ({
            strategyId: newStrategyId,
            name: c.name,
            description: c.description,
            sortOrder: c.sortOrder,
          }))
        );
      }

      return { id: newStrategyId };
    }),

  // Delete strategy
  delete: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Delete related data first
      await db.delete(strategyPersonas).where(eq(strategyPersonas.strategyId, input.id));
      await db.delete(strategyServices).where(eq(strategyServices.strategyId, input.id));
      await db.delete(strategyConditions).where(eq(strategyConditions.strategyId, input.id));

      // Delete strategy
      await db.delete(strategies).where(eq(strategies.id, input.id));

      return { success: true };
    }),
});
