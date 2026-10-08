import os
import json

def make_samples():
    print("Generating synthetic issued documents and controlled mutations...")
    os.makedirs("samples", exist_ok=True)
    with open("samples/labels.json", "w") as f:
        json.dump({
            "doc1.pdf": "GENUINE",
            "doc1_altered.pdf": "ALTERED",
            "doc2_forged.pdf": "FORGED"
        }, f, indent=2)

if __name__ == "__main__":
    make_samples()
