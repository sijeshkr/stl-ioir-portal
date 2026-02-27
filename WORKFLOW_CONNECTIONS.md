# How Strategy → Monthly Plan → Content Are Connected

## Overview

The STL IOIR Client Portal uses a hierarchical workflow where **Strategies** define the big-picture approach, **Monthly Plans** allocate resources and set quotas, and **Content** items are created to fulfill those quotas.

---

## 1. Strategy (Foundation Layer)

**Purpose:** Define the overall marketing approach and target audience framework.

**Key Components:**
- **Platform Allocation** - How much effort goes to each platform (LinkedIn 60%, Facebook 30%, Instagram 10%)
- **Target Personas** - Who you're trying to reach (Medical Oncologists, Vascular Surgeons, Patients 40-70)
- **Services** - What you're promoting (Y90, TACE, Ablation, Uterine Fibroid Embolization)
- **Conditions** - What medical conditions you address (Liver Cancer, Kidney Cancer, Fibroids)
- **Messaging Themes** - Core messages ("No Knife Needed", "Pinhole Advantage", "Elite Expertise")

**Example:**
```
Strategy: "Launch Strategy"
- LinkedIn: 60% (physician referrals)
- Facebook: 30% (patient education)
- Instagram: 10% (awareness)
- Target: Medical Oncologists, Patients 50-70
- Services: Y90, TACE, Ablation
- Theme: "Authority First, Referrals Primary"
```

---

## 2. Monthly Plan (Execution Layer)

**Purpose:** Translate strategy into monthly execution quotas and budget allocation.

**Key Components:**
- **Strategy Assignment** - Which strategy (or strategies) this month follows
- **Strategy Allocation** - If using multiple strategies, what % of each (e.g., 70% Launch, 30% Post-Launch)
- **Content Scope** - Specific quotas per platform:
  - LinkedIn: 12 posts, $800 budget
  - Facebook: 16 posts, $600 budget
  - Instagram: 12 posts, $300 budget
- **Month** - Time period (e.g., "2026-03" for March 2026)
- **Status** - draft → pending_approval → approved → locked

**Example:**
```
Monthly Plan: "March 2026 Launch"
- Month: 2026-03
- Strategy: Launch Strategy (100%)
- Content Scope:
  * LinkedIn: 12 posts ($800)
  * Facebook: 16 posts ($600)
  * Instagram: 12 posts ($300)
- Status: approved
```

**Connection to Strategy:**
- The monthly plan references one or more strategies via `monthly_plan_strategies` table
- Platform quotas align with strategy platform allocation percentages
- Content created must align with the strategy's personas, services, and themes

---

## 3. Content (Delivery Layer)

**Purpose:** Create individual content pieces that fulfill monthly plan quotas and align with strategy.

**Key Components:**
- **4-Stage Workflow:**
  1. **Topic** - Brainstorm idea (e.g., "Dr. Vaheesan Introduction")
  2. **Plan** - Detail the content structure and platform targeting
  3. **Copy** - Write the actual post text/caption
  4. **Creative** - Design visual assets (images, graphics, videos)

- **Platform** - Where it will be published (linkedin, facebook, instagram)
- **Monthly Plan** - Which monthly plan this content fulfills
- **Strategy** - Which strategy it aligns with (inherited from monthly plan)
- **Tags** - Links to personas, services, conditions from the strategy
- **Status** - draft → pending_review → approved → needs_revision → rejected → published

**Example:**
```
Content: "LinkedIn Post: Dr. Vaheesan Introduction"
- Monthly Plan: March 2026 Launch
- Strategy: Launch Strategy
- Platform: LinkedIn
- Stage: Copy
- Status: approved
- Tags: 
  * Persona: Medical Oncologists
  * Service: Y90, TACE
  * Theme: "Elite Expertise"
```

**Connection to Monthly Plan:**
- Content references a monthly plan via `monthlyPlanId`
- Each content item counts toward the platform quota (e.g., 1 of 12 LinkedIn posts)
- Content must stay within the monthly plan's approved scope

**Connection to Strategy:**
- Content inherits strategy from the monthly plan
- Content tags (personas, services, conditions) must match the strategy's defined targets
- Messaging should align with strategy themes

---

## Database Relationships

```
strategies
  ↓ (one-to-many)
monthly_plan_strategies
  ↓ (many-to-one)
monthly_plans
  ↓ (one-to-many)
content
  ↓ (many-to-many via content_tags)
strategy_personas
strategy_services
strategy_conditions
```

**Key Tables:**
- `strategies` - Marketing strategy definitions
- `monthly_plans` - Monthly execution plans
- `monthly_plan_strategies` - Links plans to strategies with allocation %
- `content` - Individual content items
- `content_tags` - Links content to personas/services/conditions
- `monthly_plan_scope` - Platform quotas per monthly plan

---

## Workflow Example

### Step 1: Create Strategy
```
Name: "Launch Strategy"
Platform Allocation:
  - LinkedIn: 60%
  - Facebook: 30%
  - Instagram: 10%
Target Personas:
  - Medical Oncologists
  - Vascular Surgeons
Services:
  - Y90
  - TACE
  - Ablation
```

### Step 2: Create Monthly Plan
```
Name: "March 2026 Launch"
Month: 2026-03
Assigned Strategy: Launch Strategy (100%)
Content Scope:
  - LinkedIn: 12 posts ($800)
  - Facebook: 16 posts ($600)
  - Instagram: 12 posts ($300)
```

### Step 3: Create Content
```
Content Item 1:
  - Title: "Clinic Opening Announcement"
  - Monthly Plan: March 2026 Launch
  - Platform: LinkedIn
  - Stage: Topic → Plan → Copy → Creative
  - Tags: Medical Oncologists, Y90, TACE
  - Status: approved
  
Content Item 2:
  - Title: "No Knife Needed Campaign"
  - Monthly Plan: March 2026 Launch
  - Platform: Facebook
  - Stage: Topic → Plan → Copy → Creative
  - Tags: Patients 50-70, Fibroids, Ablation
  - Status: pending_review
```

### Step 4: Track Progress
- Monthly Plan shows: 2 of 12 LinkedIn posts created, 1 of 16 Facebook posts created
- Content Kanban shows: 1 in Creative stage (approved), 1 in Copy stage (pending_review)
- Calendar shows: scheduled publish dates for approved content

---

## Benefits of This Structure

1. **Strategic Alignment** - All content traces back to a defined strategy
2. **Resource Planning** - Monthly quotas prevent over/under-production
3. **Budget Control** - Platform budgets set at monthly plan level
4. **Approval Workflow** - Multi-stage review ensures quality
5. **Progress Tracking** - Dashboard shows quota fulfillment in real-time
6. **Flexibility** - Can blend multiple strategies in one month (e.g., 70% Launch + 30% Post-Launch)

---

## Future Enhancements

- **Auto-tagging** - AI suggests personas/services/conditions based on content
- **Quota warnings** - Alert when approaching monthly limits
- **Performance tracking** - Link published content to engagement metrics
- **Template library** - Reuse successful content structures across months
