/* =============================================
   WORKFLOW.JS – Workflow selection page
   ============================================= */

'use strict';

(function initWorkflowPage() {

  // Read service from URL param and highlight card
  const serviceParam = window.getUrlParam('service');
  if (serviceParam) {
    const card = document.querySelector(`.workflow-card[data-service="${serviceParam}"]`);
    if (card) {
      card.style.boxShadow = 'var(--shadow-xl)';
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }

  // Keyboard accessibility: Enter/Space to navigate
  document.querySelectorAll('.workflow-card').forEach((card) => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const service = card.dataset.service;
        const btn = card.querySelector('.btn-workflow');
        if (btn) btn.click();
      }
    });
  });

  // Quick example chips → navigate to assistant with pre-filled query
  document.querySelectorAll('.example-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const query = chip.dataset.query;
      const service = chip.dataset.service || 'complaint';
      if (query) {
        const url = `assistant.html?service=${service}&query=${encodeURIComponent(query)}`;
        window.location.href = url;
      }
    });
  });

})();
