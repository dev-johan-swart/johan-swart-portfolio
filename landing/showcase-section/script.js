// script.js
document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------
     Helper / DOM shortcuts
  --------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------------------
     NAV: contact panel toggle
  --------------------------- */
  const contactToggle = $('#contact-toggle');
  const contactPanel = $('#contact-panel');
  const closeContact = $('#close-contact');

  function openContact() { contactPanel.classList.add('open'); }
  function closeContactPanel() { contactPanel.classList.remove('open'); }

  if (contactToggle) contactToggle.addEventListener('click', openContact);
  if (closeContact) closeContact.addEventListener('click', closeContactPanel);

  // Close panel when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeContactPanel();
  });

  /* ---------------------------
     Contact panel tabs
  --------------------------- */
  const tabs = $$('.contact-tabs .tab');
  const tabContents = $$('.contact-tab-content');

  function switchTab(tabName) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    tabContents.forEach(c => c.classList.toggle('active', c.classList.contains(tabName) || c.classList.contains('contact-tab-content') && c.classList.contains('active') && c.dataset.tab === tabName));
    // simpler: use dataset on content
    tabContents.forEach(c => {
      const target = c.id || c.dataset.tab || '';
      c.classList.toggle('active', target === tabName || (tabName === 'form' && c.tagName === 'FORM' && c.id === 'contact-form'));
    });
  }

  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const tabName = t.dataset.tab;
      // show/hide content by data-tab or id
      tabContents.forEach(c => {
        const matches = (c.id && c.id === tabName) || (c.dataset.tab && c.dataset.tab === tabName);
        c.classList.toggle('active', matches);
      });
    });
  });

  /* ---------------------------
     CONTACT FORM: demo submit
  --------------------------- */
  const contactForm = $('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // lightweight validation demo already handled by HTML required attributes
      // Replace this block with actual API or e-mail integration as needed
      const name = contactForm.querySelector('input[type="text"]')?.value || 'Friend';
      // show a friendly toast-ish message (basic)
      alert(`Thanks ${name}! Your message was received (demo).`);
      contactForm.reset();
      closeContactPanel();
    });
  }

  /* ---------------------------
     MESSAGE CAPSULE (simple "save & preview")
     stored in localStorage as base64 for light obfuscation
  --------------------------- */
  const capsuleInput = $('#capsule-input');
  const saveCapsuleBtn = $('#save-capsule');
  const capsuleOutput = $('#capsule-output');
  const CAPSULE_KEY = 'portfolio_capsule_v1';

  function encode(text) {
    try { return btoa(unescape(encodeURIComponent(text))); } catch { return btoa(text); }
  }
  function decode(text) {
    try { return decodeURIComponent(escape(atob(text))); } catch { return atob(text); }
  }

  function showCapsulePreview(encoded) {
    if (!encoded) {
      capsuleOutput.classList.remove('visible');
      capsuleOutput.innerHTML = '';
      return;
    }
    const decoded = decode(encoded);
    // show a short preview and a small "unlock" UX
    capsuleOutput.innerHTML = `
      <div><strong>Capsule saved.</strong></div>
      <div style="margin-top:8px; font-size:.95rem; max-height:120px; overflow:auto; white-space:pre-wrap;">${escapeHtml(decoded)}</div>
      <div style="margin-top:10px; font-size:.85rem; color: #aaa;">(Saved locally in your browser)</div>
    `;
    capsuleOutput.classList.add('visible');
  }

  function escapeHtml(s = '') {
    return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
  }

  // load capsule on start
  const saved = localStorage.getItem(CAPSULE_KEY);
  if (saved) showCapsulePreview(saved);

  if (saveCapsuleBtn && capsuleInput) {
    saveCapsuleBtn.addEventListener('click', () => {
      const val = capsuleInput.value.trim();
      if (!val) {
        alert('Please type a short note to save.');
        return;
      }
      const encoded = encode(val);
      localStorage.setItem(CAPSULE_KEY, encoded);
      showCapsulePreview(encoded);
      capsuleInput.value = '';
    });
  }

  /* ---------------------------
     PORTFOLIO FILTERS (animated reveal)
  --------------------------- */
  const filterButtons = $$('.portfolio-filters button');
  const portfolioCards = $$('.portfolio-card');

  function showCards(cards) {
    cards.forEach((card, i) => {
      card.style.display = 'block';
      // small stagger
      setTimeout(() => card.classList.add('show'), i * 80);
    });
  }

  function hideCards(cards) {
    cards.forEach((card) => {
      card.classList.remove('show');
      setTimeout(() => (card.style.display = 'none'), 350);
    });
  }

  // initial show
  showCards(portfolioCards);

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      if (filter === 'all') {
        showCards(portfolioCards);
      } else {
        portfolioCards.forEach(card => {
          if (card.classList.contains(filter)) {
            showCards([card]);
          } else {
            hideCards([card]);
          }
        });
      }
    });
  });

  /* ---------------------------
     HEATMAP: dynamic skill blocks + animation
  --------------------------- */
  const heatmapEl = $('#heatmap');

  // Configure your skills and strength here (1..5)
  const SKILLS = [
    { name: 'HTML', level: 5 },
    { name: 'CSS', level: 5 },
    { name: 'JavaScript', level: 5 },
    { name: 'React', level: 4 },
    { name: 'Accessibility', level: 4 },
    { name: 'Animation', level: 3 },
    { name: 'Design Systems', level: 3 },
    { name: 'Testing', level: 2 }
  ];

  function levelToHue(level) {
    // map 1..5 to green->yellow->red
    // hue: 140 (green) -> 48 (orange) -> 8 (red)
    const min = 140, max = 8;
    const t = (level - 1) / 4; // 0..1
    return Math.round(min + (max - min) * t);
  }

  function buildHeatmap() {
    if (!heatmapEl) return;
    heatmapEl.innerHTML = '';
    SKILLS.forEach((s, idx) => {
      const div = document.createElement('div');
      div.className = 'heatmap-item';
      div.textContent = s.name;
      // color based on level
      const hue = levelToHue(s.level);
      // compute a lively background and subtle glow
      div.style.background = `linear-gradient(180deg, hsl(${hue} 80% ${45 - (s.level * 2)}%), hsl(${hue} 75% ${30 - (s.level)}%))`;
      div.style.boxShadow = `0 6px 18px hsla(${hue} 60% 10% / ${0.12 + s.level * 0.03})`;
      div.style.color = s.level >= 3 ? '#fff' : '#111';
      // subtle scale-in with stagger
      div.style.transform = 'translateY(18px) scale(.98)';
      div.style.opacity = '0';
      heatmapEl.appendChild(div);
      setTimeout(() => {
        div.style.transition = 'transform .45s cubic-bezier(.2,.9,.2,1), opacity .45s ease';
        div.style.transform = 'translateY(0) scale(1)';
        div.style.opacity = '1';
      }, idx * 80);
    });
  }

  buildHeatmap();

  /* ---------------------------
     HERO smooth scroll helper
  --------------------------- */
  window.scrollToPortfolio = function () {
    const el = document.querySelector('#portfolio');
    if (!el) return window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    const top = el.getBoundingClientRect().top + window.scrollY - 80; // account for fixed nav
    window.scrollTo({ top, behavior: 'smooth' });
  };

  /* ---------------------------
     THEME SWITCHING
     - Insert a small theme toggle into the nav if not present
     - Toggles body.light-theme
  --------------------------- */
  const THEME_KEY = 'portfolio_theme_v1';
  const currentTheme = localStorage.getItem(THEME_KEY);

  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
  }

  // apply saved or default (dark)
  applyTheme(currentTheme === 'light' ? 'light' : 'dark');

  // create a toggle if not present
  let themeToggle = $('#theme-toggle');
  if (!themeToggle) {
    const nav = document.querySelector('.nav nav') || document.querySelector('.nav');
    if (nav) {
      themeToggle = document.createElement('button');
      themeToggle.id = 'theme-toggle';
      themeToggle.className = 'contact-btn';
      themeToggle.setAttribute('aria-label', 'Toggle theme');
      themeToggle.textContent = (document.body.classList.contains('light-theme')) ? 'Dark' : 'Light';
      // append to end of nav
      nav.appendChild(themeToggle);
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      document.body.classList.toggle('dark-theme', !isLight);
      localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
      themeToggle.textContent = isLight ? 'Dark' : 'Light';
    });
  }

  /* ---------------------------
     Small UX: remember last active filter
  --------------------------- */
  const FILTER_KEY = 'portfolio_filter_v1';
  const lastFilter = localStorage.getItem(FILTER_KEY) || 'all';
  const lastBtn = filterButtons.find(b => b.dataset.filter === lastFilter);
  if (lastBtn) lastBtn.click();

  filterButtons.forEach(b => {
    b.addEventListener('click', () => localStorage.setItem(FILTER_KEY, b.dataset.filter));
  });

  /* ---------------------------
     Accessibility & small helpers
  --------------------------- */
  // Make contact toggle keyboard accessible
  if (contactToggle) {
    contactToggle.setAttribute('aria-expanded', 'false');
    contactToggle.addEventListener('click', () => {
      const open = contactPanel.classList.contains('open');
      contactToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // small resize handler to rebuild heatmap layout if needed (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => buildHeatmap(), 250);
  });

  /* ---------------------------
     Init finished
  --------------------------- */
  // close any open panels on page start for tidy experience
  closeContactPanel();
});
