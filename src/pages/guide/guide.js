import { getData } from '../../services/loader.js';

let flowData = null;

const SYSTEM_PROMPT = `You are a concise, expert research assistant embedded in a guided study about three AI models: BERT, Claude, and LLaMA. 

Your role: answer questions about these three models only — their architecture, training, benchmarks, use cases, and differences. Stay factual, accessible, and direct. Keep answers to 3–5 sentences unless a longer explanation is genuinely needed. Use plain language — assume the reader is technically curious but not yet an expert.

If asked about anything unrelated to these three models or AI/ML fundamentals, politely redirect.`;

export function initGuide() {
  flowData = getData().models.decisionFlow;
  renderFlowStep('q1');
  bindQA();
}

function bindQA() {
  document.getElementById('qaInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendQA(); }
  });
  document.getElementById('qaSend')?.addEventListener('click', sendQA);
  document.querySelectorAll('.qa-chip').forEach(chip => {
    chip.addEventListener('click', () => setChip(chip.dataset.chip || chip.textContent));
  });
}

function renderFlowStep(stepId) {
  const container = document.getElementById('flowStep');
  if (!container || !flowData) return;

  if (stepId.startsWith('r-')) {
    const result = flowData.results[stepId];
    container.innerHTML = `
      <div class="flow-result visible" style="border-left: 3px solid var(${result.colorVar})">
        <strong style="color:var(${result.colorVar})">${result.title}</strong>
        ${result.body}
        <button class="mode-btn" style="margin-top:1rem" data-flow-reset>↩ Start over</button>
      </div>`;
    container.querySelector('[data-flow-reset]')?.addEventListener('click', resetFlow);
    return;
  }

  const step = flowData.steps.find(s => s.id === stepId);
  if (!step) return;

  container.innerHTML = `
    <div class="flow-q">${step.question}</div>
    <div class="flow-options">
      ${step.options.map(opt => `
        <button class="flow-opt" data-flow-next="${opt.next}">${opt.label}</button>
      `).join('')}
    </div>`;

  container.querySelectorAll('[data-flow-next]').forEach(btn => {
    btn.addEventListener('click', () => advanceFlow(btn.dataset.flowNext));
  });
}

export function advanceFlow(next) {
  renderFlowStep(next);
}

export function resetFlow() {
  renderFlowStep('q1');
}

export async function sendQA() {
  const input = document.getElementById('qaInput');
  const msgs = document.getElementById('qaMessages');
  const btn = document.getElementById('qaSend');
  if (!input || !msgs || !btn) return;

  const userText = input.value.trim();
  if (!userText) return;

  msgs.innerHTML += `<div class="qa-msg user">${escapeHTML(userText)}</div>`;
  input.value = '';
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>thinking';
  msgs.scrollTop = msgs.scrollHeight;

  const typingId = 'typing-' + Date.now();
  msgs.innerHTML += `<div class="qa-msg assistant" id="${typingId}" style="opacity:0.5">…</div>`;
  msgs.scrollTop = msgs.scrollHeight;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userText }],
      }),
    });

    const data = await response.json();
    const answer = data.content?.map(b => b.text || '').join('') || 'Sorry, I couldn\'t get a response.';

    document.getElementById(typingId)?.remove();
    msgs.innerHTML += `<div class="qa-msg assistant">${escapeHTML(answer)}</div>`;
  } catch {
    document.getElementById(typingId)?.remove();
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
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

window.advanceFlow = advanceFlow;
window.resetFlow = resetFlow;
window.sendQA = sendQA;
window.setChip = setChip;
