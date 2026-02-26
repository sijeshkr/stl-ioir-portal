CREATE TABLE `activity_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int,
	`userId` int NOT NULL,
	`action` varchar(255) NOT NULL,
	`entityType` varchar(64),
	`entityId` int,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`googleWorkspaceEnabled` int NOT NULL DEFAULT false,
	`googleDriveFolderId` varchar(255),
	`notificationsEnabled` int NOT NULL DEFAULT true,
	`emailNotifications` int NOT NULL DEFAULT true,
	`slaHours` int NOT NULL DEFAULT 48,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `client_settings_clientId_unique` UNIQUE(`clientId`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`logo` text,
	`primaryColor` varchar(7) NOT NULL DEFAULT '#0073E6',
	`secondaryColor` varchar(7) NOT NULL DEFAULT '#F77F00',
	`status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`createdBy` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`platform` enum('linkedin','facebook','instagram','twitter','tiktok','youtube') NOT NULL,
	`status` enum('draft','pending_review','approved','needs_revision','scheduled','published') NOT NULL DEFAULT 'draft',
	`scheduledAt` timestamp,
	`publishedAt` timestamp,
	`mediaUrls` text,
	`tags` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentId` int NOT NULL,
	`userId` int NOT NULL,
	`comment` text NOT NULL,
	`action` enum('comment','approve','request_changes','reject'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `content_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`uploadedBy` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` text NOT NULL,
	`mimeType` varchar(127),
	`fileSize` int,
	`folder` varchar(255) NOT NULL DEFAULT '/',
	`tags` text,
	`googleDriveId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticket_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`userId` int NOT NULL,
	`comment` text NOT NULL,
	`isInternal` int NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ticket_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`createdBy` int NOT NULL,
	`assignedTo` int,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` enum('content_request','design_request','technical_issue','question','other') NOT NULL,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('open','in_progress','pending_client','resolved','closed') NOT NULL DEFAULT 'open',
	`slaDeadline` timestamp,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientId` int NOT NULL,
	`role` enum('client_admin','client_editor','client_viewer') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('super_admin','agency_admin','agency_creator','client_admin','client_editor','client_viewer') NOT NULL DEFAULT 'client_viewer';