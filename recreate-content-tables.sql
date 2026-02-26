DROP TABLE IF EXISTS content_comments;
DROP TABLE IF EXISTS content;

CREATE TABLE content (
  id int AUTO_INCREMENT PRIMARY KEY,
  clientId int NOT NULL,
  monthlyPlanId int NOT NULL,
  scopeId int,
  strategyId int NOT NULL,
  stage enum('topic', 'plan', 'copy', 'creative', 'scheduled', 'published') NOT NULL DEFAULT 'topic',
  status enum('draft', 'pending_review', 'approved', 'needs_revision', 'rejected') NOT NULL DEFAULT 'draft',
  topicTitle varchar(255),
  topicDescription text,
  planTitle varchar(255),
  platform enum('linkedin', 'facebook', 'instagram', 'twitter', 'tiktok', 'youtube', 'blog', 'newsletter', 'gmb'),
  contentFormat varchar(64),
  scheduledDate timestamp,
  copyBody text,
  copyHashtags text,
  copyCta text,
  mediaUrls text,
  publishedAt timestamp,
  publishedUrl text,
  createdBy int NOT NULL,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE content_comments (
  id int AUTO_INCREMENT PRIMARY KEY,
  contentId int NOT NULL,
  userId int NOT NULL,
  comment text NOT NULL,
  action enum('comment', 'approve', 'request_changes', 'reject'),
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO content (clientId, monthlyPlanId, strategyId, stage, status, topicTitle, topicDescription, platform, scheduledDate, createdBy) VALUES 
(1, 1, 1, 'topic', 'draft', 'LinkedIn Post: Dr. Vaheesan Introduction', 'Introduce Dr. Vaheesan and his 30+ years of experience', 'linkedin', '2026-03-15 10:00:00', 1),
(1, 1, 1, 'plan', 'pending_review', 'Facebook: No Knife Needed Campaign', 'Explain the pinhole advantage vs traditional surgery', 'facebook', '2026-03-18 14:00:00', 1),
(1, 1, 1, 'copy', 'approved', 'Instagram: Clinic Opening Announcement', 'Visual announcement of March 2026 opening', 'instagram', '2026-03-20 09:00:00', 1);
