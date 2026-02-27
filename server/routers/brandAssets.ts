import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { brandAssets } from "../../drizzle/schema";
import { protectedProcedure, router } from "../_core/trpc";

export const brandAssetsRouter = router({
  // Get brand assets for current client (one per client)
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db
      .select()
      .from(brandAssets)
      .where(eq(brandAssets.clientId, ctx.user.clientId))
      .limit(1);

    return result[0] || null;
  }),

  // Create or update brand assets
  upsert: protectedProcedure
    .input(
      z.object({
        primaryLogoUrl: z.string().optional(),
        secondaryLogoUrl: z.string().optional(),
        iconUrl: z.string().optional(),
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        accentColor: z.string().optional(),
        backgroundColor: z.string().optional(),
        textColor: z.string().optional(),
        primaryFont: z.string().optional(),
        secondaryFont: z.string().optional(),
        headingFontSize: z.string().optional(),
        bodyFontSize: z.string().optional(),
        fontWeights: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if assets already exist
      const existing = await db
        .select()
        .from(brandAssets)
        .where(eq(brandAssets.clientId, ctx.user.clientId))
        .limit(1);

      if (existing[0]) {
        // Update existing
        await db
          .update(brandAssets)
          .set(input)
          .where(eq(brandAssets.id, existing[0].id));

        const updated = await db
          .select()
          .from(brandAssets)
          .where(eq(brandAssets.id, existing[0].id))
          .limit(1);

        return updated[0];
      } else {
        // Create new
        const result = await db.insert(brandAssets).values({
          clientId: ctx.user.clientId,
          ...input,
          createdBy: ctx.user.id,
        });

        const insertedId = Number(result.insertId);

        const created = await db
          .select()
          .from(brandAssets)
          .where(eq(brandAssets.id, insertedId))
          .limit(1);

        return created[0];
      }
    }),
});
