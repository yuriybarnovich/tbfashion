#!/usr/bin/env bash
# Generates responsive WebP images from the original shoots into site/img/.
# Usage: scripts/build-images.sh [source_dir]   (default ~/Downloads/fashion)
set -euo pipefail
SRC="${1:-$HOME/Downloads/fashion}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/site/img"
mkdir -p "$OUT"
for shoot in 1 2 3; do
  i=0
  for f in "$SRC/$shoot"/*.jpg; do
    i=$((i+1))
    base="s${shoot}-$(printf '%02d' $i)"
    for w in 480 960 1600; do
      magick "$f" -auto-orient -strip -resize "${w}x${w}>" -quality 82 -define webp:method=6 "$OUT/${base}-${w}.webp"
    done
    echo "$shoot/$(basename "$f") -> $base"
  done
done
# Hero: larger variants of 1/1.jpg
for w in 1200 2000 2600; do
  magick "$SRC/1/1.jpg" -auto-orient -strip -resize "${w}x>" -quality 84 -define webp:method=6 "$OUT/hero-${w}.webp"
done
# OG image (1200x630 crop from hero)
magick "$SRC/1/1.jpg" -auto-orient -strip -resize 1200x1800^ -gravity north -extent 1200x630 -quality 85 "$OUT/og.jpg"
echo done
