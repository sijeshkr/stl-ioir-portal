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
- [x] Fixed monthly plan page error (missing columns)
- [x] Fixed missing sidebar on content planning page
- [x] Comment system for content approval workflow
- [x] Content detail page with comments section
- [x] Multi-action approval (Comment, Request Changes, Reject, Approve)
- [x] Status updates based on approval actions

## In Progress
- [ ] Content form tab switching functionality (tabs need click handlers)
- [ ] Content tagging with personas/services/conditions
- [ ] Drag-and-drop functionality in Kanban view

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
