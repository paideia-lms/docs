// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://paideia-lms.github.io",
  integrations: [
    starlight({
      title: "Paideia LMS Docs",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/paideia-lms/paideia",
        },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
            { label: "Home", slug: "guides/home" },
            { label: "Getting Started", slug: "guides/getting-started" },
            { label: "Development Guide", slug: "guides/development-guide" },
            { label: "Deployment", slug: "guides/deployment" },
            {
              label: "Database and Migrations",
              slug: "guides/database-and-migrations",
            },
            { label: "Authentication", slug: "guides/authentication" },
            {
              label: "Architecture Overview",
              slug: "guides/architecture-overview",
            },
            { label: "API Documentation", slug: "guides/api-documentation" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
