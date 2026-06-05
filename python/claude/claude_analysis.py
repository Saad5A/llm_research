"""
claude_analysis.py
------------------
Structured paper abstract analysis using the Anthropic SDK.

Demonstrates:
  - System prompt engineering for JSON output
  - claude-sonnet-4 with structured responses
  - Error handling and response parsing

Requirements:
    pip install anthropic

Setup:
    export ANTHROPIC_API_KEY="your-api-key"

Usage:
    python claude_analysis.py
    python claude_analysis.py --abstract "Your abstract text here"
"""

import argparse
import json
import os
import anthropic


MODEL    = "claude-sonnet-4-20250514"
MAX_TOKENS = 1024

SYSTEM_PROMPT = """You are a research assistant specialising in AI and NLP papers.

Analyse the given abstract and return ONLY valid JSON — no preamble, no markdown fences.

Return exactly these keys:
{
  "topic":             "<main research topic in 3-6 words>",
  "contribution":      "<key contribution in one sentence>",
  "method":            "<primary method or technique used>",
  "models_mentioned":  ["<model or architecture names>"],
  "datasets_mentioned":["<dataset names, empty list if none>"],
  "task_type":         "<one of: classification, generation, understanding, efficiency, safety, other>",
  "confidence":        <float 0.0-1.0 reflecting your analysis confidence>
}"""

DEMO_ABSTRACTS = [
    """
    We introduce BERT, a new language representation model which stands for
    Bidirectional Encoder Representations from Transformers. Unlike recent
    language representation models, BERT is designed to pretrain deep
    bidirectional representations from unlabeled text by jointly conditioning
    on both left and right context in all layers. As a result, the pre-trained
    BERT model can be fine-tuned with just one additional output layer to create
    state-of-the-art models for a wide range of tasks.
    """,
    """
    We propose LLaMA, a collection of foundation language models ranging from
    7B to 65B parameters. We train our models on trillions of tokens, and show
    that it is possible to train state-of-the-art models using publicly available
    datasets exclusively. LLaMA-13B outperforms GPT-3 on most benchmarks, and
    LLaMA-65B is competitive with Chinchilla and PaLM-540B.
    """,
]


def analyse_abstract(client: anthropic.Anthropic, abstract: str) -> dict:
    """Send an abstract to Claude and return structured analysis.

    Args:
        client:   Anthropic client.
        abstract: Paper abstract text.

    Returns:
        Parsed JSON dict with analysis fields.

    Raises:
        json.JSONDecodeError: If Claude's response isn't valid JSON.
        anthropic.APIError:   On API failure.
    """
    message = client.messages.create(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": abstract.strip()}],
    )

    raw = message.content[0].text.strip()
    # Strip accidental markdown fences just in case
    raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(raw)


def display_analysis(abstract: str, result: dict) -> None:
    """Pretty-print the structured analysis."""
    print("\n" + "=" * 60)
    print("CLAUDE ABSTRACT ANALYSIS")
    print("=" * 60)
    print(f"Abstract (truncated): {abstract.strip()[:120]}…\n")
    print(f"  Topic:        {result.get('topic', 'N/A')}")
    print(f"  Task type:    {result.get('task_type', 'N/A')}")
    print(f"  Contribution: {result.get('contribution', 'N/A')}")
    print(f"  Method:       {result.get('method', 'N/A')}")
    print(f"  Models:       {', '.join(result.get('models_mentioned', [])) or 'none'}")
    print(f"  Datasets:     {', '.join(result.get('datasets_mentioned', [])) or 'none'}")
    print(f"  Confidence:   {result.get('confidence', 0):.2f}")


def main():
    parser = argparse.ArgumentParser(description="Claude Abstract Analyser")
    parser.add_argument("--abstract", type=str, help="Abstract text to analyse")
    args = parser.parse_args()

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "ANTHROPIC_API_KEY environment variable not set.\n"
            "Get your key at https://console.anthropic.com/"
        )

    client    = anthropic.Anthropic(api_key=api_key)
    abstracts = [args.abstract] if args.abstract else DEMO_ABSTRACTS

    for abstract in abstracts:
        try:
            result = analyse_abstract(client, abstract)
            display_analysis(abstract, result)
        except json.JSONDecodeError as e:
            print(f"Failed to parse Claude's response as JSON: {e}")
        except anthropic.APIError as e:
            print(f"API error: {e}")


if __name__ == "__main__":
    main()
