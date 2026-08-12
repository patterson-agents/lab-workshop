/* Lesson manifest for the TutorialKit preview app. Paths are project-relative. */
window.TK_MANIFEST = {
  base: 'tutorialkit/src/content/tutorial/',
  parts: [
    { id: '1-agents-md', title: 'AGENTS.md', lessons: [
      { id: '1-the-instruction-file', title: 'The Instruction File',
        files: [{ name: 'AGENTS.md', path: '1-agents-md/1-the-instruction-file/_files/AGENTS.md' }], focus: 'AGENTS.md' },
      { id: '2-what-goes-in', title: 'What Goes In, What Stays Out',
        files: [{ name: 'AGENTS.md', path: '1-agents-md/2-what-goes-in/_files/AGENTS.md' }], focus: 'AGENTS.md' },
      { id: '3-cross-vendor', title: 'Cross-Vendor + Checkpoint', files: [] }
    ]},
    { id: '2-commands', title: 'Commands', lessons: [
      { id: '1-two-kinds', title: 'Two Kinds Behind the Slash', files: [] },
      { id: '2-the-working-set', title: 'The Working Set', files: [] },
      { id: '3-first-custom-command', title: 'Your First Custom Command',
        files: [{ name: '.claude/skills/standup/SKILL.md', path: '2-commands/3-first-custom-command/_files/.claude/skills/standup/SKILL.md' }],
        focus: '.claude/skills/standup/SKILL.md' }
    ]},
    { id: '3-skills', title: 'Skills', lessons: [
      { id: '1-anatomy', title: 'Anatomy of a Skill',
        files: [{ name: '.claude/skills/money-handling/SKILL.md', path: '3-skills/1-anatomy/_files/.claude/skills/money-handling/SKILL.md' }],
        focus: '.claude/skills/money-handling/SKILL.md' },
      { id: '2-invocation-control', title: 'Invocation Control & Arguments',
        files: [{ name: '.claude/skills/deploy/SKILL.md', path: '3-skills/2-invocation-control/_files/.claude/skills/deploy/SKILL.md' }],
        focus: '.claude/skills/deploy/SKILL.md' },
      { id: '3-scopes', title: 'Scopes & Precedence', files: [] },
      { id: '4-best-practices', title: 'Writing Skills That Work',
        files: [{ name: '.claude/skills/money-handling/SKILL.md', path: '3-skills/4-best-practices/_files/.claude/skills/money-handling/SKILL.md' }],
        focus: '.claude/skills/money-handling/SKILL.md' },
      { id: '5-scripts-and-ecosystem', title: 'Scripts & the Skills Directory',
        files: [
          { name: '.claude/skills/audit-money/SKILL.md', path: '3-skills/5-scripts-and-ecosystem/_files/.claude/skills/audit-money/SKILL.md' },
          { name: '.claude/skills/audit-money/scripts/audit-decimals.sh', path: '3-skills/5-scripts-and-ecosystem/_files/.claude/skills/audit-money/scripts/audit-decimals.sh' }
        ],
        focus: '.claude/skills/audit-money/scripts/audit-decimals.sh' }
    ]},
    { id: '4-plugins', title: 'Plugins', lessons: [
      { id: '1-build-a-plugin', title: 'Build a Plugin',
        files: [
          { name: 'team-standards/.claude-plugin/plugin.json', path: '4-plugins/1-build-a-plugin/_files/team-standards/.claude-plugin/plugin.json' },
          { name: 'team-standards/skills/money-handling/SKILL.md', path: '4-plugins/1-build-a-plugin/_files/team-standards/skills/money-handling/SKILL.md' }
        ],
        focus: 'team-standards/.claude-plugin/plugin.json' },
      { id: '2-marketplaces', title: 'Marketplaces & Scopes', files: [] },
      { id: '3-beyond-skills', title: 'Beyond Skills', files: [] }
    ]},
    { id: '5-mcp', title: 'MCP Servers', lessons: [
      { id: '1-first-server', title: 'Your First Server', files: [] },
      { id: '2-local-stdio', title: 'Local Servers (stdio)', files: [] },
      { id: '3-scopes-and-auth', title: 'Scopes, Auth & Hygiene',
        files: [{ name: '.mcp.json', path: '5-mcp/3-scopes-and-auth/_files/.mcp.json' }], focus: '.mcp.json' },
      { id: '4-building-and-publishing', title: 'Building & Publishing', files: [] }
    ]}
  ]
};
/* Resolve file paths against the tutorial base (content.md paths are built in-app). */
window.TK_MANIFEST.parts.forEach(function (p) {
  p.lessons.forEach(function (l) {
    l.files.forEach(function (f) { f.path = window.TK_MANIFEST.base + f.path; });
  });
});
/* Flat ordered list for prev/next */
window.TK_FLAT = (function () {
  var out = [];
  window.TK_MANIFEST.parts.forEach(function (p) {
    p.lessons.forEach(function (l) { out.push({ part: p, lesson: l }); });
  });
  return out;
})();
