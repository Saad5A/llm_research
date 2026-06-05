"""
bert_ner.py
-----------
Named Entity Recognition using BERT fine-tuned on CoNLL-2003.

Recognises: PER (person), ORG (organisation), LOC (location), MISC (miscellaneous)

Requirements:
    pip install transformers torch

Usage:
    python bert_ner.py
    python bert_ner.py --text "Yann LeCun works at Meta AI in New York."
"""

import argparse
from transformers import pipeline


MODEL_ID = "dslim/bert-base-NER"

DEMO_TEXTS = [
    (
        "Anthropic, founded by Dario Amodei and Daniela Amodei in San Francisco, "
        "released Claude in 2023."
    ),
    (
        "Meta AI published LLaMA in February 2023, enabling researchers at Stanford "
        "and MIT to fine-tune the model on custom datasets."
    ),
    (
        "Geoffrey Hinton, Yann LeCun, and Yoshua Bengio won the Turing Award in 2018 "
        "for their foundational work on deep learning."
    ),
]


def load_ner(device: int = -1):
    """Load a BERT-based NER pipeline.

    Args:
        device: -1 for CPU, 0 for first GPU.
    """
    print(f"Loading model: {MODEL_ID}")
    return pipeline(
        "ner",
        model=MODEL_ID,
        aggregation_strategy="simple",  # merges sub-word tokens into whole words
        device=device,
    )


def extract_entities(ner, text: str) -> list[dict]:
    """Extract named entities from a single text.

    Returns:
        List of entity dicts with keys: word, entity_group, score, start, end.
    """
    return ner(text)


def display_results(text: str, entities: list[dict]) -> None:
    """Pretty-print NER results with colour-coded entity types."""
    COLOURS = {
        "PER":  "\033[94m",   # blue
        "ORG":  "\033[92m",   # green
        "LOC":  "\033[93m",   # yellow
        "MISC": "\033[95m",   # magenta
    }
    RESET = "\033[0m"

    print(f"\nText: {text}\n")
    print(f"{'Entity':<30} {'Type':<6} {'Confidence'}")
    print("-" * 50)
    for ent in entities:
        colour = COLOURS.get(ent["entity_group"], "")
        print(
            f"{colour}{ent['word']:<30}{RESET} "
            f"{ent['entity_group']:<6} "
            f"{ent['score']:.3f}"
        )
    print()


def main():
    parser = argparse.ArgumentParser(description="BERT Named Entity Recognition")
    parser.add_argument("--text",   type=str,  help="Text to analyse")
    parser.add_argument("--device", type=int,  default=-1,
                        help="-1 for CPU, 0 for GPU")
    args = parser.parse_args()

    texts = [args.text] if args.text else DEMO_TEXTS
    ner   = load_ner(device=args.device)

    for text in texts:
        entities = extract_entities(ner, text)
        display_results(text, entities)


if __name__ == "__main__":
    main()
