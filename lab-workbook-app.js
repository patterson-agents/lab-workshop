/* Lab Workbook — interactive toolkit + deck engine (vanilla JS, Patterson brand) */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  function copyText(str, btn, doneLabel) {
    var restore = btn.textContent;
    var done = function () {
      btn.textContent = doneLabel || 'Copied';
      btn.classList.add('is-copied');
      clearTimeout(btn._ct);
      btn._ct = setTimeout(function () {
        btn.textContent = restore;
        btn.classList.remove('is-copied');
      }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(str).then(done, function () { fallback(str); done(); });
    } else { fallback(str); done(); }
  }
  function fallback(str) {
    var ta = document.createElement('textarea');
    ta.value = str; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* =========================================================
     1) PROMPT LIBRARY
     ========================================================= */
  var PROMPTS = [
    { id: 'orient', cat: 'Understand', prompt: 'give me an overview of this codebase: architecture, key directories, and how the pieces connect',
      teaches: 'Describe what you want to know, not which files to read. Claude explores the project on its own and returns a summary of how it fits together.' },
    { id: 'explain', cat: 'Understand', prompt: 'explain what {path} does and how data flows through it. write it up as {format}',
      slots: { path: 'src/scheduler/queue.ts', format: 'an HTML page with a diagram, then open it in my browser' },
      teaches: 'Name the file and say what format you want the answer in. Swap the HTML page for a diagram, bullets, or whatever fits how you learn.' },
    { id: 'find', cat: 'Understand', prompt: 'where do we {behavior}?',
      slots: { behavior: 'validate uploaded file types' },
      teaches: 'Search by behavior instead of by filename. Works even when you don\u2019t know what the file is called.' },
    { id: 'plan', cat: 'Plan', prompt: 'plan how to refactor the {target} to {goal}. list the files you would change, but don\u2019t edit anything yet',
      slots: { target: 'payment module', goal: 'support multiple currencies' },
      teaches: 'Adding \u201cdon\u2019t edit yet\u201d separates exploration from changes, so you see the approach before any code moves.' },
    { id: 'spec', cat: 'Plan', prompt: 'I want to build {feature}. interview me about implementation, UX, edge cases, and tradeoffs until we have covered everything, then write the spec to SPEC.md',
      slots: { feature: 'per-workspace rate limits' },
      teaches: 'Ask to be interviewed instead of writing the spec yourself. Claude asks structured questions until requirements are complete.' },
    { id: 'pattern', cat: 'Build', prompt: 'look at how {example} is implemented to understand the pattern, then build {new} the same way',
      slots: { example: 'the GitHub webhook handler', new: 'a Stripe webhook handler' },
      teaches: 'Point at code you already like. With a reference, Claude matches the conventions your codebase actually uses.' },
    { id: 'tool', cat: 'Build', prompt: 'create a {tool} using HTML, CSS, and vanilla JavaScript, then open it in my browser',
      slots: { tool: 'drag-and-drop Kanban board with three columns' },
      teaches: 'You don\u2019t need a project, framework, or build step. Describe the tool and ask Claude to open it so you see it working.' },
    { id: 'tests', cat: 'Test', prompt: 'write tests for {path}, run them, and fix any failures',
      slots: { path: 'app/parsers/feed.py' },
      teaches: 'Ask for write, run, and fix together so Claude iterates without stopping for instructions.' },
    { id: 'review', cat: 'Review', prompt: 'review my uncommitted changes and flag anything that looks risky before I commit',
      teaches: 'Catch problems while they\u2019re still cheap to fix. Claude reads the changed files in full, not just the diff lines.' },
    { id: 'security', cat: 'Review', prompt: 'use a subagent to review {path} for security issues and report what it finds',
      slots: { path: 'src/api/' },
      teaches: 'A subagent runs the audit in its own context window and reports back, so a long review doesn\u2019t fill your main session.' },
    { id: 'debug', cat: 'Debug', prompt: 'the {test} test is failing, find out why and fix it',
      slots: { test: 'UserAuth' },
      teaches: 'Describe the symptom; you don\u2019t need to know which file is broken. Claude runs the test, traces it into source, and fixes it.' },
    { id: 'skill', cat: 'Automate', prompt: 'create a /{name} skill for this project that {steps}',
      slots: { name: 'ship', steps: 'runs the linter and tests, then drafts a commit message' },
      teaches: 'Name the steps once; reuse them as a command. Claude writes a skill anyone on your team can run.' },
    { id: 'memory', cat: 'Automate', prompt: 'you keep {mistake}. add a rule to CLAUDE.md so this stops happening',
      slots: { mistake: 'using default exports when this project uses named exports' },
      teaches: 'A rule in CLAUDE.md is shared with your team once you commit it, and Claude reads it at the start of every session.' }
  ];
  var CATS = ['Understand', 'Plan', 'Build', 'Test', 'Review', 'Debug', 'Automate'];

  function renderPromptLibrary(root) {
    var state = { q: '', cat: null, open: null, fills: {} };
    root.innerHTML = '';

    var search = el('div', 'lw-search');
    search.innerHTML = '<i class="pat-i pat-i-search" aria-hidden="true"></i>';
    var input = el('input');
    input.type = 'text'; input.placeholder = 'Search prompts\u2026'; input.setAttribute('aria-label', 'Search prompts');
    search.appendChild(input);
    root.appendChild(search);

    var tags = el('div', 'lw-chips');
    CATS.forEach(function (c) {
      var b = el('button', 'lw-chip'); b.type = 'button'; b.textContent = c;
      b.addEventListener('click', function () {
        state.cat = state.cat === c ? null : c; state.q = ''; input.value = ''; draw();
      });
      b._cat = c; tags.appendChild(b);
    });
    var count = el('span', 'lw-count'); tags.appendChild(count);
    root.appendChild(tags);

    var list = el('div', 'lw-list'); root.appendChild(list);

    input.addEventListener('input', function () { state.q = input.value.trim().toLowerCase(); if (state.q) state.cat = null; draw(); });

    function assemble(p) {
      return p.prompt.replace(/\{(\w+)\}/g, function (_, k) {
        var v = state.fills[p.id + '.' + k];
        if (v == null) v = p.slots && p.slots[k];
        return v || k;
      });
    }
    function draw() {
      Array.prototype.forEach.call(tags.querySelectorAll('.lw-chip'), function (b) {
        b.classList.toggle('is-on', !state.q && b._cat === state.cat);
      });
      var items = PROMPTS.filter(function (p) {
        if (state.q) return (p.prompt + ' ' + p.teaches).toLowerCase().indexOf(state.q) >= 0;
        if (state.cat) return p.cat === state.cat;
        return true;
      });
      count.textContent = items.length + (items.length === 1 ? ' prompt' : ' prompts');
      list.innerHTML = '';
      if (!items.length) { list.appendChild(el('div', 'lw-empty', 'No prompts match \u2014 try a different word.')); return; }
      items.forEach(function (p) {
        var open = state.open === p.id;
        var card = el('div', 'lw-card' + (open ? ' is-open' : ''));
        var head = el('button', 'lw-card-head'); head.type = 'button';
        head.innerHTML = '<span class="lw-cat">' + esc(p.cat) + '</span>';
        var prev = el('span', 'lw-card-prev', esc(p.prompt.replace(/\{(\w+)\}/g, function (_, k) { return (p.slots && p.slots[k]) || k; })));
        head.appendChild(prev);
        var caret = el('span', 'lw-caret pat-i ' + (open ? 'pat-i-chevron-up' : 'pat-i-chevron-down'));
        caret.setAttribute('aria-hidden', 'true');
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
        head.setAttribute('aria-label', (open ? 'Collapse' : 'Expand') + ' prompt');
        head.appendChild(caret);
        head.addEventListener('click', function () { state.open = open ? null : p.id; draw(); });
        card.appendChild(head);
        if (open) {
          var body = el('div', 'lw-card-body');
          var box = el('div', 'lw-terminal');
          box.appendChild(el('span', 'lw-prompt', ''));
          var codeWrap = el('code', 'lw-code');
          var parts = p.prompt.split(/(\{\w+\})/g);
          parts.forEach(function (part) {
            var m = part.match(/^\{(\w+)\}$/);
            if (!m) { codeWrap.appendChild(document.createTextNode(part)); return; }
            var k = m[1];
            var ph = (p.slots && p.slots[k]) || k;
            var cur = state.fills[p.id + '.' + k];
            var slot = el('input', 'lw-slot'); slot.type = 'text';
            slot.value = cur == null ? '' : cur; slot.placeholder = ph;
            slot.setAttribute('aria-label', k);
            slot.style.width = ((cur || ph).length + 2) + 'ch';
            slot.addEventListener('input', function () {
              state.fills[p.id + '.' + k] = slot.value;
              slot.style.width = ((slot.value || ph).length + 2) + 'ch';
              termCopy.dataset.text = assemble(p);
            });
            slot.addEventListener('click', function (e) { e.stopPropagation(); });
            codeWrap.appendChild(slot);
          });
          box.appendChild(codeWrap);
          var termCopy = el('button', 'lw-copy'); termCopy.type = 'button'; termCopy.textContent = 'Copy';
          termCopy.dataset.text = assemble(p);
          termCopy.addEventListener('click', function () { copyText(termCopy.dataset.text, termCopy); });
          box.appendChild(termCopy);
          body.appendChild(box);
          body.appendChild(el('div', 'lw-why-label', 'Why this works'));
          body.appendChild(el('div', 'lw-why', esc(p.teaches)));
          card.appendChild(body);
        }
        list.appendChild(card);
      });
    }
    draw();
  }

  /* =========================================================
     2) SKILL CUSTOMIZER  ->  generates SKILL.md
     ========================================================= */
  function slug(s) {
    return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'my-skill';
  }
  function renderSkillCustomizer(root) {
    root.innerHTML = '';
    var model = {
      name: 'commit-helper',
      title: 'Commit Helper',
      description: 'Draft a clear conventional-commit message from staged changes. Use when the user asks to commit, write a commit message, or wrap up a change.',
      tools: 'Read, Bash(git diff:*), Bash(git log:*)',
      sections: [
        { h: 'Instructions', body: '1. Run `git diff --staged` to see what changed.\n2. Group the changes by intent.\n3. Write a subject line under 60 chars in the imperative mood.\n4. Add a short body explaining *why*, not *what*.' },
        { h: 'Rules', body: '- Match the repo\u2019s existing commit style.\n- Never invent changes that aren\u2019t in the diff.\n- Ask before committing if the diff is empty.' }
      ]
    };

    var grid = el('div', 'lw-skill');
    var form = el('div', 'lw-skill-form');
    var out = el('div', 'lw-skill-out');
    grid.appendChild(form); grid.appendChild(out); root.appendChild(grid);

    function field(label, hint) {
      var w = el('label', 'lw-field');
      w.appendChild(el('span', 'lw-field-label', esc(label) + (hint ? ' <em>' + esc(hint) + '</em>' : '')));
      return w;
    }
    // name
    var fName = field('Skill name', 'lowercase, hyphenated');
    var iName = el('input', 'lw-in'); iName.type = 'text'; iName.value = model.name;
    var nameHint = el('span', 'lw-microhint', '');
    fName.appendChild(iName); fName.appendChild(nameHint); form.appendChild(fName);
    // title
    var fTitle = field('Display title');
    var iTitle = el('input', 'lw-in'); iTitle.type = 'text'; iTitle.value = model.title;
    fTitle.appendChild(iTitle); form.appendChild(fTitle);
    // description
    var fDesc = field('Description', 'this is what Claude reads to decide when to run the skill');
    var iDesc = el('textarea', 'lw-in lw-ta'); iDesc.rows = 3; iDesc.value = model.description;
    var descHint = el('span', 'lw-microhint', '');
    fDesc.appendChild(iDesc); fDesc.appendChild(descHint); form.appendChild(fDesc);
    // tools
    var fTools = field('Allowed tools', 'optional \u00b7 comma-separated');
    var iTools = el('input', 'lw-in'); iTools.type = 'text'; iTools.value = model.tools;
    fTools.appendChild(iTools); form.appendChild(fTools);
    // sections
    var secWrap = el('div', 'lw-sections');
    form.appendChild(el('span', 'lw-field-label', 'Body sections'));
    form.appendChild(secWrap);
    var addBtn = el('button', 'lw-btn lw-btn-ghost'); addBtn.type = 'button'; addBtn.textContent = '+ Add section';
    form.appendChild(addBtn);

    function drawSections() {
      secWrap.innerHTML = '';
      model.sections.forEach(function (s, i) {
        var row = el('div', 'lw-section-row');
        var h = el('input', 'lw-in lw-in-sm'); h.type = 'text'; h.value = s.h; h.placeholder = 'Heading';
        h.addEventListener('input', function () { s.h = h.value; build(); });
        var b = el('textarea', 'lw-in lw-ta'); b.rows = 3; b.value = s.body; b.placeholder = 'Section content (markdown)';
        b.addEventListener('input', function () { s.body = b.value; build(); });
        var del = el('button', 'lw-x pat-i pat-i-remove'); del.type = 'button'; del.title = 'Remove section'; del.setAttribute('aria-label', 'Remove section');
        del.addEventListener('click', function () { model.sections.splice(i, 1); drawSections(); build(); });
        var hr = el('div', 'lw-section-head');
        hr.appendChild(h); hr.appendChild(del);
        row.appendChild(hr); row.appendChild(b);
        secWrap.appendChild(row);
      });
    }
    addBtn.addEventListener('click', function () { model.sections.push({ h: 'New section', body: '' }); drawSections(); build(); });

    var outHead = el('div', 'lw-out-head');
    outHead.innerHTML = '<span class="lw-file">SKILL.md</span>';
    var copyBtn = el('button', 'lw-copy'); copyBtn.type = 'button'; copyBtn.textContent = 'Copy';
    outHead.appendChild(copyBtn);
    var pre = el('pre', 'lw-md'); var code = el('code'); pre.appendChild(code);
    out.appendChild(outHead); out.appendChild(pre);

    function generate() {
      var fm = ['---', 'name: ' + slug(iName.value), 'description: ' + (iDesc.value || '').replace(/\s+/g, ' ').trim()];
      if (iTools.value.trim()) fm.push('allowed-tools: ' + iTools.value.trim());
      fm.push('---', '');
      var body = ['# ' + (iTitle.value.trim() || iName.value), ''];
      model.sections.forEach(function (s) {
        if (!s.h.trim() && !s.body.trim()) return;
        body.push('## ' + (s.h.trim() || 'Section'), '', s.body.trim(), '');
      });
      return fm.join('\n') + body.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
    }
    function build() {
      var md = generate();
      code.textContent = md;
      copyBtn.dataset.text = md;
      // micro-feedback
      var s = slug(iName.value);
      nameHint.innerHTML = s === iName.value.trim() ? '<i class="pat-i pat-i-check" aria-hidden="true"></i> valid' : '<i class="pat-i pat-i-arrow-right" aria-hidden="true"></i> ' + esc(s);
      nameHint.className = 'lw-microhint' + (s === iName.value.trim() ? ' ok' : ' warn');
      var dl = (iDesc.value || '').trim().length;
      descHint.innerHTML = dl < 30 ? 'Too short \u2014 name concrete triggers so Claude knows when to use it' : dl > 500 ? 'Getting long \u2014 keep it tight' : '<i class="pat-i pat-i-check" aria-hidden="true"></i> ' + dl + ' chars';
      descHint.className = 'lw-microhint' + (dl >= 30 && dl <= 500 ? ' ok' : ' warn');
    }
    [iName, iTitle, iDesc, iTools].forEach(function (i) { i.addEventListener('input', build); });
    copyBtn.addEventListener('click', function () { copyText(copyBtn.dataset.text, copyBtn); });

    drawSections(); build();
  }

  /* =========================================================
     3) PROMPT MAKER / IMPROVER
     ========================================================= */
  var ENHANCERS = [
    { id: 'verify', label: 'Give it a way to check its own work',
      hint: 'Ask Claude to run / test / verify so it iterates instead of stopping after one try.',
      clause: function () { return 'Then run the tests and fix anything that fails before reporting back.'; } },
    { id: 'reference', label: 'Point at a reference', input: 'the existing profile page',
      hint: 'Name a file or pattern to match so new code fits what you already have.',
      clause: function (v) { return 'Follow the same pattern as ' + (v || 'the existing code') + '.'; } },
    { id: 'target', label: 'State a measurable target', input: 'p95 latency under 500ms',
      hint: 'Give a metric and threshold so \u201cdone\u201d is unambiguous.',
      clause: function (v) { return 'Target: ' + (v || 'the stated goal') + '.'; } },
    { id: 'artifact', label: 'Give it the artifact', input: '@build.log',
      hint: 'Paste the error / log / screenshot or @-mention a file instead of describing it.',
      clause: function (v) { return 'Here is the relevant context: ' + (v || '@file') + '.'; } },
    { id: 'format', label: 'Say how you want the answer', input: 'an HTML page with a diagram, then open it',
      hint: 'Name the format, length, or audience so the output fits how you\u2019ll use it.',
      clause: function (v) { return 'Write the answer as ' + (v || 'a short summary') + '.'; } },
    { id: 'scope', label: 'Set the scope / guardrails', input: "don't touch tests or the changelog",
      hint: 'Say what to leave alone so a small fix doesn\u2019t become a refactor.',
      clause: function (v) { return 'Constraint: ' + (v || 'keep the change minimal') + '.'; } }
  ];
  function renderPromptImprover(root) {
    root.innerHTML = '';
    var on = {};
    var vals = {};
    var grid = el('div', 'lw-improve');
    var left = el('div', 'lw-improve-left');
    var right = el('div', 'lw-improve-right');
    grid.appendChild(left); grid.appendChild(right); root.appendChild(grid);

    left.appendChild(el('span', 'lw-field-label', 'Your rough prompt'));
    var ta = el('textarea', 'lw-in lw-ta lw-ta-lg'); ta.rows = 4;
    ta.value = 'add rate limiting to the public API';
    left.appendChild(ta);

    left.appendChild(el('span', 'lw-field-label', 'Apply the patterns that make prompts work'));
    var opts = el('div', 'lw-enh');
    ENHANCERS.forEach(function (e) {
      var row = el('div', 'lw-enh-row');
      var lab = el('label', 'lw-toggle');
      var cb = el('input'); cb.type = 'checkbox';
      var sw = el('span', 'lw-switch');
      var txt = el('span', 'lw-toggle-txt', '<strong>' + esc(e.label) + '</strong><em>' + esc(e.hint) + '</em>');
      lab.appendChild(cb); lab.appendChild(sw); lab.appendChild(txt);
      row.appendChild(lab);
      var inp = null;
      if (e.input) {
        inp = el('input', 'lw-in lw-in-sm lw-enh-in'); inp.type = 'text'; inp.value = e.input; inp.placeholder = e.input;
        inp.disabled = true; vals[e.id] = e.input;
        inp.addEventListener('input', function () { vals[e.id] = inp.value; build(); });
        row.appendChild(inp);
      }
      cb.addEventListener('change', function () {
        on[e.id] = cb.checked; if (inp) inp.disabled = !cb.checked;
        row.classList.toggle('is-on', cb.checked); build();
      });
      opts.appendChild(row);
    });
    left.appendChild(opts);
    ta.addEventListener('input', build);

    var outHead = el('div', 'lw-out-head');
    var meter = el('span', 'lw-meter', '');
    outHead.appendChild(el('span', 'lw-file', 'Improved prompt'));
    outHead.appendChild(meter);
    var copyBtn = el('button', 'lw-copy'); copyBtn.type = 'button'; copyBtn.textContent = 'Copy';
    outHead.appendChild(copyBtn);
    var box = el('div', 'lw-terminal lw-terminal-out');
    box.appendChild(el('span', 'lw-prompt', ''));
    var code = el('code', 'lw-code'); box.appendChild(code);
    right.appendChild(outHead); right.appendChild(box);
    var note = el('div', 'lw-improve-note', '');
    right.appendChild(note);

    function build() {
      var base = ta.value.trim() || 'describe your task\u2026';
      var clauses = [base];
      var used = 0;
      ENHANCERS.forEach(function (e) {
        if (on[e.id]) { clauses.push(e.clause(vals[e.id])); used++; }
      });
      var full = clauses.join(' ');
      code.textContent = full;
      copyBtn.dataset.text = full;
      var score = Math.min(5, used + (base.length > 12 ? 1 : 0));
      meter.innerHTML = '';
      for (var i = 0; i < 5; i++) {
        var d = el('span', 'lw-dot' + (i < score ? ' on' : ''));
        meter.appendChild(d);
      }
      note.textContent = used === 0
        ? 'A bare outcome works, but layering a pattern or two makes Claude iterate and self-check.'
        : used >= 4 ? 'Strong \u2014 outcome, verification, and constraints are all specified.'
        : 'Good start. Add a way to verify and a reference for even better results.';
    }
    build();
  }

  /* =========================================================
     4) DECK ENGINE  (Document <-> Deck)
     ========================================================= */
  var Deck = {
    slides: [], idx: 0, root: null, stage: null, inner: null, built: false,
    build: function () {
      this.slides = [];
      var S = this.slides;
      // cover
      S.push({ kind: 'cover', html:
        '<div class="ds-eyebrow">TechDays \u00b7 Training Series</div>' +
        '<h1 class="ds-cover-h">AI Fluency<br><em>Agentic Agents</em></h1>' +
        '<p class="ds-cover-sub">Five hands-on tutorials \u2014 AGENTS.md, Commands, Skills, Plugins, and MCP Servers.</p>' });
      var tut = document.querySelectorAll('.tutorial');
      Array.prototype.forEach.call(tut, function (t) {
        var kids = Array.prototype.slice.call(t.children);
        var h1 = t.querySelector('h1');
        if (h1) S.push({ kind: 'divider', html: '<div class="ds-eyebrow">Tutorial</div><h2 class="ds-div-h">' + h1.innerHTML + '</h2>' });
        // group by h2
        var cur = null;
        kids.forEach(function (node) {
          var tag = node.tagName;
          if (tag === 'H1') return;
          if (tag === 'H2') {
            if (cur) S.push(cur);
            cur = { kind: 'content', title: node.innerHTML, parts: [] };
          } else {
            if (!cur) cur = { kind: 'content', title: h1 ? h1.textContent : '', parts: [] };
            cur.parts.push(node.outerHTML);
          }
        });
        if (cur) S.push(cur);
      });
      S.push({ kind: 'end', html:
        '<div class="ds-eyebrow">That\u2019s the lab</div>' +
        '<h2 class="ds-div-h">Now go build.</h2>' +
        '<p class="ds-cover-sub">Open the interactive toolkit to draft a skill or tune a prompt \u2014 then take it into Claude Code.</p>' });
      this.built = true;
    },
    slideHTML: function (s) {
      if (s.kind === 'content') {
        return '<div class="ds-content"><h2 class="ds-content-h">' + s.title + '</h2>' + s.parts.join('') + '</div>';
      }
      return '<div class="ds-center">' + s.html + '</div>';
    },
    open: function () {
      if (!this.built) this.build();
      document.body.classList.add('lw-deck-mode');
      this.root.hidden = false;
      this.go(this.idx || 0);
      this.root.focus();
    },
    close: function () {
      document.body.classList.remove('lw-deck-mode');
      this.root.hidden = true;
      var t = document.getElementById('view-toggle');
      if (t) { t.setAttribute('aria-pressed', 'false'); setToggleLabel(false); }
    },
    go: function (i) {
      this.idx = Math.max(0, Math.min(this.slides.length - 1, i));
      var s = this.slides[this.idx];
      this.stage.className = 'ds-stage ds-' + s.kind;
      this.inner.style.transform = 'none';
      this.inner.innerHTML = this.slideHTML(s);
      // fit
      var pad = 2;
      var avail = this.stage.clientHeight - pad;
      var h = this.inner.scrollHeight;
      var scale = h > avail ? Math.max(0.5, avail / h) : 1;
      this.inner.style.transform = scale < 1 ? 'scale(' + scale + ')' : 'none';
      this.counter.textContent = (this.idx + 1) + ' / ' + this.slides.length;
      this.prevBtn.disabled = this.idx === 0;
      this.nextBtn.disabled = this.idx === this.slides.length - 1;
      // reset entry animation
      this.inner.classList.remove('ds-enter'); void this.inner.offsetWidth; this.inner.classList.add('ds-enter');
    },
    next: function () { this.go(this.idx + 1); },
    prev: function () { this.go(this.idx - 1); },
    init: function () {
      var root = document.getElementById('deck-root');
      this.root = root; root.tabIndex = -1;
      this.stage = root.querySelector('.ds-stage');
      this.inner = root.querySelector('.ds-inner');
      this.counter = root.querySelector('.ds-counter');
      this.prevBtn = root.querySelector('.ds-prev');
      this.nextBtn = root.querySelector('.ds-next');
      var self = this;
      this.prevBtn.addEventListener('click', function () { self.prev(); });
      this.nextBtn.addEventListener('click', function () { self.next(); });
      root.querySelector('.ds-exit').addEventListener('click', function () { self.close(); });
      root.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); self.next(); }
        else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); self.prev(); }
        else if (e.key === 'Escape') { self.close(); }
        else if (e.key === 'Home') { self.go(0); }
        else if (e.key === 'End') { self.go(self.slides.length - 1); }
      });
      window.addEventListener('resize', function () { if (!root.hidden) self.go(self.idx); });
    }
  };

  function setToggleLabel(on) {
    var t = document.getElementById('view-toggle');
    if (t) t.querySelector('.lw-toggle-state').textContent = on ? 'Deck' : 'Document';
  }

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    Deck.init();
    var toggle = document.getElementById('view-toggle');
    toggle.addEventListener('click', function () {
      var on = toggle.getAttribute('aria-pressed') !== 'true';
      toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      setToggleLabel(on);
      if (on) Deck.open(); else Deck.close();
    });
    var pl = document.getElementById('tool-prompts'); if (pl) renderPromptLibrary(pl);
    var sk = document.getElementById('tool-skill'); if (sk) renderSkillCustomizer(sk);
    var pi = document.getElementById('tool-improver'); if (pi) renderPromptImprover(pi);

    // mobile drawer
    var burger = document.getElementById('burger');
    var scrim = document.getElementById('scrim');
    var closeNav = function () { document.body.classList.remove('lw-nav-open'); if (burger) burger.setAttribute('aria-expanded', 'false'); };
    if (burger) burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('lw-nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (scrim) scrim.addEventListener('click', closeNav);
  }

  window.LabWorkbook = { init: init };
})();
