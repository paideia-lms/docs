---
title: Home
description: Home page for Paideia LMS
---

# Paideia LMS

**A modern, lightweight Learning Management System (LMS) built with Bun and React Router v7.**

Paideia LMS is a modern alternative to traditional LMS platforms like Moodle, designed for extreme ease of management and deployment as a single executable. Built from the ground up with modern web technologies, it focuses on simplicity, performance, and developer experience while maintaining powerful LMS capabilities.

## 🎯 Vision

Paideia LMS aims to be the modern alternative to traditional LMS platforms. Built for the modern web with cutting-edge technologies, it provides a streamlined, efficient, and developer-friendly experience.

## ✨ Core Features

### 📚 Course Management
- Create and manage courses with assignments, quizzes, content, and grading
- Support for different course formats and delivery methods
- Instructor dashboard with course analytics

### 👥 User Management
- Comprehensive user creation and role-based access control
- Support for Students, Instructors, and Administrators
- User profiles with customizable information

### 🔐 Authentication & Security
- Built-in authentication system with Payload CMS
- JWT-based authentication with secure cookie handling
- Role-based permissions and access control

### 💾 Data Management
- PostgreSQL database with migration support
- File storage with MinIO S3-compatible storage
- Automatic first-user setup for new installations

### 🔄 Modern Architecture
- Single executable deployment
- Lightweight and fast startup times
- No dynamic plugins - built-in functionality only
- Modern tech stack optimized for performance

## 🏗️ Architecture Principles

- **🚀 Single Executable**: Package and deploy as one binary for maximum portability
- **🐰 Lightweight**: Minimal resource usage with fast startup times
- **🛡️ Secure by Default**: Built-in security best practices
- **⚡ Modern Stack**: Latest web technologies for optimal performance
- **🔧 Developer-Friendly**: TypeScript, hot reload, comprehensive tooling

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh) runtime
- Docker and Docker Compose (for development)

### Development Setup
```bash
# Clone the repository
git clone https://github.com/hananoshikayomaru/paideia.git
cd paideia

# Start development environment
bun dev
```

This starts:
- **PostgreSQL**: `localhost:5432`
- **MinIO**: `localhost:9000` (API) / `localhost:9001` (Web UI)
- **App**: `http://localhost:3000`

### Production Build
```bash
# Build for production
bun run build

# Run in production
bun start
```

## 📁 Project Structure

```
paideia/
├── app/                    # React Router frontend
│   ├── routes/            # Application routes
│   ├── utils/             # Frontend utilities
│   └── assets/            # Static assets
├── server/                # Backend server
│   ├── payload.config.ts  # CMS configuration
│   └── internal/          # Internal utilities
├── src/migrations/        # Database migrations
└── scripts/               # Build scripts
```

## 🛠️ Tech Stack

- **[Bun](https://bun.sh)** - Fast JavaScript runtime and bundler
- **[React Router v7](https://reactrouter.com/)** - Modern React framework
- **[Elysia](https://elysiajs.com)** - High-performance web framework
- **[TypeScript](https://typescriptlang.org/)** - Type-safe JavaScript
- **[Payload CMS](https://payloadcms.com/)** - Headless CMS and authentication
- **[PostgreSQL](https://postgresql.org/)** - Robust relational database
- **[MinIO](https://min.io/)** - S3-compatible object storage
- **[Mantine](https://mantine.dev/)** - Modern React components
- **[Docker](https://docker.com/)** - Containerized development environment

## 🤝 Contributing

We welcome contributions! This project is built with modern development practices and aims to be a community-driven alternative to traditional LMS platforms.

See our [Contributing Guide](Contributing-Guide) for details.

## 📄 License

[MIT License](https://github.com/hananoshikayomaru/paideia/blob/main/LICENSE)

---

**Paideia LMS** - Modern Learning Management for the Modern Web
