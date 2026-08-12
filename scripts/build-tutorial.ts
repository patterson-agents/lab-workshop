// Ports the TutorialKit content package (tutorialkit/src/content/tutorial/**)
// into Starlight docs pages (site/src/content/docs/tutorial/**).
//
// Why a port instead of a real TutorialKit scaffold: see the commit that
// introduced this script. In short, @tutorialkit/astro@1.6.0 pins
// `astro: ^4.15.0` (both dependency and peerDependency — verified via
// `npm view @tutorialkit/astro@1.6.0 dependencies peerDependencies`), and
// Astro 4.x carries unpatched CVEs relative to the Astro 7 line this org's
// other Pages sites already run. The content format — parts with meta.md,
// lessons with content.md and an optional _files/ tree — is the stable
// contract HANDOFF.md itself anticipated surviving a scaffold-tool change.
//
// Zero dependencies: only Node's built-in fs/path/url modules. Written in
// erasable-syntax-only TypeScript (no enums, no namespaces, no parameter
// properties) so `node scripts/build-tutorial.ts` runs under Node's built-in
// type stripping with no build step and no flag.
//
// Re-runnable: wipes and regenerates site/src/content/docs/tutorial/ on every
// run. That tree is gitignored (site/.gitignore) and rebuilt in CI before
// `bun run build`. Never hand-edit files under it — edit
// tutorialkit/src/content/tutorial/** and re-run this script instead.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'tutorialkit/src/content/tutorial');
const DEST = join(ROOT, 'site/src/content/docs/tutorial');
// Where each lesson's starter files are served from. They live in
// site/public/tutorial-files/<part>/<lesson>/** and are committed, so the
// links survive the removal of the TutorialKit source package.
const FILES_PREFIX = '/tutorial-files';

// Stamped into every generated page so the ported tree is self-describing once
// the source package and this script are gone.
const PROVENANCE =
  '<!-- Ported from the TutorialKit content package 2026-08-12; now canonical here. -->\n\n';

const EXPECTED_PARTS = 5;
const EXPECTED_LESSONS = 18;

type Frontmatter = Record<string, string>;

function splitFrontmatter(raw: string): { fm: Frontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { fm: {}, body: raw };
  const fmBlock = match[1];
  const body = match[2];
  const fm: Frontmatter = {};
  for (const line of fmBlock.split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return { fm, body };
}

// TutorialKit directive -> Starlight aside. `:::danger` is left alone —
// Starlight ships a `danger` aside natively.
function transformDirectives(body: string): string {
  return body
    .replace(/:::success/g, ':::tip')
    .replace(/:::info/g, ':::note')
    .replace(/:::warn/g, ':::caution')
    .replace(/```sh frame="terminal"/g, '```sh');
}

function listFilesRecursive(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRecursive(full));
    else out.push(full);
  }
  return out.sort();
}

function yamlScalar(value: string): string {
  if (/[:#'"]/.test(value) || value.trim() !== value) return JSON.stringify(value);
  return value;
}

function frontmatterBlock(fields: Frontmatter): string {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fields)) {
    lines.push(`${key}: ${yamlScalar(value)}`);
  }
  lines.push('---', '');
  return lines.join('\n');
}

function subdirs(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });

const partSlugs = subdirs(SRC);
let partCount = 0;
let lessonCount = 0;

for (const partSlug of partSlugs) {
  const partDir = join(SRC, partSlug);
  const { fm: partFm } = splitFrontmatter(readFileSync(join(partDir, 'meta.md'), 'utf8'));
  const partTitle = partFm.title ?? partSlug;

  const lessonSlugs = subdirs(partDir);
  const destPartDir = join(DEST, partSlug);
  mkdirSync(destPartDir, { recursive: true });

  const indexLines = [
    `Lessons in this module of *TechDays: AI Fluency — Agentic Agents*.`,
    '',
  ];

  for (const lessonSlug of lessonSlugs) {
    const contentPath = join(partDir, lessonSlug, 'content.md');
    const { fm: lessonFm } = splitFrontmatter(readFileSync(contentPath, 'utf8'));
    const lessonTitle = lessonFm.title ?? lessonSlug;
    indexLines.push(`- [${lessonTitle}](/tutorial/${partSlug}/${lessonSlug}/)`);
  }

  writeFileSync(
    join(destPartDir, 'index.md'),
    frontmatterBlock({ title: partTitle }) + PROVENANCE + indexLines.join('\n') + '\n',
  );
  partCount += 1;

  for (const lessonSlug of lessonSlugs) {
    const lessonDir = join(partDir, lessonSlug);
    const raw = readFileSync(join(lessonDir, 'content.md'), 'utf8');
    const { fm, body } = splitFrontmatter(raw);
    const title = fm.title ?? lessonSlug;

    let out = transformDirectives(body.trim()) + '\n';

    const filesDir = join(lessonDir, '_files');
    if (existsSync(filesDir)) {
      const files = listFilesRecursive(filesDir).map((f) => relative(filesDir, f));
      out += '\n## Files used in this lesson\n\n';
      for (const relPath of files) {
        const posixRel = relPath.split(/\\/).join('/');
        const href = `${FILES_PREFIX}/${partSlug}/${lessonSlug}/${posixRel}`;
        out += `- [\`${posixRel}\`](${href})\n`;
      }
    }

    writeFileSync(
      join(destPartDir, `${lessonSlug}.md`),
      frontmatterBlock({ title }) + PROVENANCE + out,
    );
    lessonCount += 1;
  }
}

console.log(
  `build-tutorial: ported ${partCount} part indexes and ${lessonCount} lesson pages into ` +
    relative(ROOT, DEST),
);

if (partCount !== EXPECTED_PARTS) {
  throw new Error(`Expected ${EXPECTED_PARTS} part indexes, wrote ${partCount}`);
}
if (lessonCount !== EXPECTED_LESSONS) {
  throw new Error(`Expected ${EXPECTED_LESSONS} lesson pages, wrote ${lessonCount}`);
}
