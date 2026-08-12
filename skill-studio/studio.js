// templates/file-manager/studio.js
// Skill Studio engine: GitHub browsing (live api.github.com with offline
// catalog fallback) + a Claude-powered agent (plan / search / customize).
// Exposes window.Studio. Depends on app-data.js.
(() => {
  const ORGS = window.STUDIO_ORGS;
  const CATALOG = window.STUDIO_CATALOG;
  const approved = new Set(ORGS.map((o) => o.login));

  // -------------------------------------------------- GitHub (best-effort)
  async function ghJSON(url) {
    const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (!r.ok) throw new Error('gh ' + r.status);
    return r.json();
  }

  // List repos for a pre-approved org. Live first, catalog fallback.
  async function listOrgRepos(org, live) {
    if (!approved.has(org)) throw new Error('Org not pre-approved: ' + org);
    if (live) {
      try {
        const repos = await ghJSON(`https://api.github.com/orgs/${org}/repos?per_page=30&sort=updated`);
        return repos.map((r) => ({ name: r.name, description: r.description || '', stars: r.stargazers_count, updated: (r.updated_at || '').slice(0, 10), live: true }));
      } catch (e) { /* fall through */ }
    }
    // fallback: distinct repos present in catalog for this org
    const seen = {};
    CATALOG.filter((c) => c.org === org).forEach((c) => {
      seen[c.repo] = seen[c.repo] || { name: c.repo, description: '', stars: 0, updated: '', live: false, count: 0 };
      seen[c.repo].stars = Math.max(seen[c.repo].stars, c.stars);
      seen[c.repo].updated = c.updated > seen[c.repo].updated ? c.updated : seen[c.repo].updated;
      seen[c.repo].count++;
    });
    return Object.values(seen);
  }

  // Items (skills/templates/examples/plugins) inside an org/repo.
  function repoItems(org, repo) {
    return CATALOG.filter((c) => c.org === org && c.repo === repo);
  }

  // Fetch a single file's content — live raw first, catalog fallback.
  async function getFile(item, filePath, live) {
    if (live) {
      try {
        const r = await fetch(`https://raw.githubusercontent.com/${item.org}/${item.repo}/HEAD/${item.path}/${filePath}`);
        if (r.ok) return await r.text();
      } catch (e) { /* fall through */ }
    }
    return (item.files && item.files[filePath]) || '';
  }

  // -------------------------------------------------- Claude agent
  const MODEL = undefined; // default (haiku) — reliable within rate limits
  const hasClaude = () => typeof window !== 'undefined' && window.claude && typeof window.claude.complete === 'function';

  function catalogSummary() {
    return CATALOG.map((c) => `- id:${c.id} | ${c.kind} | ${c.name} (${c.org}/${c.repo}) — ${c.description} [tags: ${c.tags.join(', ')}]`).join('\n');
  }

  function extractJSON(text) {
    const m = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try { return JSON.parse(m[1] || m[0]); } catch (e) { return null; }
  }

  // PLAN: given a brief, return { planMd, rec:[ids], skillName, skillSlug, query }
  async function planSkill(brief) {
    const system = `You are the planning agent inside "Patterson Skill Studio", which builds Claude Agent Skills and plugins the way the gh-skill-creator skill prescribes: SEARCH FOR AND MERGE existing skills, templates and references from pre-approved GitHub orgs first, generating from scratch only as a last resort.\n\nApproved orgs: ${ORGS.map((o) => o.login).join(', ')}.\n\nRules: a partial match is a base, not a miss. Aim to assemble a new skill from several harvested upstream artifacts; net-new prose is limited to glue. Record provenance in a SOURCES.md.\n\nGiven the user's brief and the CATALOG of importable items, respond with:\n1. A concise plan in Markdown (## Plan) — 3-6 steps, name the base(s) you'd copy from the catalog and what you'd change for the Patterson brand (navy/sky, Figtree, voice: trusted expertise, unrivaled support).\n2. A fenced \`\`\`json block: {"skillName","skillSlug","query","rec":["<catalog id>", ...]}. Only put REAL catalog ids in rec (2-4 best matches). Keep skillSlug kebab-case.`;
    const user = `BRIEF: ${brief}\n\nCATALOG:\n${catalogSummary()}`;
    if (!hasClaude()) {
      // offline heuristic fallback
      const words = brief.toLowerCase();
      const rec = CATALOG.filter((c) => c.tags.some((t) => words.includes(t)) || words.includes(c.name)).slice(0, 3).map((c) => c.id);
      return {
        planMd: `## Plan\n\n1. Search the pre-approved orgs for a matching base.\n2. Copy the closest skill/template into \`my-skills/\`.\n3. Rewrite the SKILL.md description & workflow for Patterson.\n4. Swap in Patterson tokens/voice; add a reference file.\n\n*(Offline heuristic — connect to Claude for a tailored plan.)*`,
        rec: rec.length ? rec : [CATALOG[0].id], skillName: 'New Skill', skillSlug: 'new-skill', query: brief,
      };
    }
    const text = await window.claude.complete({ model: MODEL, system, max_tokens: 1400, messages: [{ role: 'user', content: user }] });
    const json = extractJSON(text) || {};
    const planMd = text.replace(/```json[\s\S]*?```/i, '').trim();
    const rec = Array.isArray(json.rec) ? json.rec.filter((id) => CATALOG.some((c) => c.id === id)) : [];
    return { planMd, rec, skillName: json.skillName || 'New Skill', skillSlug: json.skillSlug || 'new-skill', query: json.query || brief };
  }

  // CUSTOMIZE: adapt selected catalog items into a Patterson skill.
  // Returns { files: {relPath: content}, notes }
  async function customize(items, brief, skillSlug, live, selMap) {
    // gather source files — if selMap {itemId:[rels]} is given, only those files
    const sources = [];
    for (const it of items) {
      let names = Object.keys(it.files || {});
      if (selMap && selMap[it.id] && selMap[it.id].length) names = names.filter((n) => selMap[it.id].includes(n));
      for (const fp of names) sources.push({ item: it, path: fp, content: await getFile(it, fp, live) });
    }
    if (!hasClaude() || sources.length === 0) {
      const files = {};
      sources.forEach((s) => { files[`my-skills/${skillSlug}/${s.path}`] = s.content; });
      if (!files[`my-skills/${skillSlug}/SKILL.md`]) files[`my-skills/${skillSlug}/SKILL.md`] = `---\nname: ${skillSlug}\ndescription: ${brief}\n---\n\n# ${skillSlug}\n\nCustomized for Patterson. (Connect Claude to auto-adapt.)`;
      return { files, notes: 'Copied verbatim (offline).' };
    }
    const system = `You are the customizer inside Skill Studio. You are given source files copied from pre-approved GitHub examples and a brief. Rewrite them into a single cohesive Agent Skill for the PATTERSON brand (navy/sky, Figtree, voice: trusted expertise, unrivaled support). Keep working code; adapt names, descriptions, defaults and copy. Respond ONLY with a fenced \`\`\`json block: {"files": {"<relative path>": "<full file content>"}, "notes": "<1-2 lines on what you changed>"}. Paths are relative to the skill folder (e.g. "SKILL.md", "scripts/build.py").`;
    const srcText = sources.map((s) => `### ${s.item.id} :: ${s.path}\n\`\`\`\n${s.content}\n\`\`\``).join('\n\n');
    const user = `BRIEF: ${brief}\nSKILL SLUG: ${skillSlug}\n\nSOURCE FILES:\n${srcText}`;
    const text = await window.claude.complete({ model: MODEL, system, max_tokens: 4000, messages: [{ role: 'user', content: user }] });
    const json = extractJSON(text) || {};
    const files = {};
    if (json.files && typeof json.files === 'object') {
      Object.entries(json.files).forEach(([p, c]) => { files[`my-skills/${skillSlug}/${p.replace(/^\/+/, '')}`] = String(c); });
    }
    if (Object.keys(files).length === 0) sources.forEach((s) => { files[`my-skills/${skillSlug}/${s.path}`] = s.content; });
    return { files, notes: json.notes || 'Customized for Patterson.' };
  }

  // -------------------------------------------------- MCP tool servers
  // Ground-truth notes served by the skill-registry MCP server (offline).
  const SPEC_NOTES = {
    frontmatter: 'SKILL.md YAML frontmatter requires `name` and `description`. Optional: `compatibility`. The description is the primary trigger — state what it does AND when to use it, and make it slightly "pushy" to combat undertriggering.',
    trigger: 'Triggering lives entirely in the description. Include concrete user phrases/contexts. Claude tends to undertrigger, so be explicit: "Use this whenever the user mentions X, Y or Z, even if they don\'t say the word."',
    disclosure: 'Progressive disclosure has three levels: (1) metadata name+description always in context; (2) SKILL.md body when triggered (<500 lines ideal); (3) bundled resources loaded/executed on demand (scripts/, references/, assets/).',
    eval: 'Evals: write a few test prompts, run the skill, review qualitatively AND with quantitative metrics (variance across runs). Skills with objectively verifiable outputs benefit most. Use the eval-viewer to review results.',
    reuse: 'Reuse-first (Search Before Scaffold): walk the discovery ladder — installed skills, skills.sh, aitmpl, curated indexes, the user\'s orgs — before writing anything. A partial match is a base, not a miss. Assemble from 5–10 harvested artifacts; record provenance in SOURCES.md.',
    default: 'Agent Skills spec: a SKILL.md with name+description frontmatter plus optional scripts/, references/, assets/. See agentskills.io for the authoritative format. Reuse existing skills before generating from scratch.',
  };

  // Build the MCP-style tool set the assistant can call during chat. Each
  // tool has a `run` handler the window.claude helper executes in-page.
  function buildTools(ctx) {
    const live = !!(ctx && ctx.live);
    const note = (n, i) => { if (ctx && ctx.onTool) try { ctx.onTool(n, i); } catch (e) {} };
    return [
      {
        name: 'search_sources',
        description: 'Search the pre-approved GitHub orgs (anthropics, github, githubnext, patterson-tools) for skills, plugins, templates and references to reuse. Returns matching catalog items with id, kind and description. Call this before recommending a base.',
        input_schema: { type: 'object', properties: { query: { type: 'string', description: 'keywords, e.g. "mcp server" or "deck"' } }, required: ['query'] },
        run: async ({ query }) => {
          note('search_sources', { query }); const q = (query || '').toLowerCase();
          const hits = CATALOG.filter((c) => (c.name + ' ' + c.description + ' ' + c.tags.join(' ') + ' ' + c.org + '/' + c.repo).toLowerCase().includes(q) || c.tags.some((t) => q.includes(t))).slice(0, 8);
          return hits.length ? hits.map((c) => `${c.id} | ${c.kind} | ${c.name} (${c.org}/${c.repo}) — ${c.description} [files: ${Object.keys(c.files || {}).join(', ') || '—'}]`).join('\n') : 'No catalog matches for "' + query + '".';
        },
      },
      {
        name: 'read_source_file',
        description: 'Read one file from a catalog item. Provide the catalog id (from search_sources) and the file path relative to that item.',
        input_schema: { type: 'object', properties: { id: { type: 'string' }, path: { type: 'string' } }, required: ['id', 'path'] },
        run: async ({ id, path }) => {
          note('read_source_file', { id, path }); const it = CATALOG.find((c) => c.id === id);
          if (!it) return 'No catalog item with id ' + id + '.';
          const body = await getFile(it, path, live);
          return body ? body.slice(0, 4000) : ('No file "' + path + '" in ' + id + '. Available: ' + Object.keys(it.files || {}).join(', '));
        },
      },
      {
        name: 'list_workspace',
        description: 'List every file path currently in the Patterson workspace (the skills & plugins being built).',
        input_schema: { type: 'object', properties: {} },
        run: async () => { note('list_workspace', {}); const p = (ctx && ctx.workspacePaths) || []; return p.length ? p.join('\n') : '(workspace empty)'; },
      },
      {
        name: 'read_workspace_file',
        description: 'Read a workspace file by its full path (from list_workspace).',
        input_schema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
        run: async ({ path }) => { note('read_workspace_file', { path }); const v = ctx && ctx.readWorkspace && ctx.readWorkspace(path); return (v != null && v !== '') ? String(v).slice(0, 4000) : '(no workspace file at ' + path + ')'; },
      },
      {
        name: 'lookup_spec',
        description: 'Look up the Agent Skills format spec & registry guidance for a topic: frontmatter, trigger/description, progressive disclosure, eval, or reuse-first discovery.',
        input_schema: { type: 'object', properties: { topic: { type: 'string' } }, required: ['topic'] },
        run: async ({ topic }) => { note('lookup_spec', { topic }); const t = (topic || '').toLowerCase(); const key = Object.keys(SPEC_NOTES).find((k) => k !== 'default' && t.includes(k)) || 'default'; return SPEC_NOTES[key]; },
      },
    ];
  }

  // General assistant chat with workspace context + MCP tools.
  async function chat(history, ctx) {
    if (!hasClaude()) {
      return ctx.file
        ? `I can see \`${ctx.file}\`. Connect me to Claude and I'll plan, search, and customize skills for you. Meanwhile try the **Plan a skill** action.`
        : `Connect me to Claude to plan and customize skills. Open a file or describe the skill you want to build.`;
    }
    const tools = buildTools(ctx);
    const system = `You are the Skill Studio assistant for the Patterson design system. You help authors PLAN, CURATE and CUSTOMIZE Claude skills & plugins by searching for and merging proven examples from pre-approved orgs (${ORGS.map((o) => o.login).join(', ')}) — reuse first, generate from scratch only as a last resort (the gh-skill-creator method).\n\nYou are connected to MCP tool servers. USE THEM before answering substantive questions: call search_sources to find reusable bases, read_source_file to inspect them, list_workspace / read_workspace_file to see what the author already has, and lookup_spec for SKILL.md format questions. Cite the catalog ids you used. Be concise. Current open file: ${ctx.file || 'none'}.${ctx.fileBody ? '\n\nFILE CONTENT:\n' + ctx.fileBody.slice(0, 3000) : ''}`;
    const messages = history.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }));
    return await window.claude.complete({ model: MODEL, system, max_tokens: 1400, messages, tools });
  }

  window.Studio = { ORGS, CATALOG, MCP: window.STUDIO_MCP, approved, listOrgRepos, repoItems, getFile, planSkill, customize, chat, buildTools, hasClaude, byId: (id) => CATALOG.find((c) => c.id === id) };
})();
