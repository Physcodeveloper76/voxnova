"""
Run this script once to inspect and merge both .pkl model files.
Usage: python inspect_pkl.py
"""
import joblib
import os
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))

# Find all .pkl files under the project
print("Searching for .pkl files...\n")
pkls = glob.glob(os.path.join(ROOT, "**", "*.pkl"), recursive=True)
for p in pkls:
    size_kb = os.path.getsize(p) / 1024
    print(f"  {p}  ({size_kb:.1f} KB)")

print()

# Inspect each word_dictionary.pkl
for p in pkls:
    if "word_dictionary" in p or "dictionary" in p.lower():
        try:
            d = joblib.load(p)
            print(f"=== {os.path.basename(p)} @ {p} ===")
            print(f"  Type : {type(d)}")
            print(f"  Count: {len(d)}")
            print(f"  Data : {d}")
            print()
        except Exception as e:
            print(f"  ERROR loading {p}: {e}")

# Inspect model files
for p in pkls:
    if "model" in p.lower():
        try:
            m = joblib.load(p)
            print(f"=== {os.path.basename(p)} @ {p} ===")
            print(f"  Type : {type(m)}")
            if hasattr(m, "classes_"):
                print(f"  Classes ({len(m.classes_)}): {list(m.classes_)}")
            elif hasattr(m, "n_classes_"):
                print(f"  n_classes_: {m.n_classes_}")
            print()
        except Exception as e:
            print(f"  ERROR loading {p}: {e}")
