#!/usr/bin/env python3
"""Build public/fonts/playfair-headings-600.woff2 from headline glyphs.

Requires: pip install fonttools brotli
Source TTF is downloaded into tools/ (gitignored).
"""

from __future__ import annotations

import urllib.request
from pathlib import Path

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "tools"
OUT = ROOT / "public" / "fonts" / "playfair-headings-600.woff2"
GLYPHS = TOOLS / "playfair-glyphs.txt"
VF = TOOLS / "PlayfairDisplay-wght.ttf"
VF_URL = (
    "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/"
    "PlayfairDisplay%5Bwght%5D.ttf"
)

HEADLINE_SAMPLES = [
    "ГРАНЬ",
    "Грань",
    "Стрижка, после которой хочется селфи",
    "Запись онлайн",
    "Заявка собрана",
    "Четыре руки, четыре почерка",
    "Найти «Грань»",
    "До / после",
    "Как это видит барбершоп",
    "Как на картах",
    "Ритуалы, а не прайс",
    "Политика конфиденциальности",
    "Стрижка",
    "Стрижка + борода",
    "Борода",
    "Детская",
    "Камуфляж седины",
    "Королевское бритьё",
    "Артём",
    "Илья",
    "Тимур",
    "Кирилл",
    "Максим К.",
    "Денис В.",
    "Руслан М.",
    "Андрей С.",
    "Елена П.",
    "Игорь Т.",
    "Fade и текстура",
    "Форма бороды",
    "Классическая стрижка",
    "0123456789",
    "—–-.,:;!?«»“”()+ /",
    " \u00a0…·•",
]


def main() -> None:
    TOOLS.mkdir(parents=True, exist_ok=True)
    glyphs = "".join(sorted(set("".join(HEADLINE_SAMPLES))))
    GLYPHS.write_text(glyphs, encoding="utf-8")

    if not VF.exists():
        print(f"download {VF_URL}")
        urllib.request.urlretrieve(VF_URL, VF)

    vf = TTFont(VF)
    font = instantiateVariableFont(vf, {"wght": 600}, inplace=False)

    opts = Options()
    opts.layout_features = ["kern", "liga", "calt", "locl", "mark", "mkmk"]
    opts.hinting = False
    opts.desubroutinize = True
    opts.flavor = "woff2"

    subsetter = Subsetter(options=opts)
    subsetter.populate(text=glyphs)
    subsetter.subset(font)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    font.save(str(OUT))
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size} bytes, {len(glyphs)} glyphs)")


if __name__ == "__main__":
    main()
