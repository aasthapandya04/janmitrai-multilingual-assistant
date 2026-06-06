/* =============================================
   RESULTS.JS – Results page logic
   Displays ticket info, complaint docs, PDF export
   ============================================= */

'use strict';

// ── MOCK DATA GENERATOR ───────────────────────
// Fallback data if no stored result exists
function getDefaultResult() {
  return {
    ticketId: window.generateTicketId(),
    category: 'Public Utilities',
    dept: 'Energy Department',
    priority: 'High',
    query: 'बिजली 3 दिनों से बंद है (Power outage for 3 days)',
    date: new Date().toISOString()
  };
}

// ── DEPT → HINDI MAP ──────────────────────────
const DEPT_HINDI = {
  'Energy Department': 'ऊर्जा विभाग',
  'Water Department': 'जल विभाग',
  'Roads & Transport': 'सड़क एवं परिवहन विभाग',
  'Health Department': 'स्वास्थ्य विभाग',
  'Municipal Corporation': 'नगर निगम',
  'Revenue Department': 'राजस्व विभाग',
  'Police Department': 'पुलिस विभाग',
  'Education Department': 'शिक्षा विभाग',
  'General Grievance Cell': 'सामान्य शिकायत प्रकोष्ठ'
};

const DEPT_HELPLINES = {
  'Energy Department': '1912',
  'Water Department': '1800-180-5678',
  'Roads & Transport': '1800-11-7788',
  'Health Department': '104',
  'Municipal Corporation': '14420',
  'Revenue Department': '1800-180-1551',
  'Police Department': '100',
  'Education Department': '1800-111-265',
  'General Grievance Cell': '1800-11-7800'
};

const DEPT_PORTALS = {
  'Energy Department': 'vidyutmitra.gov.in',
  'Water Department': 'jaljeevanmission.gov.in',
  'Roads & Transport': 'morth.nic.in',
  'Health Department': 'nhp.gov.in',
  'Municipal Corporation': 'pgportal.gov.in',
  'Revenue Department': 'dilrmp.gov.in',
  'Police Department': 'pgportal.gov.in',
  'Education Department': 'samagra.gov.in',
  'General Grievance Cell': 'pgportal.gov.in'
};

