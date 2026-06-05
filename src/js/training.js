// =============================================================================
// training.js — Phase 3 interactive: MLM masking demo
// =============================================================================

const MLM_TOKENS = [
  'The', 'scientist', 'discovered', 'a', 'new', 'species', 'of', 'butterfly'
];

// Plausible BERT predictions for each masked token
const MLM_PREDICTIONS = {
  0: ['The', 'A', 'One'],
  1: ['scientist', 'researcher', 'biologist'],
  2: ['discovered', 'identified', 'found'],
  3: ['a', 'an', 'the'],
  4: ['new', 'rare', 'unique'],
  5: ['species', 'type', 'variety'],
  6: ['of', 'from', 'among'],
  7: ['butterfly', 'moth', 'insect'],
};

let maskedIndices = new Set();
let revealedIndices = new Set();

export function initTraining() {
  renderMLM();
}

function renderMLM() {
  const container = document.getElementById('mlmTokens');
  if (!container) return;
  container.innerHTML = '';

  MLM_TOKENS.forEach((token, i) => {
    const span = document.createElement('span');
    span.className = 'mlm-tok';

    if (revealedIndices.has(i)) {
      span.classList.add('revealed');
      span.textContent = `${token} ✓`;
    } else if (maskedIndices.has(i)) {
      span.classList.add('is-masked');
      span.textContent = '[MASK]';
    } else {
      span.textContent = token;
    }

    span.addEventListener('click', () => handleMLMClick(i));
    container.appendChild(span);
  });
}

function handleMLMClick(i) {
  const info = document.getElementById('mlmInfo');
  if (!info) return;

  if (revealedIndices.has(i)) {
    // Reset this token
    revealedIndices.delete(i);
    maskedIndices.delete(i);
    info.textContent = 'Click a word to mask it, then click again to see BERT\'s prediction.';
  } else if (maskedIndices.has(i)) {
    // Reveal prediction
    revealedIndices.add(i);
    maskedIndices.delete(i);
    const preds = MLM_PREDICTIONS[i];
    info.innerHTML = `<strong style="color:var(--claude)">BERT predicts:</strong> "${preds[0]}" (top alternatives: ${preds.slice(1).map(p => `"${p}"`).join(', ')}) — using context from both sides of the mask.`;
  } else {
    // Mask the token
    maskedIndices.add(i);
    info.textContent = `"${MLM_TOKENS[i]}" is now masked. Click it again to see BERT's prediction based on surrounding context.`;
  }

  renderMLM();
}

// Expose for inline handlers
window.initTraining = initTraining;
