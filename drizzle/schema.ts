import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, date, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["super_admin", "agency_admin", "agency_creator", "client_admin", "client_editor", "client_viewer"]).default("client_viewer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Clients table - Multi-tenant support
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logo: text("logo"), // S3 URL
  primaryColor: varchar("primaryColor", { length: 7 }).default("#0073E6").notNull(),
  secondaryColor: varchar("secondaryColor", { length: 7 }).default("#F77F00").notNull(),
  status: mysqlEnum("status", ["active", "inactive", "suspended"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * User-Client relationship table
 */
export const userClients = mysqlTable("user_clients", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  clientId: int("clientId").notNull(),
  role: mysqlEnum("role", ["client_admin", "client_editor", "client_viewer"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserClient = typeof userClients.$inferSelect;
export type InsertUserClient = typeof userClients.$inferInsert;

// ============================================
// STRATEGY MANAGEMENT
// ============================================

/**
 * Strategies table - Marketing strategy frameworks (versioned, per-client)
 */
export const strategies = mysqlTable("strategies", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // "Launch Strategy", "Post-Launch Strategy"
  version: varchar("version", { length: 50 }).default("1.0").notNull(),
  status: mysqlEnum("status", ["draft", "pending_approval", "approved", "archived"]).default("draft").notNull(),
  isDefault: int("isDefault", { mode: "boolean" }).default(false).notNull(),
  
  // Funnel configuration (JSON)
  funnelConfig: text("funnelConfig"), // {tiers: [{name, description, channels}]}
  
  // Platform allocation (JSON)
  platformAllocation: text("platformAllocation"), // {linkedin: 60, facebook: 30, instagram: 10}
  
  // Budget allocation (JSON)
  budgetAllocation: text("budgetAllocation"), // {linkedin: 800, facebook: 600, google: 200}
  
  // Campaign timeline (JSON)
  timeline: text("timeline"), // {phases: [{name, startDate, endDate, goals}]}
  
  // High-level notes
  notes: text("notes"),
  
  createdBy: int("createdBy").notNull(),
  approvedBy: int("approvedBy"),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Strategy = typeof strategies.$inferSelect;
export type InsertStrategy = typeof strategies.$inferInsert;

/**
 * Strategy Personas - Target audiences for each strategy
 */
export const strategyPersonas = mysqlTable("strategy_personas", {
  id: int("id").autoincrement().primaryKey(),
  strategyId: int("strategyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // "Referring Physician", "Patient", "Family Member"
  description: text("description"),
  demographics: text("demographics"), // JSON
  painPoints: text("painPoints"), // JSON
  goals: text("goals"), // JSON
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StrategyPersona = typeof strategyPersonas.$inferSelect;
export type InsertStrategyPersona = typeof strategyPersonas.$inferInsert;

/**
 * Strategy Services - Services offered (per strategy)
 */
export const strategyServices = mysqlTable("strategy_services", {
  id: int("id").autoincrement().primaryKey(),
  strategyId: int("strategyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // "Y90", "TACE", "Ablation"
  description: text("description"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StrategyService = typeof strategyServices.$inferSelect;
export type InsertStrategyService = typeof strategyServices.$inferInsert;

/**
 * Strategy Conditions - Conditions treated (per strategy)
 */
export const strategyConditions = mysqlTable("strategy_conditions", {
  id: int("id").autoincrement().primaryKey(),
  strategyId: int("strategyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // "Liver Cancer", "Kidney Cancer", "Fibroids"
  description: text("description"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StrategyCondition = typeof strategyConditions.$inferSelect;
export type InsertStrategyCondition = typeof strategyConditions.$inferInsert;

// ============================================
// MONTHLY PLANNING (Leadership Workflow)
// ============================================

/**
 * Monthly Plans - Output of leadership meetings
 */
export const monthlyPlans = mysqlTable("monthly_plans", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientid").notNull(),
  name: varchar("name", { length: 255 }).notNull(), // "March 2026 Launch"
  month: varchar("month", { length: 7 }).notNull(), // "2026-03"
  status: mysqlEnum("status", ["draft", "pending_approval", "approved", "locked"]).default("draft").notNull(),
  
  // High-level themes and notes from leadership meeting
  notes: text("notes"),
  
  createdBy: int("createdby").notNull(),
  approvedBy: int("approvedby"),
  approvedAt: timestamp("approvedat"),
  lockedAt: timestamp("lockedat"),
  createdAt: timestamp("createdat").defaultNow().notNull(),
  updatedAt: timestamp("updatedat").defaultNow().notNull(),
});

export type MonthlyPlan = typeof monthlyPlans.$inferSelect;
export type InsertMonthlyPlan = typeof monthlyPlans.$inferInsert;

/**
 * Monthly Plan Strategies - Support multiple strategies per month
 */
export const monthlyPlanStrategies = mysqlTable("monthly_plan_strategies", {
  id: int("id").autoincrement().primaryKey(),
  monthlyPlanId: int("monthlyPlanId").notNull(),
  strategyId: int("strategyId").notNull(),
  allocation: int("allocation").default(100).notNull(), // Percentage (0-100)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MonthlyPlanStrategy = typeof monthlyPlanStrategies.$inferSelect;
export type InsertMonthlyPlanStrategy = typeof monthlyPlanStrategies.$inferInsert;

/**
 * Content Scope - Approved quantities per platform/content type
 */
export const contentScope = mysqlTable("content_scope", {
  id: int("id").autoincrement().primaryKey(),
  monthlyPlanId: int("monthlyPlanId").notNull(),
  platform: varchar("platform", { length: 64 }).notNull(), // "linkedin", "facebook", "blog", "newsletter", "youtube", "gmb"
  contentType: varchar("contentType", { length: 64 }).notNull(), // "post", "video", "article", "email"
  quantity: int("quantity").notNull(), // Approved number (e.g., 12 LinkedIn posts)
  budget: decimal("budget", { precision: 10, scale: 2 }), // For paid campaigns
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContentScope = typeof contentScope.$inferSelect;
export type InsertContentScope = typeof contentScope.$inferInsert;

// ============================================
// CONTENT PLANNING (4-Stage Workflow)
// ============================================

/**
 * Content table - 4-stage workflow: Topic → Plan → Copy → Creative
 */
export const content = mysqlTable("content", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  monthlyPlanId: int("monthlyPlanId").notNull(),
  scopeId: int("scopeId"), // Links to approved scope item
  strategyId: int("strategyId").notNull(),
  
  // Stage tracking
  stage: mysqlEnum("stage", ["topic", "plan", "copy", "creative", "scheduled", "published"]).default("topic").notNull(),
  status: mysqlEnum("status", ["draft", "pending_review", "approved", "needs_revision", "rejected"]).default("draft").notNull(),
  
  // Stage 1: Topic
  topicTitle: varchar("topicTitle", { length: 255 }),
  topicDescription: text("topicDescription"),
  
  // Stage 2: Plan
  planTitle: varchar("planTitle", { length: 255 }),
  platform: mysqlEnum("platform", ["linkedin", "facebook", "instagram", "twitter", "tiktok", "youtube", "blog", "newsletter", "gmb"]),
  contentFormat: varchar("contentFormat", { length: 64 }), // "image", "video", "carousel", "article", "email"
  scheduledDate: timestamp("scheduledDate"),
  
  // Stage 3: Copy
  copyBody: text("copyBody"),
  copyHashtags: text("copyHashtags"),
  copyCta: text("copyCta"),
  
  // Stage 4: Creative
  mediaUrls: text("mediaUrls"), // JSON array of S3 URLs
  
  // Publishing
  publishedAt: timestamp("publishedAt"),
  publishedUrl: text("publishedUrl"),
  
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;

/**
 * Content Calendar Topics - High-level daily content planning
 * Sits between Monthly Plan and Content Creation
 */
export const contentCalendarTopics = mysqlTable("content_calendar_topics", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientid").notNull(),
  monthlyPlanId: int("monthlyplanid").notNull(),
  strategyId: int("strategyid"),
  
  // High-level planning fields
  scheduledDate: date("scheduleddate").notNull(),
  topicTitle: varchar("topictitle", { length: 255 }).notNull(),
  cta: text("cta"),
  audience: varchar("audience", { length: 255 }), // Target persona
  platform: mysqlEnum("platform", ["linkedin", "facebook", "instagram", "twitter", "tiktok", "youtube", "blog", "newsletter", "gmb"]).notNull(),
  
  // Status tracking (reflects linked content status)
  status: mysqlEnum("status", ["planned", "in_progress", "completed", "published"]).default("planned").notNull(),
  
  // Link to detailed content
  contentId: int("contentid"), // NULL until content is created
  
  // Source identifier
  source: mysqlEnum("source", ["monthly_plan", "manual"]).default("manual").notNull(),
  
  notes: text("notes"),
  createdBy: int("createdby").notNull(),
  createdAt: timestamp("createdat").defaultNow().notNull(),
  updatedAt: timestamp("updatedat").defaultNow().onUpdateNow().notNull(),
});

export type ContentCalendarTopic = typeof contentCalendarTopics.$inferSelect;
export type InsertContentCalendarTopic = typeof contentCalendarTopics.$inferInsert;

/**
 * Content Tags - Link content to strategy elements
 */
export const contentTags = mysqlTable("content_tags", {
  id: int("id").autoincrement().primaryKey(),
  contentId: int("contentId").notNull(),
  tagType: mysqlEnum("tagType", ["persona", "service", "condition", "funnel_stage"]).notNull(),
  tagId: int("tagId").notNull(), // ID of persona/service/condition
  tagValue: varchar("tagValue", { length: 255 }), // For funnel_stage: "authority", "education", "action"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContentTag = typeof contentTags.$inferSelect;
export type InsertContentTag = typeof contentTags.$inferInsert;

/**
 * Content Comments - Approval workflow discussions
 */
export const contentComments = mysqlTable("content_comments", {
  id: int("id").autoincrement().primaryKey(),
  contentId: int("contentId").notNull(),
  userId: int("userId").notNull(),
  comment: text("comment").notNull(),
  action: mysqlEnum("action", ["comment", "approve", "request_changes", "reject"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContentComment = typeof contentComments.$inferSelect;
export type InsertContentComment = typeof contentComments.$inferInsert;

// ============================================
// FILE LIBRARY
// ============================================

/**
 * Files table - File library with S3 storage
 */
export const files = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  uploadedBy: int("uploadedBy").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(), // S3 key
  fileUrl: text("fileUrl").notNull(), // S3 URL
  mimeType: varchar("mimeType", { length: 127 }),
  fileSize: int("fileSize"), // Bytes
  folder: varchar("folder", { length: 255 }).default("/").notNull(),
  tags: text("tags"), // JSON array
  googleDriveId: varchar("googleDriveId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type File = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;

// ============================================
// TICKETING SYSTEM
// ============================================

/**
 * Tickets table - Support/request ticketing
 */
export const tickets = mysqlTable("tickets", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  createdBy: int("createdBy").notNull(),
  assignedTo: int("assignedTo"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["content_request", "design_request", "technical_issue", "question", "other"]).notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "pending_client", "resolved", "closed"]).default("open").notNull(),
  slaDeadline: timestamp("slaDeadline"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

/**
 * Ticket Comments - Discussion threads
 */
export const ticketComments = mysqlTable("ticket_comments", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull(),
  userId: int("userId").notNull(),
  comment: text("comment").notNull(),
  isInternal: int("isInternal", { mode: "boolean" }).default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TicketComment = typeof ticketComments.$inferSelect;
export type InsertTicketComment = typeof ticketComments.$inferInsert;

// ============================================
// ACTIVITY LOG & SETTINGS
// ============================================

/**
 * Activity Log - Audit trail
 */
export const activityLog = mysqlTable("activity_log", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId"),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  entityType: varchar("entityType", { length: 64 }),
  entityId: int("entityId"),
  metadata: text("metadata"), // JSON
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = typeof activityLog.$inferInsert;

/**
 * Client Settings - Per-client configuration
 */
export const clientSettings = mysqlTable("client_settings", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().unique(),
  googleWorkspaceEnabled: int("googleWorkspaceEnabled", { mode: "boolean" }).default(false).notNull(),
  googleDriveFolderId: varchar("googleDriveFolderId", { length: 255 }),
  notificationsEnabled: int("notificationsEnabled", { mode: "boolean" }).default(true).notNull(),
  emailNotifications: int("emailNotifications", { mode: "boolean" }).default(true).notNull(),
  slaHours: int("slaHours").default(48).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientSettings = typeof clientSettings.$inferSelect;
export type InsertClientSettings = typeof clientSettings.$inferInsert;

// ============================================
// BRAND DNA (Client-Level)
// ============================================

/**
 * Brand Personas - Client-level target audiences (reusable across strategies)
 */
export const personas = mysqlTable("personas", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  demographics: text("demographics"), // Age, location, income, etc.
  psychographics: text("psychographics"), // Values, interests, lifestyle
  painPoints: text("painPoints"), // Problems they face
  goals: text("goals"), // What they want to achieve
  preferredChannels: text("preferredChannels"), // LinkedIn, Facebook, etc.
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Persona = typeof personas.$inferSelect;
export type InsertPersona = typeof personas.$inferInsert;

/**
 * Brand Services - Client-level services (reusable across strategies)
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 255 }), // "Interventional Oncology", "Vascular", etc.
  benefits: text("benefits"), // Key benefits
  targetPersonas: text("targetPersonas"), // JSON array of persona IDs
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Brand Conditions - Client-level conditions treated (reusable across strategies)
 */
export const conditions = mysqlTable("conditions", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  symptoms: text("symptoms"), // Common symptoms
  treatments: text("treatments"), // Available treatments
  relatedServices: text("relatedServices"), // JSON array of service IDs
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Condition = typeof conditions.$inferSelect;
export type InsertCondition = typeof conditions.$inferInsert;

/**
 * Brand Guidelines - Client-level brand voice, tone, and messaging
 */
export const brandGuidelines = mysqlTable("brand_guidelines", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().unique(), // One set of guidelines per client
  
  // Brand Identity
  tagline: varchar("tagline", { length: 255 }),
  positioningStatement: text("positioningStatement"),
  
  // Voice & Tone
  brandVoice: text("brandVoice"), // e.g., "Professional, Compassionate, Expert"
  toneGuidelines: text("toneGuidelines"), // How to communicate in different contexts
  
  // Messaging
  keyMessages: text("keyMessages"), // JSON array of core messages
  messagingPillars: text("messagingPillars"), // JSON array of pillars
  valueProposition: text("valueProposition"),
  
  // Do's and Don'ts
  languageDos: text("languageDos"), // What language to use
  languageDonts: text("languageDonts"), // What to avoid
  
  // Metadata
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BrandGuideline = typeof brandGuidelines.$inferSelect;
export type InsertBrandGuideline = typeof brandGuidelines.$inferInsert;

/**
 * Brand Assets - Client-level brand assets (logos, colors, typography)
 */
export const brandAssets = mysqlTable("brand_assets", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().unique(), // One set of assets per client
  
  // Logos
  primaryLogoUrl: varchar("primaryLogoUrl", { length: 500 }),
  secondaryLogoUrl: varchar("secondaryLogoUrl", { length: 500 }),
  iconUrl: varchar("iconUrl", { length: 500 }),
  
  // Color Palette
  primaryColor: varchar("primaryColor", { length: 50 }), // e.g., "#0073E6"
  secondaryColor: varchar("secondaryColor", { length: 50 }),
  accentColor: varchar("accentColor", { length: 50 }),
  backgroundColor: varchar("backgroundColor", { length: 50 }),
  textColor: varchar("textColor", { length: 50 }),
  
  // Typography
  primaryFont: varchar("primaryFont", { length: 100 }), // e.g., "Outfit"
  secondaryFont: varchar("secondaryFont", { length: 100 }),
  headingFontSize: varchar("headingFontSize", { length: 50 }), // e.g., "32px"
  bodyFontSize: varchar("bodyFontSize", { length: 50 }),
  fontWeights: text("fontWeights"), // JSON: { light: 300, regular: 400, bold: 700 }
  
  // Metadata
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BrandAsset = typeof brandAssets.$inferSelect;
export type InsertBrandAsset = typeof brandAssets.$inferInsert;
