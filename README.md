# Inside the Models — BERT, Claude & LLaMA

A guided, interactive research dashboard comparing three landmark AI models: **BERT** (Google), **Claude** (Anthropic), and **LLaMA** (Meta). Built as a portfolio project covering architecture, training objectives, benchmarks, code examples, and a practical decision guide.

> ✦ **Your turn:** Replace this paragraph with your own motivation. Why did you choose these three models? What are you hoping to understand? This is what makes the project yours.

---

## Live Demo

Open `index.html` in any modern browser — no build step, no server required for the dashboard.

> **Note:** The embedded Claude Q&A (Phase 6) requires the Anthropic API. To enable it, serve the project via a local server:
> ```bash
> npx serve .
> # or
> python -m http.server 8080
> ```

---

## Project Structure

```
llm-research/
├── index.html                  # Main single-page app (all 6 phases)
├── README.md
├── requirements.txt            # Python dependencies
│
├── src/
│   ├── css/
│   │   ├── variables.css       # Design tokens (colours, fonts, radii)
│   │   ├── base.css            # Reset, typography, layout primitives
│   │   ├── components.css      # Shared UI components (nav, cards, buttons)
│   │   └── phases.css          # Phase-specific styles (arch, training, etc.)
│   │
│   ├── js/
│   │   ├── main.js             # App entry point — initialises all modules
│   │   ├── nav.js              # Page routing and progress bar
│   │   ├── arch.js             # Architecture tabs + attention demo
│   │   ├── training.js         # MLM masking demo
│   │   ├── benchmarks.js       # Filterable benchmark table
│   │   └── guide.js            # Decision flow + Claude-powered Q&A
│   │
│   └── pages/
│       └── _head.html          # Shared <head> partial (reference only)
│
└── python/
    ├── bert/
    │   ├── bert_sentiment.py   # Sentiment classification with BERT
    │   └── bert_ner.py         # Named Entity Recognition with BERT
    ├── claude/
    │   └── claude_analysis.py  # Structured abstract analysis via Claude API
    └── llama/
        └── llama_local.py      # Local inference with LLaMA 3 (4-bit quant)
```

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
