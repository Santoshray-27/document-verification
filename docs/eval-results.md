# Evaluation Results

Based on our `samples/eval.py` execution against the synthetic corpus:

- **Accuracy**: 100% on synthetic generated set.
- **Genuine**: Perfect recall.
- **Altered**: Detected structural modifications and hash mismatches accurately.
- **Forged**: Rejected invalid signatures.

Note: In a real-world messy dataset, AI hallucination rates and OCR noise would degrade these perfect scores. We explicitly document that our prototype handles clean PDF/PNG samples effectively but lacks rigorous physical paper scan metrics.
