---
title: 'Running open-source LLMs on your own machine'
description: 'A quick recipe for standing up a local Python environment and running quantized open-weight models like Gemma with nothing but a consumer GPU.'
date: 2025-07-05
tags:
  - AI
  - Python
categories:
  - Engineering
showHeroImage: false
comments: false
---

There's something satisfying about running a language model entirely on your own machine — no API key, no rate limit, no data leaving your desk. It's also gotten remarkably easy.

The setup starts with [`uv`](https://github.com/astral-sh/uv), which has become my default way to spin up a clean Python environment:

```sh
uv venv --python 3.12 --seed
source .venv/bin/activate
uv pip install torch transformers accelerate bitsandbytes
```

From there, loading an open-weight instruction-tuned model in 4-bit is a few lines:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import torch

quantization_config = BitsAndBytesConfig(load_in_4bit=True)
model_id = "google/gemma-7b-it"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    quantization_config=quantization_config,
)

model_inputs = tokenizer(
    ["The secret to baking a good cake is "], return_tensors="pt"
).to("cuda")
generated_ids = model.generate(**model_inputs, max_length=30)
print(tokenizer.batch_decode(generated_ids)[0])
```

On a consumer GPU, `google/gemma-7b-it` in 4-bit ran comfortably and produced coherent, useful output — for the cake prompt above, it confidently informed me that the secret is "patience and practice," which is either wisdom or a very well-trained prior.

The bigger point isn't the cake. It's that the barrier to running a genuinely capable model locally has quietly collapsed. A weekend's worth of `uv` incantations gets you a private, offline, inspectable model — a useful thing to have, if only as a sandbox for understanding what these systems can and can't do without a network connection watching.
