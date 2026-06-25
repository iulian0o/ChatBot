# Model Benchmark

Date: June 25, 2026

## Test Setup

The same Python snippet was reviewed with three Groq-hosted models through the LLM client and benchmark helper.

```python
def calculate_discount(price, discount):
    final_price = price - discount
    if final_price < 0:
        return 0
    return final_price

print(calculate_discount("100", 20))
```

The snippet intentionally contains a type mismatch: `"100"` is a string, so subtracting an integer from it raises a Python `TypeError`.

## Results

| Model | Status | Duration | Quality notes |
| --- | --- | ---: | --- |
| `openai/gpt-oss-20b` | OK | 1491 ms | Found the main `TypeError`, explained the mismatch clearly, and produced a structured review with bug and validation recommendations. |
| `openai/gpt-oss-120b` | OK | 1986 ms | Also found the main `TypeError`; explanation was slightly more polished and included documentation/style notes, but it was slower in this single run. |
| `llama-3.1-8b-instant` | OK | 843 ms | Fastest response and found the main bug, but included a less relevant "division by zero" note, making the review slightly less precise. |

## Interpretation

For this code-review use case, all three models detected the important runtime bug. `llama-3.1-8b-instant` was fastest, but its answer contained a weaker extra warning. `openai/gpt-oss-20b` gave the best balance of speed, cost, and review quality. `openai/gpt-oss-120b` produced a strong answer but was slower for this small snippet, so the larger model may not be necessary for basic classroom demos.

This is only a small benchmark. A stronger evaluation would run several snippets across each model and score results for correctness, security coverage, clarity, and latency.

## Sources

- Groq supported models: https://console.groq.com/docs/models
- Groq data handling: https://console.groq.com/docs/your-data
