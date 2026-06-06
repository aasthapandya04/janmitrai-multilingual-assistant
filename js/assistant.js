/* =============================================
   ASSISTANT.JS – JanMitra AI with Live Gemini API
   Model: gemini-2.5-flash (via REST API)
   ============================================= */

'use strict';

const GEMINI_MODEL    = 'gemini-2.5-flash';
const GEMINI_API_KEY  = 'YOUR_KEY';
const GEMINI_ENDPOINT = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;

// ── SERVICE CONFIG ────────────────────────────
const SERVICE_CONFIG = {
  complaint: {
    svgPath: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    title: 'File a Complaint',
    desc: 'Describe your problem. Gemini AI will generate a professional bilingual complaint.',
    placeholder: 'Apni samasya yahan likhein... (e.g., Mere ghar ki bijli 3 din se nahi hai)',
    chips: ['Power outage in my area', 'Water supply disrupted', 'Road needs repair'],
    examples: ['Bijli 3 din se nahi hai', 'Paani supply band hai', 'Sadak mein gadhde hain', 'Hospital mein problem', 'Ration card issue']
  },
  form: {
    svgPath: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>',
    title: 'Government Form Help',
    desc: 'Tell me which form you need help with. AI will guide you step by step.',
    placeholder: 'Kaunsa form bharna hai? (e.g., Ration card form, Income certificate form...)',
    chips: ['Ration Card form help', 'Income Certificate', 'Caste Certificate'],
    examples: ['Ration card form', 'Income certificate', 'Caste certificate', 'Pension form', 'PM Kisan registration']
  },
  policy: {
    svgPath: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>',
    title: 'Policy Explainer',
    desc: 'Ask about any government scheme, policy, or regulation in simple language.',
    placeholder: 'Koi bhi scheme ya policy ke baare mein poochein... (e.g., PM Kisan kya hai?)',
    chips: ['PM Kisan Samman Nidhi', 'Ayushman Bharat scheme', 'Ujjwala Yojana'],
    examples: ['PM Kisan Yojana', 'Ayushman Bharat', 'Ujjwala Yojana', 'Jan Dhan account', 'Mudra Loan']
  },
  support: {
    svgPath: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    title: 'Support Routing',
    desc: 'Describe your issue and AI will find the right department and contact information.',
    placeholder: 'Apni problem describe karein... (AI sahi department dhundh dega)',
    chips: ['Electricity complaint — who to call', 'Water department contact', 'Road repair authority'],
    examples: ['Electricity complaint', 'Water department', 'Road authority', 'Medical help', 'Grievance portal']
  }
};

// ── GEMINI SYSTEM PROMPTS ─────────────────────
function getSystemPrompt(service) {
  const base = `You are JanMitra AI, an expert multilingual government services assistant for Indian citizens. 
You understand Hindi, Hinglish (Hindi written in Roman script), and English. 
Always respond in the same language the user writes in — if they write Hindi/Hinglish, respond in Hinglish with some Hindi.
Be professional, helpful, warm, and concise.
Do NOT use emojis in your responses.
Use plain text formatting. You may use line breaks and dashes for structure.`;

  const servicePrompts = {
    complaint: `${base}

Your primary role: Help users file government complaints.
When a user describes their problem:
1. Identify the correct government department (Energy, Water, Roads, Health, Municipal, Revenue, Police, Education, etc.)
2. Assess priority (High / Medium / Low) based on urgency
3. Generate a SHORT structured response with:
   - Department identified
   - Priority level  
   - A brief English complaint draft (formal, 3-4 sentences)
   - A brief Hindi complaint draft (formal, 3-4 sentences in Devanagari)
   - Suggest a ticket ID: JM-2024-XXXXX (random 5 digits)
   - Helpline number if applicable

Format your response clearly with labeled sections like:
DEPARTMENT: ...
PRIORITY: ...
ENGLISH DRAFT:
...
HINDI DRAFT:
...
TICKET ID: ...
HELPLINE: ...`,

    form: `${base}

Your primary role: Help users fill and understand government forms.
When a user asks about a form:
1. Identify which form/document they need
2. List required documents clearly
3. Explain each key field in simple language
4. Explain where to submit it (online portal URL if applicable)
5. Give a step-by-step guide

Be concise — use numbered steps and bullet points (with - dashes, no emojis).`,

    policy: `${base}

Your primary role: Explain government policies, schemes, and regulations simply.
When a user asks about a policy or scheme:
1. State what the scheme/policy is in 1-2 sentences
2. Who is eligible (criteria)
3. How to apply (steps)
4. Benefits / amount
5. Important documents needed
6. Official portal / helpline

Use clear section headers and be conversational. Keep it under 300 words.`,

    support: `${base}

Your primary role: Route users to the correct government department/authority.
When a user describes their problem:
1. Identify the problem type
2. Name the exact department to contact
3. Provide helpline number
4. Provide online portal if available
5. Suggest escalation path (what to do if not resolved)
6. Estimate typical resolution time

Be direct and practical. Format clearly.`
  };

  return servicePrompts[service] || base;
}

