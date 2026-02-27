import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { tickets, ticketComments } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const ticketsRouter = router({
  // List all tickets with optional filters
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(["open", "in_progress", "pending_client", "resolved", "closed"]).optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        category: z.enum(["content_request", "design_request", "technical_issue", "question", "other"]).optional(),
        assignedTo: z.number().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const conditions = [];

      if (input?.status) {
        conditions.push(eq(tickets.status, input.status));
      }
      if (input?.priority) {
        conditions.push(eq(tickets.priority, input.priority));
      }
      if (input?.category) {
        conditions.push(eq(tickets.category, input.category));
      }
      if (input?.assignedTo) {
        conditions.push(eq(tickets.assignedTo, input.assignedTo));
      }

      const result = await db
        .select()
        .from(tickets)
        .where(and(...conditions))
        .orderBy(desc(tickets.createdAt));

      return result;
    }),

  // Get single ticket by ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [ticket] = await db
        .select()
        .from(tickets)
        .where(eq(tickets.id, input.id));

      if (!ticket) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Ticket not found" });
      }

      return ticket;
    }),

  // Create new ticket
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        category: z.enum(["content_request", "design_request", "technical_issue", "question", "other"]),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
        assignedTo: z.number().optional(),
        slaDeadline: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [newTicket] = await db.insert(tickets).values({
        clientId: 1, // Default client ID
        createdBy: ctx.user.id,
        title: input.title,
        description: input.description,
        category: input.category,
        priority: input.priority,
        assignedTo: input.assignedTo,
        slaDeadline: input.slaDeadline,
        status: "open",
      });

      return { success: true, ticketId: newTicket.insertId };
    }),

  // Update ticket
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        category: z.enum(["content_request", "design_request", "technical_issue", "question", "other"]).optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        assignedTo: z.number().optional(),
        slaDeadline: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...updates } = input;

      await db
        .update(tickets)
        .set(updates)
        .where(eq(tickets.id, id));

      return { success: true };
    }),

  // Update ticket status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["open", "in_progress", "pending_client", "resolved", "closed"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const updateData: any = { status: input.status };

      // Set resolvedAt timestamp when status is resolved or closed
      if (input.status === "resolved" || input.status === "closed") {
        updateData.resolvedAt = new Date();
      }

      await db
        .update(tickets)
        .set(updateData)
        .where(eq(tickets.id, input.id));

      return { success: true };
    }),

  // Delete ticket
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Delete comments first
      await db
        .delete(ticketComments)
        .where(eq(ticketComments.ticketId, input.id));

      // Delete ticket
      await db
        .delete(tickets)
        .where(eq(tickets.id, input.id));

      return { success: true };
    }),

  // Add comment to ticket
  addComment: protectedProcedure
    .input(
      z.object({
        ticketId: z.number(),
        comment: z.string().min(1, "Comment cannot be empty"),
        isInternal: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Verify ticket exists
      const [ticket] = await db
        .select()
        .from(tickets)
        .where(eq(tickets.id, input.ticketId));

      if (!ticket) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Ticket not found" });
      }

      await db.insert(ticketComments).values({
        ticketId: input.ticketId,
        userId: ctx.user.id,
        comment: input.comment,
        isInternal: input.isInternal ? 1 : 0,
      });

      return { success: true };
    }),

  // Get comments for a ticket
  getComments: protectedProcedure
    .input(z.object({ ticketId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Verify ticket exists
      const [ticket] = await db
        .select()
        .from(tickets)
        .where(eq(tickets.id, input.ticketId));

      if (!ticket) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Ticket not found" });
      }

      const comments = await db
        .select()
        .from(ticketComments)
        .where(eq(ticketComments.ticketId, input.ticketId))
        .orderBy(desc(ticketComments.createdAt));

      return comments;
    }),
});
