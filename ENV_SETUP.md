# Environment Variables Setup Guide

This document lists all environment variables required to deploy the STL IOIR Portal.

## Required Environment Variables

### Database Configuration
```bash
DATABASE_URL=mysql://user:password@host:port/database
```
- MySQL or TiDB connection string
- Format: `mysql://username:password@hostname:port/database_name`
- Example: `mysql://admin:pass123@db.example.com:3306/stl_ioir`

### Authentication & Security
```bash
JWT_SECRET=your-secret-key-change-this-in-production
```
- Secret key for signing JWT tokens
- Generate a random 32+ character string
- **IMPORTANT**: Change this in production!

```bash
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```
- Manus OAuth server URLs (if using Manus authentication)
- Can be omitted if using custom email/password authentication only

### Application Configuration
```bash
VITE_APP_ID=your-app-id
VITE_APP_TITLE=STL IOIR Social Media Strategy Dashboard
VITE_APP_LOGO=https://your-logo-url.com/logo.png
```
- App ID from Manus (if using Manus hosting)
- App title shown in browser tab and header
- Logo URL (can be a public URL or path to uploaded file)

### Owner Information
```bash
OWNER_OPEN_ID=owner-open-id
OWNER_NAME=Owner Name
```
- Owner's Manus Open ID (if using Manus authentication)
- Owner's display name

## Optional Environment Variables

### Manus Built-in APIs
```bash
BUILT_IN_FORGE_API_URL=https://forge-api.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge-api.manus.im
```
- Only needed if using Manus LLM, storage, or notification services
- Can be omitted if deploying independently

### Analytics
```bash
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```
- Optional analytics tracking
- Can be omitted if not using analytics

### Environment Mode
```bash
NODE_ENV=production
```
- Set to `production` for production deployments
- Set to `development` for local development

## GCP Deployment Setup

### Option 1: Cloud Run
1. Create a Cloud SQL MySQL instance
2. Set environment variables in Cloud Run service configuration
3. Deploy using `gcloud run deploy`

### Option 2: App Engine
1. Create `app.yaml` with environment variables
2. Deploy using `gcloud app deploy`

### Option 3: Compute Engine
1. SSH into VM instance
2. Create `.env` file in project root
3. Copy environment variables from this guide
4. Run `pnpm install && pnpm build && pnpm start`

## Security Best Practices

1. **Never commit `.env` files to git**
2. **Use different JWT_SECRET for each environment**
3. **Store DATABASE_URL securely** (use GCP Secret Manager)
4. **Rotate secrets regularly**
5. **Use HTTPS in production**

## Minimal Configuration for Testing

If you just want to test the portal locally, you only need:

```bash
DATABASE_URL=mysql://user:pass@localhost:3306/stl_ioir
JWT_SECRET=test-secret-key-change-in-production
NODE_ENV=development
```

All other variables have sensible defaults or are optional.

## Getting Help

- Check `server/_core/env.ts` for the complete list of environment variables
- Contact the development team for Manus-specific credentials
- Refer to GCP documentation for Cloud SQL and deployment guides