// ── STATE ─────────────────────────────────────
let currentService = 'complaint';
let currentLang    = 'hinglish';
let geminiApiKey   = GEMINI_API_KEY; // Pre-configured
let isProcessing   = false;
let conversationHistory = []; // For multi-turn context

// ── INIT ──────────────────────────────────────
function init() {
  // Use backend proxy for Gemini requests.
  updateApiKeyStatus(true);

  // Load service from URL
  currentService = window.getUrlParam('service') || 'complaint';

  // Setup everything
  setupServiceSelector();
  setupLanguageSelector();
  setupExamples();
  setupInput();
  setupVoiceInput();
  updateServiceUI();
  loadHistory();

  // Pre-fill query from URL
  const q = window.getUrlParam('query');
  if (q) {
    const input = document.getElementById('mainInput');
    if (input) { input.value = decodeURIComponent(q); updateCharCount(); }
  }
}

// ── API KEY MANAGEMENT ────────────────────────
// API key is pre-configured — no user input required
function setupApiKey() {
  // Key is hardcoded; just ensure connected status is shown
  updateApiKeyStatus(true);
}

function updateApiKeyStatus(connected) {
  const status = document.getElementById('apiKeyStatus');
  const label  = document.getElementById('modelStatusLabel');
  if (status) {
    if (connected) {
      status.textContent = 'Connected via backend proxy';
      status.classList.add('connected');
    } else {
      status.textContent = 'Backend proxy unavailable. Please check the server.';
      status.classList.remove('connected');
    }
  }
  if (label) label.textContent = connected ? 'Gemini Live' : 'No API Key';
}

// ── CALL GEMINI API ───────────────────────────
async function callGemini(userMessage) {
  const systemPrompt = getSystemPrompt(currentService);

  // Build conversation array for multi-turn
  const contents = [];

  // Add history (last 6 turns max for token efficiency)
  const recentHistory = conversationHistory.slice(-6);
  recentHistory.forEach(turn => {
    contents.push({ role: turn.role, parts: [{ text: turn.text }] });
  });

  // Add current message
  const fullMessage = `[Service: ${currentService.toUpperCase()} | Language preference: ${currentLang}]

${userMessage}`;

  contents.push({ role: 'user', parts: [{ text: fullMessage }] });

  const payload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
    ]
  };

  const response = await fetch(GEMINI_ENDPOINT(geminiApiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || `HTTP ${response.status}`;
    if (response.status === 400 && msg.includes('API key')) {
      throw new Error('Invalid API key. Please check your Gemini API key in the sidebar.');
    }
    if (response.status === 429) {
      throw new Error('Rate limit reached. Please wait a moment and try again.');
    }
    throw new Error(`Gemini API error: ${msg}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error('No response received from Gemini. Please try again.');

  // Save to conversation history
  conversationHistory.push({ role: 'user', text: userMessage });
  conversationHistory.push({ role: 'model', text });

  // Keep history manageable
  if (conversationHistory.length > 20) conversationHistory = conversationHistory.slice(-16);

  return text;
}

// ── SERVICE SELECTOR ──────────────────────────
function setupServiceSelector() {
  document.querySelectorAll('.service-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      currentService = pill.dataset.service;
      conversationHistory = []; // Reset context on service change
      document.querySelectorAll('.service-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      updateServiceUI();
    });
  });

  // Activate from URL
  const pill = document.querySelector(`.service-pill[data-service="${currentService}"]`);
  if (pill) { document.querySelectorAll('.service-pill').forEach(p => p.classList.remove('active')); pill.classList.add('active'); }
}

// ── LANGUAGE SELECTOR ─────────────────────────
function setupLanguageSelector() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ── UPDATE SERVICE UI ─────────────────────────
function updateServiceUI() {
  const cfg = SERVICE_CONFIG[currentService];
  if (!cfg) return;

  const bannerIcon  = document.getElementById('bannerIcon');
  const bannerTitle = document.getElementById('bannerTitle');
  const bannerDesc  = document.getElementById('bannerDesc');
  const mainInput   = document.getElementById('mainInput');

  if (bannerIcon)  bannerIcon.innerHTML  = `<svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5">${cfg.svgPath}</svg>`;
  if (bannerTitle) bannerTitle.textContent = cfg.title;
  if (bannerDesc)  bannerDesc.textContent  = cfg.desc;
  if (mainInput)   mainInput.placeholder   = cfg.placeholder;

  // Update sidebar examples
  const exList = document.getElementById('exampleList');
  if (exList) {
    exList.innerHTML = cfg.examples.map((ex, i) =>
      `<button class="sidebar-example-btn" id="sex${i}">${ex}</button>`
    ).join('');
    setupSidebarExamples();
  }

  // Update quick chips
  const qc = document.getElementById('quickChips');
  if (qc) {
    qc.innerHTML = cfg.chips.map((c, i) =>
      `<button class="quick-chip" id="sqc${i}">${c}</button>`
    ).join('');
    setupQuickChips();
  }
}

// ── EXAMPLES ──────────────────────────────────
function setupExamples() { setupSidebarExamples(); setupQuickChips(); }

function setupSidebarExamples() {
  document.querySelectorAll('.sidebar-example-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById('mainInput');
      if (input) { input.value = btn.textContent.trim(); input.focus(); updateCharCount(); }
    });
  });
}

