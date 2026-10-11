# Tetyana Barnovych — model portfolio site (barnovych.fashion)

Approved in chat 2026-10-11.

## Goal
One-page static model card, English, deployed to HostPro shared hosting under barnovych.fashion.
Reference: barbaralim.net (name, stats, portfolio, contact).

## Content
- Name: Tetyana Barnovych. Subtitle: Model.
- Stats: Height 173 cm / 5'8", Bust 88 cm / 34.5", Waist 73 cm / 28.5", Hips 93 cm / 36.5",
  Shoes 39 EU / 8 US, Dress 2–3 US / 34–36 EU, Hair brown, Eyes green.
- Contact: email tetyana.barnovych@gmail.com, phone +380 63 688 78 88. No Instagram yet, no agencies, no form.
- Portfolio: three shoots in order 1 → 2 → 3 (source ~/Downloads/fashion/{1,2,3}). Hero = 1/1.jpg.

## Design
- Light minimal: cream background, near-black text, serif display (Cormorant Garamond) + sans (Jost).
- Full-viewport hero photo with name overlay; sections: Stats, Portfolio, Contact, footer.
- Gallery grid, click opens lightbox (keyboard + swipe), lazy-loaded responsive WebP.

## Tech
- Plain HTML/CSS/JS in `site/`. No build step for the page; `scripts/build-images.sh` generates WebP
  (widths 480/960/1600, hero up to 2400) into `site/img/`. Originals never shipped.
- Deploy = upload `site/` contents to HostPro document root; then point GoDaddy DNS at HostPro.
