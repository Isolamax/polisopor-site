#!/usr/bin/env python3
"""
Mede todas as imagens de public/ e grava src/lib/image-sizes.json.

Serve para preencher width/height nas tags <img>. Sem esses atributos o
navegador não reserva espaço antes de baixar a imagem e o conteúdo salta durante
o carregamento — é o CLS, que conta como Core Web Vitals no ranqueamento.

Rodar sempre que uma imagem for adicionada ou trocada: python3 scripts/gen-image-sizes.py
"""

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
OUT = ROOT / "src/lib/image-sizes.json"

EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"}


def main() -> None:
    sizes: dict[str, list[int]] = {}
    for path in sorted(PUBLIC.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in EXTS:
            continue
        try:
            with Image.open(path) as im:
                w, h = im.size
        except Exception as exc:  # imagem corrompida não deve derrubar o build
            print(f"  ! {path.name}: {exc}")
            continue
        key = "/" + path.relative_to(PUBLIC).as_posix()
        sizes[key] = [w, h]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(sizes, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(sizes)} imagens medidas -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
