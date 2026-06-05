// =============================================================================
// benchmarks.js — Phase 4 filterable benchmark table
// =============================================================================

const BENCHMARKS = [
  // Understanding
  { name: 'GLUE',       category: 'understanding', bert: 82.1, claude: 89.4, llama: 85.2, winner: 'claude', note: 'General Language Understanding Evaluation — 9 NLP tasks' },
  { name: 'SuperGLUE',  category: 'understanding', bert: 71.5, claude: 90.1, llama: 84.7, winner: 'claude', note: 'Harder version of GLUE with more complex tasks' },
  { name: 'SQuAD 2.0',  category: 'understanding', bert: 86.7, claude: 91.2, llama: 88.3, winner: 'claude', note: 'Extractive reading comprehension with unanswerable questions' },
  { name: 'NER (CoNLL)',category: 'understanding', bert: 92.4, claude: 88.1, llama: 83.6, winner: 'bert',   note: 'Named Entity Recognition — BERT\'s home turf' },
  { name: 'SST-2',      category: 'understanding', bert: 94.9, claude: 96.1, llama: 93.4, winner: 'claude', note: 'Stanford Sentiment Treebank — binary sentiment classification' },
  // Reasoning
  { name: 'MMLU',       category: 'reasoning',     bert: 42.0, claude: 88.7, llama: 79.3, winner: 'claude', note: 'Massive Multitask Language Understanding — 57 subjects' },
  { name: 'HellaSwag',  category: 'reasoning',     bert: 48.3, claude: 95.3, llama: 88.2, winner: 'claude', note: 'Commonsense NLI — completing plausible sentences' },
  { name: 'ARC-C',      category: 'reasoning',     bert: 44.1, claude: 90.2, llama: 80.1, winner: 'claude', note: 'AI2 Reasoning Challenge — grade school science questions' },
  { name: 'BoolQ',      category: 'reasoning',     bert: 77.4, claude: 91.0, llama: 84.6, winner: 'claude', note: 'Boolean yes/no questions with reading passage' },
  // Code
  { name: 'HumanEval',  category: 'code',          bert:  0.0, claude: 81.2, llama: 62.4, winner: 'claude', note: 'Python function synthesis from docstrings — 164 problems' },
  { name: 'MBPP',       category: 'code',          bert:  0.0, claude: 77.8, llama: 58.3, winner: 'claude', note: 'Mostly Basic Python Programming — 374 tasks' },
  // Generation
  { name: 'MT-Bench',   category: 'generation',    bert:  0.0, claude: 8.9,  llama: 7.3,  winner: 'claude', note: 'Multi-turn conversation quality — scored 1–10' },
  { name: 'AlpacaEval', category: 'generation',    bert:  0.0, claude: 89.5, llama: 71.4, winner: 'claude', note: 'Instruction-following win rate vs GPT-4-Turbo reference' },
];

let activeFilter = 'all';

export function initBenchmarks() {
  renderTable();
}

export function setBenchFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.bench-filter').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('benchTbody');
  if (!tbody) return;

  const filtered = activeFilter === 'all'
    ? BENCHMARKS
    : BENCHMARKS.filter(b => b.category === activeFilter);

  tbody.innerHTML = filtered.map(b => `
    <tr>
      <td>
        <div class="bench-name">${b.name}</div>
        <div style="font-size:11px;color:var(--text3);font-family:var(--mono);margin-top:2px;">${b.note}</div>
      </td>
      <td>
        <div class="bench-bar-wrap">
          <div class="bench-bar-track"><div class="bench-bar-fill bar-bert" style="width:${b.bert}%"></div></div>
          <span class="bench-score" style="color:${b.bert > 0 ? 'var(--bert)' : 'var(--text3)'}">${b.bert > 0 ? b.bert : 'N/A'}</span>
          ${b.winner === 'bert' ? '<span class="winner-badge">best</span>' : ''}
        </div>
      </td>
      <td>
        <div class="bench-bar-wrap">
          <div class="bench-bar-track"><div class="bench-bar-fill bar-claude" style="width:${b.claude}%"></div></div>
          <span class="bench-score" style="color:var(--claude)">${b.claude}</span>
          ${b.winner === 'claude' ? '<span class="winner-badge">best</span>' : ''}
        </div>
      </td>
      <td>
        <div class="bench-bar-wrap">
          <div class="bench-bar-track"><div class="bench-bar-fill bar-llama" style="width:${b.llama}%"></div></div>
          <span class="bench-score" style="color:${b.llama > 0 ? 'var(--llama)' : 'var(--text3)'}">${b.llama > 0 ? b.llama : 'N/A'}</span>
          ${b.winner === 'llama' ? '<span class="winner-badge">best</span>' : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

// Expose for inline handlers
window.setBenchFilter = setBenchFilter;
