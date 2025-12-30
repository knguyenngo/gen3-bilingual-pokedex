from __future__ import annotations

import ast
import json
from pathlib import Path
import pandas as pd

# ✅ EDIT THESE TWO IF YOUR PATHS DIFFER
VITE_ROOT = Path("/home/anti/Projects/gen3-bilingual-pokedex/pokedex")
SCRAPED_DIR = Path("/home/anti/Projects/gen3-bilingual-pokedex/scraped")

OUT_DIR = VITE_ROOT / "public" / "data"
OUT_DIR.mkdir(parents=True, exist_ok=True)

def parse_list_cell(value):
    """
    Converts strings like "['Fire', 'Flying']" or '["Fire","Flying"]' into real lists.
    """
    if isinstance(value, list):
        return value

    if not isinstance(value, str):
        return value

    s = value.strip()
    if not (s.startswith("[") and s.endswith("]")):
        return value

    try:
        parsed = json.loads(s)
        if isinstance(parsed, list):
            return parsed
    except Exception:
        pass

    try:
        parsed = ast.literal_eval(s)
        if isinstance(parsed, list):
            return parsed
    except Exception:
        pass

    return value

def write_json(df: pd.DataFrame, out_path: Path):
    records = df.to_dict(orient="records")
    out_path.write_text(
        json.dumps(records, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"✓ wrote {len(records):,} rows -> {out_path}")

def main():
    required = ["jp_moves.csv", "moves.csv", "pokemon.csv", "jp_names.csv"]
    missing = [f for f in required if not (SCRAPED_DIR / f).is_file()]
    if missing:
        raise FileNotFoundError(f"Missing CSVs in {SCRAPED_DIR}:\n" + "\n".join(missing))

    print(f"Vite root:   {VITE_ROOT}")
    print(f"Scraped dir: {SCRAPED_DIR}")
    print(f"Out dir:     {OUT_DIR}\n")

    jp_moves = pd.read_csv(SCRAPED_DIR / "jp_moves.csv")
    moves = pd.read_csv(SCRAPED_DIR / "moves.csv")
    pokemon = pd.read_csv(SCRAPED_DIR / "pokemon.csv")
    jp_names = pd.read_csv(SCRAPED_DIR / "jp_names.csv")

    # Normalize list-ish columns
    if "type" in moves.columns:
        moves["type"] = moves["type"].apply(parse_list_cell)

    if "type" in pokemon.columns:
        pokemon["type"] = pokemon["type"].apply(parse_list_cell)

    if "ability" in pokemon.columns:
        pokemon["ability"] = pokemon["ability"].apply(parse_list_cell)

    write_json(jp_moves, OUT_DIR / "jp_moves.json")
    write_json(moves, OUT_DIR / "moves.json")
    write_json(pokemon, OUT_DIR / "pokemon.json")
    write_json(jp_names, OUT_DIR / "jp_names.json")

    print("\nDone. JSON is in pokedex/public/data/")
    print("Test in browser:")
    print("  http://localhost:5173/data/moves.json")

if __name__ == "__main__":
    main()

