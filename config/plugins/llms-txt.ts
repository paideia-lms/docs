import starlightLlmsTxt from 'starlight-llms-txt';

/** Starlight plugin that sets up `starlight-llms-txt` with configuration for the Paideia LMS docs. */
export const starlightPluginLlmsTxt = () =>
	starlightLlmsTxt({
		// Basic information about the docs and Paideia LMS to display in the main `llms.txt` entry file.
		projectName: 'Paideia LMS',
		description:
			'Paideia LMS is a modern, lightweight Learning Management System designed for educational institutions. ',
		details: [
			'- Paideia is built with a modern tech stack including Bun, React Router v7, and Elysia for optimal performance.',
			'- Paideia features a React-based frontend with Mantine components for a consistent, modern UI.',
			'- Paideia is feature-complete with comprehensive LMS functionality including courses, enrollments, assignments, quizzes, discussions, and gradebooks.',
			'- Paideia deploys as a single binary - download and run with no complex setup required.',
			'- Paideia is built on PostgreSQL and S3 for minimal footprint with massive scalability.',
			'- Unlike Moodle and Canvas, Paideia avoids plugin hell with a "batteries included" approach - all essential features are built-in.',
			'- Paideia includes built-in LTI support, AI-native features, and Microsoft integration (Teams, OneDrive, Office 365).',
		].join('\n'),
		optionalLinks: [
			{
				label: 'Paideia LMS Website',
				url: 'https://paideialms.com/',
				description: 'the official Paideia LMS website',
			},
		],

		// Create custom subsets of docs to break things up.
		customSets: [
			{
				label: 'API Reference',
				description: 'terse, structured descriptions of Paideia LMS APIs',
				paths: ['en/reference/**'],
			},
			{
				label: 'User Modules',
				description: 'guides for using different content modules in Paideia LMS',
				paths: ['en/guides/user-modules/**'],
			},
			{
				label: 'Migration Guides',
				description: 'advice on how to migrate from other LMS platforms to Paideia LMS',
				paths: ['en/guides/migrate-to-paideia/**'],
			},
			{
				label: 'Integration Guides',
				description: 'guides for integrating Paideia LMS with external services and tools',
				paths: ['en/guides/integrations-guide/**'],
			},
		],

		// Control the order of pages in output files.
		promote: [
			'en/concepts/why-paideia',
			'en/concepts/design-principles',
			'en/concepts/operating-principles',
			'en/install-and-setup',
			'en/basics/user-overview',
			'en/basics/course-overview',
			'en/guides/user-modules',
		],

		// Exclude pages from the abridged `llms-small.txt` file designed for smaller context windows.
		exclude: [
			// Landing page doesn't really include any helpful content on its own, so it is excluded.
			'en/getting-started',
			// We can exclude this from the abridged docs as nonessential.
			'en/contribute',
			// Whitepaper is a PDF download, not essential for LLM context
			'en/whitepaper',

			// The following are all excluded because they are split out using `customSets`.

			// API Reference
			'en/reference/**',
			// User Modules
			'en/guides/user-modules/**',
			// Migration Guides
			'en/guides/migrate-to-paideia/**',
			// Integration Guides
			'en/guides/integrations-guide/**',
		],
	});