function setupQuickChips() {
  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const input = document.getElementById('mainInput');
      if (input) { input.value = chip.textContent.trim(); input.focus(); updateCharCount(); }
    });
  });
}

// ── INPUT HANDLING ────────────────────────────
function setupInput() {
  const input    = document.getElementById('mainInput');
  const submitBtn = document.getElementById('submitBtn');
  const clearBtn  = document.getElementById('clearBtn');

  if (input) {
    input.addEventListener('input', updateCharCount);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
    });
  }
  if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
  if (clearBtn)  clearBtn.addEventListener('click', () => {
    const input = document.getElementById('mainInput');
    if (input) { input.value = ''; updateCharCount(); input.focus(); }
  });
}

function updateCharCount() {
  const input = document.getElementById('mainInput');
  const cc    = document.getElementById('charCount');
  if (input && cc) {
    const n = input.value.length;
    cc.textContent = `${n} / 2000`;
    cc.style.color = n > 1800 ? 'var(--error)' : '';
  }
}

// ── SUBMIT ────────────────────────────────────
async function handleSubmit() {
  if (isProcessing) return;

  const input = document.getElementById('mainInput');
  if (!input) return;

  const query = input.value.trim();
  if (!query) {
    window.showToast('Please enter your complaint or query first.');
    input.focus();
    return;
  }

  // Lock UI
  isProcessing = true;
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) submitBtn.disabled = true;

  // Show user message
  appendMessage('user', query);
  input.value = '';
  updateCharCount();

  // Save history
  saveToHistory(query);

  // Show typing
  showTyping(true);

  try {
    const aiResponse = await callGemini(query);
    showTyping(false);
    appendMessage('ai', formatResponse(aiResponse));

    // If complaint service and response looks like a full complaint, offer results page
    if (currentService === 'complaint' && aiResponse.includes('TICKET ID')) {
      const ticketMatch = aiResponse.match(/JM-\d{4}-\d{5}/);
      const deptMatch   = aiResponse.match(/DEPARTMENT:\s*(.+)/i);
      const priMatch    = aiResponse.match(/PRIORITY:\s*(.+)/i);

      if (ticketMatch) {
        const ticketId = ticketMatch[0];
        const dept = deptMatch ? deptMatch[1].trim() : 'General Grievance';
        const priority = priMatch ? priMatch[1].trim() : 'Medium';

        window.storage.set('lastResult', {
          ticketId,
          category: getCategoryFromDept(dept),
          dept,
          priority,
          query,
          rawResponse: aiResponse,
          date: new Date().toISOString()
        });

        setTimeout(() => {
          appendMessage('ai', `<p>Your complaint document is ready. <a href="results.html" style="color:var(--gold-dark);font-weight:600;text-decoration:underline;">View full results &rarr;</a></p>`);
        }, 800);
      }
    }
  } catch (err) {
    showTyping(false);
    appendMessage('ai', `<p style="color:var(--error)"><strong>Error:</strong> ${escapeHtml(err.message)}</p><p>Please check your API key and try again.</p>`);
  } finally {
    isProcessing = false;
    if (submitBtn) submitBtn.disabled = false;
  }
}

