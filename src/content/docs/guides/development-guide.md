---
title: Development Guide
description: Development guide for Paideia LMS
---

# Development Guide

This guide provides comprehensive information for developers working on Paideia LMS, including code organization, development workflows, best practices, and troubleshooting.

## 🏗️ Code Organization

### Project Structure
```
paideia/
├── app/                          # Frontend (React Router)
│   ├── routes/                   # Page components and route handlers
│   │   ├── admin.tsx            # Admin dashboard
│   │   ├── first-user.tsx       # First user setup
│   │   ├── login.tsx            # Authentication
│   │   └── *.tsx                # Other pages
│   ├── utils/                   # Frontend utilities
│   │   ├── responses.ts         # Response utilities
│   │   ├── get-content-type.ts  # Content type handling
│   │   └── assert-request-method.tsx # Request validation
│   └── assets/                  # Static assets (images, icons)
├── server/                      # Backend (Elysia.js + Payload)
│   ├── payload.config.ts        # CMS and database configuration
│   ├── internal/                # Internal server utilities
│   │   ├── check-first-user.ts  # First user detection
│   │   └── register-first-user.ts # User registration logic
│   ├── static/                  # Static file serving
│   └── utils/                   # Server utilities
├── src/migrations/              # Database migrations
└── scripts/                     # Build and utility scripts
```

### Frontend Structure (React Router)

#### Route Organization
Routes in React Router v7 follow a file-based structure:

```
app/routes/
├── admin.tsx              # Admin dashboard (/admin/*)
├── first-user.tsx         # First user setup (/first-user)
├── login.tsx              # Login page (/login)
├── logout.tsx             # Logout handler (/logout)
└── index.tsx              # Home page (/)
```

#### Key Frontend Concepts

**Loaders**: Server-side data loading functions
```typescript
export async function loader({ context }: Route.LoaderArgs) {
  const payload = context.get(dbContextKey).payload;
  // Load data here
  return { data };
}
```

**Actions**: Server-side form handling and mutations
```typescript
export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  // Handle form submission
  return { success: true };
}
```

**Client Actions**: Client-side action handling with notifications
```typescript
export async function clientAction({ request, serverAction }: Route.ClientActionArgs) {
  const actionData = await serverAction();
  // Show notifications based on result
  return actionData;
}
```

### Backend Structure (Elysia.js + Payload)

#### Server Organization
- **Elysia.js**: Main web framework for API routes
- **Payload CMS**: Content management and authentication
- **Database**: PostgreSQL with migration support

#### Key Server Components

**Global Context**: Shared resources across routes
```typescript
// server/global-context.ts
export const dbContextKey = Symbol("dbContext");
```

**Payload Configuration**: CMS setup and collections
```typescript
// server/payload.config.ts
export const Users = {
  slug: "users",
  auth: true,
  fields: [/* user fields */],
};
```

**Internal Utilities**: Reusable server functions
```typescript
// server/internal/check-first-user.ts
export async function checkFirstUser(): Promise<boolean> {
  // Check if any users exist
}
```

## 🔧 Development Workflow

### Setting Up Development Environment

1. **Prerequisites**: Install Bun, Docker, and Docker Compose
2. **Environment**: Configure `.env` file with required variables
3. **Services**: Use Docker Compose for database and storage services
4. **Development**: Run with hot reload for rapid iteration

### Development Commands

```bash
# Start full development environment
bun dev

# Run type checking and generate types
bun run typecheck

# Run database migrations
bun run migrate:up

# Build for production
bun run build

# Start production server
bun start
```

### Hot Reload Development

The development server supports hot module replacement for both frontend and backend:

- Frontend changes: Automatic browser reload
- Backend changes: Server restart with state preservation
- Database changes: Automatic migration application (in development)

### Debugging and Logging

#### Frontend Debugging
- Use browser developer tools
- Check React Router DevTools
- Console logging in components

#### Backend Debugging
```typescript
// Add logging to server functions
console.log("Debug info:", data);

// Use Payload's built-in logging
payload.logger.info("Info message");
```

#### Database Debugging
- Use Drizzle Gateway console at http://localhost:4983
- Check PostgreSQL logs in Docker
- Review migration logs

## 🛠️ Best Practices

### Code Style and Conventions

#### TypeScript Guidelines
- Use strict TypeScript settings
- Leverage type inference where possible
- Define interfaces for complex objects
- Use union types for better type safety

#### React Router Patterns
```typescript
// ✅ Good: Use proper TypeScript with Route types
export async function loader({ context }: Route.LoaderArgs) {
  // Implementation
}

// ✅ Good: Proper error handling
export async function action({ request, context }: Route.ActionArgs) {
  try {
    // Implementation
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

#### Error Handling
- Use structured error responses
- Implement proper try/catch blocks
- Provide meaningful error messages
- Handle edge cases gracefully

### Database Best Practices

#### Migration Strategy
- Create migrations for schema changes
- Test migrations in development first
- Use descriptive migration names
- Keep migrations reversible when possible

#### Query Optimization
```typescript
// ✅ Good: Use specific field selection
const users = await payload.find({
  collection: "users",
  select: { id: true, email: true, firstName: true },
  limit: 10,
});

