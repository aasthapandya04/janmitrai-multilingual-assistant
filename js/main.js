/* =============================================
   MAIN.JS – Shared utilities across all pages
   ============================================= */

'use strict';

// ── NAVBAR SCROLL EFFECT ─────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once
})();

// ── HAMBURGER MENU ───────────────────────────
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
})();

// ── TOAST NOTIFICATION ───────────────────────
window.showToast = function (message, duration = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
};

// ── GENERATE TICKET ID ───────────────────────
window.generateTicketId = function () {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `JM-${year}-${rand}`;
};

// ── FORMAT DATE ──────────────────────────────
window.formatDate = function (date) {
  return (date || new Date()).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// ── SCROLL ANIMATION (Intersection Observer) ─
(function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Observe cards, step items, etc.
  const selectors = [
    '.feature-card', '.step-item', '.benefit-item',
    '.scheme-card', '.student-card', '.guide-step',
    '.faq-item', '.contact-card', '.demo-card', '.doc-card',
    '.workflow-card', '.ticket-card'
  ];

  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
      observer.observe(el);
    });
  });

  // Add CSS rule for animate-in
  const style = document.createElement('style');
  style.textContent = '.animate-in { opacity: 1 !important; transform: none !important; }';
  document.head.appendChild(style);
})();

// ── SMOOTH SCROLL FOR ANCHOR LINKS ───────────
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 130; // navbar + tab nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── URL PARAM HELPER ─────────────────────────
window.getUrlParam = function (name) {
  return new URLSearchParams(window.location.search).get(name);
};

// ── LOCAL STORAGE HELPERS ────────────────────
window.storage = {
  get: (key) => {
    try { return JSON.parse(localStorage.getItem('janmitra_' + key)); }
    catch { return null; }
  },
  set: (key, value) => {
    try { localStorage.setItem('janmitra_' + key, JSON.stringify(value)); }
    catch { /* storage full */ }
  },
  push: (key, item, max = 10) => {
    const arr = window.storage.get(key) || [];
    arr.unshift(item);
    if (arr.length > max) arr.pop();
    window.storage.set(key, arr);
  }
};

// ── COPY TO CLIPBOARD ────────────────────────
window.copyToClipboard = function (text, successMsg = '✅ Copied!') {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => window.showToast(successMsg))
      .catch(() => window.showToast('⚠️ Copy failed'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    window.showToast(successMsg);
  }
};

// ── PRINT / PDF GENERATION ───────────────────
window.generatePDF = function (content, filename) {
  // Simple print-to-PDF implementation
  const printWin = window.open('', '_blank');
  if (!printWin) {
    window.showToast('⚠️ Please allow popups for PDF download');
    return;
  }
  printWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${filename}</title>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', Arial, sans-serif; padding: 40px; color: #111827; max-width: 700px; margin: 0 auto; }
        h1 { color: #FF6B00; margin-bottom: 8px; font-size: 1.5rem; }
        .hindi { font-family: 'Noto Sans Devanagari', sans-serif; line-height: 2; }
        p { line-height: 1.8; margin-bottom: 12px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 24px; }
        .subject { background: #FFF3E8; border-left: 4px solid #FF6B00; padding: 8px 12px; margin-bottom: 16px; }
        .ticket { background: #F0FFF0; padding: 8px 12px; border-radius: 4px; margin-top: 24px; font-size: 0.875rem; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      ${content}
      <script>window.onload = function() { window.print(); window.close(); }<\/script>
    </body>
    </html>
  `);
  printWin.document.close();
};

console.log('🤝 JanMitra AI v1.0 loaded');
