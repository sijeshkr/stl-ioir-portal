-- Insert STL IOIR client
INSERT INTO `clients` (`id`, `name`, `slug`, `logo`, `primaryColor`, `secondaryColor`, `status`, `createdAt`, `updatedAt`) 
VALUES (1, 'STL IOIR Clinics', 'stl-ioir', 'https://cdn.manus.space/hero-collaboration-team.jpg', '#0073E6', '#F77F00', 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Insert Launch Strategy
INSERT INTO `strategies` (`id`, `clientId`, `name`, `version`, `status`, `isDefault`, `funnelConfig`, `platformAllocation`, `budgetAllocation`, `timeline`, `notes`, `createdAt`, `updatedAt`)
VALUES (
  1,
  1,
  'Launch Strategy',
  '1.0',
  'approved',
  1,
  '{"tiers":[{"name":"Tier 1: Authority","description":"Establish Dr. Vaheesan as physician\'s choice","channels":["LinkedIn","Physician Networks","Tumor Boards"]},{"name":"Tier 2: Education","description":"Answer what is IO/IR?","channels":["Facebook","Website","YouTube"]},{"name":"Tier 3: Action","description":"Make it easy to refer or book","channels":["Google Search","Referral Portal","Direct Outreach"]}]}',
  '{"linkedin":60,"facebook":30,"instagram":10}',
  '{"linkedin":800,"facebook":600,"google":200}',
  '{"phases":[{"name":"Pre-Launch","startDate":"2026-02-18","endDate":"2026-03-07","goals":"Build awareness & anticipation. 500+ followers, website traffic growth, physician awareness"},{"name":"Launch Week","startDate":"2026-03-10","endDate":"2026-03-14","goals":"Maximize visibility & momentum. 2,000+ website visits, peak engagement, launch buzz"},{"name":"Post-Launch","startDate":"2026-03-15","endDate":"2026-05-31","goals":"Sustain engagement & build pipeline. 1,500+ followers, 15+ referring physicians, 50+ reviews"}]}',
  'Authority First, Referrals Primary. One referring physician = 100 direct patients. Focus on LinkedIn for physician referrals (60%), Facebook for patient education (30%), Instagram for awareness (10%).',
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE name=name;

-- Insert Post-Launch Strategy
INSERT INTO `strategies` (`id`, `clientId`, `name`, `version`, `status`, `isDefault`, `funnelConfig`, `platformAllocation`, `budgetAllocation`, `timeline`, `notes`, `createdAt`, `updatedAt`)
VALUES (
  2,
  1,
  'Post-Launch Strategy',
  '1.0',
  'draft',
  0,
  '{"tiers":[{"name":"Tier 1: Authority","description":"Maintain physician relationships","channels":["LinkedIn","Case Studies","Tumor Boards"]},{"name":"Tier 2: Education","description":"Patient success stories","channels":["Facebook","YouTube","Blog"]},{"name":"Tier 3: Action","description":"Referral optimization","channels":["Google Search","Referral Portal","Email"]}]}',
  '{"linkedin":50,"facebook":35,"instagram":10,"youtube":5}',
  '{"linkedin":600,"facebook":500,"google":200,"youtube":200}',
  '{"phases":[{"name":"Sustained Engagement","startDate":"2026-04-01","endDate":"2026-06-30","goals":"Maintain momentum, build referral pipeline"},{"name":"Growth Phase","startDate":"2026-07-01","endDate":"2026-12-31","goals":"Scale operations, expand services"}]}',
  'Focus shifts to sustained engagement and referral pipeline building.',
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE name=name;

-- Insert Personas for Launch Strategy
INSERT INTO `strategy_personas` (`strategyId`, `name`, `description`, `demographics`, `painPoints`, `goals`)
VALUES 
(1, 'Referring Physician', 'Medical oncologists, surgeons, primary care physicians', '40-65 years old, St. Louis area, established practice', 'Need fast turnaround for patients, reliable referral partners, complex cases requiring specialist care', 'Find trusted IO/IR specialist, fast consultation and treatment, collaborative care model'),
(1, 'Patient & Family', 'Cancer patients and their families seeking treatment options', '40-70 years old, diagnosed with liver, kidney, or other cancers', 'Fear of surgery, long recovery times, limited treatment options, need for less invasive care', 'Minimize pain and recovery time, maintain quality of life, find expert care close to home'),
(1, 'Younger Patient', 'Younger adults seeking minimally invasive treatments', '30-50 years old, active lifestyle, health-conscious', 'Want to avoid major surgery, quick return to work/life, modern treatment approaches', 'Fast recovery, minimal disruption, cutting-edge medical care')
ON DUPLICATE KEY UPDATE name=name;

-- Insert Services for Launch Strategy
INSERT INTO `strategy_services` (`strategyId`, `name`, `description`)
VALUES 
(1, 'Y90 Radioembolization', 'Liver cancer treatment using radioactive microspheres'),
(1, 'TACE (Transarterial Chemoembolization)', 'Targeted chemotherapy delivery for liver tumors'),
(1, 'Tumor Ablation', 'Minimally invasive tumor destruction using heat or cold'),
(1, 'Uterine Fibroid Embolization', 'Non-surgical treatment for uterine fibroids'),
(1, 'Prostate Artery Embolization', 'Treatment for enlarged prostate (BPH)'),
(1, 'Vascular Interventions', 'Treatment for vascular conditions and diseases')
ON DUPLICATE KEY UPDATE name=name;

-- Insert Conditions for Launch Strategy
INSERT INTO `strategy_conditions` (`strategyId`, `name`, `description`)
VALUES 
(1, 'Liver Cancer', 'Primary and metastatic liver tumors (HCC, colorectal mets)'),
(1, 'Kidney Cancer', 'Renal cell carcinoma and kidney tumors'),
(1, 'Bone Metastases', 'Cancer spread to bones causing pain'),
(1, 'Thyroid Cancer', 'Thyroid nodules and tumors'),
(1, 'Uterine Fibroids', 'Non-cancerous growths in the uterus'),
(1, 'Enlarged Prostate (BPH)', 'Benign prostatic hyperplasia'),
(1, 'Vascular Disease', 'Peripheral artery disease, DVT, varicose veins')
ON DUPLICATE KEY UPDATE name=name;

-- Insert March 2026 Monthly Plan
INSERT INTO `monthly_plans` (`id`, `clientId`, `name`, `month`, `status`, `notes`, `createdAt`, `updatedAt`)
VALUES (
  1,
  1,
  'March 2026 Launch',
  '2026-03-01',
  'approved',
  'Grand opening month. Focus on physician referrals and launch week visibility. Week 1: Introducing STL IOIR. Week 2: Pinhole Advantage. Week 3: Launch Week (Mar 10-14). Week 4: Patient Success Stories.',
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE name=name;

-- Link Launch Strategy to March Plan
INSERT INTO `monthly_plan_strategies` (`monthlyPlanId`, `strategyId`, `allocation`)
VALUES (1, 1, 100)
ON DUPLICATE KEY UPDATE allocation=allocation;

-- Insert Content Scope for March 2026
INSERT INTO `content_scope` (`monthlyPlanId`, `platform`, `contentType`, `quantity`, `budget`)
VALUES 
(1, 'linkedin', 'post', 12, 800.00),
(1, 'facebook', 'post', 16, 600.00),
(1, 'instagram', 'post', 12, NULL),
(1, 'blog', 'article', 4, NULL),
(1, 'newsletter', 'email', 2, NULL),
(1, 'youtube', 'video', 2, NULL)
ON DUPLICATE KEY UPDATE quantity=quantity;

-- Insert Sample Content Items
INSERT INTO `content` (`clientId`, `monthlyPlanId`, `scopeId`, `strategyId`, `stage`, `status`, `platform`, `contentType`, `title`, `copy`, `scheduledDate`)
VALUES 
-- Week 1: Introducing STL IOIR
(1, 1, 1, 1, 'copy', 'approved', 'linkedin', 'post', 'Clinic Announcement - Coming March 2026', 
'Exciting news for the St. Louis medical community:\n\nSTL Interventional Oncology + Interventional Radiology Clinics opens March 2026 — the first independent, office-based IO/IR practice in the region.\n\nLed by Dr. Kirubahara Vaheesan, MD, FSIR (30+ years experience, 30,000+ procedures, 400+ Y90 cases), we''re bringing advanced minimally invasive cancer and vascular treatments to a comfortable, patient-centered setting.\n\nWhy this matters for your practice:\n✓ Faster access: Consults within 5 days, biopsies < 48 hours\n✓ Comprehensive IO services: Y90, TACE, Ablation, Pain Management\n✓ Full IR capabilities: Vascular, Venous, Embolization, Drainage\n✓ Collaborative care model: We work with your team, not replace it\n✓ Office-based efficiency: Lower costs, better patient experience\n\nNow accepting appointment requests for March.\n\nRefer a patient: www.stlioirclinics.com\nQuestions? Reach Dr. Vaheesan directly: (314) 888-4647',
'2026-02-19 09:00:00'),

(1, 1, 2, 1, 'copy', 'approved', 'facebook', 'post', 'A Critical Milestone in Cancer Care',
'🏥 A New Kind of Cancer Care is Coming to St. Louis\n\nThis March, STL Interventional Oncology + Interventional Radiology Clinics opens its doors — bringing advanced, minimally invasive cancer treatments to a comfortable, office-based setting.\n\nWhat makes us different?\n✨ No knife needed — just a tiny pinhole entry point\n✨ Same-day procedures — go home to recover\n✨ Less pain, faster recovery — back to life in days, not weeks\n✨ Expert care — led by Dr. Vaheesan (30+ years, 30,000+ procedures, Top Doctor 5 years)\n\nWe treat:\n• Liver, kidney, bone, and thyroid cancers\n• Uterine fibroids\n• Enlarged prostate (BPH)\n• Vascular conditions\n• And more\n\n📅 Opening March 2026\n📞 Request your appointment now: (314) 888-4647\n🌐 www.stlioirclinics.com\n\nLess Waiting. More Living. 💙',
'2026-02-18 10:00:00'),

-- Week 2: Pinhole Advantage
(1, 1, 2, 1, 'copy', 'pending_review', 'facebook', 'post', 'No Knife Needed - The Pinhole Advantage',
'✂️ No Knife Needed: The Pinhole Advantage\n\nImagine treating serious medical conditions — like cancer, fibroids, or an enlarged prostate — without traditional surgery.\n\nNo large incisions. No overnight hospital stays. No weeks of recovery.\n\nThat''s the power of minimally invasive procedures.\n\nAt STL IOIR Clinics, we use a tiny, pinhole-sized entry point (less than 3mm — about the size of a pencil tip) to access and treat conditions that once required major surgery.\n\nHere''s what that means for you:\n🩹 Less Pain — Minimal incision = minimal discomfort\n⏱️ Faster Recovery — Most patients return to normal activities within days\n🏠 Outpatient Care — Go home the same day\n💰 Lower Costs — Office-based procedures are more affordable\n❤️ Better Outcomes — Precision treatment with less risk\n\nThe choice is clear.\n\n📞 (314) 888-4647\n🌐 www.stlioirclinics.com\n\nLess Waiting. More Living. 💙',
'2026-02-25 10:00:00'),

-- Launch Week
(1, 1, 1, 1, 'plan', 'draft', 'linkedin', 'post', 'We''re Open! STL IOIR Launches Today',
'Professional announcement for physicians. Services overview, referral information, contact details.',
'2026-03-10 08:00:00'),

(1, 1, 2, 1, 'plan', 'draft', 'facebook', 'post', 'We''re Open! Welcome to STL IOIR',
'Celebration post with clinic photos, services overview, patient-focused messaging, call to action.',
'2026-03-10 09:00:00'),

-- Topic stage examples
(1, 1, 1, 1, 'topic', 'draft', 'linkedin', 'post', 'Case Study: Fast Turnaround Success',
NULL,
'2026-03-20 09:00:00'),

(1, 1, 2, 1, 'topic', 'draft', 'facebook', 'post', 'Patient Testimonial: Life After Treatment',
NULL,
'2026-03-22 10:00:00')

ON DUPLICATE KEY UPDATE title=title;

-- Insert Content Tags
INSERT INTO `content_tags` (`contentId`, `tagType`, `tagValue`)
VALUES 
(1, 'persona', 'Referring Physician'),
(1, 'funnel_stage', 'Authority'),
(2, 'persona', 'Patient & Family'),
(2, 'funnel_stage', 'Education'),
(2, 'service', 'Y90 Radioembolization'),
(2, 'condition', 'Liver Cancer'),
(3, 'persona', 'Patient & Family'),
(3, 'funnel_stage', 'Education'),
(4, 'persona', 'Referring Physician'),
(4, 'funnel_stage', 'Action'),
(5, 'persona', 'Patient & Family'),
(5, 'funnel_stage', 'Action')
ON DUPLICATE KEY UPDATE tagValue=tagValue;

-- Insert Activity Log entries
INSERT INTO `activity_log` (`clientId`, `userId`, `action`, `entityType`, `entityId`, `details`, `createdAt`)
VALUES 
(1, NULL, 'strategy_approved', 'strategy', 1, 'Launch Strategy approved and set as default', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(1, NULL, 'monthly_plan_created', 'monthly_plan', 1, 'March 2026 Launch plan created', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(1, NULL, 'content_approved', 'content', 1, 'LinkedIn Post - March Week 1 approved', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, NULL, 'content_approved', 'content', 2, 'Facebook Post - March Week 1 approved', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, NULL, 'strategy_created', 'strategy', 2, 'Post-Launch Strategy created as draft', DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE action=action;
