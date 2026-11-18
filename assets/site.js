/* Progressive enhancement only: every page and paper is readable without JS. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const nav = document.getElementById('primary-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    const setOpen = open => { nav.dataset.open = String(open); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Close menu' : 'Menu'; };
    setOpen(false);
    toggle.addEventListener('click', () => setOpen(nav.dataset.open !== 'true'));
    document.addEventListener('keydown', e => { if(e.key === 'Escape' && nav.dataset.open === 'true') { setOpen(false); toggle.focus(); } });
    nav.addEventListener('click', e => { if(e.target.closest('a')) setOpen(false); });
  }
  for (const button of document.querySelectorAll('[data-copy]')) {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const target = button.dataset.copy === 'url' ? document.querySelector('link[rel=canonical]').href : document.getElementById(button.dataset.copy).innerText;
      const status = button.parentElement.parentElement.querySelector('.copy-status');
      try {
        if(!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(target);
        if(status) status.textContent = button.dataset.copy === 'url' ? 'Page link copied.' : 'Citation copied.';
      } catch (_) {
        if(status) { status.textContent = 'Copy this text: ' + target; }
      }
    });
  }
})();
