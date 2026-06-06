/* =============================================
   RESOURCES.JS – Resources page interactions
   FAQ accordion, search, tab highlighting
   ============================================= */

'use strict';

// ── FAQ ACCORDION ─────────────────────────────
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach((i) => {
        i.classList.remove('open');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// ── RESOURCE SEARCH ───────────────────────────
(function initSearch() {
  const searchInput = document.getElementById('resourceSearch');
  const searchBtn = document.getElementById('resourceSearchBtn');

  if (!searchInput) return;

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      window.showToast('⚠️ Please enter a search term');
      return;
    }

    // Search through FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    let found = 0;
    faqItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.classList.add('open');
        found++;
      }
    });

    // Search through scheme cards
    document.querySelectorAll('.scheme-card').forEach((card) => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.style.boxShadow = '0 0 0 3px var(--saffron)';
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => { card.style.boxShadow = ''; }, 3000);
        found++;
      }
    });

    if (found > 0) {
      window.showToast(`✅ Found ${found} result${found > 1 ? 's' : ''} for "${query}"`);
    } else {
      window.showToast(`ℹ️ No results for "${query}". Try asking our AI!`);
    }
  }

  if (searchBtn) searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performSearch();
  });
})();

// ── ACTIVE TAB HIGHLIGHTING ON SCROLL ─────────
(function initScrollSpy() {
  const sections = document.querySelectorAll('.resource-section');
  const tabs = document.querySelectorAll('.res-tab');
  if (!sections.length || !tabs.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tabs.forEach((tab) => {
            tab.classList.toggle('active', tab.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
})();

// ── DEMO VIDEO PLAY (mock) ────────────────────
(function initDemoVideos() {
  document.querySelectorAll('.demo-card').forEach((card) => {
    card.addEventListener('click', () => {
      window.showToast('🎬 Video demo coming soon! Use the live assistant instead.');
    });
  });
})();

// ── SCHEME CARDS: ASK AI LINKS ────────────────
// These are already handled via href in HTML

// ── SCROLL TO SECTION from URL hash ──────────
(function initHashScroll() {
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        const offset = 130;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 500);
  }
})();
