import { getData } from '../../services/loader.js';

let mlmData = null;
let maskedIndices = new Set();
let revealedIndices = new Set();

export function initTraining() {
  mlmData = getData().models.mlm;
  renderMLM();
}

function renderMLM() {
  const container = document.getElementById('mlmTokens');
  if (!container || !mlmData) return;
  container.innerHTML = '';

  mlmData.tokens.forEach((token, i) => {
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
  if (!info || !mlmData) return;

  if (revealedIndices.has(i)) {
    revealedIndices.delete(i);
    maskedIndices.delete(i);
    info.textContent = 'Click a word to mask it, then click again to see BERT\'s prediction.';
  } else if (maskedIndices.has(i)) {
    revealedIndices.add(i);
    maskedIndices.delete(i);
    const preds = mlmData.predictions[String(i)];
    info.innerHTML = `<strong style="color:var(--claude)">BERT predicts:</strong> "${preds[0]}" (top alternatives: ${preds.slice(1).map(p => `"${p}"`).join(', ')}) — using context from both sides of the mask.`;
  } else {
    maskedIndices.add(i);
    info.textContent = `"${mlmData.tokens[i]}" is now masked. Click it again to see BERT's prediction based on surrounding context.`;
  }

  renderMLM();
}
