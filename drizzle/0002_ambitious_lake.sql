-- Custom SQL migration file, put your code below! --

-- Drop old content table and recreate with new schema
DROP TABLE IF EXISTS `content_comments`;
DROP TABLE IF EXISTS `content`;

-- Create strategies table
CREATE TABLE IF NOT EXISTS `strategies` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `clientId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `version` varchar(50) NOT NULL DEFAULT '1.0',
  `status` enum('draft', 'pending_approval', 'approved', 'archived') NOT NULL DEFAULT 'draft',
  `isDefault` boolean NOT NULL DEFAULT false,
  `funnelConfig` text,
  `platformAllocation` text,
  `budgetAllocation` text,
  `timeline` text,
  `notes` text,
  `createdBy` int NOT NULL,
  `approvedBy` int,
  `approvedAt` timestamp,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create strategy_personas table
CREATE TABLE IF NOT EXISTS `strategy_personas` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `strategyId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `demographics` text,
  `painPoints` text,
  `goals` text,
  `sortOrder` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create strategy_services table
CREATE TABLE IF NOT EXISTS `strategy_services` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `strategyId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `sortOrder` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create strategy_conditions table
CREATE TABLE IF NOT EXISTS `strategy_conditions` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `strategyId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `sortOrder` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create monthly_plans table
CREATE TABLE IF NOT EXISTS `monthly_plans` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `clientId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `month` varchar(7) NOT NULL,
  `strategyId` int NOT NULL,
  `status` enum('draft', 'pending_approval', 'approved', 'locked') NOT NULL DEFAULT 'draft',
  `notes` text,
  `createdBy` int NOT NULL,
  `approvedBy` int,
  `approvedAt` timestamp,
  `lockedAt` timestamp,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create monthly_plan_strategies table
CREATE TABLE IF NOT EXISTS `monthly_plan_strategies` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `monthlyPlanId` int NOT NULL,
  `strategyId` int NOT NULL,
  `allocation` int NOT NULL DEFAULT 100,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create content_scope table
CREATE TABLE IF NOT EXISTS `content_scope` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `monthlyPlanId` int NOT NULL,
  `platform` varchar(64) NOT NULL,
  `contentType` varchar(64) NOT NULL,
  `quantity` int NOT NULL,
  `budget` decimal(10, 2),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Recreate content table with new schema
CREATE TABLE `content` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `clientId` int NOT NULL,
  `monthlyPlanId` int NOT NULL,
  `scopeId` int,
  `strategyId` int NOT NULL,
  `stage` enum('topic', 'plan', 'copy', 'creative', 'scheduled', 'published') NOT NULL DEFAULT 'topic',
  `status` enum('draft', 'pending_review', 'approved', 'needs_revision', 'rejected') NOT NULL DEFAULT 'draft',
  `topicTitle` varchar(255),
  `topicDescription` text,
  `planTitle` varchar(255),
  `platform` enum('linkedin', 'facebook', 'instagram', 'twitter', 'tiktok', 'youtube', 'blog', 'newsletter', 'gmb'),
  `contentFormat` varchar(64),
  `scheduledDate` timestamp,
  `copyBody` text,
  `copyHashtags` text,
  `copyCta` text,
  `mediaUrls` text,
  `publishedAt` timestamp,
  `publishedUrl` text,
  `createdBy` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create content_tags table
CREATE TABLE IF NOT EXISTS `content_tags` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `contentId` int NOT NULL,
  `tagType` enum('persona', 'service', 'condition', 'funnel_stage') NOT NULL,
  `tagId` int NOT NULL,
  `tagValue` varchar(255),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Recreate content_comments table
CREATE TABLE `content_comments` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `contentId` int NOT NULL,
  `userId` int NOT NULL,
  `comment` text NOT NULL,
  `action` enum('comment', 'approve', 'request_changes', 'reject'),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);