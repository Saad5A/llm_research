# Inside the Models — BERT, Claude & LLaMA

A guided, interactive research dashboard comparing three landmark AI models: **BERT** (Google), **Claude** (Anthropic), and **LLaMA** (Meta). Built as a portfolio project covering architecture, training objectives, benchmarks, code examples, and a practical decision guide.

> ✦ **Your turn:** Replace this paragraph with your own motivation. Why did you choose these three models? What are you hoping to understand? This is what makes the project yours.

---

## Live Demo

**Inside the Models: An Interactive AI Systems Research Platform**

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build
```

> **Note:** The embedded Claude Q&A (Phase 6) calls the Anthropic API from the browser and requires a proxy/API key setup for production use.

### Deploy to Cloudflare Pages

1. Connect [github.com/Saad5A/llm_research](https://github.com/Saad5A/llm_research) in the Cloudflare Pages dashboard.
2. Configure:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 20+
3. SPA routing is handled via `public/_redirects`.
4. Add a custom domain under **Pages → Custom domains** when ready.

---

## Project Structure (Stage 1)

```
llm-research-project/
├── index.html                  # Vite entry shell
├── package.json
├── vite.config.js
├── public/                     # Static assets + Cloudflare _redirects
├── requirements.txt            # Python experiment dependencies
│
├── src/
│   ├── main.js                 # App bootstrap
│   ├── assets/                 # images, icons, animations
│   ├── components/
│   │   ├── navigation/         # Nav, breadcrumbs, theme toggle
│   │   ├── code-viewer/        # Copy + tab switching
│   │   ├── cards/              # (Stage 2)
│   │   ├── charts/             # (Stage 2)
│   │   └── modals/             # (Stage 2)
│   ├── pages/
│   │   ├── intro/
│   │   ├── architecture/       # Attention demo
│   │   ├── training/           # MLM demo
│   │   ├── benchmarks/         # Filterable table
│   │   ├── examples/           # Code snippets
│   │   └── guide/              # Decision flow + Q&A
│   ├── data/
│   │   ├── models.json
│   │   ├── benchmarks.json
│   │   ├── citations.json
│   │   └── glossary.json
│   ├── services/
│   │   ├── router.js           # Deep linking + keyboard nav
│   │   ├── loader.js           # JSON data layer
│   │   ├── theme.js            # Light/dark + persistence
│   │   └── analytics.js        # Local pageview tracking
│   └── styles/
│       ├── tokens.css          # Design system
│       ├── typography.css
│       ├── layout.css
│       └── components/
│
└── python/
    ├── bert/
    ├── claude/
    └── llama/
```

### Stage 1 Features

- **Design tokens** — spacing, radii, shadows, motion, semantic colours
- **Light + dark themes** — system preference, localStorage persistence, no flash
- **Router** — `/intro`, `/architecture`, `/training`, `/benchmarks`, `/examples`, `/guide`
- **Keyboard navigation** — `←` / `→` to move between phases
- **Data layer** — benchmarks, models, citations, glossary in JSON

---

## The 6 Phases

| Phase | Topic | What you'll find |
|-------|-------|-----------------|
| 01 | Introduction | Why these 3 models, what a transformer is, guide overview |
| 02 | Architecture | Encoder vs decoder, layer stacks, interactive attention demo |
| 03 | Training | Masked LM, RLHF, Constitutional AI, causal LM at scale |
| 04 | Benchmarks | Filterable table across GLUE, MMLU, HumanEval, and more |
| 05 | Code | 4 annotated, copy-ready Python snippets |
| 06 | When to use | Decision cards, interactive flow, live AI Q&A |

---

## Running the Python Examples

### Setup

```bash
pip install -r requirements.txt
```

### BERT Sentiment
```bash
cd python/bert
python bert_sentiment.py
python bert_sentiment.py --text "Your custom text here"
```

### BERT NER
```bash
cd python/bert
python bert_ner.py
python bert_ner.py --text "Yann LeCun works at Meta AI in New York."
```

### Claude Abstract Analysis
```bash
export ANTHROPIC_API_KEY="your-key-here"
cd python/claude
python claude_analysis.py
python claude_analysis.py --abstract "Your abstract text here"
```

### LLaMA Local Inference
```bash
# Requires HuggingFace access to meta-llama/Meta-Llama-3-8B-Instruct
# Accept licence at: https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct
huggingface-cli login

cd python/llama
python llama_local.py                              # GPU (recommended)
python llama_local.py --cpu                        # CPU only (slow)
python llama_local.py --prompt "Your prompt here"
```

---

## Key Findings

> ✦ **Your turn:** After running the experiments and completing the guide, add your 3–5 key takeaways here. What surprised you? What changed how you'd approach a real project?

---

## Collaboration Notes

This project was built collaboratively:
- **Architecture, code, and dashboard** — Claude (Anthropic)
- **Experiments, observations, personal narrative, editorial decisions** — [Your name]

The 5 `persona-note` boxes throughout the dashboard mark where your voice and real experiment results belong.

---

## References

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) — Vaswani et al., 2017
- [BERT: Pre-training of Deep Bidirectional Transformers](https://arxiv.org/abs/1810.04805) — Devlin et al., 2018
- [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) — Anthropic, 2022
- [LLaMA: Open and Efficient Foundation Language Models](https://arxiv.org/abs/2302.13971) — Touvron et al., 2023
- [Llama 3 Model Card](https://github.com/meta-llama/llama3) — Meta AI, 2024
- [HuggingFace Transformers Docs](https://huggingface.co/docs/transformers)
- [Anthropic API Docs](https://docs.anthropic.com)

---

## License

MIT — free to use, modify, and share. If this helped your learning, a ⭐ on GitHub is appreciated.