// ✅ Good: Use where clauses for filtering
const activeUsers = await payload.find({
  collection: "users",
  where: { status: { equals: "active" } },
});
```

### Security Best Practices

#### Authentication
- Use Payload's built-in auth system
- Implement proper session management
- Validate all user inputs
- Use HTTPS in production

#### Authorization
- Implement role-based access control
- Check permissions on sensitive operations
- Use Payload's field-level permissions
- Validate user ownership of resources

### Performance Optimization

#### Frontend Performance
- Use React Router's built-in code splitting
- Optimize images and assets
- Implement proper loading states
- Use React.memo for expensive components

#### Backend Performance
- Use database indexes for frequently queried fields
- Implement caching for expensive operations
- Optimize database queries
- Use connection pooling

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Test utility functions
import { describe, it, expect } from "bun:test";

describe("User utilities", () => {
  it("should validate email format", () => {
    // Test implementation
  });
});
```

### Integration Tests
- Test API endpoints
- Test database operations
- Test authentication flows
- Test file upload/download

### Manual Testing Checklist

#### Authentication Testing
- [ ] First user creation works
- [ ] Login/logout functionality
- [ ] Password reset (if implemented)
- [ ] Role-based access control

#### Course Management Testing
- [ ] Course creation and editing
- [ ] User enrollment
- [ ] Content upload and display
- [ ] Assignment submission

#### Admin Panel Testing
- [ ] User management interface
- [ ] Course management interface
- [ ] System settings configuration
- [ ] Analytics and reporting

## 🔍 Troubleshooting

### Common Development Issues

#### Port Conflicts
```bash
# Check what's using ports
lsof -i :3000
lsof -i :5432

# Kill conflicting processes
kill -9 $(lsof -t -i:3000)
```

#### Database Connection Issues
```bash
# Test database connectivity
docker exec paideia-postgres psql -U paideia -d paideia_db -c "SELECT 1;"

# Reset database (development only)
docker-compose down -v
docker-compose up -d postgres
```

#### TypeScript Errors
```bash
# Regenerate Payload types
bun run typecheck

# Check TypeScript compilation
npx tsc --noEmit
```

#### Hot Reload Issues
- Restart the development server
- Clear node_modules/.cache
- Check for syntax errors in files
- Verify file permissions

### Debug Mode

Enable debug logging by setting environment variables:

```env
# Enable detailed logging
DEBUG=*
LOG_LEVEL=debug

# Payload specific logging
PAYLOAD_LOG_LEVEL=debug
```

### Performance Profiling

#### Frontend Profiling
- Use React DevTools Profiler
- Check network tab for API calls
- Monitor bundle size with build analyzer

#### Backend Profiling
- Monitor database query performance
- Check API response times
- Use Payload's query logger in development

## 🚀 Advanced Development

### Custom Collections

Add new content types to Payload:

```typescript
// server/payload.config.ts
export const Lessons = {
  slug: "lessons",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      required: true,
    },
  ],
};
```

### Custom Routes

Add new API endpoints to Elysia:

```typescript
// server/index.ts
const backend = new Elysia()
  .get("/api/custom-endpoint", async () => {
    // Implementation
  })
```

### Custom Components

Create reusable React components:

```typescript
// app/components/CustomComponent.tsx
export function CustomComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className="custom-component">
      {children}
    </div>
  );
}
```

### Plugin Development

While Paideia doesn't support dynamic plugins, you can extend functionality:

1. **Custom Utilities**: Add to `app/utils/` or `server/utils/`
2. **Custom Hooks**: Create React hooks in `app/hooks/`
3. **Custom Collections**: Add to Payload configuration
4. **Custom Routes**: Add to React Router routes

## 📚 Learning Resources

### Official Documentation
- [React Router v7](https://reactrouter.com/)
- [Elysia.js](https://elysiajs.com/)
- [Payload CMS](https://payloadcms.com/)
- [Mantine](https://mantine.dev/)
- [Bun](https://bun.sh/)

### Development Tools
- [TypeScript](https://typescriptlang.org/)
- [Docker](https://docker.com/)
- [PostgreSQL](https://postgresql.org/)
- [MinIO](https://min.io/)

### Community Resources
- [React Router Discord](https://discord.gg/react-router)
- [Elysia.js Discord](https://discord.gg/elysia)
- [Payload CMS Community](https://payloadcms.com/community)

---

This development guide should help you navigate the codebase and contribute effectively to Paideia LMS. Remember to follow the established patterns and maintain code quality standards.
