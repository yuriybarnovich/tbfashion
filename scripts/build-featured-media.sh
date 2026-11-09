#!/usr/bin/env bash
# Prepare the November shoot and silent hero video for the static site.
# Usage: bash scripts/build-featured-media.sh [source_dir]
set -euo pipefail
SRC="${1:-$HOME/Downloads/fashion-photo}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/site/img" "$ROOT/site/video"

for f in "$SRC"/*.JPG; do
  name="$(basename "$f" .JPG)"
  for width in 480 960 1600; do
    magick "$f" -auto-orient -strip -resize "${width}x>" -quality 82 \
      -define webp:method=6 "$ROOT/site/img/november-${name#IMG_}-${width}.webp"
  done
done

ffmpeg -hide_banner -loglevel error -y -i "$SRC/IMG_4116.MOV" \
  -map 0:v:0 -an -map_metadata -1 -vf 'scale=720:-2,setsar=1' \
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart \
  "$ROOT/site/video/hero.mp4"
ffmpeg -hide_banner -loglevel error -y -ss 1 -i "$SRC/IMG_4116.MOV" \
  -frames:v 1 -vf 'scale=1080:-2' -c:v libwebp -quality 84 \
  "$ROOT/site/img/hero-video-poster.webp"
