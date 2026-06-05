"""
llama_local.py
--------------
Run LLaMA 3 8B locally with 4-bit quantisation (bitsandbytes).

Hardware requirements:
  - GPU:  ~8GB VRAM (RTX 3070 / RTX 4070 or better)
  - CPU:  ~16GB RAM (slow but functional with device_map="cpu")

Requirements:
    pip install transformers torch accelerate bitsandbytes

HuggingFace access:
    1. Accept Meta's licence at https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct
    2. huggingface-cli login

Usage:
    python llama_local.py
    python llama_local.py --prompt "Explain constitutional AI in simple terms."
    python llama_local.py --cpu          # force CPU (very slow)
    python llama_local.py --max-tokens 512
"""

import argparse
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    BitsAndBytesConfig,
    pipeline,
)


MODEL_ID   = "meta-llama/Meta-Llama-3-8B-Instruct"
DEFAULT_MAX_NEW_TOKENS = 256

DEMO_PROMPTS = [
    "Explain the difference between BERT and LLaMA in two sentences.",
    "What is the main advantage of open-weight models like LLaMA over API-only models like Claude?",
    "When would you choose to fine-tune LLaMA instead of using Claude via the API?",
]

# LLaMA 3 Instruct chat template
def format_prompt(user_message: str) -> str:
    return (
        "<|begin_of_text|>"
        "<|start_header_id|>system<|end_header_id|>\n"
        "You are a helpful AI research assistant. Be concise and accurate.\n"
        "<|eot_id|>"
        "<|start_header_id|>user<|end_header_id|>\n"
        f"{user_message}\n"
        "<|eot_id|>"
        "<|start_header_id|>assistant<|end_header_id|>\n"
    )


def load_model(use_cpu: bool = False):
    """Load LLaMA 3 with 4-bit quantisation (GPU) or full precision (CPU).

    Args:
        use_cpu: If True, skip quantisation and run on CPU.

    Returns:
        Tuple of (tokenizer, pipeline)
    """
    print(f"Loading {MODEL_ID}…")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

    if use_cpu:
        print("⚠️  Running on CPU — expect slow inference.")
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_ID,
            torch_dtype=torch.float32,
            device_map="cpu",
        )
    else:
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_use_double_quant=True,   # extra quantisation compression
            bnb_4bit_quant_type="nf4",        # Normal Float 4 — best quality
        )
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_ID,
            quantization_config=bnb_config,
            device_map="auto",                # auto-distributes across available GPUs
        )

    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
    )
    print("Model loaded.\n")
    return tokenizer, pipe


def generate(pipe, prompt: str, max_new_tokens: int = DEFAULT_MAX_NEW_TOKENS) -> str:
    """Generate a response to a user prompt.

    Args:
        pipe:           Loaded text-generation pipeline.
        prompt:         User message (will be wrapped in chat template).
        max_new_tokens: Maximum tokens to generate.

    Returns:
        Generated assistant response text.
    """
    formatted = format_prompt(prompt)
    output    = pipe(
        formatted,
        max_new_tokens=max_new_tokens,
        do_sample=True,
        temperature=0.7,
        top_p=0.9,
        repetition_penalty=1.1,
    )[0]["generated_text"]

    # Extract only the assistant's reply
    return output.split("<|start_header_id|>assistant<|end_header_id|>")[-1].strip()


def main():
    parser = argparse.ArgumentParser(description="LLaMA 3 Local Inference")
    parser.add_argument("--prompt",     type=str, help="Single prompt to run")
    parser.add_argument("--cpu",        action="store_true", help="Run on CPU (no GPU required)")
    parser.add_argument("--max-tokens", type=int, default=DEFAULT_MAX_NEW_TOKENS,
                        help=f"Max new tokens (default: {DEFAULT_MAX_NEW_TOKENS})")
    args = parser.parse_args()

    tokenizer, pipe = load_model(use_cpu=args.cpu)
    prompts = [args.prompt] if args.prompt else DEMO_PROMPTS

    for prompt in prompts:
        print(f"Prompt: {prompt}")
        print("-" * 50)
        response = generate(pipe, prompt, max_new_tokens=args.max_tokens)
        print(response)
        print()


if __name__ == "__main__":
    main()