// ── COMPLAINT TEMPLATES ───────────────────────
function generateEnglishComplaint(result) {
  const date = new Date(result.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const category = result.category || 'Public Utilities';

  const templates = {
    'Energy Department': {
      subject: 'Complaint Regarding Continuous Power Outage',
      body: `Respected Sir/Madam,

I am writing to formally bring to your attention the continuous power outage that has been affecting our area. The situation has caused significant disruption to our daily lives.

The power supply to our locality has been completely interrupted. Despite multiple attempts to reach the helpline, no resolution has been provided. The prolonged outage has affected households, small businesses, and medical equipment users in the area.

Nature of Problem: ${result.query}

I respectfully request that you treat this matter with utmost urgency and restore the power supply at the earliest. I also request a formal acknowledgment of this complaint and an expected timeline for resolution.

Thanking you in anticipation of prompt action.`
    },
    'Water Department': {
      subject: 'Complaint Regarding Disruption in Water Supply',
      body: `Respected Sir/Madam,

I am writing to formally report the complete disruption in water supply to our area. This issue has been causing severe inconvenience to all residents in the locality.

The water supply has been completely disrupted and has not been restored despite multiple follow-ups. This has severely impacted the daily needs of households, especially for drinking, cooking, and sanitation.

Nature of Problem: ${result.query}

I request immediate attention and restoration of water supply, along with a formal response acknowledging this complaint.

Thanking you in anticipation of prompt action.`
    }
  };

  const template = templates[result.dept] || {
    subject: `Complaint Regarding ${category} Issue`,
    body: `Respected Sir/Madam,

I am writing to formally lodge a complaint regarding the following issue that has been affecting the residents of our area:

Nature of Problem: ${result.query}

This matter has been causing significant inconvenience and requires immediate attention from the concerned authorities. Despite several attempts to resolve this issue through informal channels, the problem persists.

I respectfully request that you take immediate action to address this issue and provide a formal acknowledgment along with the expected timeline for resolution.

Thanking you in anticipation of your prompt action.`
  };

  return {
    subject: template.subject,
    body: template.body,
    date
  };
}

function generateHindiComplaint(result) {
  const date = new Date(result.date).toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const hindiDept = DEPT_HINDI[result.dept] || 'संबंधित विभाग';

  const templates = {
    'Energy Department': {
      subject: 'निरंतर बिजली कटौती के संबंध में शिकायत',
      body: `माननीय महोदय/महोदया,

मैं आपका ध्यान हमारे क्षेत्र में हो रही निरंतर बिजली कटौती की ओर आकर्षित करना चाहता/चाहती हूँ। यह स्थिति हमारे दैनिक जीवन में गंभीर व्यवधान उत्पन्न कर रही है।

हमारे मोहल्ले में बिजली की आपूर्ति पूरी तरह बाधित है। हेल्पलाइन पर कई बार संपर्क करने के बावजूद कोई समाधान नहीं मिला। इस लंबी कटौती से घरेलू उपभोक्ता, छोटे व्यापारी और चिकित्सा उपकरण उपयोगकर्ता गंभीर रूप से प्रभावित हैं।

समस्या का विवरण: ${result.query}

मैं सविनय निवेदन करता/करती हूँ कि आप इस मामले को अत्यंत प्राथमिकता से लें और शीघ्रातिशीघ्र बिजली आपूर्ति बहाल करें। साथ ही, इस शिकायत की औपचारिक पावती और समाधान की अपेक्षित समय-सीमा का अनुरोध करता/करती हूँ।

त्वरित कार्रवाई की प्रत्याशा में धन्यवाद।`
    }
  };

  const template = templates[result.dept] || {
    subject: `${hindiDept} संबंधी शिकायत`,
    body: `माननीय महोदय/महोदया,

मैं आपका ध्यान हमारे क्षेत्र में हो रही निम्नलिखित समस्या की ओर आकर्षित करना चाहता/चाहती हूँ जो हम नागरिकों के लिए अत्यंत कष्टकारी है।

समस्या का विवरण: ${result.query}

यह मामला कई दिनों से लंबित है और अनौपचारिक माध्यमों से समाधान के अनेक प्रयासों के बावजूद समस्या जस की तस बनी हुई है।

मैं सविनय निवेदन करता/करती हूँ कि आप इस समस्या के समाधान हेतु तत्काल उचित कदम उठाएं तथा इस शिकायत की औपचारिक पावती के साथ-साथ समाधान की अपेक्षित समय-सीमा से अवगत कराएं।

धन्यवाद।`
  };

  return { subject: template.subject, body: template.body, date };
}

// ── INIT RESULTS PAGE ─────────────────────────
function init() {
  const result = window.storage.get('lastResult') || getDefaultResult();

  // Populate Ticket Card
  populateTicketCard(result);

  // Populate English Complaint
  populateEnglishComplaint(result);

  // Populate Hindi Complaint
  populateHindiComplaint(result);

  // Populate Summary
  populateSummary(result);

  // Setup Tabs
  setupTabs();

  // Setup Actions
  setupActions(result);

  // Animate ticket
  animateTicketReveal();
}

function populateTicketCard(result) {
  setText('ticketId', result.ticketId);
  setText('ticketCategory', result.category);
  setText('ticketDept', result.dept);
  setText('ticketDate', window.formatDate(result.date ? new Date(result.date) : new Date()));

  const priorityEl = document.getElementById('ticketPriority');
  if (priorityEl) {
    const pClass = result.priority === 'High' ? 'priority-high' : result.priority === 'Medium' ? 'priority-medium' : 'priority-low';
    const emoji = result.priority === 'High' ? '🔴' : result.priority === 'Medium' ? '🟡' : '🟢';
    priorityEl.innerHTML = `<span class="priority-badge ${pClass}">${emoji} ${result.priority}</span>`;
  }
}

function populateEnglishComplaint(result) {
  const eng = generateEnglishComplaint(result);
  const hindiDept = DEPT_HINDI[result.dept] || result.dept;

  setText('engDeptName', result.dept);
  setText('engDate', eng.date);
  setText('engSubject', eng.subject);

  const body = document.getElementById('engBody');
  if (body) {
    body.innerHTML = eng.body.split('\n\n').map(p => `<p>${p}</p>`).join('');
  }
}

function populateHindiComplaint(result) {
  const hin = generateHindiComplaint(result);
  const hindiDept = DEPT_HINDI[result.dept] || result.dept;

  setText('hinDeptName', hindiDept);
  setText('hinDate', hin.date);
  setText('hinSubject', hin.subject);

  const body = document.getElementById('hinBody');
  if (body) {
    body.innerHTML = hin.body.split('\n\n').map(p => `<p>${p}</p>`).join('');
    body.classList.add('devanagari');
  }
}

function populateSummary(result) {
  setText('sumDept', result.dept);
  setText('sumCategory', result.category);
  setText('sumTicketId', result.ticketId);

  // Update helpline and portal
  const helplineEl = document.querySelector('#tabContentSummary .summary-item:nth-child(3) strong');
  const portalEl = document.querySelector('#tabContentSummary .summary-item:nth-child(4) a');

  if (helplineEl) helplineEl.textContent = DEPT_HELPLINES[result.dept] || '1916';
  if (portalEl) {
    const portal = DEPT_PORTALS[result.dept] || 'pgportal.gov.in';
    portalEl.textContent = portal;
    portalEl.href = 'https://' + portal;
  }
}

// ── TABS ──────────────────────────────────────
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;

      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const content = document.getElementById(`tabContent${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
      if (content) content.classList.add('active');
    });
  });
}

// ── ACTIONS ───────────────────────────────────
function setupActions(result) {
  // Copy Ticket ID
  const copyTicketBtn = document.getElementById('copyTicketBtn');
  if (copyTicketBtn) {
    copyTicketBtn.addEventListener('click', () => {
      window.copyToClipboard(result.ticketId, `✅ Ticket ID ${result.ticketId} copied!`);
    });
  }

  // Copy English
  const copyEnglishBtn = document.getElementById('copyEnglishBtn');
  if (copyEnglishBtn) {
    copyEnglishBtn.addEventListener('click', () => {
      const body = document.getElementById('engBody');
      if (body) window.copyToClipboard(body.innerText, '✅ English complaint copied!');
    });
  }

  // Copy Hindi
  const copyHindiBtn = document.getElementById('copyHindiBtn');
  if (copyHindiBtn) {
    copyHindiBtn.addEventListener('click', () => {
      const body = document.getElementById('hinBody');
      if (body) window.copyToClipboard(body.innerText, '✅ Hindi complaint copied!');
    });
  }

  // Download English PDF
  const downloadEnglishBtn = document.getElementById('downloadEnglishBtn');
  if (downloadEnglishBtn) {
    downloadEnglishBtn.addEventListener('click', () => {
      downloadEnglishPDF(result);
    });
  }

  // Download Hindi PDF
  const downloadHindiBtn = document.getElementById('downloadHindiBtn');
  if (downloadHindiBtn) {
    downloadHindiBtn.addEventListener('click', () => {
      downloadHindiPDF(result);
    });
  }

  // Download All
  const downloadAllBtn = document.getElementById('downloadAllBtn');
  if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', () => {
      downloadEnglishPDF(result);
      setTimeout(() => downloadHindiPDF(result), 1000);
      window.showToast('⬇️ Downloading both PDF files...');
    });
  }

  // Share Ticket
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'JanMitra AI – Complaint Filed',
        text: `I filed a complaint using JanMitra AI. Ticket ID: ${result.ticketId}`,
        url: window.location.href
      };
      if (navigator.share) {
        try { await navigator.share(shareData); }
        catch { window.copyToClipboard(`Ticket ID: ${result.ticketId}`, '✅ Ticket ID copied for sharing!'); }
      } else {
        window.copyToClipboard(`Ticket ID: ${result.ticketId}`, '✅ Ticket ID copied for sharing!');
      }
    });
  }
}

function downloadEnglishPDF(result) {
  const eng = generateEnglishComplaint(result);
  const content = `
    <h1>JanMitra AI – Complaint Letter</h1>
    <p style="color: #6B7280; font-size: 0.875rem;">Ticket ID: <strong style="color: #FF6B00;">${result.ticketId}</strong> | Generated: ${eng.date}</p>
    <hr style="margin: 16px 0; border-color: #E5E7EB;">
    <div class="header">
      <div>
        <strong>To,</strong><br>
        The Officer-in-Charge,<br>
        ${result.dept}<br>
        Government of India
      </div>
      <div style="text-align:right;">Date: ${eng.date}</div>
    </div>
    <div class="subject"><strong>Subject:</strong> ${eng.subject}</div>
    ${eng.body.split('\n\n').map(p => `<p>${p}</p>`).join('')}
    <div class="ticket">
      Ticket Reference: ${result.ticketId} | Department: ${result.dept} | Priority: ${result.priority}
    </div>
  `;
  window.generatePDF(content, `JanMitra_Complaint_${result.ticketId}_English.pdf`);
  window.showToast('📄 Opening English PDF for download...');
}

function downloadHindiPDF(result) {
  const hin = generateHindiComplaint(result);
  const hindiDept = DEPT_HINDI[result.dept] || result.dept;
  const content = `
    <h1>JanMitra AI – शिकायत पत्र</h1>
    <p style="color: #6B7280; font-size: 0.875rem;">टिकट ID: <strong style="color: #FF6B00;">${result.ticketId}</strong> | दिनांक: ${hin.date}</p>
    <hr style="margin: 16px 0; border-color: #E5E7EB;">
    <div class="hindi header">
      <div>
        <strong>सेवा में,</strong><br>
        अधिकारी महोदय,<br>
        ${hindiDept}<br>
        भारत सरकार
      </div>
      <div style="text-align:right;">दिनांक: ${hin.date}</div>
    </div>
    <div class="hindi subject"><strong>विषय:</strong> ${hin.subject}</div>
    <div class="hindi">
      ${hin.body.split('\n\n').map(p => `<p>${p}</p>`).join('')}
    </div>
    <div class="ticket">
      टिकट संख्या: ${result.ticketId} | विभाग: ${hindiDept} | प्राथमिकता: ${result.priority}
    </div>
  `;
  window.generatePDF(content, `JanMitra_Shikayat_${result.ticketId}_Hindi.pdf`);
  window.showToast('📄 Opening Hindi PDF for download...');
}

// ── ANIMATION ─────────────────────────────────
function animateTicketReveal() {
  const banner = document.getElementById('successBanner');
  const ticket = document.getElementById('ticketCard');

  if (banner) {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-20px)';
    banner.style.transition = 'all 0.5s ease';
    requestAnimationFrame(() => {
      setTimeout(() => {
        banner.style.opacity = '1';
        banner.style.transform = 'translateY(0)';
      }, 100);
    });
  }

  if (ticket) {
    ticket.style.opacity = '0';
    ticket.style.transition = 'all 0.5s ease 0.3s';
    requestAnimationFrame(() => {
      setTimeout(() => {
        ticket.style.opacity = '1';
      }, 100);
    });
  }
}

// ── UTILITIES ─────────────────────────────────
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ── START ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
