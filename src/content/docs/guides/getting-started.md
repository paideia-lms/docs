---
title: Getting Started
description: Getting started with Paideia LMS
---

# Getting Started

This guide will help you set up and run Paideia LMS for development or production.

## Prerequisites

Before you begin, ensure you have the following installed:

- **[Bun](https://bun.sh)** - Fast JavaScript runtime and package manager
- **[Docker](https://docker.com)** - Container runtime (for development environment)
- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container Docker applications

### Install Bun

#### macOS/Linux
```bash
curl -fsSL https://bun.sh/install | bash
```

#### Windows
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

#### Verify Installation
```bash
bun --version
```

## Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/hananoshikayomaru/paideia.git
cd paideia
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://paideia:paideia_password@localhost:5432/paideia_db

# File Storage Configuration
S3_URL=http://localhost:9000
S3_ACCESS_KEY=paideia_minio
S3_SECRET_KEY=paideia_minio_secret

# Payload CMS Configuration
PAYLOAD_SECRET=your-super-secret-payload-key-change-this-in-production

# Server Configuration
PORT=3001
FRONTEND_PORT=3000
```

### 3. Start Development Environment

The easiest way to get started is using the development script which automatically starts all required services:

```bash
bun dev
```

This command will:
- Start PostgreSQL database on `localhost:5432`
- Start MinIO object storage on `localhost:9000` (API) and `localhost:9001` (Web UI)
- Start the Drizzle Gateway on `localhost:4983`
- Start the Paideia application on `localhost:3000`

### 4. Access the Application

- **Main Application**: http://localhost:3000
- **MinIO Console**: http://localhost:9001
  - Username: `paideia_minio`
  - Password: `paideia_minio_secret`
- **Drizzle Gateway**: http://localhost:4983
  - Master Password: `your_master_password`

### 5. First User Setup

When you first access the application, you'll be redirected to create the first user:

1. Open http://localhost:3000
2. You'll be automatically redirected to `/first-user`
3. Fill out the form with your admin details:
   - Email address
   - Password (minimum 8 characters)
   - First name
   - Last name
4. Click "Create First User"
5. You'll be logged in as an administrator and redirected to the admin panel

## Manual Setup (Alternative)

If you prefer to set up services manually or have them running separately:

### Database Setup
```bash
# Using Docker
docker run --name paideia-postgres \
  -e POSTGRES_USER=paideia \
  -e POSTGRES_PASSWORD=paideia_password \
  -e POSTGRES_DB=paideia_db \
  -p 5432:5432 \
  -d postgres:15

# Using local PostgreSQL installation
createdb paideia_db
createuser -P paideia  # Enter password: paideia_password
```

### File Storage Setup
```bash
# Using Docker
docker run --name paideia-minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=paideia_minio \
  -e MINIO_ROOT_PASSWORD=paideia_minio_secret \
  -d minio/minio server /data --console-address ":9001"
```

### Run Database Migrations
```bash
# Generate Payload types
bun run typecheck

# Run database migrations
bun run migrate:up
```

### Start the Application
```bash
# Development mode
bun --watch ./server/index.ts

# Or run the frontend and backend separately
# Frontend: bun --watch run dev
# Backend: bun --watch ./server/index.ts
```

## Production Setup

### 1. Build the Application
```bash
bun run build
```

This creates a single executable in the `dist/` directory.

### 2. Set Production Environment Variables

Create a `.env` file or set environment variables:

```env
# Production Database
DATABASE_URL=postgresql://prod_user:prod_password@prod_host:5432/paideia_prod

# Production File Storage
S3_URL=https://your-s3-endpoint.com
S3_ACCESS_KEY=your_access_key
S3_SECRET_KEY=your_secret_key

# Production Secrets
PAYLOAD_SECRET=your-production-payload-secret

# Server Configuration
PORT=3001
FRONTEND_PORT=3000
NODE_ENV=production
```

### 3. Run in Production
```bash
# Using the built executable
./dist/paideia

# Or using Bun
bun start
```

### 4. Production Deployment Options

#### Docker Deployment
```dockerfile
FROM oven/bun:latest
COPY . /app
WORKDIR /app
RUN bun install --production
RUN bun run build
EXPOSE 3000
CMD ["./dist/paideia"]
```

#### Systemd Service (Linux)
Create `/etc/systemd/system/paideia.service`:
```ini
[Unit]
Description=Paideia LMS
After=network.target

[Service]
Type=simple
User=paideia
WorkingDirectory=/opt/paideia
ExecStart=/opt/paideia/dist/paideia
Restart=always
EnvironmentFile=/opt/paideia/.env

[Install]
WantedBy=multi-user.target
```

## Troubleshooting

### Port Conflicts
If you encounter port conflicts:

```bash
# Check what's using the ports
lsof -i :3000
lsof -i :5432
lsof -i :9000

# Kill processes if needed
kill -9 $(lsof -t -i:3000)
```

### Database Connection Issues
```bash
# Test database connection
docker exec paideia-postgres psql -U paideia -d paideia_db -c "SELECT 1;"

# Check logs
docker logs paideia-postgres
```

### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod +x dist/paideia
```

### First User Creation Issues
If you're having trouble with first user creation:

1. Check the browser console for JavaScript errors
2. Verify all environment variables are set correctly
3. Check the server logs for error messages
4. Try clearing browser cache and cookies

## Next Steps

- Explore the [Architecture Overview](Architecture-Overview) to understand the system design
- Check the [Development Guide](Development-Guide) for detailed development workflows
- Review the [Authentication Guide](Authentication) for user management
- See the [Contributing Guide](Contributing-Guide) if you want to contribute to the project

## Support

If you encounter issues:

1. Check the [troubleshooting](#troubleshooting) section above
2. Review the logs from Docker containers
3. Check the browser developer console for frontend errors
4. Open an issue on [GitHub](https://github.com/hananoshikayomaru/paideia/issues)

---

**Happy Learning!** 🎓
