#!/usr/bin/env python3
"""Détourage chroma-key des stickers kawaii de l'app (assets/gen → public/assets/img).

POURQUOI CE FICHIER EXISTE
--------------------------
Le modèle Gemini ne produit pas de vraie transparence : on lui demande donc un
fond vert franc, puis on le retire ici. Ce script a déjà été écrit et perdu deux
fois parce qu'il vivait dans un dossier temporaire — d'où sa présence dans le
dépôt, malgré le fait que ce soit le seul Python d'un projet 100 % JS. Il n'entre
NI dans le build NI dans la CI : c'est un outil d'atelier, lancé à la main quand
on ajoute une image.

USAGE
-----
Pillow n'est pas dans le Python système. Le venv du plugin google-image-gen l'a
déjà, on emprunte donc son interpréteur :

    PLUGIN=~/.claude/plugins/cache/google-image-gen/google-image-gen/1.0.0
    cd $PLUGIN && uv run python <dépôt>/tools/detourer.py \
        <dépôt>/assets/gen/bocian-head.png \
        <dépôt>/public/assets/img/bocian-head.png 512

LES DEUX ÉTAPES, ET POURQUOI LA SECONDE
---------------------------------------
1. Floodfill depuis les 4 coins : seul le fond CONTIGU devient transparent. Un
   floodfill et non un seuil global sur la couleur — sans quoi une zone verte
   appartenant au sujet serait trouée elle aussi.
2. Rognage du liseré. Les pixels de bord sont un mélange vert/blanc dû à
   l'anti-aliasing ; leur couleur est trop loin du vert pur pour que l'étape 1
   les emporte, et ils forment le halo verdâtre encore visible sur
   `zubr-head.png` (détouré avant que cette étape existe). On les retire en
   quelques passes, en ne touchant QUE les pixels à dominance verte adjacents à
   du transparent — la double condition est ce qui protège le sujet.

À SAVOIR
--------
- Le vert RENDU dérive toujours du vert demandé (#00b140) : on l'échantillonne
  aux coins plutôt que de le coder en dur.
- Le rendu transparent de certains visualiseurs peut sembler encore opaque :
  vérifier l'alpha réel, ce que fait le récapitulatif imprimé en fin de course.
"""

import sys
from PIL import Image, ImageDraw

# Magenta : absent de tous nos stickers, donc utilisable comme marqueur.
SENTINELLE = (255, 0, 255)
TOLERANCE = 60
PASSES_LISERE = 3
TAILLE_DEFAUT = 512


def dominance_verte(px):
    """Vrai si le vert domine assez pour que ce pixel soit du fond résiduel."""
    r, g, b = px[0], px[1], px[2]
    return g > r + 18 and g > b + 18


def detourer(src, dst, taille=TAILLE_DEFAUT):
    img = Image.open(src).convert("RGB")
    w, h = img.size

    # --- 1. le fond contigu, atteint depuis les 4 coins ---
    for xy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if img.getpixel(xy) == SENTINELLE:
            continue  # déjà emporté par un coin précédent
        ImageDraw.floodfill(img, xy, SENTINELLE, thresh=TOLERANCE)

    out = img.convert("RGBA")
    px = out.load()
    for y in range(h):
        for x in range(w):
            if px[x, y][:3] == SENTINELLE:
                px[x, y] = (0, 0, 0, 0)

    # --- 2. le liseré d'anti-aliasing ---
    for _ in range(PASSES_LISERE):
        a_retirer = []
        for y in range(h):
            for x in range(w):
                if px[x, y][3] == 0 or not dominance_verte(px[x, y]):
                    continue
                # Adjacent à du transparent ? Sinon c'est du vert du sujet.
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] == 0:
                        a_retirer.append((x, y))
                        break
        if not a_retirer:
            break
        for x, y in a_retirer:
            px[x, y] = (0, 0, 0, 0)
        print(f"  passe liseré : {len(a_retirer)} pixels retirés")

    # `taille` borne la plus GRANDE dimension ; l'autre suit le ratio de la
    # source. Sans quoi une bannière large (ratio ≠ 1:1) sortirait écrasée en
    # carré — inoffensif jusqu'ici puisque toutes les sources étaient déjà
    # carrées, donc ce calcul leur rend exactement le même résultat.
    echelle = taille / max(w, h)
    nw, nh = round(w * echelle), round(h * echelle)
    out = out.resize((nw, nh), Image.LANCZOS)
    out.save(dst)

    # --- récapitulatif : de quoi conclure sans ouvrir l'image ---
    v = out.load()
    coins = [
        v[0, 0][3],
        v[nw - 1, 0][3],
        v[0, nh - 1][3],
        v[nw - 1, nh - 1][3],
    ]
    restants = sum(
        1
        for y in range(nh)
        for x in range(nw)
        if v[x, y][3] > 0 and dominance_verte(v[x, y])
    )
    print(f"{dst} — {nw}x{nh}, alpha des coins = {coins}")
    print(f"pixels à dominance verte restants : {restants}")
    if any(coins):
        print("⚠️  un coin n'est pas transparent : le fond n'était pas uniforme ?")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(f"usage : {sys.argv[0]} <source.png> <sortie.png> [taille]")
    detourer(
        sys.argv[1],
        sys.argv[2],
        int(sys.argv[3]) if len(sys.argv) > 3 else TAILLE_DEFAUT,
    )
