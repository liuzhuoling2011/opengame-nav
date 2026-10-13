# OpenGame / 开源游戏导航

Bilingual (zh-CN / en) static directory of open-source and browser-ported games — remakes, FPS ports, skate, open-world WASM titles, and more.

中英双语的开源 / 网页移植游戏导航站：分类展示近期可玩的游戏，含精选「我的重制」、截图与外链。

## Preview / 预览

```bash
cd /workspace/opengame-nav
python3 -m http.server 8765
# open http://127.0.0.1:8765
```

Or open `index.html` via any static file server (needed so `games.json` can be fetched).

## Structure / 结构

```
opengame-nav/
├── index.html          # landing page
├── styles.css          # dark game-directory UI
├── app.js              # i18n, search, category filters
├── games.json          # all game entries (edit this to add games)
├── README.md
└── public/
    ├── favicon.svg
    └── screenshots/    # optional thumbnails
```

## Add a game / 添加游戏

Edit `games.json` and append an object under `games`:

```json
{
  "id": "unique-slug",
  "category": "fps-classics",
  "url": "https://example.com/play",
  "title": { "zh": "中文名", "en": "English Name" },
  "blurb": { "zh": "一句话简介", "en": "One-line description" },
  "tags": ["fps", "classic"],
  "screenshot": "public/screenshots/your-slug.webp"   // 800×450 webp, 16:9
}
```

- `category` must match an `id` in `categories` (`remakes`, `fps-zombies`, `sports`, `fps-classics`, `open-world`).
- Set `"featured": true` for highlight cards under **My Remakes**.
- `screenshot` is optional; without it a colored placeholder is used.
- Language toggle persists in `localStorage` (`opengame-nav-lang`).

## Deploy / 部署

Pure static files — push to GitHub and enable **Pages** on the repo root (or `/docs`). No build step required.

## Notes / 说明

- Some fan ports need your own original game files; skip sites that require downloading a launcher.
- More GTA / Minecraft-style WASM ports: [wasmarcade.com](https://wasmarcade.com)
- Featured remakes: Big Fish Eat Small Fish, Gold Miner, Old Master Q Monopoly, Plants vs Zombies.
- Screenshots of third-party games come from each port's own og:image, Steam store pages, or Wikipedia, and belong to their respective owners.
