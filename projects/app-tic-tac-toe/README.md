# Fantasy Tic Tac Toe

**Fantasy Tic Tac Toe** — a polished, themed tic-tac-toe web app with fantasy artwork, draggable launcher, and a compact embeddable widget.

## Features
- X / O rendered with images (`dragon.png` and `knight.png`)
- 5 visual themes: Ice, Gold, Dark, Legendary, Green
- Themed winner popup with image and auto-advance to next theme
- Close (✕) hides the app and creates a draggable knight launcher — click it to restore
- Responsive layout with accessible interactions
- Clean, modular code suitable for portfolio/demo

## Files
- `app.html` — main HTML (drop-in)
- `app.css` — styles
- `app.js` — cleaned game logic (keep unchanged to preserve behavior)
- `embed.js` — embeddable widget (mounts the game into an iframe)
- `assets/` — required images:
  - `dragon.png`
  - `knight.png`
  - `theme1.jpg`
  - `theme2.jpg`
  - `theme3.jpg`
  - `theme4.jpg`
  - `theme5.jpg`

## How to run locally
1. Put the `assets/` folder and files in the project root (same level as `app.html`).
2. Open `app.html` in your browser (or serve via simple HTTP server):
   ```bash
   npx http-server .   # or python -m http.server 8000
