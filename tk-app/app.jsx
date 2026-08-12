/* TutorialKit preview app — loads real lesson content.md + _files and renders them. */
const { useState, useEffect, useRef, useMemo } = React;
const M = window.TK_MANIFEST, FLAT = window.TK_FLAT;

const contentCache = {};
function useFetchText(path) {
  const [text, setText] = useState(contentCache[path] != null ? contentCache[path] : null);
  useEffect(() => {
    if (path == null) { setText(null); return; }
    if (contentCache[path] != null) { setText(contentCache[path]); return; }
    let live = true;
    setText(null);
    fetch(path).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(t => { contentCache[path] = t; if (live) setText(t); })
      .catch(() => { if (live) setText('Could not load ' + path); });
    return () => { live = false; };
  }, [path]);
  return text;
}

function Breadcrumb({ idx, onGo }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const cur = FLAT[idx];
  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return (
    <div className="bc-wrap" ref={ref}>
      <div className={"breadcrumb" + (open ? " open" : "")} onClick={() => setOpen(o => !o)}>
        <span className="crumbs">{cur.part.title} <span className="chev">/</span> <strong>{cur.lesson.title}</strong></span>
        <i className={'pat-i ' + (open ? 'pat-i-chevron-up' : 'pat-i-chevron-down') + ' chev'} aria-hidden="true"></i>
      </div>
      {open && (
        <div className="bc-menu">
          {M.parts.map(p => (
            <div key={p.id}>
              <div className="bc-part">{p.title}</div>
              {p.lessons.map(l => {
                const i = FLAT.findIndex(f => f.lesson === l);
                return (
                  <div key={l.id} className={"bc-item" + (i === idx ? " active" : "")}
                    onClick={() => { onGo(i); setOpen(false); }}>
                    {l.title}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LessonPane({ idx, onGo }) {
  const cur = FLAT[idx];
  const path = M.base + cur.part.id + '/' + cur.lesson.id + '/content.md';
  const raw = useFetchText(path);
  const parsed = useMemo(() => (raw != null ? TKMD.parse(raw) : null), [raw]);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [idx]);
  const prev = idx > 0 ? FLAT[idx - 1] : null;
  const next = idx < FLAT.length - 1 ? FLAT[idx + 1] : null;
  return (
    <aside className="lesson-pane">
      <div className="lesson-nav">
        <button className="nav-arrow" disabled={!prev} onClick={() => onGo(idx - 1)} title="Previous lesson" aria-label="Previous lesson"><i className="pat-i pat-i-arrow-left" aria-hidden="true"></i></button>
        <Breadcrumb idx={idx} onGo={onGo} />
        <button className="nav-arrow" disabled={!next} onClick={() => onGo(idx + 1)} title="Next lesson" aria-label="Next lesson"><i className="pat-i pat-i-arrow-right" aria-hidden="true"></i></button>
      </div>
      <div className="lesson-scroll" ref={scrollRef}>
        <span className="part-label">{cur.part.title}</span>
        {parsed
          ? <div dangerouslySetInnerHTML={{ __html: parsed.html }}></div>
          : <p style={{ color: 'var(--tk-text-disabled)' }}>Loading lesson…</p>}
        <div className="lesson-cards">
          {prev ? (
            <a className="lesson-card" onClick={() => onGo(idx - 1)}>
              <span className="dir"><i className="pat-i pat-i-arrow-left" aria-hidden="true"></i> Previous</span><span className="nm">{prev.lesson.title}</span>
            </a>
          ) : <span></span>}
          {next ? (
            <a className="lesson-card next" onClick={() => onGo(idx + 1)}>
              <span className="dir">Next <i className="pat-i pat-i-arrow-right" aria-hidden="true"></i></span><span className="nm">{next.lesson.title}</span>
            </a>
          ) : <span></span>}
        </div>
      </div>
    </aside>
  );
}

function FileTree({ files, selected, onSelect }) {
  // Build a simple nested render from slash paths.
  const rows = [];
  const seen = {};
  files.forEach(f => {
    const segs = f.name.split('/');
    let acc = '';
    segs.forEach((s, i) => {
      acc = acc ? acc + '/' + s : s;
      if (i < segs.length - 1) {
        if (!seen[acc]) { seen[acc] = true; rows.push({ type: 'dir', label: s, depth: i }); }
      } else {
        rows.push({ type: 'file', label: s, depth: i, file: f });
      }
    });
  });
  return (
    <div className="file-tree">
      <div className="panel-head"><span>Files</span></div>
      <div className="tree">
        {rows.length === 0 && <div className="entry" style={{ cursor: 'default', color: 'var(--tk-text-disabled)' }}>no files in this lesson</div>}
        {rows.map((r, i) => (
          <div key={i}
            className={"entry " + (r.type === 'dir' ? 'dir open' : 'file') + ' d' + Math.min(r.depth, 3) + (r.file && r.file === selected ? ' active' : '')}
            onClick={r.file ? () => onSelect(r.file) : undefined}>
            {r.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function Editor({ file }) {
  const raw = useFetchText(file ? file.path : null);
  if (!file) {
    return (
      <div className="editor">
        <div className="panel-head"><span>Editor</span></div>
        <div className="editor-empty">
          <p>This lesson runs entirely in your terminal —<br />no artifact files to display.</p>
        </div>
      </div>
    );
  }
  const lines = raw != null ? raw.replace(/\n$/, '').split('\n') : null;
  return (
    <div className="editor">
      <div className="panel-head"><span>{file.name.split('/').pop()}</span><span style={{ textTransform: 'none', letterSpacing: '.04em', opacity: .6 }}>{file.name}</span></div>
      <div className="code">
        {lines
          ? lines.map((ln, i) => (
            <div className="ln" key={i}>
              <span className="no">{i + 1}</span>
              <span className="tx" dangerouslySetInnerHTML={{ __html: TKMD.hl(ln) }}></span>
            </div>
          ))
          : <div className="ln"><span className="no">·</span><span className="tx" style={{ color: 'var(--tk-text-disabled)' }}>loading…</span></div>}
      </div>
    </div>
  );
}

function Terminal({ files }) {
  const [hist, setHist] = useState([
    { t: 'tip', s: 'scratchpad — Claude Code runs on your machine. Try: help, ls, cat <file>, clear' }
  ]);
  const [val, setVal] = useState('');
  const bodyRef = useRef(null);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [hist]);

  function run(cmdline) {
    const out = [{ t: 'cmd', s: cmdline }];
    const [cmd, ...args] = cmdline.trim().split(/\s+/);
    if (!cmd) { setHist(h => [...h, ...out]); return; }
    if (cmd === 'clear') { setHist([]); return; }
    if (cmd === 'help') {
      out.push({ t: 'dim', s: 'ls            list this lesson\u2019s files' });
      out.push({ t: 'dim', s: 'cat <file>    print a file' });
      out.push({ t: 'dim', s: 'clear         clear the scratchpad' });
    } else if (cmd === 'ls') {
      if (files.length === 0) out.push({ t: 'dim', s: '(no files in this lesson)' });
      else files.forEach(f => out.push({ t: 'blue', s: f.name }));
    } else if (cmd === 'cat') {
      const name = args.join(' ');
      const f = files.find(x => x.name === name || x.name.endsWith('/' + name) || x.name.split('/').pop() === name);
      if (!f) out.push({ t: 'warn', s: 'cat: ' + (name || '<file>') + ': no such file (try ls)' });
      else {
        const txt = contentCache[f.path];
        if (txt == null) out.push({ t: 'dim', s: '(still loading — open it in the editor first)' });
        else txt.replace(/\n$/, '').split('\n').forEach(l => out.push({ t: 'dim', s: l || ' ' }));
      }
    } else if (cmd === 'claude') {
      out.push({ t: 'warn', s: 'this scratchpad can\u2019t run Claude Code — open a real terminal on your machine' });
    } else {
      out.push({ t: 'warn', s: cmd + ': command not found — this scratchpad supports ls, cat, clear, help' });
    }
    setHist(h => [...h, ...out]);
  }

  return (
    <div className="terminal">
      <div className="panel-head"><span>Scratchpad</span><span style={{ letterSpacing: '.06em', textTransform: 'none', opacity: .7 }}>interactive — try ls / cat</span></div>
      <div className="term-body" ref={bodyRef} onClick={() => document.getElementById('term-input') && document.getElementById('term-input').focus()}>
        {hist.map((l, i) => (
          <div key={i}>
            {l.t === 'cmd' && <span><i className="pat-i pat-i-chevron-right prompt" aria-hidden="true"></i> <span className="cmd">{l.s}</span></span>}
            {l.t === 'dim' && <span className="dim">{l.s}</span>}
            {l.t === 'blue' && <span className="blue">{l.s}</span>}
            {l.t === 'warn' && <span className="warn-t">{l.s}</span>}
            {l.t === 'tip' && <span className="dim">{l.s}</span>}
          </div>
        ))}
        <div className="term-line">
          <i className="pat-i pat-i-chevron-right prompt" aria-hidden="true"></i>&nbsp;
          <input id="term-input" className="term-input" value={val} autoComplete="off" spellCheck="false"
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { run(val); setVal(''); } }} />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [idx, setIdx] = useState(() => {
    const s = parseInt(localStorage.getItem('tk-lesson'), 10);
    return (s >= 0 && s < FLAT.length) ? s : 0;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('tk-preview-theme') || 'light');
  const cur = FLAT[idx];
  const [selFile, setSelFile] = useState(null);

  useEffect(() => { localStorage.setItem('tk-lesson', String(idx)); }, [idx]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tk-preview-theme', theme);
  }, [theme]);
  useEffect(() => {
    const focus = cur.lesson.focus && cur.lesson.files.find(f => f.name === cur.lesson.focus);
    setSelFile(focus || cur.lesson.files[0] || null);
    // Prefetch file contents for the terminal's cat.
    cur.lesson.files.forEach(f => {
      if (contentCache[f.path] == null) fetch(f.path).then(r => r.text()).then(t => { contentCache[f.path] = t; });
    });
  }, [idx]);
  useEffect(() => {
    function key(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft' && idx > 0) setIdx(idx - 1);
      if (e.key === 'ArrowRight' && idx < FLAT.length - 1) setIdx(idx + 1);
    }
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [idx]);

  return (
    <React.Fragment>
      <header className="topbar">
        <div className="brand">
          <img className="brand-logo" src={theme === 'dark' ? 'assets/brand/patterson-logo-white.svg' : 'assets/brand/patterson-logo-navy.svg'} alt="Patterson Companies" />
          <span className="mark">TechDays: AI Fluency <em>Agentic Agents</em></span>
          <span className="series">TutorialKit Preview · {idx + 1} / {FLAT.length}</span>
        </div>
        <div className="actions">
          <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <span>◐</span> <span>{theme === 'dark' ? 'Light' : 'Navy'}</span>
          </button>
        </div>
      </header>
      <div className="main">
        <LessonPane idx={idx} onGo={setIdx} />
        <section className="workspace">
          <div className="ws-top">
            <FileTree files={cur.lesson.files} selected={selFile} onSelect={setSelFile} />
            <Editor file={selFile} />
          </div>
          <Terminal files={cur.lesson.files} key={idx} />
        </section>
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('tk-root')).render(<App />);
