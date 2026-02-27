import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

// Mock context for testing
const mockContext: Context = {
  user: {
    id: 1,
    openId: "test-user-123",
    name: "Test User",
    email: "test@example.com",
    role: "admin",
    clientId: 1,
  },
};

describe("Content Calendar API", () => {
  const caller = appRouter.createCaller(mockContext);

  describe("contentCalendar.create", () => {
    it("should create a new calendar topic", async () => {
      const topicData = {
        monthlyPlanId: 1,
        scheduledDate: "2026-03-01",
        topicTitle: "Test Topic - Pinhole Advantage",
        platform: "linkedin" as const,
        audience: "Referring Physicians",
        cta: "Request appointment",
      };

      const result = await caller.contentCalendar.create(topicData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.topictitle).toBe(topicData.topicTitle);
      expect(result.platform).toBe(topicData.platform);
      expect(result.status).toBe("planned");
    });

    it("should require monthlyPlanId", async () => {
      const topicData = {
        monthlyPlanId: undefined as any,
        scheduledDate: "2026-03-01",
        topicTitle: "Test Topic",
        platform: "facebook" as const,
      };

      await expect(caller.contentCalendar.create(topicData)).rejects.toThrow();
    });

    it("should require scheduledDate", async () => {
      const topicData = {
        monthlyPlanId: 1,
        scheduledDate: undefined as any,
        topicTitle: "Test Topic",
        platform: "instagram" as const,
      };

      await expect(caller.contentCalendar.create(topicData)).rejects.toThrow();
    });

    it("should require topicTitle", async () => {
      const topicData = {
        monthlyPlanId: 1,
        scheduledDate: "2026-03-01",
        topicTitle: undefined as any,
        platform: "twitter" as const,
      };

      await expect(caller.contentCalendar.create(topicData)).rejects.toThrow();
    });

    it("should require platform", async () => {
      const topicData = {
        monthlyPlanId: 1,
        scheduledDate: "2026-03-01",
        topicTitle: "Test Topic",
        platform: undefined as any,
      };

      await expect(caller.contentCalendar.create(topicData)).rejects.toThrow();
    });
  });

  describe("contentCalendar.list", () => {
    it("should list calendar topics", async () => {
      const result = await caller.contentCalendar.list({
        startDate: "2026-02-01",
        endDate: "2026-03-31",
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter by monthly plan", async () => {
      const result = await caller.contentCalendar.list({
        monthlyPlanId: 1,
        startDate: "2026-02-01",
        endDate: "2026-03-31",
      });

      expect(Array.isArray(result)).toBe(true);
      // All results should belong to the specified monthly plan
      result.forEach((topic: any) => {
        expect(topic.monthlyplanid).toBe(1);
      });
    });

    it("should work without date filters", async () => {
      const result = await caller.contentCalendar.list({
        startDate: undefined,
        endDate: undefined,
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("contentCalendar.updateStatus", () => {
    it("should update topic status", async () => {
      // First create a topic
      const topic = await caller.contentCalendar.create({
        monthlyPlanId: 1,
        scheduledDate: "2026-03-15",
        topicTitle: "Status Test Topic",
        platform: "linkedin" as const,
      });

      // Update status
      const result = await caller.contentCalendar.updateStatus({
        id: topic.id,
        status: "in_progress",
      });

      expect(result.status).toBe("in_progress");
    });

    it("should accept valid status values", async () => {
      const topic = await caller.contentCalendar.create({
        monthlyPlanId: 1,
        scheduledDate: "2026-03-20",
        topicTitle: "Multi-Status Test",
        platform: "facebook" as const,
      });

      const statuses = ["planned", "in_progress", "completed", "published"] as const;

      for (const status of statuses) {
        const result = await caller.contentCalendar.updateStatus({
          id: topic.id,
          status,
        });
        expect(result.status).toBe(status);
      }
    });
  });
});
