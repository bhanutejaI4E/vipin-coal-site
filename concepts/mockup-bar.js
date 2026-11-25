/*
 * Mockup concept switcher — presentation aid only. REMOVE BEFORE LAUNCH.
 * Adds a floating pill to move between the 5 design concepts.
 * Hide it with the × button, or by adding ?clean to the URL (handy for screenshots).
 */
(() => {
  const concepts = [
    { file: '01-obsidian.html', name: 'Obsidian' },
    { file: '02-ledger.html', name: 'Ledger' },
    { file: '03-terminal.html', name: 'Terminal' },
    { file: '04-strata.html', name: 'Strata' },
    { file: '05-meridian.html', name: 'Meridian' },
  ];
  const params = new URLSearchParams(location.search);
  if (params.has('clean') || sessionStorage.getItem('mockbar-hidden') === '1') return;

  const here = location.pathname.split('/').pop();
  const i = concepts.findIndex((c) => c.file === here);
  if (i === -1) return;
  const prev = concepts[(i - 1 + concepts.length) % concepts.length];
  const next = concepts[(i + 1) % concepts.length];
  const pad = (n) => String(n).padStart(2, '0');

  const style = document.createElement('style');
  style.textContent = `
    .mockbar{position:fixed;z-index:2147483000;left:50%;bottom:16px;transform:translateX(-50%);
      display:flex;align-items:center;gap:2px;padding:5px;border-radius:999px;
      background:rgba(18,18,20,.92);color:#fff;border:1px solid rgba(255,255,255,.16);
      box-shadow:0 10px 30px rgba(0,0,0,.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
      font:500 13px/1.2 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:0;white-space:nowrap}
    .mockbar a,.mockbar button{all:unset;cursor:pointer;color:#fff;padding:8px 12px;border-radius:999px}
    .mockbar a:hover,.mockbar button:hover{background:rgba(255,255,255,.12)}
    .mockbar a:focus-visible,.mockbar button:focus-visible{outline:2px solid #fff;outline-offset:1px}
    .mockbar .mb-label{padding:0 8px;color:#d4d4d8}
    .mockbar .mb-label strong{color:#fff;font-weight:650}
    .mockbar .mb-note{color:#a1a1aa;padding-right:6px}
    .mockbar .mb-sep{width:1px;height:18px;background:rgba(255,255,255,.18);margin:0 4px}
    @media (max-width:640px){.mockbar .mb-note,.mockbar .mb-all-text{display:none}.mockbar{bottom:10px}}
    @media print{.mockbar{display:none}}
  `;
  document.head.appendChild(style);

  const bar = document.createElement('nav');
  bar.className = 'mockbar';
  bar.setAttribute('aria-label', 'Design concepts (mockup only)');
  bar.innerHTML = `
    <a href="${prev.file}" aria-label="Previous concept: ${prev.name}">&larr;</a>
    <span class="mb-label">Concept ${pad(i + 1)}/${pad(concepts.length)} · <strong>${concepts[i].name}</strong></span>
    <a href="${next.file}" aria-label="Next concept: ${next.name}">&rarr;</a>
    <span class="mb-sep" aria-hidden="true"></span>
    <span class="mb-note">Placeholder content</span>
    <a href="../index.html" aria-label="All concepts"><span aria-hidden="true">▦<span class="mb-all-text"> All concepts</span></span></a>
    <button type="button" aria-label="Hide concept bar">&times;</button>
  `;
  bar.querySelector('button').addEventListener('click', () => {
    sessionStorage.setItem('mockbar-hidden', '1');
    bar.remove();
  });
  document.body.appendChild(bar);
})();