// ── FORMAT GEMINI RESPONSE ────────────────────
function formatResponse(text) {
  // Convert labeled sections to styled HTML
  const escaped = escapeHtml(text);
  const formatted = escaped
    // Bold section labels like DEPARTMENT:, PRIORITY:, etc.
    .replace(/^(DEPARTMENT|PRIORITY|TICKET ID|HELPLINE|ENGLISH DRAFT|HINDI DRAFT|CATEGORY|ESCALATION|OFFICE HOURS|PORTAL):\s*/gim,
      (_, label) => `<strong style="color:var(--gold-dark);font-size:0.78rem;letter-spacing:0.08em;text-transform:uppercase;">${label}: </strong>`)
    // Convert line breaks
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br />');

  return `<p>${formatted}</p>`;
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

// ── APPEND MESSAGE ────────────────────────────
function appendMessage(type, htmlContent) {
  const chatWindow = document.getElementById('chatWindow');
  if (!chatWindow) return;

  const svgUser = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--navy)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  const svgAI   = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--gold)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${type === 'user' ? 'user-message' : 'ai-message'}`;
  msgDiv.innerHTML = `
    <div class="msg-avatar">${type === 'user' ? svgUser : svgAI}</div>
    <div class="msg-bubble ${type === 'user' ? 'user-bubble' : 'ai-bubble'}">${htmlContent}</div>
  `;

  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msgDiv;
}

// ── TYPING INDICATOR ──────────────────────────
function showTyping(show) {
  const ind = document.getElementById('typingIndicator');
  if (ind) {
    ind.style.display = show ? 'flex' : 'none';
    if (show) {
      const cw = document.getElementById('chatWindow');
      if (cw) cw.scrollTop = cw.scrollHeight;
    }
  }
}

// ── VOICE INPUT ───────────────────────────────
function setupVoiceInput() {
  const voiceBtn       = document.getElementById('voiceBtn');
  const voiceModal     = document.getElementById('voiceModal');
  const stopVoiceBtn   = document.getElementById('stopVoiceBtn');
  const voiceTranscript = document.getElementById('voiceTranscript');
  const voiceHint      = document.getElementById('voiceHint');
  const mainInput      = document.getElementById('mainInput');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (voiceHint) voiceHint.textContent = 'Voice input: Chrome/Edge only';
    if (voiceBtn) voiceBtn.addEventListener('click', () => window.showToast('Voice input requires Chrome or Edge.'));
    return;
  }

  if (voiceHint) voiceHint.textContent = 'Mic icon for voice input';

  let recognition = null;
  let listening    = false;

  function startVoice() {
    if (listening) return;
    recognition = new SpeechRecognition();
    recognition.lang = currentLang === 'english' ? 'en-IN' : 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    if (voiceModal) voiceModal.style.display = 'flex';
    listening = true;

    recognition.onresult = e => {
      let t = '';
      for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
      if (voiceTranscript) voiceTranscript.textContent = t;
      if (e.results[e.results.length - 1].isFinal && mainInput) {
        mainInput.value = t;
        updateCharCount();
      }
    };
    recognition.onerror = e => { window.showToast('Voice error: ' + e.error); closeVoice(); };
    recognition.onend   = closeVoice;
    recognition.start();
  }

  function closeVoice() {
    listening = false;
    if (voiceModal) voiceModal.style.display = 'none';
    if (voiceTranscript) voiceTranscript.textContent = 'Speak your complaint in Hindi or English.';
  }

  if (voiceBtn) voiceBtn.addEventListener('click', startVoice);
  if (stopVoiceBtn) stopVoiceBtn.addEventListener('click', () => { if (recognition) recognition.stop(); closeVoice(); });
  if (voiceModal) voiceModal.addEventListener('click', e => { if (e.target === voiceModal) { if (recognition) recognition.stop(); closeVoice(); } });
}

// ── HISTORY ───────────────────────────────────
function saveToHistory(query) {
  window.storage.push('history', { query: query.substring(0, 80), service: currentService, time: new Date().toISOString() });
  loadHistory();
}

function loadHistory() {
  const hl = document.getElementById('historyList');
  if (!hl) return;
  const history = window.storage.get('history') || [];
  if (!history.length) { hl.innerHTML = '<div class="history-empty">No recent queries</div>'; return; }
  hl.innerHTML = history.slice(0, 6).map((item, i) =>
    `<div class="history-item" data-idx="${i}">${item.query}</div>`
  ).join('');
  hl.querySelectorAll('.history-item').forEach((el, i) => {
    el.addEventListener('click', () => {
      const inp = document.getElementById('mainInput');
      if (inp && history[i]) { inp.value = history[i].query; updateCharCount(); inp.focus(); }
    });
  });
}

// ── HELPERS ───────────────────────────────────
function getCategoryFromDept(dept) {
  const m = { 'Energy': 'Public Utilities', 'Water': 'Public Utilities', 'Roads': 'Infrastructure', 'Health': 'Healthcare', 'Municipal': 'Municipal Services', 'Revenue': 'Revenue & Land', 'Police': 'Law & Order', 'Education': 'Education' };
  for (const [k, v] of Object.entries(m)) { if (dept.includes(k)) return v; }
  return 'General Services';
}

// ── START ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
