import { getData } from '../../services/loader.js';

let attnMode = 'bert';
let attentionData = null;

export function initArchitecture() {
  attentionData = getData().models.attention;
  renderSentence();
  bindArchTabs();
}

function bindArchTabs() {
  document.querySelectorAll('.arch-tab').forEach(tab => {
    tab.addEventListener('click', () => showArch(tab.dataset.model));
  });
}

export function showArch(model) {
  ['bert', 'claude', 'llama'].forEach(m => {
    document.getElementById('panel-' + m)?.classList.remove('visible');
    document.getElementById('tab-' + m)?.classList.remove('active-bert', 'active-claude', 'active-llama');
  });
  document.getElementById('panel-' + model)?.classList.add('visible');
  document.getElementById('tab-' + model)?.classList.add('active-' + model);
}

export function setAttnMode(mode) {
  attnMode = mode;
  document.getElementById('mode-bert-btn')?.classList.toggle('active', mode === 'bert');
  document.getElementById('mode-causal-btn')?.classList.toggle('active', mode === 'causal');
  renderSentence();
  const info = document.getElementById('attnInfo');
  if (info) info.textContent = '← Select a word to see what it attends to';
}

function renderSentence(selectedIdx = -1) {
  const container = document.getElementById('attnSentence');
  if (!container || !attentionData) return;
  container.innerHTML = '';

  const { sentence, weights, insights } = attentionData;

  sentence.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'attn-word';
    span.textContent = word;

    if (i === selectedIdx) {
      span.classList.add('selected');
    } else if (selectedIdx >= 0) {
      const canAttend = attnMode === 'bert' ? true : i <= selectedIdx;
      if (canAttend) {
        const weight = weights[String(selectedIdx)][i];
        if (weight > 0.5) {
          span.style.opacity = '1';
          span.style.background = `rgba(200,184,255,${weight * 0.3})`;
          span.style.borderColor = `rgba(200,184,255,${weight * 0.5})`;
          span.style.color = `rgba(200,184,255,${0.5 + weight * 0.5})`;
        } else {
          span.style.opacity = String(0.3 + weight * 0.4);
        }
      } else {
        span.style.opacity = '0.15';
      }
    }

    span.addEventListener('click', () => {
      renderSentence(i);
      const info = document.getElementById('attnInfo');
      if (!info) return;
      if (attnMode === 'bert') {
        info.textContent = insights[String(i)] || `"${word}" attends to contextually related tokens.`;
      } else {
        info.textContent = i === 0
          ? `"${word}" is the first token — in causal attention it can only attend to itself.`
          : `"${word}" (position ${i + 1}) attends only to the ${i + 1} token${i > 0 ? 's' : ''} before it. Future tokens are masked — this is what enables generation.`;
      }
    });

    container.appendChild(span);
  });
}

window.showArch = showArch;
window.setAttnMode = setAttnMode;
