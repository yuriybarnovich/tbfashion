#!/usr/bin/env bash
# Prepare the six photos downloaded on November 19, preserving the originals.
# Usage: bash scripts/build-november19-images.sh [source_dir]
set -euo pipefail
SRC="${1:-$HOME/Downloads}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/site/img"
mkdir -p "$OUT"
for name in IMG_5298 IMG_5357-Duplicate_reblum IMG_5396 IMG_5464 IMG_5576 IMG_5732; do
  number="${name#IMG_}"
  number="${number%%-*}"
  for width in 480 960 1600; do
    magick "$SRC/$name.jpg" -auto-orient -strip -resize "${width}x>" \
      -quality 82 -define webp:method=6 "$OUT/november19-${number}-${width}.webp"
  done
done
