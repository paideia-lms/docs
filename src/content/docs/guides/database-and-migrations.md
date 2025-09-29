---
title: Database and Migrations
description: Database and migrations guide for Paideia LMS
---

# Database and Migrations

This guide covers the database architecture, migration system, and best practices for managing data in Paideia LMS.

## 🗄️ Database Architecture

### Database Engine

Paideia LMS uses **PostgreSQL** as its primary database engine, chosen for its:
- Robust relational data model
- Advanced querying capabilities
- JSON/JSONB support for flexible data
- Excellent performance and reliability
- Strong ACID compliance

### Database Schema

The database is organized around several key entities:

#### Core Collections
- **Users**: Authentication and user profiles
- **Courses**: Course information and metadata
- **Lessons**: Individual course content units
- **Enrollments**: Student-course relationships
- **Assignments**: Course assignments and submissions

## 🗂️ Data Model

### Users Collection
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  role VARCHAR CHECK (role IN ('admin', 'instructor', 'student')),
  bio TEXT,
  avatar_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### Courses Collection
```sql
courses (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  instructor_id UUID REFERENCES users(id),
  difficulty VARCHAR CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER,
  status VARCHAR CHECK (status IN ('draft', 'published', 'archived')),
  thumbnail_url VARCHAR,
  tags JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### Lessons Collection
```sql
lessons (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  course_id UUID REFERENCES courses(id),
  order_index INTEGER NOT NULL,
  type VARCHAR CHECK (type IN ('text', 'video', 'quiz', 'assignment')),
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

## 🔄 Migration System

### Migration Overview

Paideia uses **Payload CMS migrations** combined with **Drizzle ORM** for database schema management. This provides:

- Automatic schema generation from Payload configuration
- Version-controlled database changes
- Rollback capabilities
- Development and production parity

### Migration Files

Migrations are stored in `src/migrations/` and follow the pattern:

```
src/migrations/
├── 20250925_053233.ts       # Migration file
├── 20250925_053233.json     # Migration metadata
└── index.ts                 # Migration registry
```

### Migration Structure

```typescript
// src/migrations/20250925_053233.ts
import { MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Schema changes go here
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS new_collection (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

export async function down({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Rollback changes go here
  await db.execute(sql`
    DROP TABLE IF EXISTS new_collection;
  `);
}
```

## 🛠️ Migration Commands

### Development Workflow

#### 1. Make Schema Changes
Edit the Payload configuration in `server/payload.config.ts`:

```typescript
// Add new collection or modify existing ones
export const NewCollection = {
  slug: "new-collection",
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};
```

#### 2. Create Migration
```bash
# Generate migration from schema changes
bun run migrate:create "add-new-collection"
```

This analyzes the difference between current database schema and Payload configuration, then generates the appropriate SQL.

#### 3. Review Migration
```bash
# Check migration status
bun run migrate:status

# View generated migration
cat src/migrations/$(ls -t src/migrations/ | head -1)
```

#### 4. Apply Migration
```bash
# Apply pending migrations
bun run migrate:up
```

### Migration Commands Reference

```bash
# Create new migration
bun run migrate:create [migration-name]
# Optional: --skip-empty (skip if no changes detected)

# Check migration status
bun run migrate:status

# Apply all pending migrations
bun run migrate:up

# Rollback last migration
bun run migrate:down

# Rollback and reapply all migrations
bun run migrate:refresh

# Reset database and reapply all migrations
bun run migrate:fresh

# Rollback all migrations
bun run migrate:reset
```

### Production Migration Strategy

#### CI/CD Pipeline
```yaml
# Example GitHub Actions deployment
- name: Run Database Migrations
  run: |
    bun run migrate:up
    bun run build
```

#### Zero-Downtime Migrations
```bash
# 1. Deploy new code with migration
# 2. Migration runs during app startup
# 3. Old code still works with new schema
# 4. Gradual rollout to new version
```

## 🔧 Database Management

### Connection Configuration

Database connection is configured through environment variables:

```env
# Development
DATABASE_URL=postgresql://paideia:paideia_password@localhost:5432/paideia_db

# Production
DATABASE_URL=postgresql://prod_user:prod_password@prod_host:5432/paideia_prod
```

### Connection Pooling

Payload automatically handles connection pooling:

```typescript
// server/payload.config.ts
const config = {
  db: postgresAdapter({
    pool: {
      max: 20,           // Maximum connections
      min: 2,            // Minimum connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  }),
};
```

### Performance Optimization

#### Indexing Strategy
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_enrollments_user_course ON enrollments(user_id, course_id);
```

#### Query Optimization
```typescript
// ✅ Good: Use specific field selection
const users = await payload.find({
  collection: "users",
  select: { id: true, email: true, firstName: true },
  where: { role: { equals: "student" } },
  limit: 50,
});

// ✅ Good: Use pagination instead of large limits
const users = await payload.find({
  collection: "users",
  page: 1,
  limit: 20,
});
```

## 🔍 Database Queries

### Basic CRUD Operations

#### Create
```typescript
const newCourse = await payload.create({
  collection: "courses",
  data: {
    title: "Introduction to React",
    description: "Learn React fundamentals",
    instructor: "instructor-id",
    difficulty: "beginner",
  },
});
```

#### Read
```typescript
// Find all courses
const courses = await payload.find({
  collection: "courses",
});

// Find specific course
const course = await payload.findByID({
  collection: "courses",
  id: "course-id",
});

// Find with filtering
const beginnerCourses = await payload.find({
  collection: "courses",
  where: {
    difficulty: { equals: "beginner" },
    status: { equals: "published" },
  },
});
```

#### Update
```typescript
const updatedCourse = await payload.update({
  collection: "courses",
  id: "course-id",
  data: {
    title: "Updated Course Title",
    description: "Updated description",
  },
});
```

#### Delete
```typescript
await payload.delete({
  collection: "courses",
  id: "course-id",
});
```

### Advanced Queries

#### Complex Filtering
```typescript
const courses = await payload.find({
  collection: "courses",
  where: {
    and: [
      { difficulty: { equals: "intermediate" } },
      {
        or: [
          { instructor: { equals: "instructor-1" } },
          { instructor: { equals: "instructor-2" } },
        ],
      },
    ],
  },
});
```

#### Sorting and Pagination
```typescript
const courses = await payload.find({
  collection: "courses",
  sort: "-createdAt",        // Sort by newest first
  limit: 20,                 // 20 per page
  page: 1,                   // Page 1
});
```

#### Population (Relationships)
```typescript
const coursesWithInstructors = await payload.find({
  collection: "courses",
  populate: {
    instructor: true,        // Populate instructor data
  },
});
```

### Raw SQL Queries

For complex queries that exceed Payload's ORM capabilities:

```typescript
import { sql } from '@payloadcms/db-postgres';

// Execute raw SQL
const result = await payload.db.execute(sql`
  SELECT
    c.title,
    u.first_name || ' ' || u.last_name as instructor_name,
    COUNT(e.id) as enrollment_count
  FROM courses c
  LEFT JOIN users u ON c.instructor_id = u.id
  LEFT JOIN enrollments e ON c.id = e.course_id
  GROUP BY c.id, u.id
  ORDER BY enrollment_count DESC
  LIMIT 10;
`);
```

## 📊 Database Monitoring

### Performance Monitoring

#### Query Performance
```typescript
// Enable query logging in development
const config = {
  db: postgresAdapter({
    logger: process.env.NODE_ENV !== "production"
      ? new EnhancedQueryLogger()
      : undefined,
  }),
};
```

#### Connection Pool Monitoring
```typescript
// Check pool status
const pool = payload.db.pool;
console.log({
  totalConnections: pool.totalCount,
  idleConnections: pool.idleCount,
  waitingConnections: pool.waitingCount,
});
```

### Health Checks

#### Database Connectivity
```typescript
export async function checkDatabaseHealth() {
  try {
    await payload.db.connect();
    const result = await payload.db.execute(sql`SELECT 1 as health_check`);
    return { status: "healthy", responseTime: Date.now() - start };
  } catch (error) {
    return { status: "unhealthy", error: error.message };
  }
}
```

#### Application Health Endpoint
```typescript
// Add to server
app.get("/api/health", async () => {
  const dbHealth = await checkDatabaseHealth();
  return {
    status: dbHealth.status === "healthy" ? "ok" : "error",
    database: dbHealth,
    timestamp: new Date().toISOString(),
  };
});
```

## 🔄 Backup and Recovery

### Database Backup

#### Automated Backups
```bash
# PostgreSQL dump
pg_dump -h localhost -U paideia -d paideia_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump -h localhost -U paideia -d paideia_db | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

#### Backup Strategy
```bash
#!/bin/bash
# Daily backup script
BACKUP_DIR="/var/backups/paideia"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U paideia -d paideia_db > $BACKUP_DIR/db_backup_$DATE.sql

# File storage backup (MinIO)
mc cp -r minio/paideia $BACKUP_DIR/files_backup_$DATE/

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

### Recovery Process

#### Database Recovery
```bash
# Restore from backup
psql -h localhost -U paideia -d paideia_db < backup.sql

# Or restore specific tables
psql -h localhost -U paideia -d paideia_db -c "TRUNCATE courses CASCADE;"
psql -h localhost -U paideia -d paideia_db < courses_backup.sql
```

#### Migration Recovery
```bash
# Rollback to specific migration
bun run migrate:down

# Reset and reapply migrations
bun run migrate:refresh
```

## 🚀 Scaling Considerations

### Read Replicas
```typescript
// Configure read replicas for better performance
const config = {
  db: postgresAdapter({
    replicas: [
      { url: "postgresql://replica1:5432/paideia" },
      { url: "postgresql://replica2:5432/paideia" },
    ],
  }),
};
```

### Connection Pooling
```typescript
// Optimize pool settings based on load
const config = {
  db: postgresAdapter({
    pool: {
      max: process.env.NODE_ENV === "production" ? 50 : 20,
      min: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    },
  }),
};
```

### Partitioning Strategy
```sql
-- Partition large tables by date
CREATE TABLE enrollments_y2024m01 PARTITION OF enrollments
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

## 🔧 Troubleshooting

### Common Database Issues

#### Connection Problems
```bash
# Test database connectivity
docker exec paideia-postgres psql -U paideia -d paideia_db -c "SELECT 1;"

# Check connection logs
docker logs paideia-postgres

# Verify environment variables
echo $DATABASE_URL
```

#### Migration Issues
```bash
# Check migration status
bun run migrate:status

# View migration logs
PAYLOAD_LOG_LEVEL=debug bun run migrate:up

# Reset migrations (development only)
bun run migrate:reset
bun run migrate:fresh
```

#### Performance Problems
```sql
-- Check for slow queries
SELECT * FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Add missing indexes
CREATE INDEX CONCURRENTLY idx_courses_status ON courses(status);
```

### Debug Mode

Enable detailed database logging:

```env
# Enable query logging
DEBUG=*
PAYLOAD_LOG_LEVEL=debug

# Enable Drizzle query logging
DRIZZLE_LOGGER=true
```

### Recovery Procedures

#### After Failed Migration
```bash
# 1. Check current status
bun run migrate:status

# 2. Rollback if needed
bun run migrate:down

# 3. Fix the migration file
# 4. Reapply
bun run migrate:up
```

#### Database Corruption
```bash
# 1. Stop the application
# 2. Restore from backup
psql -h localhost -U paideia -d paideia_db < backup.sql

# 3. Verify data integrity
psql -h localhost -U paideia -d paideia_db -c "SELECT COUNT(*) FROM users;"

# 4. Restart application
```

## 📈 Best Practices

### Schema Design
- Use descriptive field names
- Implement proper relationships
- Add appropriate indexes
- Use consistent data types

### Migration Best Practices
- Test migrations in development first
- Use descriptive migration names
- Keep migrations reversible
- Document significant changes

### Query Optimization
- Use indexes for frequently queried fields
- Avoid SELECT * in production queries
- Use pagination for large datasets
- Monitor query performance regularly

### Backup Strategy
- Automate regular backups
- Test backup restoration procedures
- Store backups securely
- Keep multiple backup generations

---

Following these database and migration practices ensures a robust, scalable, and maintainable data layer for Paideia LMS.
