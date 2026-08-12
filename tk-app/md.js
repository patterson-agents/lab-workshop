/* Markdown pipeline: frontmatter strip + ::: callouts + terminal-frame code labels. */
window.TKMD = (function () {
  var CO_TITLES = { info: 'Note', tip: 'Tip', warn: 'Gotcha', warning: 'Gotcha', danger: 'Security', success: 'Checkpoint' };

  function parse(raw) {
    var title = '';
    var md = raw;
    // frontmatter
    var fm = md.match(/^---\n([\s\S]*?)\n---\n/);
    if (fm) {
      var t = fm[1].match(/^title:\s*(.+)$/m);
      if (t) title = t[1].trim();
      md = md.slice(fm[0].length);
    }
    // ::: callouts -> html block wrappers (blank lines keep inner md parsed)
    md = md.replace(/^:::(\w+)\s*$/gm, function (_, kind) {
      var k = kind.toLowerCase();
      var cls = k === 'warning' ? 'warn' : (k === 'danger' ? 'danger' : k);
      return '<div class="callout ' + cls + '"><span class="co-title">' + (CO_TITLES[k] || k) + '</span>\n';
    }).replace(/^:::\s*$/gm, '</div>\n');

    var renderer = new marked.Renderer();
    renderer.code = function (code, infostring) {
      var info = String(infostring || '');
      var label = /frame="terminal"/.test(info) ? '<span class="pre-label">Terminal \u00b7 your machine</span>' : '';
      var esc = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return label + '<pre><code>' + esc + '</code></pre>';
    };
    var html = marked.parse(md, { renderer: renderer, mangle: false, headerIds: false });
    return { title: title, html: html };
  }

  /* Tiny per-line highlighter for the editor pane. */
  function hl(line) {
    var esc = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (/^---\s*$/.test(line)) return '<span class="tok-k">' + esc + '</span>';
    if (/^#{1,3} /.test(line)) return '<span class="tok-k">' + esc + '</span>';
    if (/^\s*(#|\/\/)/.test(line)) return '<span class="tok-c">' + esc + '</span>';
    var m = line.match(/^(\s*)([\w-]+):(.*)$/);
    if (m) {
      return m[1].replace(/</g, '&lt;') + '<span class="tok-k">' + m[2] + ':</span>' +
        m[3].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return esc.replace(/(`[^`]+`|"[^"]*")/g, '<span class="tok-s">$1</span>');
  }

  return { parse: parse, hl: hl };
})();
