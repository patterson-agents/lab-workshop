// skill-studio/app-data.js
// Patterson Skill Studio — workspace seed, pre-approved orgs, GitHub catalog
// (offline fallback index for the real repos), curated references, and a tiny
// Markdown renderer. Plain browser JS. Depends on skill-content.js for the
// attached gh-skill-creator file contents (window.GH_SKILL_FILES).
(() => {
  // --------------------------------------------------------------------
  // Turn the flat {relPath: content} map of the attached gh-skill-creator
  // skill into a nested workspace tree under my-skills/gh-skill-creator/.
  // --------------------------------------------------------------------
  function filesToTree(map, openTop) {
    const root = [];
    const dirIndex = {}; // path -> node
    const openDirs = new Set(['agents', 'references']);
    Object.keys(map).sort().forEach((rel) => {
      const parts = rel.split('/');
      let level = root, acc = '';
      for (let i = 0; i < parts.length - 1; i++) {
        acc = acc ? acc + '/' + parts[i] : parts[i];
        let dir = dirIndex[acc];
        if (!dir) {
          dir = { type: 'dir', name: parts[i], open: openDirs.has(acc), children: [] };
          dirIndex[acc] = dir; level.push(dir);
        }
        level = dir.children;
      }
      level.push({ type: 'file', name: parts[parts.length - 1], content: map[rel] });
    });
    return root;
  }

  const ghSkillTree = (window.GH_SKILL_FILES && Object.keys(window.GH_SKILL_FILES).length)
    ? filesToTree(window.GH_SKILL_FILES)
    : [{ type: 'file', name: 'SKILL.md', content: '---\nname: gh-skill-creator\n---\n\n# gh-skill-creator\n\n(Skill content failed to load.)' }];

  // ======================================================================
  // WORKSPACE — skills & plugins in progress (left pane / Workspace)
  // ======================================================================
  window.PAT_TREE = [
    {
      type: 'dir', name: 'my-skills', open: true, children: [
        { type: 'dir', name: 'gh-skill-creator', open: true, children: ghSkillTree },
        { type: 'file', name: 'README.md', content: "# Patterson Skill Studio\n\nThe workspace for building **Claude Agent Skills & plugins** for the Patterson agent.\n\n## How this studio works\n\n1. **Plan** \u2014 tell the assistant what skill you need.\n2. **Search** \u2014 it walks the pre-approved GitHub orgs for skills, templates, plugins & references to reuse.\n3. **Select** \u2014 tick the files you want in the **Sources** tree.\n4. **Customize** \u2014 the assistant copies them here and adapts them to Patterson.\n\n---\n\n## Reuse first\n\nThe attached **gh-skill-creator** skill (see the folder above) is the method this studio follows: *search for and merge existing skills, templates and references first \u2014 generate from scratch only as a last resort.* A new skill should be assembled from 5\u201310 harvested upstream artifacts, with provenance recorded in a `SOURCES.md`.\n\nInstead of writing skills from scratch, we **curate, merge and customize** proven ones." },
      ]
    },
    {
      type: 'dir', name: 'plugins', open: false, children: [
        {
          type: 'dir', name: 'patterson-connector', open: false, children: [
            { type: 'file', name: 'plugin.json', content: '{\n  "name": "patterson-connector",\n  "version": "0.1.0",\n  "description": "Connects the agent to the Patterson storefront + newsroom APIs.",\n  "entry": "server.py",\n  "capabilities": ["product_search", "order_status", "newsroom_fetch"]\n}' },
            { type: 'file', name: 'README.md', content: '# Patterson Connector (plugin)\n\nAn MCP-style plugin scaffold. Customize from `anthropics/claude-plugins-official` (mcp-server-dev) or `github/gh-aw` in Sources.' },
          ]
        },
      ]
    },
  ];

  // ======================================================================
  // PRE-APPROVED ORGS — only these GitHub orgs may be browsed / imported
  // ======================================================================
  window.STUDIO_ORGS = [
    { login: 'anthropics', label: 'Anthropic', note: 'Claude Code, official plugins, cookbook', trusted: true },
    { login: 'github', label: 'GitHub', note: 'Awesome Copilot, gh-aw, docs', trusted: true },
    { login: 'githubnext', label: 'GitHub Next', note: 'Agentic workflows (agentics, ado-aw)', trusted: true },
    { login: 'patterson-tools', label: 'Patterson Tools', note: 'Internal brand & storefront skills', trusted: true },
  ];

  // ======================================================================
  // CATALOG — offline index of importable items across the approved orgs.
  // Paths mirror the real repositories so the "Live GitHub" toggle can
  // fetch the true files from raw.githubusercontent.com.
  // kind: 'skill' | 'template' | 'example' | 'plugin' | 'reference'
  // ======================================================================
  window.STUDIO_CATALOG = [
    /* ------------------------------------------------ anthropics/claude-plugins-official */
    {
      id: 'anthropics/claude-plugins-official/skill-creator', org: 'anthropics', repo: 'claude-plugins-official', path: 'plugins/skill-creator',
      kind: 'skill', name: 'skill-creator', stars: 1700, updated: '2026-07-08', lang: 'Markdown',
      description: 'Official skill-creator plugin \u2014 create, improve and benchmark skills. The upstream base of the attached gh-skill-creator.',
      tags: ['skill', 'authoring', 'scaffold', 'eval', 'official'],
      files: {
        '.claude-plugin/plugin.json': '{\n  "name": "skill-creator",\n  "description": "Create new skills, improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, update or optimize an existing skill, run evals to test a skill, or benchmark skill performance with variance analysis.",\n  "author": { "name": "Anthropic", "email": "support@anthropic.com" }\n}',
        'README.md': '# skill-creator\n\nCreate new skills, improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, update or optimize an existing skill, run evals to test a skill, or benchmark skill performance with variance analysis.',
      },
    },
    {
      id: 'anthropics/claude-plugins-official/mcp-server-dev', org: 'anthropics', repo: 'claude-plugins-official', path: 'plugins/mcp-server-dev',
      kind: 'plugin', name: 'mcp-server-dev', stars: 1100, updated: '2026-07-08', lang: 'TypeScript',
      description: 'Official plugin for building MCP servers that expose tools to the agent. Base for the Patterson storefront connector.',
      tags: ['plugin', 'mcp', 'server', 'official'],
      files: { 'README.md': '# mcp-server-dev\n\nScaffold a typed MCP server, register its tools, and wire stdio / streamable-HTTP transports.' },
    },
    {
      id: 'anthropics/claude-plugins-official/marketplace', org: 'anthropics', repo: 'claude-plugins-official', path: '.claude-plugin',
      kind: 'template', name: 'marketplace.json', stars: 1700, updated: '2026-07-08', lang: 'JSON',
      description: 'The official marketplace manifest listing every plugin \u2014 a template for your own Patterson plugin catalog.',
      tags: ['marketplace', 'manifest', 'template', 'official'],
      files: { 'marketplace.json': '{\n  "name": "claude-plugins-official",\n  "owner": "anthropics",\n  "plugins": [\n    "skill-creator", "plugin-dev", "mcp-server-dev",\n    "pr-review-toolkit", "feature-dev", "code-modernization"\n  ]\n}' },
    },

    /* ------------------------------------------------ anthropics/claude-code */
    {
      id: 'anthropics/claude-code/plugin-dev', org: 'anthropics', repo: 'claude-code', path: 'plugins/plugin-dev',
      kind: 'plugin', name: 'plugin-dev', stars: 4200, updated: '2026-07-11', lang: 'Markdown',
      description: 'Build and package Claude Code plugins \u2014 commands, hooks, agents and MCP servers, with phase-gated authoring.',
      tags: ['plugin', 'authoring', 'commands', 'hooks', 'claude-code'],
      files: { 'README.md': '# plugin-dev\n\nScaffold plugin.json, commands, hooks and agents; wire optional MCP servers. Uses a phase-gated command structure (plan \u2192 scaffold \u2192 validate).' },
    },
    {
      id: 'anthropics/claude-code/pr-review-toolkit', org: 'anthropics', repo: 'claude-code', path: 'plugins/pr-review-toolkit',
      kind: 'plugin', name: 'pr-review-toolkit', stars: 4200, updated: '2026-07-11', lang: 'Markdown',
      description: 'Structured PR-review commands and hooks for consistent, checklist-based code review.',
      tags: ['plugin', 'pr', 'review', 'hooks', 'claude-code'],
      files: { 'README.md': '# pr-review-toolkit\n\nDrive consistent, checklist-based pull-request reviews with commands and hooks.' },
    },
    {
      id: 'anthropics/claude-code/feature-dev', org: 'anthropics', repo: 'claude-code', path: 'plugins/feature-dev',
      kind: 'plugin', name: 'feature-dev', stars: 4200, updated: '2026-07-11', lang: 'Markdown',
      description: 'A guided feature-development workflow \u2014 plan, implement, and verify a change end to end.',
      tags: ['plugin', 'workflow', 'feature', 'claude-code'],
      files: { 'README.md': '# feature-dev\n\nPlan, implement and verify a feature end to end with structured commands.' },
    },

    /* ------------------------------------------------ anthropics/anthropic-cookbook */
    {
      id: 'anthropics/anthropic-cookbook/skills', org: 'anthropics', repo: 'anthropic-cookbook', path: 'skills',
      kind: 'example', name: 'cookbook skills', stars: 12800, updated: '2026-07-02', lang: 'Jupyter',
      description: 'Worked examples for Agent Skills \u2014 retrieval, classification, summarization notebooks to lift patterns from.',
      tags: ['cookbook', 'example', 'skills', 'notebook'],
      files: { 'README.md': '# Cookbook \u2014 Skills\n\nRunnable notebooks demonstrating skill patterns: retrieval, classification, summarization and evaluation.' },
    },
    {
      id: 'anthropics/anthropic-cookbook/claude_agent_sdk', org: 'anthropics', repo: 'anthropic-cookbook', path: 'claude_agent_sdk',
      kind: 'example', name: 'claude_agent_sdk', stars: 12800, updated: '2026-07-02', lang: 'Python',
      description: 'Agent SDK recipes \u2014 tools, subagents and long-running loops. Useful for the customize + eval loop.',
      tags: ['cookbook', 'agent-sdk', 'tools', 'example'],
      files: { 'README.md': '# Claude Agent SDK recipes\n\nBuild tool-using agents, subagents and durable loops with the Claude Agent SDK.' },
    },

    /* ------------------------------------------------ github/awesome-copilot */
    {
      id: 'github/awesome-copilot/dotnet-mcp-builder', org: 'github', repo: 'awesome-copilot', path: 'skills/dotnet-mcp-builder',
      kind: 'skill', name: 'dotnet-mcp-builder', stars: 8200, updated: '2026-07-10', lang: 'Markdown',
      description: 'Community skill: build MCP servers in C#/.NET against the current ModelContextProtocol 1.x packages. 13 reference docs.',
      tags: ['copilot', 'skill', 'mcp', 'dotnet', 'server'],
      files: {
        'SKILL.md': "---\nname: dotnet-mcp-builder\ndescription: Build Model Context Protocol (MCP) servers in C#/.NET against the current ModelContextProtocol 1.x NuGet packages. Trigger on any .NET MCP server work.\n---\n\n# Building MCP servers in .NET\n\nWrite production-quality MCP servers and basic clients in C#/.NET against the official ModelContextProtocol NuGet packages (stable 1.x, spec 2025-11-25).\n\n## Cardinal rules\n\n1. Pin the current stable package, not a preview.\n2. STDIO servers must not write to stdout \u2014 it is the JSON-RPC channel.\n3. HTTP defaults to stateful; set Stateless=true only when you have no server-initiated traffic.\n4. SSE-only is deprecated \u2014 use Streamable HTTP.\n5. Always [Description] tools and parameters.\n\n## References\n\nLoad references/transport-stdio.md, references/tool-primitive.md, references/mcp-apps.md, etc. per task.",
        'references/tool-primitive.md': '# Tool primitive\n\nMark a class [McpServerToolType] and methods [McpServerTool] with [Description] attributes. Register with .WithToolsFromAssembly() or .WithTools<T>().',
      },
    },
    {
      id: 'github/awesome-copilot/eval-driven-dev', org: 'github', repo: 'awesome-copilot', path: 'skills/eval-driven-dev',
      kind: 'skill', name: 'eval-driven-dev', stars: 8200, updated: '2026-07-10', lang: 'Markdown',
      description: 'Community skill: drive development with evals first \u2014 pairs well with gh-skill-creator\u2019s benchmark loop.',
      tags: ['copilot', 'skill', 'eval', 'testing'],
      files: { 'SKILL.md': '---\nname: eval-driven-dev\ndescription: Build and iterate features against an evaluation set first.\n---\n\n# Eval-driven development\n\nWrite the eval set, run it, then implement until it passes. Track variance across runs.' },
    },
    {
      id: 'github/awesome-copilot/instructions', org: 'github', repo: 'awesome-copilot', path: 'instructions',
      kind: 'reference', name: 'copilot instructions', stars: 8200, updated: '2026-07-10', lang: 'Markdown',
      description: 'Reusable .instructions.md files that steer Copilot per language & framework \u2014 harvest the guidance, not the branding.',
      tags: ['copilot', 'instructions', 'guidance', 'reference'],
      files: { 'README.md': '# Instructions\n\nDrop-in custom instructions for Copilot, organized by language & framework.' },
    },
    {
      id: 'github/awesome-copilot/plugins', org: 'github', repo: 'awesome-copilot', path: 'plugins',
      kind: 'plugin', name: 'copilot plugins', stars: 8200, updated: '2026-07-10', lang: 'Markdown',
      description: 'Packaged Copilot plugins bundling commands, hooks and instructions in one folder.',
      tags: ['copilot', 'plugin', 'commands', 'hooks'],
      files: { 'README.md': '# Plugins\n\nPackaged Copilot plugins \u2014 commands, hooks and instructions.' },
    },

    /* ------------------------------------------------ github/gh-aw */
    {
      id: 'github/gh-aw', org: 'github', repo: 'gh-aw', path: '',
      kind: 'skill', name: 'gh-aw', stars: 1500, updated: '2026-07-12', lang: 'Go',
      description: 'GitHub Agentic Workflows \u2014 author markdown workflows and compile them to GitHub Actions lock files. Ships a top-level SKILL.md.',
      tags: ['agentic', 'workflow', 'github-actions', 'automation', 'mcp'],
      files: {
        'SKILL.md': "# gh-aw Prompt Surface\n\nThis repository builds gh-aw (GitHub Agentic Workflows), a GitHub CLI extension for writing workflows in markdown and compiling them to GitHub Actions.\n\n## What this surface does\n\n- Converts markdown workflow specs (.md) into compiled lock files (.lock.yml)\n- Supports multiple AI engines (copilot, claude, codex, custom)\n- Integrates tools, including GitHub MCP servers and safe-output tooling\n- Provides CLI commands to compile, run, inspect, and audit workflows\n\n## Key concepts\n\n1. Workflow compilation: edit workflow markdown, then recompile lock files\n2. Engine selection: set engine in frontmatter to control runtime agent behavior\n3. MCP tools: configure GitHub/MCP toolsets in frontmatter\n4. Safe outputs: workflow-safe issue/comment output paths and constraints",
        'create.md': '# Creating Agentic Workflows\n\nGuides a coding agent to create, debug, or update GitHub Agentic Workflows (gh-aw) in a repository.\n\n## Step 1: Install the CLI extension\n\n    gh aw version\n    curl -sL https://raw.githubusercontent.com/github/gh-aw/main/install-gh-aw.sh | bash\n\n## Step 2: Create the workflow\n\nWrite the automation in prose; gh-aw scaffolds the compiled .lock.yml. Then compile:\n\n    gh aw compile\n    gh aw run .github/workflows/<name>.md',
      },
    },

    /* ------------------------------------------------ github/docs */
    {
      id: 'github/docs/content-actions', org: 'github', repo: 'docs', path: 'content/actions',
      kind: 'reference', name: 'GitHub Actions docs', stars: 16000, updated: '2026-07-12', lang: 'Markdown',
      description: 'Authoritative GitHub Actions documentation \u2014 ground reference when a skill emits or edits workflow YAML.',
      tags: ['docs', 'actions', 'reference', 'workflow'],
      files: { 'README.md': '# GitHub Actions documentation\n\nThe canonical content for Actions concepts, syntax and reusable workflows. Use as a grounding reference; do not copy prose into skills.' },
    },
    {
      id: 'github/docs/content-copilot', org: 'github', repo: 'docs', path: 'content/copilot',
      kind: 'reference', name: 'Copilot docs', stars: 16000, updated: '2026-07-12', lang: 'Markdown',
      description: 'GitHub Copilot documentation \u2014 features, extensions and customization. Grounding reference for Copilot skills.',
      tags: ['docs', 'copilot', 'reference'],
      files: { 'README.md': '# GitHub Copilot documentation\n\nReference for Copilot features, extensions, chat modes and custom instructions.' },
    },

    /* ------------------------------------------------ githubnext/agentics */
    {
      id: 'githubnext/agentics/daily-plan', org: 'githubnext', repo: 'agentics', path: 'workflows',
      kind: 'template', name: 'daily-plan workflow', stars: 2100, updated: '2026-07-06', lang: 'Markdown',
      description: 'Reusable agentic workflow: a daily planning agent that runs as a GitHub Action. Drop-in and adapt.',
      tags: ['agentic', 'workflow', 'planning', 'template'],
      files: { 'daily-plan.md': '# Daily Plan\n\nA reusable agentic workflow that drafts a daily plan from open issues and recent activity, posted as an issue comment. Runs on a schedule as a GitHub Action.' },
    },
    {
      id: 'githubnext/agentics/issue-triage', org: 'githubnext', repo: 'agentics', path: 'workflows',
      kind: 'template', name: 'issue-triage workflow', stars: 2100, updated: '2026-07-06', lang: 'Markdown',
      description: 'Reusable agentic workflow: triage and label incoming issues automatically.',
      tags: ['agentic', 'workflow', 'triage', 'template'],
      files: { 'issue-triage.md': '# Issue Triage\n\nClassifies, labels and routes new issues. Configure labels and routing in frontmatter; runs as a GitHub Action.' },
    },
    {
      id: 'githubnext/agentics/code-simplifier', org: 'githubnext', repo: 'agentics', path: 'workflows',
      kind: 'example', name: 'code-simplifier workflow', stars: 2100, updated: '2026-07-06', lang: 'Markdown',
      description: 'Agentic workflow example: proposes safe simplifications to a codebase as pull requests.',
      tags: ['agentic', 'workflow', 'refactor', 'example'],
      files: { 'code-simplifier.md': '# Code Simplifier\n\nScans the repo for safe simplifications and opens PRs with the changes and rationale.' },
    },

    /* ------------------------------------------------ githubnext/ado-aw */
    {
      id: 'githubnext/ado-aw/agency', org: 'githubnext', repo: 'ado-aw', path: 'agency',
      kind: 'example', name: 'ado-aw agency', stars: 340, updated: '2026-07-04', lang: 'Rust',
      description: 'Azure DevOps agentic workflows \u2014 "agency" primitives and worked examples of long-running agents.',
      tags: ['agentic', 'azure-devops', 'workflow', 'rust', 'example'],
      files: { 'README.md': '# ado-aw \u2014 agency\n\nAgent "agency" primitives for Azure DevOps: durable agents, task decomposition and worked examples.' },
    },

    /* ------------------------------------------------ patterson-tools (internal) */
    {
      id: 'patterson-tools/brand-skills/deck-template', org: 'patterson-tools', repo: 'brand-skills', path: 'templates/deck',
      kind: 'template', name: 'patterson-deck-template', stars: 42, updated: '2026-07-01', lang: 'HTML',
      description: 'Internal: the on-brand Patterson deck template (navy dividers, sky accents, Figtree).',
      tags: ['deck', 'brand', 'template', 'patterson'],
      files: { 'SKILL.md': '---\nname: patterson-deck\ndescription: The Patterson-branded deck template \u2014 navy/sky, Figtree, section dividers.\n---\n\n# Patterson Deck Template\n\nUse the design-system deck starting point; keep 1-2 background colors max.' },
    },
    {
      id: 'patterson-tools/brand-skills/storefront-connector', org: 'patterson-tools', repo: 'brand-skills', path: 'plugins/storefront',
      kind: 'plugin', name: 'storefront-connector', stars: 28, updated: '2026-06-15', lang: 'Python',
      description: 'Internal: connects the agent to the Patterson dental & vet storefront search API.',
      tags: ['plugin', 'storefront', 'patterson', 'search'],
      files: { 'plugin.json': '{\n  "name": "storefront-connector",\n  "capabilities": ["product_search", "order_status"]\n}' },
    },
  ];

  // ======================================================================
  // REFERENCE LIBRARY — curated links the reference curator tracks
  // ======================================================================
  window.STUDIO_REFS = [
    { title: 'Agent Skills — authoring guide', url: 'https://docs.claude.com/en/docs/agents-and-tools/agent-skills', kind: 'Docs', note: 'SKILL.md format & triggers' },
    { title: 'agentskills.io — spec', url: 'https://agentskills.io', kind: 'Spec', note: 'Skill format ground truth' },
    { title: 'Model Context Protocol', url: 'https://modelcontextprotocol.io', kind: 'Spec', note: 'Plugin / server contract' },
    { title: 'gh-aw — GitHub Agentic Workflows', url: 'https://github.com/github/gh-aw', kind: 'Repo', note: 'Markdown → Actions workflows' },
    { title: 'awesome-copilot', url: 'https://github.com/github/awesome-copilot', kind: 'Repo', note: 'Community skills & instructions' },
    { title: 'Patterson Brand Guide 2025', url: '#', kind: 'Brand', note: 'Voice, color, type tokens' },
  ];

  // ======================================================================
  // MCP SERVERS — tool servers the Studio Assistant connects to. The tool
  // implementations live in studio.js (buildTools); this is the display /
  // connection metadata shown in the assistant's MCP panel.
  // ======================================================================
  window.STUDIO_MCP = [
    {
      id: 'github', name: 'github', transport: 'http', status: 'connected',
      endpoint: 'https://api.github.com (pre-approved orgs)',
      note: 'Search and read files across anthropics, github & githubnext.',
      tools: [
        { name: 'search_sources', desc: 'Search the approved-org catalog for skills, plugins, templates & references.' },
        { name: 'read_source_file', desc: 'Read one file from a catalog item (live raw, catalog fallback).' },
      ],
    },
    {
      id: 'workspace', name: 'workspace', transport: 'stdio', status: 'connected',
      endpoint: 'local · my-skills/ + plugins/',
      note: 'List and read the skills & plugins you are building.',
      tools: [
        { name: 'list_workspace', desc: 'List every file path in the Patterson workspace.' },
        { name: 'read_workspace_file', desc: 'Read a workspace file by its full path.' },
      ],
    },
    {
      id: 'skill-registry', name: 'skill-registry', transport: 'sse', status: 'connected',
      endpoint: 'agentskills.io · skills.sh',
      note: 'Agent Skills format spec & registry guidance (ground truth).',
      tools: [
        { name: 'lookup_spec', desc: 'Look up SKILL.md format, triggers, progressive disclosure or eval guidance.' },
      ],
    },
  ];

  // ======================================================================
  // Minimal, safe Markdown → HTML
  // ======================================================================
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function inline(s) {
    s = esc(s);
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s;
  }
  window.PAT_MD = function renderMarkdown(md) {
    const lines = (md || '').split('\n');
    let html = '', i = 0;
    if (lines[0] === '---') {
      let fm = ''; i = 1;
      while (i < lines.length && lines[i] !== '---') { fm += lines[i] + '\n'; i++; }
      i++;
      html += '<div class="md-fm"><span class="md-fm-tag">front&nbsp;matter</span><pre>' + esc(fm.trim()) + '</pre></div>';
    }
    while (i < lines.length) {
      let line = lines[i];
      if (/^```/.test(line)) {
        let code = ''; i++;
        while (i < lines.length && !/^```/.test(lines[i])) { code += lines[i] + '\n'; i++; }
        i++; html += '<pre class="md-code">' + esc(code.replace(/\n$/, '')) + '</pre>'; continue;
      }
      if (/^\|/.test(line) && /^\|/.test(lines[i + 1] || '') && /-/.test(lines[i + 1])) {
        const head = line.split('|').slice(1, -1).map((c) => c.trim());
        i += 2; const rows = [];
        while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i].split('|').slice(1, -1).map((c) => c.trim())); i++; }
        html += '<table class="md-table"><thead><tr>' + head.map((h) => '<th>' + inline(h) + '</th>').join('') +
          '</tr></thead><tbody>' + rows.map((r) => '<tr>' + r.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
        continue;
      }
      if (/^### /.test(line)) { html += '<h3>' + inline(line.slice(4)) + '</h3>'; i++; continue; }
      if (/^## /.test(line)) { html += '<h2>' + inline(line.slice(3)) + '</h2>'; i++; continue; }
      if (/^# /.test(line)) { html += '<h1>' + inline(line.slice(2)) + '</h1>'; i++; continue; }
      if (/^> /.test(line)) { html += '<blockquote>' + inline(line.slice(2)) + '</blockquote>'; i++; continue; }
      if (/^(---|\*\*\*)\s*$/.test(line)) { html += '<hr>'; i++; continue; }
      if (/^\s*[-*] /.test(line)) {
        html += '<ul>';
        while (i < lines.length && /^\s*[-*] /.test(lines[i])) {
          let item = lines[i].replace(/^\s*[-*] /, '');
          item = item.replace(/^\[( |x)\] /, (m, c) => c === 'x' ? '<span class="md-check done">\u2713</span> ' : '<span class="md-check">\u25cb</span> ');
          html += '<li>' + inline(item) + '</li>'; i++;
        }
        html += '</ul>'; continue;
      }
      if (/^\s*\d+\. /.test(line)) {
        html += '<ol>';
        while (i < lines.length && /^\s*\d+\. /.test(lines[i])) { html += '<li>' + inline(lines[i].replace(/^\s*\d+\. /, '')) + '</li>'; i++; }
        html += '</ol>'; continue;
      }
      if (/^\s*$/.test(line)) { i++; continue; }
      let para = line;
      while (i + 1 < lines.length && !/^\s*$/.test(lines[i + 1]) && !/^(#{1,3} |> |[-*] |\d+\. |\||```)/.test(lines[i + 1])) { para += ' ' + lines[i + 1]; i++; }
      html += '<p>' + inline(para) + '</p>'; i++;
    }
    return html;
  };
})();
