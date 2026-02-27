import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { 
  content, 
  contentComments,
  contentTags 
} from "../../drizzle/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

export const contentRouter = router({
  // List all content items for a monthly plan
  list: protectedProcedure
    .input(z.object({ 
      monthlyPlanId: z.number(),
      stage: z.enum(["topic", "plan", "copy", "creative", "all"]).optional(),
      status: z.enum(["draft", "pending_approval", "approved", "rejected", "all"]).optional(),
      platform: z.enum(["linkedin", "facebook", "instagram", "twitter", "all"]).optional(),
      format: z.enum(["post", "video", "story", "carousel", "reel", "all"]).optional()
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db
        .select()
        .from(content)
        .where(eq(content.monthlyPlanId, input.monthlyPlanId));

      // Apply filters
      const items = await query.orderBy(desc(content.scheduledDate));

      // Filter by stage, status, platform, and format in memory (simpler than complex SQL)
      let filtered = items;
      if (input.stage && input.stage !== "all") {
        filtered = filtered.filter(item => item.stage === input.stage);
      }
      if (input.status && input.status !== "all") {
        filtered = filtered.filter(item => item.status === input.status);
      }
      if (input.platform && input.platform !== "all") {
        filtered = filtered.filter(item => item.platform === input.platform);
      }
      if (input.format && input.format !== "all") {
        filtered = filtered.filter(item => item.contentFormat === input.format);
      }

      // Fetch tags for each content item
      const itemsWithTags = await Promise.all(
        filtered.map(async (item) => {
          const tags = await db
            .select()
            .from(contentTags)
            .where(eq(contentTags.contentId, item.id));
          
          return {
            ...item,
            tags
          };
        })
      );

      return itemsWithTags;
    }),

  // Get a single content item with all details
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const item = await db
        .select()
        .from(content)
        .where(eq(content.id, input.id))
        .limit(1);

      if (!item[0]) throw new Error("Content item not found");

      // Get comments
      const comments = await db
        .select()
        .from(contentComments)
        .where(eq(contentComments.contentId, input.id))
        .orderBy(desc(contentComments.createdAt));

      // Get tags
      const tags = await db
        .select()
        .from(contentTags)
        .where(eq(contentTags.contentId, input.id));

      return {
        ...item[0],
        comments,
        tags
      };
    }),

  // Create a new content item
  create: protectedProcedure
    .input(z.object({
      monthlyPlanId: z.number(),
      title: z.string().min(1),
      stage: z.enum(["topic", "plan", "copy", "creative"]),
      platforms: z.array(z.string()),
      scheduledDate: z.string().optional(),
      assignedTo: z.number().optional(),
      notes: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(content).values({
        clientId: 1, // TODO: Get from context
        monthlyPlanId: input.monthlyPlanId,
        strategyId: 1, // TODO: Get from monthly plan
        topicTitle: input.title,
        topicDescription: input.notes || null,
        stage: input.stage,
        status: "draft",
        platform: input.platforms[0] as any || "linkedin",
        scheduledDate: input.scheduledDate ? new Date(input.scheduledDate) : null,
        createdBy: ctx.user.id
      });

      return { id: Number(result.insertId) };
    }),

  // Update a content item
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      stage: z.enum(["topic", "plan", "copy", "creative"]).optional(),
      platforms: z.array(z.string()).optional(),
      scheduledDate: z.string().optional(),
      assignedTo: z.number().optional(),
      notes: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {
        updatedAt: new Date()
      };

      if (input.title) updateData.topicTitle = input.title;
      if (input.stage) updateData.stage = input.stage;
      if (input.platforms) updateData.platforms = JSON.stringify(input.platforms);
      if (input.scheduledDate !== undefined) updateData.scheduledDate = input.scheduledDate || null;
      if (input.assignedTo !== undefined) updateData.assignedTo = input.assignedTo || null;
      if (input.notes !== undefined) updateData.topicDescription = input.notes || null;

      await db
        .update(content)
        .set(updateData)
        .where(eq(content.id, input.id));

      return { success: true };
    }),



  // Submit for approval
  submitForApproval: protectedProcedure
    .input(z.object({
      contentId: z.number()
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Update content status
      await db
        .update(content)
        .set({ 
          status: "pending_review"
        })
        .where(eq(content.id, input.contentId));

      return { success: true };
    }),

  // Approve/reject content
  approve: protectedProcedure
    .input(z.object({
      contentId: z.number(),
      action: z.enum(["approve", "request_changes", "reject"]),
      comment: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Add comment with action
      await db.insert(contentComments).values({
        contentId: input.contentId,
        userId: ctx.user.id,
        comment: input.comment || "",
        action: input.action,
        createdAt: new Date()
      });

      // Update content status based on action
      const statusMap = {
        approve: "approved" as const,
        request_changes: "needs_revision" as const,
        reject: "rejected" as const
      };

      await db
        .update(content)
        .set({
          status: statusMap[input.action]
        })
        .where(eq(content.id, input.contentId));

      return { success: true };
    }),

  // Add a comment
  addComment: protectedProcedure
    .input(z.object({
      contentId: z.number(),
      comment: z.string().min(1)
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(contentComments).values({
        contentId: input.contentId,
        userId: ctx.user.id,
        comment: input.comment,
        action: "comment",
        createdAt: new Date()
      });

      return { id: Number(result.insertId) };
    }),

  // Add tags to content
  addTags: protectedProcedure
    .input(z.object({
      contentId: z.number(),
      personaIds: z.array(z.number()).optional(),
      serviceIds: z.array(z.number()).optional(),
      conditionIds: z.array(z.number()).optional()
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Remove existing tags
      await db
        .delete(contentTags)
        .where(eq(contentTags.contentId, input.contentId));

      // Add new tags
      const tags = [];
      
      if (input.personaIds) {
        tags.push(...input.personaIds.map(id => ({
          contentId: input.contentId,
          tagType: "persona" as const,
          tagId: id
        })));
      }

      if (input.serviceIds) {
        tags.push(...input.serviceIds.map(id => ({
          contentId: input.contentId,
          tagType: "service" as const,
          tagId: id
        })));
      }

      if (input.conditionIds) {
        tags.push(...input.conditionIds.map(id => ({
          contentId: input.contentId,
          tagType: "condition" as const,
          tagId: id
        })));
      }

      if (tags.length > 0) {
        await db.insert(contentTags).values(tags);
      }

      return { success: true };
    }),

  // Delete a content item
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .delete(content)
        .where(eq(content.id, input.id));    return { success: true };
    })
});
