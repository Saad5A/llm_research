"""
bert_sentiment.py
-----------------
Sentiment classification using a BERT model fine-tuned on SST-2.

Requirements:
    pip install transformers torch

Usage:
    python bert_sentiment.py
    python bert_sentiment.py --text "Your custom text here"
"""

import argparse
from transformers import pipeline


MODEL_ID = "distilbert-base-uncased-finetuned-sst-2-english"

DEMO_TEXTS = [
    "The transformer architecture was a genuine breakthrough in NLP.",
    "I couldn't get the model to run at all — terrible documentation.",
    "It's an interesting paper but the empirical results are mixed.",
    "BERT's bidirectional attention is elegantly simple in hindsight.",
    "Fine-tuning took three days and the results were disappointing.",
]


def load_classifier(device: int = -1):
    """Load a pre-trained sentiment classifier.

    Args:
        device: -1 for CPU, 0 for first GPU.

    Returns:
        HuggingFace pipeline ready for inference.
    """
    print(f"Loading model: {MODEL_ID}")
    return pipeline("sentiment-analysis", model=MODEL_ID, device=device)


def classify(classifier, texts: list[str]) -> list[dict]:
    """Run inference on a list of texts.

    Args:
        classifier: Loaded pipeline.
        texts:      List of strings to classify.

    Returns:
        List of dicts with 'label' (POSITIVE/NEGATIVE) and 'score' (confidence).
    """
    return classifier(texts, truncation=True, max_length=512)


def display_results(texts: list[str], results: list[dict]) -> None:
    """Pretty-print classification results."""
    print("\n" + "=" * 60)
    print("BERT Sentiment Classification Results")
    print("=" * 60)
    for text, result in zip(texts, results):
        label  = result["label"]
        score  = result["score"]
        emoji  = "✅" if label == "POSITIVE" else "❌"
        print(f"\n{emoji} {label:8s}  ({score:.3f} confidence)")
        print(f"   {text[:80]}{'…' if len(text) > 80 else ''}")


def main():
    parser = argparse.ArgumentParser(description="BERT Sentiment Classifier")
    parser.add_argument("--text",   type=str,  help="Single text to classify")
    parser.add_argument("--device", type=int,  default=-1,
                        help="-1 for CPU, 0 for GPU (default: -1)")
    args = parser.parse_args()

    texts      = [args.text] if args.text else DEMO_TEXTS
    classifier = load_classifier(device=args.device)
    results    = classify(classifier, texts)
    display_results(texts, results)


if __name__ == "__main__":
    main()
