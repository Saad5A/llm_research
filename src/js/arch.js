// =============================================================================
// arch.js — Architecture tab switching and attention demo
// =============================================================================

// ── Attention demo data ────────────────────────────────────────────────────
const SENTENCE = [
  'The','animal','didn\'t','cross','the','street','because','it','was','tired'
];

const BERT_ATTENTION = {
  0: [0.8,0.4,0.2,0.1,0.3,0.1,0.1,0.1,0.1,0.1],
  1: [0.3,0.9,0.2,0.3,0.2,0.2,0.4,0.8,0.3,0.3],
  2: [0.2,0.3,0.8,0.4,0.2,0.2,0.3,0.2,0.2,0.2],
  3: [0.1,0.3,0.3,0.9,0.2,0.4,0.3,0.2,0.2,0.2],
  4: [0.4,0.2,0.1,0.2,0.9,0.5,0.1,0.1,0.1,0.1],
  5: [0.1,0.2,0.2,0.4,0.4,0.9,0.3,0.3,0.2,0.2],
  6: [0.2,0.4,0.4,0.3,0.2,0.3,0.9,0.5,0.3,0.3],
  7: [0.2,0.9,0.3,0.2,0.2,0.3,0.4,0.9,0.4,0.5],
  8: [0.1,0.3,0.3,0.2,0.1,0.2,0.3,0.5,0.9,0.6],
  9: [0.1,0.3,0.2,0.2,0.1,0.2,0.3,0.6,0.5,0.9],
};

const INSIGHTS = {
  0: '"The" attends most to itself — but also tracks the second "the" as a related article.',
  1: '"animal" strongly attends to "it" — BERT resolves this coreference by reading both left and right context simultaneously.',
  2: '"didn\'t" spreads its negation influence across neighboring tokens.',
  3: '"cross" attends to "street" (its object) and "didn\'t" (its negation).',
  4: 'The second "the" groups with "street" — articles naturally cluster with their nouns.',
  5: '"street" attends to "cross" and "the" — it\'s the object of the verb phrase.',
  6: '"because" bridges both clauses, attending in both directions.',
  7: '"it" strongly attends to "animal" — correct pronoun resolution using full bidirectional context. A causal model might have picked "street" instead.',
  8: '"was" links "it" and "tired" as a copular verb.',
  9: '"tired" completes the predicate, attending to "it" (subject) and "was".',
};

let attnMode = 'bert';

// ── Public API ──────────────────────────────────────────────────────────────

export function initArch() {
  renderSentence();
}

export function showArch(model) {
  ['bert', 'claude', 'llama'].forEach(m => {
    document.getElementById('panel-' + m)?.classList.remove('visible');
    const tab = document.getElementById('tab-' + m);
    if (tab) {
      tab.classList.remove('active-bert', 'active-claude', 'active-llama');
    }
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

// ── Rendering ───────────────────────────────────────────────────────────────

function renderSentence(selectedIdx = -1) {
  const container = document.getElementById('attnSentence');
  if (!container) return;
  container.innerHTML = '';

  SENTENCE.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'attn-word';
    span.textContent = word;

    if (i === selectedIdx) {
      span.classList.add('selected');
    } else if (selectedIdx >= 0) {
      const canAttend = attnMode === 'bert' ? true : i <= selectedIdx;
      if (canAttend) {
        const weight = BERT_ATTENTION[selectedIdx][i];
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
        info.textContent = INSIGHTS[i] || `"${word}" attends to contextually related tokens.`;
      } else {
        info.textContent = i === 0
          ? `"${word}" is the first token — in causal attention it can only attend to itself.`
          : `"${word}" (position ${i + 1}) attends only to the ${i + 1} token${i > 0 ? 's' : ''} before it. Future tokens are masked — this is what enables generation.`;
      }
    });

    container.appendChild(span);
  });
}

// Expose for inline handlers
window.showArch    = showArch;
window.setAttnMode = setAttnMode;
