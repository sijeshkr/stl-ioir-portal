# Project TODO

## Completed Features
- [x] Database schema (19 tables) for multi-tenant portal
- [x] Authentication system with Google OAuth
- [x] 6-level RBAC (super_admin, agency_admin, agency_creator, client_admin, client_editor, client_viewer)
- [x] Login page with split-screen design
- [x] Dashboard shell with sidebar navigation
- [x] Strategy Management module (list, create, edit, clone, delete)
- [x] Sample STL IOIR data seeded (2 strategies, 1 monthly plan, personas, services, conditions)
- [x] Design system (Outfit font, blue #0073E6 + orange #F77F00)
- [x] Monthly Planning module backend API (list, get, create, update, approve, lock, delete)
- [x] Monthly Planning module frontend UI (list page, form with 3 tabs)
- [x] Content Planning Module - 4-stage workflow (Topic → Plan → Copy → Creative)
- [x] Content Planning - List view with stage/status filters
- [x] Content Planning - Kanban view with drag-and-drop
- [x] Content Planning - Calendar view with month navigation
- [x] Content Planning backend API (list, get, create, update, approve, reject, delete)
- [x] Content form with 4-stage tabs (Topic, Plan, Copy, Creative)
- [x] Fixed monthly plan page error (schema mismatch: lowercase columns in DB, camelCase in code)
- [x] Fixed missing sidebar on content planning page
- [x] Fixed date formatting in monthly plans (removed startDate/endDate, using month field)
- [x] Added missing database columns (approvedby, approvedat, lockedat)
- [x] Comment system for content approval workflow
- [x] Content detail page with comments section
- [x] Multi-action approval (Comment, Request Changes, Reject, Approve)
- [x] Status updates based on approval actions
- [x] Updated portal logo to STL IOIR branding
- [x] Created Google Drive integration infrastructure
- [x] Built Files page with upload and browse UI
- [x] Added file management backend API (ready for OAuth credentials)
- [x] Implemented file grid with thumbnails and actions
- [x] Fixed Monthly Plans View Details button error (removed startDate/endDate references)
- [x] Removed Start Date and End Date fields from Monthly Plan form UI
- [x] Created WORKFLOW_CONNECTIONS.md documentation explaining Strategy → Monthly Plan → Content hierarchy

## In Progress
- [ ] Complete database migration for content_calendar_topics (strategyId nullable)
- [ ] Content form tab switching functionality (tabs need click handlers)
- [ ] Content tagging with personas/services/conditions
- [ ] Drag-and-drop functionality in Kanban view

## Recently Completed (Feb 26, 2026)
- [x] Create content_calendar_topics database table
- [x] Build Content Calendar backend API (create, list, update, updateStatus, delete, linkToContent)
- [x] Build Content Calendar page with 3 views (Table, Calendar, Kanban)
- [x] Add Calendar menu item to sidebar navigation
- [x] Create Topic Creation Dialog with all required fields
- [x] Add topic picker dropdown to Content Creation page
- [x] Auto-populate form when topic is selected from calendar
- [x] Add "Create Content" button to calendar topics in table view
- [x] Link calendar topics to content creation via URL params
- [x] Modernize UI design with improved CSS (glass morphism, shadows, transitions)
- [x] Create comprehensive API tests for content calendar (10 tests)

## Pending Features
- [ ] Comment threads for content approval
- [ ] File Library with S3 upload
- [ ] Ticketing System
- [ ] Team Management
- [ ] Dashboard analytics and metrics
- [ ] PWA configuration
- [ ] Analytics integration (Phase 2)
- [ ] Social media auto-publishing (Phase 2)

## Known Issues
- [ ] TypeScript lib.esnext.d.ts error (non-blocking, LSP cache issue)
- [ ] Sample content data needs correct stage values for Kanban display
