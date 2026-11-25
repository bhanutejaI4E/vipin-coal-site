/*
 * Mockup toolbar: presentation aid only. REMOVE BEFORE LAUNCH.
 *
 * 1. Switch between the 5 design concepts.
 * 2. "Customize": preview the current concept in other colour themes, font pairings
 *    and text sizes. Each concept declares its options in `window.STYLE_LAB`
 *    (an inline <script> just above the one that loads this file).
 *
 * Choices are saved per concept in localStorage. URL options also work and are
 * what "Copy my pick" shares:  ?theme=<id>&font=<id>&size=0|1|2
 * Add ?clean to hide the toolbar (handy for screenshots); URL options still apply.
 */
(() => {
  const concepts = [
    { file: '01-obsidian.html', name: 'Obsidian' },
    { file: '02-ledger.html', name: 'Ledger' },
    { file: '03-terminal.html', name: 'Terminal' },
    { file: '04-strata.html', name: 'Strata' },
    { file: '05-meridian.html', name: 'Meridian' },
  ];
  const here = location.pathname.split('/').pop();
  const idx = concepts.findIndex((c) => c.file === here);
  if (idx === -1) return;

  const concept = concepts[idx];
  const slug = concept.file.replace('.html', '');
  const lab = window.STYLE_LAB && window.STYLE_LAB.themes && window.STYLE_LAB.fonts ? window.STYLE_LAB : null;
  const params = new URLSearchParams(location.search);
  const clean = params.has('clean');
  const root = document.documentElement;
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ls = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
    del: (k) => { try { localStorage.removeItem(k); } catch (e) { /* private mode */ } },
  };
  const KEY = { theme: `kolvara.${slug}.theme`, font: `kolvara.${slug}.font`, size: 'kolvara.size', hint: 'kolvara.hint.v1' };
  const SIZES = [
    { id: '0', label: 'A', name: 'Default', pct: '' },
    { id: '1', label: 'A+', name: 'Large', pct: '112.5%' },
    { id: '2', label: 'A++', name: 'Larger', pct: '125%' },
  ];
  const state = { theme: lab ? lab.themes[0].id : null, font: lab ? lab.fonts[0].id : null, size: '0' };

  /* ---------- apply ---------- */
  const loaded = new Set();
  const loadFont = (f) => {
    if (!f || !f.href || loaded.has(f.href)) return;
    loaded.add(f.href);
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = f.href;
    document.head.appendChild(l);
  };
  const meta = document.querySelector('meta[name="theme-color"]');
  const metaOriginal = meta ? meta.content : '';
  const setVars = (list, chosen) => {
    list.forEach((o) => Object.keys(o.vars || {}).forEach((k) => root.style.removeProperty(k)));
    Object.entries(chosen.vars || {}).forEach(([k, v]) => root.style.setProperty(k, v));
  };
  const setTheme = (id) => {
    const t = lab.themes.find((x) => x.id === id) || lab.themes[0];
    setVars(lab.themes, t);
    root.style.colorScheme = t.scheme || '';
    if (meta) meta.content = t.meta || metaOriginal;
    state.theme = t.id;
  };
  const setFont = (id) => {
    const f = lab.fonts.find((x) => x.id === id) || lab.fonts[0];
    loadFont(f);
    setVars(lab.fonts, f);
    state.font = f.id;
  };
  const setSize = (id) => {
    const s = SIZES.find((x) => x.id === id) || SIZES[0];
    root.style.fontSize = s.pct;
    state.size = s.id;
  };
  const pick = (k) => params.get(k) || (clean ? null : ls.get(KEY[k]));
  if (lab) { setTheme(pick('theme')); setFont(pick('font')); }
  setSize(pick('size'));

  if (clean || sessionStorage.getItem('mockbar-hidden') === '1') return;

  /* ---------- styles ---------- */
  const css = document.createElement('style');
  css.textContent = `
  .kb{position:fixed;z-index:2147483000;left:50%;bottom:16px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;
    font:500 13px/1.25 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;letter-spacing:0;color:#fff;-webkit-font-smoothing:antialiased;text-align:left}
  .kb *,.kb *::before,.kb *::after{box-sizing:border-box}
  :where(.kb) button,:where(.kb) a{all:unset;box-sizing:border-box;cursor:pointer;position:relative}
  .kb :focus-visible{outline:2px solid #fff;outline-offset:2px}
  .mockbar{display:flex;align-items:center;gap:2px;padding:5px;border-radius:999px;background:rgba(18,18,20,.94);border:1px solid rgba(255,255,255,.16);
    box-shadow:0 12px 34px rgba(0,0,0,.38);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);white-space:nowrap;position:relative}
  .mockbar > a,.mockbar > button{color:#fff;padding:8px 11px;border-radius:999px;transition:background .15s}
  .mockbar > a:hover,.mockbar > button:hover{background:rgba(255,255,255,.12)}
  .kb-label{padding:0 6px;color:#d4d4d8}
  .kb-label strong{color:#fff;font-weight:650}
  .kb-sep{width:1px;height:18px;background:rgba(255,255,255,.18);margin:0 4px}
  .kb-sw{display:flex;align-items:center;gap:5px;padding:0 6px}
  .kb-sw button{width:20px;height:20px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28);transition:transform .15s}
  .kb-sw button:hover{transform:scale(1.18)}
  .kb-sw button[aria-pressed="true"]::before{content:"";position:absolute;inset:-4px;border-radius:50%;border:1.5px solid #fff}
  .kb-aa{display:inline-flex;align-items:center;gap:6px;font-weight:700;background:rgba(255,255,255,.1)}
  .kb-aa svg{width:15px;height:15px}
  .mockbar > .kb-aa[aria-expanded="true"]{background:#fff;color:#111}
  .kb-aa.pulse::after{content:"";position:absolute;inset:-3px;border-radius:999px;border:2px solid #FACC15;animation:kbpulse 1.6s ease-out infinite}
  @keyframes kbpulse{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.25)}}
  .kb [data-tip]:hover::after,.kb [data-tip]:focus-visible::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 12px);left:50%;transform:translateX(-50%);
    background:#fff;color:#111;font:600 12px/1 ui-sans-serif,system-ui,sans-serif;padding:7px 9px;border-radius:7px;white-space:nowrap;box-shadow:0 6px 18px rgba(0,0,0,.25);pointer-events:none;z-index:2}
  .kb-aa.pulse:hover::after{content:none}

  .kb-panel{width:380px;max-width:calc(100vw - 20px);max-height:min(72vh,620px);overflow:auto;overscroll-behavior:contain;background:#16161A;color:#fff;border:1px solid rgba(255,255,255,.14);
    border-radius:18px;box-shadow:0 24px 60px rgba(0,0,0,.45);padding:16px 16px 14px}
  .kb-panel[hidden],.kb-hint[hidden]{display:none}
  .kb-head{display:flex;justify-content:space-between;align-items:center;gap:12px}
  .kb-head h2{margin:0;font-weight:700;font-size:15px;line-height:1.2;font-family:inherit;letter-spacing:0;text-transform:none;color:#fff}
  .kb-x{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:#d4d4d8;font-size:18px}
  .kb-x:hover{background:rgba(255,255,255,.1);color:#fff}
  .kb-sub{margin:4px 0 12px;color:#a1a1aa;font-size:12.5px;line-height:1.45}
  .kb-panel h3{margin:14px 0 8px;font-weight:700;font-size:11px;line-height:1.2;font-family:inherit;letter-spacing:.08em;text-transform:uppercase;color:#a1a1aa}
  .kb-themes{display:grid;grid-template-columns:1fr 1fr;gap:6px}
  .kb-themes button{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.1);color:#e4e4e7;font-size:12.5px}
  .kb-themes button:hover{background:rgba(255,255,255,.06)}
  .kb-themes button[aria-pressed="true"]{border-color:#fff;background:rgba(255,255,255,.08);color:#fff}
  .kb-dot{flex:none;width:22px;height:22px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)}
  .kb-fonts{display:grid;gap:5px}
  .kb-fonts button{display:block;padding:9px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.1);color:#e4e4e7}
  .kb-fonts button:hover{background:rgba(255,255,255,.06)}
  .kb-fonts button[aria-pressed="true"]{border-color:#fff;background:rgba(255,255,255,.08);color:#fff}
  .kb-fonts .d{display:block;font-size:18px;line-height:1.2}
  .kb-fonts .b{display:block;font-size:12.5px;color:#a1a1aa;margin-top:2px}
  .kb-fonts button[aria-pressed="true"] .b{color:#d4d4d8}
  .kb-tag{display:inline-block;margin-left:6px;padding:2px 6px;border-radius:5px;background:rgba(255,255,255,.12);font:600 10px/1.2 ui-sans-serif,system-ui,sans-serif;letter-spacing:.04em;vertical-align:3px;color:#e4e4e7}
  .kb-sizes{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
  .kb-sizes button{text-align:center;padding:9px 0;border-radius:10px;border:1px solid rgba(255,255,255,.1);font-weight:700;color:#e4e4e7}
  .kb-sizes button:nth-child(2){font-size:15px}.kb-sizes button:nth-child(3){font-size:17px}
  .kb-sizes button:hover{background:rgba(255,255,255,.06)}
  .kb-sizes button[aria-pressed="true"]{border-color:#fff;background:#fff;color:#111}
  .kb-foot{position:sticky;bottom:-14px;margin:14px -16px -14px;padding:12px 16px 14px;background:#16161A;border-top:1px solid rgba(255,255,255,.12)}
  .kb-sum{margin:0 0 10px;font-size:12.5px;color:#d4d4d8;line-height:1.45}
  .kb-sum b{color:#fff}
  .kb-actions{display:flex;gap:8px}
  .kb-actions button{flex:1;text-align:center;padding:10px 0;border-radius:10px;font-weight:700}
  .kb-reset{border:1px solid rgba(255,255,255,.2);color:#fff}
  .kb-reset:hover{background:rgba(255,255,255,.08)}
  .kb-copy{background:#fff;color:#111}
  .kb-copy:hover{background:#e4e4e7}

  .kb-hint{position:absolute;bottom:calc(100% + 14px);width:300px;max-width:calc(100vw - 24px);background:#FEF9C3;color:#1C1917;border-radius:14px;padding:13px 14px 12px;
    box-shadow:0 16px 40px rgba(0,0,0,.35);font-size:13px;line-height:1.45}
  .kb-hint::after{content:"";position:absolute;top:100%;left:var(--arrow,50%);transform:translateX(-50%);border:8px solid transparent;border-top-color:#FEF9C3}
  .kb-hint b{display:block;font-size:14px;margin-bottom:3px}
  .kb-hint-actions{display:flex;gap:8px;margin-top:10px}
  .kb-hint-actions button{padding:7px 12px;border-radius:8px;font-weight:700}
  .kb-hint-actions .p{background:#1C1917;color:#FEF9C3}
  .kb-hint-actions .s{color:#1C1917;box-shadow:inset 0 0 0 1px rgba(28,25,23,.3)}
  .kb-hint :focus-visible{outline-color:#1C1917}

  @media (max-width:900px){.kb-sw,.kb-sep-sw{display:none}}
  @media (max-width:640px){.kb{bottom:10px}.kb-label .kb-long,.kb-all-text,.kb-aa-text{display:none}.mockbar > a,.mockbar > button{padding:8px 10px}}
  @media (prefers-reduced-motion:reduce){.kb-aa.pulse::after{animation:none}.kb *{transition:none !important}}
  @media print{.kb{display:none}}
  `;
  document.head.appendChild(css);

  /* ---------- markup ---------- */
  const prev = concepts[(idx - 1 + concepts.length) % concepts.length];
  const next = concepts[(idx + 1) % concepts.length];
  const half = (sw) => `conic-gradient(${sw[0]} 0 50%, ${sw[1]} 50% 100%)`;
  const theme = () => lab.themes.find((t) => t.id === state.theme);
  const font = () => lab.fonts.find((f) => f.id === state.font);
  const size = () => SIZES.find((s) => s.id === state.size);

  const kb = document.createElement('aside');
  kb.className = 'kb';
  kb.setAttribute('aria-label', 'Mockup toolbar: switch concepts and customise colours, fonts and text size');
  kb.innerHTML = `
    ${lab ? `
    <div class="kb-hint" id="kb-hint" role="note" hidden>
      <b>New: customise this design</b>
      From here you can try different colour themes, fonts and text sizes on this layout, then copy your favourite combination.
      <div class="kb-hint-actions"><button type="button" class="p" data-act="show">Show me</button><button type="button" class="s" data-act="dismiss">Got it</button></div>
    </div>
    <div class="kb-panel" id="kb-panel" role="dialog" aria-modal="false" aria-labelledby="kb-title" hidden>
      <div class="kb-head"><h2 id="kb-title">Customise ${esc(concept.name)}</h2><button type="button" class="kb-x" aria-label="Close customise panel">&times;</button></div>
      <p class="kb-sub">Same layout, different look. Your choices are saved on this device for this concept.</p>
      <h3 id="kb-h-theme">Colour theme</h3>
      <div class="kb-themes" role="group" aria-labelledby="kb-h-theme">
        ${lab.themes.map((t) => `<button type="button" data-theme="${esc(t.id)}" aria-pressed="false"><span class="kb-dot" style="background:${half(t.swatch)}" aria-hidden="true"></span><span>${esc(t.name)}</span></button>`).join('')}
      </div>
      <h3 id="kb-h-size">Text size</h3>
      <div class="kb-sizes" role="group" aria-labelledby="kb-h-size">
        ${SIZES.map((s) => `<button type="button" data-size="${s.id}" aria-pressed="false" aria-label="${s.name} text size">${s.label}</button>`).join('')}
      </div>
      <h3 id="kb-h-font">Fonts · headings + body</h3>
      <div class="kb-fonts" role="group" aria-labelledby="kb-h-font">
        ${lab.fonts.map((f, n) => `<button type="button" data-font="${esc(f.id)}" aria-pressed="false" aria-label="${esc(f.name)}${n === 0 ? ' (original)' : ''}${f.note ? ', ' + esc(f.note) : ''}"><span class="d" style="font-family:${esc(f.display)}">${esc(f.label || f.name.split(' + ')[0])}${n === 0 ? '<span class="kb-tag">ORIGINAL</span>' : ''}${f.note ? `<span class="kb-tag">${esc(f.note.toUpperCase())}</span>` : ''}</span><span class="b" style="font-family:${esc(f.body)}">${esc(f.name.includes(' + ') ? 'with ' + f.name.split(' + ')[1] : 'one family for everything')}</span></button>`).join('')}
      </div>
      <div class="kb-foot">
        <p class="kb-sum" aria-live="polite"></p>
        <div class="kb-actions"><button type="button" class="kb-reset">Reset</button><button type="button" class="kb-copy">Copy my pick</button></div>
      </div>
    </div>` : ''}
    <nav class="mockbar" aria-label="Design concepts (mockup only)">
      <a href="${prev.file}" aria-label="Previous concept: ${prev.name}" data-tip="${prev.name}">&larr;</a>
      <span class="kb-label"><span class="kb-long">Concept </span>${pad(idx + 1)}/${pad(concepts.length)} · <strong>${concept.name}</strong></span>
      <a href="${next.file}" aria-label="Next concept: ${next.name}" data-tip="${next.name}">&rarr;</a>
      ${lab ? `
      <span class="kb-sep kb-sep-sw" aria-hidden="true"></span>
      <div class="kb-sw" role="group" aria-label="Colour theme">
        ${lab.themes.map((t) => `<button type="button" data-theme="${esc(t.id)}" aria-pressed="false" aria-label="Colour theme: ${esc(t.name)}" data-tip="${esc(t.name)}" style="background:${half(t.swatch)}"></button>`).join('')}
      </div>
      <button type="button" class="kb-aa" aria-expanded="false" aria-controls="kb-panel" data-tip="Change colours, fonts &amp; text size">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M10 2.5a7.5 7.5 0 1 0 0 15c1.1 0 1.6-.8 1.3-1.7-.3-.9.2-1.8 1.2-1.8h1.6a3.4 3.4 0 0 0 3.4-3.4C17.5 6 14.1 2.5 10 2.5z"/><circle cx="6.3" cy="9.3" r="1" fill="currentColor"/><circle cx="8.8" cy="6.1" r="1" fill="currentColor"/><circle cx="12.6" cy="6.4" r="1" fill="currentColor"/></svg>
        <span>Aa</span><span class="kb-aa-text" style="font-weight:500">Customise</span>
      </button>` : ''}
      <span class="kb-sep" aria-hidden="true"></span>
      <a href="../index.html" aria-label="All concepts" data-tip="All concepts"><span aria-hidden="true">▦<span class="kb-all-text"> All</span></span></a>
      <button type="button" class="kb-hide" aria-label="Hide toolbar" data-tip="Hide toolbar">&times;</button>
    </nav>`;
  document.body.appendChild(kb);

  kb.querySelector('.kb-hide').addEventListener('click', () => { sessionStorage.setItem('mockbar-hidden', '1'); kb.remove(); });
  if (!lab) return;

  /* ---------- behaviour ---------- */
  const panel = kb.querySelector('#kb-panel');
  const aa = kb.querySelector('.kb-aa');
  const hint = kb.querySelector('#kb-hint');
  const sum = kb.querySelector('.kb-sum');

  const sync = () => {
    kb.querySelectorAll('[data-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === state.theme)));
    kb.querySelectorAll('[data-font]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.font === state.font)));
    kb.querySelectorAll('[data-size]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.size === state.size)));
    sum.innerHTML = `Your pick: <b>${esc(theme().name)}</b> · <b>${esc(font().name)}</b> · <b>${esc(size().name)}</b> text`;
  };
  const save = () => { ls.set(KEY.theme, state.theme); ls.set(KEY.font, state.font); ls.set(KEY.size, state.size); };
  const dismissHint = () => { if (!hint.hidden) { hint.hidden = true; aa.classList.remove('pulse'); } ls.set(KEY.hint, '1'); };

  kb.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.theme) { setTheme(b.dataset.theme); save(); sync(); dismissHint(); }
    else if (b.dataset.font) { setFont(b.dataset.font); save(); sync(); }
    else if (b.dataset.size) { setSize(b.dataset.size); save(); sync(); }
  });

  let lastFocus = null;
  const open = () => {
    lab.fonts.forEach(loadFont); // so every option previews in its own typeface
    panel.hidden = false;
    aa.setAttribute('aria-expanded', 'true');
    dismissHint();
    sync();
    (panel.querySelector('[aria-pressed="true"]') || panel.querySelector('button')).focus();
  };
  const close = (restore = true) => {
    if (panel.hidden) return;
    panel.hidden = true;
    aa.setAttribute('aria-expanded', 'false');
    if (restore) aa.focus();
  };
  aa.addEventListener('click', () => (panel.hidden ? open() : close()));
  kb.querySelector('.kb-x').addEventListener('click', () => close());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); close(); } }, true);
  document.addEventListener('pointerdown', (e) => { if (!panel.hidden && !kb.contains(e.target)) close(false); });

  kb.querySelector('.kb-reset').addEventListener('click', () => {
    setTheme(lab.themes[0].id); setFont(lab.fonts[0].id); setSize('0');
    [KEY.theme, KEY.font, KEY.size].forEach(ls.del);
    sync();
    sum.insertAdjacentHTML('beforeend', ' (reset to original)');
  });

  kb.querySelector('.kb-copy').addEventListener('click', async () => {
    const url = `${location.href.split(/[?#]/)[0]}?theme=${state.theme}&font=${state.font}&size=${state.size}`;
    const text = `Concept ${pad(idx + 1)} ${concept.name}: theme "${theme().name}", fonts "${font().name}", ${size().name.toLowerCase()} text\n${url}`;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
    }
    sum.innerHTML = ok ? '<b>Copied.</b> Paste it into WhatsApp or email to share this combination.' : `Copy this: <b>${esc(text)}</b>`;
  });

  // First-visit tip, pointing at the Customise button
  if (ls.get(KEY.hint) !== '1') {
    const place = () => {
      const bar = kb.querySelector('.mockbar').getBoundingClientRect();
      const btn = aa.getBoundingClientRect();
      const w = Math.min(300, window.innerWidth - 24);
      const center = btn.left + btn.width / 2;
      let left = Math.max(12, Math.min(window.innerWidth - w - 12, center - w / 2));
      hint.style.left = `${left - kb.getBoundingClientRect().left}px`;
      hint.style.setProperty('--arrow', `${center - left}px`);
      void bar;
    };
    setTimeout(() => {
      hint.hidden = false;
      aa.classList.add('pulse');
      place();
      window.addEventListener('resize', place);
    }, 900);
    hint.querySelector('[data-act="show"]').addEventListener('click', open);
    hint.querySelector('[data-act="dismiss"]').addEventListener('click', () => { dismissHint(); aa.focus(); });
  }
  sync();
})();
