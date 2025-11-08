import type { StarlightUserConfig } from '@astrojs/starlight/types';
import { group } from './config/sidebar';

/**
 * Starlight sidebar configuration object for the global site sidebar.
 *
 * - Top-level groups become tabs.
 * - Use the `group()` utility function to define groups. This uses labels from our
 *   `src/content/nav/*.ts` files instead of defining labels and translations inline.
 *
 */
export const sidebar = [
	// Start tab
	group('start', {
		items: [
			'getting-started',
			'gallery',
			'tutorial/0-introduction',
			group('start.welcome', {
				items: [
					'concepts/why-paideia',
					'concepts/design-principles',
					'concepts/operating-principles',
				],
			}),
			group('start.newProject', {
				items: ['install-and-setup'],
			}),
			group('start.config', {
				items: [
					'guides/configuring-paideia',
					'guides/environment-variables',
					'guides/build-with-ai',
				],
			}),
			group('start.migrate', {
				collapsed: true,
				autogenerate: { directory: 'guides/migrate-to-paideia' },
			}),
		],
	}),

	// Guides tab
	group('guides', {
		items: [
			group('guides.userRoles', {
				items: ['basics/user-overview'],
			}),
			group('guides.ui', {
				items: [
					'guides/user-modules',
					'guides/user-modules/page',
					'guides/user-modules/whiteboard',
					'guides/user-modules/assignment',
					'guides/user-modules/quiz',
					'guides/user-modules/discussion',
				],
			}),
			group('guides.content', {
				items: ['basics/course-overview', 'basics/adding-modules-to-courses'],
			}),
			group('guides.enrolments', {
				items: ['guides/enrolments-overview', 'guides/enrolments-overview/groups'],
			}),
			group('guides.gradebook', {
				items: ['guides/gradebook-overview'],
			}),
			group('guides.notes', {
				items: ['concepts/notes'],
			}),
			group('guides.adminAndServer', {
				items: [
					'guides/admin-and-server/maintenance-mode',
					'guides/admin-and-server/cron-jobs',
				],
			}),
			group('guides.upgrade', {
				items: [
					'upgrade',
					// group('guides.upgrade.major', {
					// 	collapsed: true,
					// 	items: [
					// 		'guides/upgrade-to/v5',
					// 		'guides/upgrade-to/v4',
					// 		'guides/upgrade-to/v3',
					// 		'guides/upgrade-to/v2',
					// 		'guides/upgrade-to/v1',
					// 	],
					// }),
				],
			}),
			// 'guides/troubleshooting',
			// group('guides.recipes', { collapsed: true, autogenerate: { directory: 'recipes' } }),
			'contribute',
		],
	}),

	// Reference tab
	group('reference', {
		items: [
			'reference/configuration-reference',
			'reference/cli-reference',
			'reference/api-reference',
			'whitepaper',
			// group('reference.experimental', {
			// 	items: [
			// 		'reference/experimental-flags',
			// 		'reference/experimental-flags/csp',
			// 		'reference/experimental-flags/fonts',
			// 		'reference/experimental-flags/live-content-collections',
			// 		'reference/experimental-flags/client-prerender',
			// 		'reference/experimental-flags/content-intellisense',
			// 		'reference/experimental-flags/preserve-scripts-order',
			// 		'reference/experimental-flags/heading-id-compat',
			// 		'reference/experimental-flags/static-import-meta-env',
			// 		'reference/experimental-flags/chrome-devtools-workspace',
			// 		'reference/experimental-flags/fail-on-prerender-conflict',
			// 	],
			// }),
			// 'reference/legacy-flags',
			// 'reference/error-reference',
		],
	}),

	// Integrations tab
	group('integrations', {
		items: [
			'guides/integrations-guide',
			// group('integrations.ui', {
			// 	items: [
			// 		'guides/integrations-guide/alpinejs',
			// 		'guides/integrations-guide/preact',
			// 		'guides/integrations-guide/react',
			// 		'guides/integrations-guide/solid-js',
			// 		'guides/integrations-guide/svelte',
			// 		'guides/integrations-guide/vue',
			// 	],
			// }),
			// group('integrations.adapters', {
			// 	items: [
			// 		'guides/integrations-guide/cloudflare',
			// 		'guides/integrations-guide/netlify',
			// 		'guides/integrations-guide/node',
			// 		'guides/integrations-guide/vercel',
			// 	],
			// }),
			// group('integrations.other', {
			// 	items: [
			// 		'guides/integrations-guide/db',
			// 		'guides/integrations-guide/markdoc',
			// 		'guides/integrations-guide/mdx',
			// 		'guides/integrations-guide/partytown',
			// 		'guides/integrations-guide/sitemap',
			// 	],
			// }),
			// 'reference/publish-to-npm',
		],
	}),

	// Third-party services tab (commented out - may need to reference in the future)
	// group('thirdParty', {
	// 	items: [
	// 		group('thirdParty.deployment', {
	// 			collapsed: true,
	// 			autogenerate: { directory: 'guides/deploy' },
	// 		}),
	// 		group('thirdParty.cms', {
	// 			collapsed: true,
	// 			autogenerate: { directory: 'guides/cms' },
	// 		}),
	// 		group('thirdParty.backend', {
	// 			collapsed: true,
	// 			autogenerate: { directory: 'guides/backend' },
	// 		}),
	// 		group('thirdParty.media', {
	// 			collapsed: true,
	// 			autogenerate: { directory: 'guides/media' },
	// 		}),
	// 		'guides/ecommerce',
	// 		'guides/authentication',
	// 		'guides/testing',
	// 	],
	// }),
] satisfies StarlightUserConfig['sidebar'];
