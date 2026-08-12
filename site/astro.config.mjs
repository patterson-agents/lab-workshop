// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';

// TechDays: AI Fluency — the "Agentic Agents" training lab.
//
// The tutorial lessons under src/content/docs/tutorial/** were ported from a
// TutorialKit content package on 2026-08-12 and are now committed, canonical
// content edited in place. The TutorialKit toolchain was retired because
// @tutorialkit/astro@1.6.0 pins astro ^4.15.0, which carries unpatched CVEs.
//
// Branding is applied entirely through `src/styles/patterson.css`, which remaps
// Starlight's `--sl-*` custom properties onto Patterson brand tokens. No Starlight
// component is ejected, so the theme survives Starlight upgrades.
//
// https://astro.build/config
export default defineConfig({
  site: 'https://techdays.dev',

  // Astro's default image service compiles sharp, which carries an open advisory.
  // The passthrough service copies images through untouched — no native binary,
  // no optimization. Docs sites rarely need the pipeline.
  image: { service: passthroughImageService() },

  integrations: [
    starlight({
      title: 'TechDays: AI Fluency',
      description:
        'A half-day, hands-on training lab on configuring AI coding agents — AGENTS.md, commands, skills, plugins, and MCP.',
      tagline: 'Agentic agents - half-day training lab',
      logo: {
        light: './src/assets/patterson-logo-navy.svg',
        dark: './src/assets/patterson-logo-white.svg',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      customCss: ['./src/styles/patterson.css'],
      // Proxima Nova is served by Adobe Fonts kit uth1qfm. Load it from the kit
      // only — Adobe's terms do not permit re-hosting Typekit payloads, so never
      // commit font binaries or @font-face declarations for it.
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://use.typekit.net/uth1qfm.css',
          },
        },
      ],
      social: [
        {
          icon: 'external',
          label: 'Patterson Companies',
          href: 'https://www.pattersoncompanies.com',
        },
      ],
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      pagination: true,
      expressiveCode: {
        // Copy button on code frames; Patterson borders and radius come from
        // src/styles/patterson.css.
        frames: { showCopyToClipboardButton: true },
      },
      // Facilitators carries the presenter's guide. Curriculum is the workshop
      // track the tutorial lessons were adapted from. Tutorial is the 5-part,
      // 18-lesson hands-on track. All three autogenerate from their folders,
      // so adding a lesson never needs a sidebar edit.
      sidebar: [
        {
          label: 'Start here',
          items: [{ label: 'Overview', link: '/' }],
        },
        {
          label: 'Facilitators',
          items: [{ autogenerate: { directory: 'facilitators' } }],
        },
        {
          label: 'Workshop track',
          items: [{ autogenerate: { directory: 'curriculum' } }],
        },
        {
          label: 'Tutorial',
          items: [{ autogenerate: { directory: 'tutorial' } }],
        },
      ],
    }),
  ],
});
