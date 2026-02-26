-- Create strategies table
CREATE TABLE IF NOT EXISTS `strategies` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `clientId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `version` varchar(50) NOT NULL DEFAULT '1.0',
  `status` enum('draft', 'pending_approval', 'approved', 'archived') NOT NULL DEFAULT 'draft',
  `isDefault` tinyint NOT NULL DEFAULT 0,
  `funnelConfig` text,
  `platformAllocation` text,
  `budgetAllocation` text,
  `timeline` text,
  `notes` text,
  `createdBy` int,
  `approvedBy` int,
  `approvedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
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
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`strategyId`) REFERENCES `strategies`(`id`) ON DELETE CASCADE
);

-- Create strategy_services table
CREATE TABLE IF NOT EXISTS `strategy_services` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `strategyId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`strategyId`) REFERENCES `strategies`(`id`) ON DELETE CASCADE
);

-- Create strategy_conditions table
CREATE TABLE IF NOT EXISTS `strategy_conditions` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `strategyId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`strategyId`) REFERENCES `strategies`(`id`) ON DELETE CASCADE
);

-- Create monthly_plans table
CREATE TABLE IF NOT EXISTS `monthly_plans` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `clientId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `month` date NOT NULL,
  `status` enum('draft', 'pending_approval', 'approved', 'locked') NOT NULL DEFAULT 'draft',
  `notes` text,
  `createdBy` int,
  `approvedBy` int,
  `approvedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Create monthly_plan_strategies table
CREATE TABLE IF NOT EXISTS `monthly_plan_strategies` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `monthlyPlanId` int NOT NULL,
  `strategyId` int NOT NULL,
  `allocation` int NOT NULL DEFAULT 100,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`monthlyPlanId`) REFERENCES `monthly_plans`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`strategyId`) REFERENCES `strategies`(`id`) ON DELETE CASCADE
);

-- Create content_scope table
CREATE TABLE IF NOT EXISTS `content_scope` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `monthlyPlanId` int NOT NULL,
  `platform` varchar(50) NOT NULL,
  `contentType` varchar(50) NOT NULL,
  `quantity` int NOT NULL,
  `budget` decimal(10,2),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`monthlyPlanId`) REFERENCES `monthly_plans`(`id`) ON DELETE CASCADE
);

-- Create content table
CREATE TABLE IF NOT EXISTS `content` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `clientId` int NOT NULL,
  `monthlyPlanId` int,
  `scopeId` int,
  `strategyId` int,
  `stage` enum('topic', 'plan', 'copy', 'creative', 'scheduled', 'published') NOT NULL DEFAULT 'topic',
  `status` enum('draft', 'pending_review', 'needs_revision', 'approved', 'rejected') NOT NULL DEFAULT 'draft',
  `platform` varchar(50) NOT NULL,
  `contentType` varchar(50) NOT NULL,
  `title` varchar(500),
  `copy` text,
  `scheduledDate` timestamp NULL,
  `publishedDate` timestamp NULL,
  `createdBy` int,
  `assignedTo` int,
  `approvedBy` int,
  `approvedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`monthlyPlanId`) REFERENCES `monthly_plans`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`scopeId`) REFERENCES `content_scope`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`strategyId`) REFERENCES `strategies`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assignedTo`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Create content_tags table
CREATE TABLE IF NOT EXISTS `content_tags` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `contentId` int NOT NULL,
  `tagType` enum('persona', 'service', 'condition', 'funnel_stage') NOT NULL,
  `tagValue` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE CASCADE
);
