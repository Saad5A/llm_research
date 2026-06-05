// =============================================================================
// guide.js — Phase 6: decision flow + Claude-powered Q&A
// =============================================================================

// ── Decision flow ────────────────────────────────────────────────────────────

const FLOW_STEPS = [
  {
    id: 'q1',
    question: 'What is your primary goal?',
    options: [
      { label: 'Understand / classify text',          next: 'r-bert'   },
      { label: 'Generate text or have a conversation',next: 'q2'       },
      { label: 'Research / build open-source product', next: 'r-llama' },
    ],
  },
  {
    id: 'q2',
    question: 'Do you need to self-host or fine-tune on private data?',
    options: [
      { label: 'Yes — full control is critical', next: 'r-llama'  },
      { label: 'No — API access is fine',        next: 'r-claude' },
    ],
  },
];

const RESULTS = {
  'r-bert': {
    model: 'BERT',
    color: 'var(--bert)',
    title: 'Use BERT',
    body: 'Your task is about understanding, labelling, or extracting from text — not generating it. BERT's bidirectional encoder excels here: sentiment analysis, NER, document classification, semantic search, extractive QA. It\'s small, fast, and proven in production. Fine-tune a pre-trained checkpoint on HuggingFace in minutes.',
  },
  'r-claude': {
    model: 'Claude',
    color: 'var(--claude)',
    title: 'Use Claude',
    body: 'You need high-quality generation, reasoning, or instruction-following — and you\'re comfortable calling an API. Claude\'s Constitutional AI training makes it reliable and safe out-of-the-box, with a 200K token context window ideal for long documents, code review, complex analysis, and research assistance.',
  },
  'r-llama': {
    model: 'LLaMA',
    color: 'var(--llama)',
    title: 'Use LLaMA',
    body: 'You want open weights — the ability to inspect, fine-tune, and deploy the model entirely on your own infrastructure. LLaMA 3 (8B–405B) runs on consumer or cloud hardware. Ideal for domain-specific chatbots, RAG pipelines, research experiments, and any product where data privacy or customisation are non-negotiable.',
  },
};

let flowStep = 'q1';

export function initGuide() {
  renderFlowStep('q1');
}

function renderFlowStep(stepId) {
  flowStep = stepId;
  const container = document.getElementById('flowStep');
  if (!container) return;

  if (stepId.startsWith('r-')) {
    const result = RESULTS[stepId];
    container.innerHTML = `
      <div class="flow-result visible" style="border-left: 3px solid ${result.color}">
        <strong style="color:${result.color}">${result.title}</strong>
        ${result.body}
        <button class="mode-btn" style="margin-top:1rem" onclick="resetFlow()">↩ Start over</button>
      </div>`;
    return;
  }

  const step = FLOW_STEPS.find(s => s.id === stepId);
  if (!step) return;

  container.innerHTML = `
    <div class="flow-q">${step.question}</div>
    <div class="flow-options">
      ${step.options.map(opt => `
        <button class="flow-opt" onclick="advanceFlow('${opt.next}')">${opt.label}</button>
      `).join('')}
    </div>`;
}

export function advanceFlow(next) {
  renderFlowStep(next);
}

export function resetFlow() {
  renderFlowStep('q1');
}

window.advanceFlow = advanceFlow;
window.resetFlow   = resetFlow;

// ── Claude-powered Q&A ───────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a concise, expert research assistant embedded in a guided study about three AI models: BERT, Claude, and LLaMA. 

Your role: answer questions about these three models only — their architecture, training, benchmarks, use cases, and differences. Stay factual, accessible, and direct. Keep answers to 3–5 sentences unless a longer explanation is genuinely needed. Use plain language — assume the reader is technically curious but not yet an expert.

If asked about anything unrelated to these three models or AI/ML fundamentals, politely redirect.`;

export async function sendQA() {
  const input  = document.getElementById('qaInput');
  const msgs   = document.getElementById('qaMessages');
  const btn    = document.getElementById('qaSend');
  if (!input || !msgs || !btn) return;

  const userText = input.value.trim();
  if (!userText) return;

  // Render user message
  msgs.innerHTML += `<div class="qa-msg user">${escapeHTML(userText)}</div>`;
  input.value = '';
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>thinking';
  msgs.scrollTop = msgs.scrollHeight;

  // Add typing indicator
  const typingId = 'typing-' + Date.now();
  msgs.innerHTML += `<div class="qa-msg assistant" id="${typingId}" style="opacity:0.5">…</div>`;
  msgs.scrollTop = msgs.scrollHeight;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system:     SYSTEM_PROMPT,
        messages:   [{ role: 'user', content: userText }],
      }),
    });

    const data   = await response.json();
    const answer = data.content?.map(b => b.text || '').join('') || 'Sorry, I couldn't get a response.';

    // Replace typing indicator with answer
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    msgs.innerHTML += `<div class="qa-msg assistant">${escapeHTML(answer)}</div>`;
  } catch (err) {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();
    msgs.innerHTML += `<div class="qa-msg assistant" style="color:var(--llama)">Error reaching the API. Make sure you're running this from a server with the Anthropic API available.</div>`;
  }

  btn.disabled = false;
  btn.textContent = 'Ask →';
  msgs.scrollTop = msgs.scrollHeight;
}

export function setChip(text) {
  const input = document.getElementById('qaInput');
  if (input) { input.value = text; input.focus(); }
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

window.sendQA  = sendQA;
window.setChip = setChip;
