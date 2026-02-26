import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'super_admin';
      updateSet.role = 'super_admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ============================================
// Client Management
// ============================================

export async function getClientById(clientId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const { clients } = await import("../drizzle/schema");
  const result = await db.select().from(clients).where(eq(clients.id, clientId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getClientBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const { clients } = await import("../drizzle/schema");
  const result = await db.select().from(clients).where(eq(clients.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];
  
  const { clients } = await import("../drizzle/schema");
  return await db.select().from(clients);
}

// ============================================
// User-Client Relationships & Permissions
// ============================================

export async function getUserClients(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { userClients, clients } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  const result = await db
    .select({
      id: userClients.id,
      clientId: userClients.clientId,
      role: userClients.role,
      clientName: clients.name,
      clientSlug: clients.slug,
      clientLogo: clients.logo,
      primaryColor: clients.primaryColor,
      secondaryColor: clients.secondaryColor,
    })
    .from(userClients)
    .leftJoin(clients, eq(userClients.clientId, clients.id))
    .where(eq(userClients.userId, userId));
  
  return result;
}

export async function getUserRoleForClient(userId: number, clientId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const { userClients } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");
  
  const result = await db
    .select()
    .from(userClients)
    .where(and(eq(userClients.userId, userId), eq(userClients.clientId, clientId)))
    .limit(1);
  
  return result.length > 0 ? result[0].role : null;
}

export async function assignUserToClient(userId: number, clientId: number, role: "client_admin" | "client_editor" | "client_viewer") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { userClients, InsertUserClient } = await import("../drizzle/schema");
  
  const values: InsertUserClient = {
    userId,
    clientId,
    role,
  };
  
  await db.insert(userClients).values(values);
}

// ============================================
// Permission Checking
// ============================================

export type Permission = 
  | "view_content" 
  | "create_content" 
  | "edit_content" 
  | "delete_content"
  | "approve_content"
  | "view_files"
  | "upload_files"
  | "delete_files"
  | "view_tickets"
  | "create_tickets"
  | "assign_tickets"
  | "view_team"
  | "invite_users"
  | "manage_settings";

const rolePermissions: Record<string, Permission[]> = {
  super_admin: [
    "view_content", "create_content", "edit_content", "delete_content", "approve_content",
    "view_files", "upload_files", "delete_files",
    "view_tickets", "create_tickets", "assign_tickets",
    "view_team", "invite_users", "manage_settings",
  ],
  agency_admin: [
    "view_content", "create_content", "edit_content", "delete_content", "approve_content",
    "view_files", "upload_files", "delete_files",
    "view_tickets", "create_tickets", "assign_tickets",
    "view_team", "invite_users", "manage_settings",
  ],
  agency_creator: [
    "view_content", "create_content", "edit_content",
    "view_files", "upload_files",
    "view_tickets", "create_tickets",
    "view_team",
  ],
  client_admin: [
    "view_content", "create_content", "edit_content", "approve_content",
    "view_files", "upload_files",
    "view_tickets", "create_tickets",
    "view_team", "invite_users",
  ],
  client_editor: [
    "view_content", "create_content", "edit_content",
    "view_files", "upload_files",
    "view_tickets", "create_tickets",
    "view_team",
  ],
  client_viewer: [
    "view_content",
    "view_files",
    "view_tickets",
    "view_team",
  ],
};

export function hasPermission(userRole: string, permission: Permission): boolean {
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
}

export function canAccessClient(user: { role: string }, clientId: number, userClientRole?: string | null): boolean {
  // Super admin and agency roles can access all clients
  if (["super_admin", "agency_admin", "agency_creator"].includes(user.role)) {
    return true;
  }
  
  // Client-level users need explicit assignment
  return userClientRole !== null && userClientRole !== undefined;
}
