# Paideia LMS Documentation

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

**Documentation for Paideia LMS - A modern, lightweight Learning Management System built with Bun and React Router v7.**

This documentation site provides comprehensive guides, API references, and development information for Paideia LMS.

## 📖 About Paideia LMS

Paideia LMS is a modern alternative to traditional LMS platforms like Moodle, designed for extreme ease of management and deployment as a single executable. Built from the ground up with modern web technologies, it focuses on simplicity, performance, and developer experience while maintaining powerful LMS capabilities.

### Key Features
- **📚 Course Management**: Create and manage courses with assignments, quizzes, content, and grading
- **👥 User Management**: Comprehensive user creation and role-based access control
- **🔐 Authentication & Security**: Built-in authentication system with Payload CMS
- **💾 Data Management**: PostgreSQL database with MinIO S3-compatible storage
- **🔄 Modern Architecture**: Single executable deployment with lightweight performance

### Tech Stack
- **[Bun](https://bun.sh)** - Fast JavaScript runtime and bundler
- **[React Router v7](https://reactrouter.com/)** - Modern React framework
- **[Elysia](https://elysiajs.com)** - High-performance web framework
- **[Payload CMS](https://payloadcms.com/)** - Headless CMS and authentication
- **[PostgreSQL](https://postgresql.org/)** & **[MinIO](https://min.io/)** - Database and storage

## 🚀 Documentation Structure

This documentation site is built with Astro and Starlight. The structure includes:

```
.
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and media
│   ├── content/
│   │   └── docs/          # Documentation content
│   │       ├── guides/    # Implementation guides
│   │       └── reference/ # API references
│   └── content.config.ts  # Content configuration
├── astro.config.mjs       # Astro configuration
├── package.json
└── tsconfig.json
```

Documentation is written in `.md` or `.mdx` files in the `src/content/docs/` directory. Each file becomes a route based on its file name.

## 🧞 Development Commands

All commands are run from the root of the documentation project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`            | Installs dependencies                            |
| `bun dev`                | Starts local dev server at `localhost:4321`     |
| `bun build`              | Build your production site to `./dist/`         |
| `bun preview`            | Preview your build locally, before deploying    |
| `bun astro ...`          | Run CLI commands like `astro add`, `astro check`|
| `bun astro -- --help`    | Get help using the Astro CLI                    |

## 🔗 Links

- **[Paideia LMS Repository](https://github.com/hananoshikayomaru/paideia)** - Main project repository
- **[Starlight Documentation](https://starlight.astro.build/)** - Documentation framework
- **[Astro Documentation](https://docs.astro.build)** - Static site generator
- **[Contributing Guide](./src/content/docs/guides/development-guide.md)** - How to contribute to Paideia LMS

## 📝 Contributing to Documentation

To contribute to this documentation:

1. Fork the repository
2. Create a new branch for your changes
3. Edit or add `.md` files in `src/content/docs/`
4. Test locally with `bun dev`
5. Submit a pull request

For contributing to the main Paideia LMS project, see the [Development Guide](./src/content/docs/guides/development-guide.md).
