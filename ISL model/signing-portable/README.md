# Portable signing kit (3D avatar + A–Z finger-spelling)

This folder is **self-contained**. Copy the whole `signing-portable` directory into any static site or app (`public/`, `static/`, etc.).

## Contents

| File / folder | Purpose |
|---------------|---------|
| `signing-core.js` | **Generated** — pose data for A–Z + Three.js scene + animation loop. Regenerate from this repo with `npm run build:signing`. |
| `models/ybot.glb` | Mixamo-style avatar (same as Sign-Kit `ybot`). Copied by the build script. |
| `index.html` | Minimal demo: text input + letter-by-letter signing. |

## Dependencies (CDN)

The demo loads **three.js r136** and **GLTFLoader** from jsDelivr (see `index.html`). No npm install is required in the target project if you only serve these static files.

## Regenerating `signing-core.js` (from Sign-Kit client)

From the **client** project root:

```bash
npm run build:signing
```

This reads `src/Animations/Alphabets/A.js` … `Z.js`, snapshots the exact bone tuples, and overwrites `signing-portable/signing-core.js`.

## Integration in another project

1. Copy **`signing-portable`** (entire folder) into your app’s static assets, e.g. `public/signing-portable/`.
2. Open or route to `signing-portable/index.html`, or embed the same `<script type="module">` block from `index.html` in your page.
3. Ensure URLs resolve: `signing-core.js` and `models/ybot.glb` must be same-origin or CORS-enabled.

### API (global `SigningCore`)

- `SigningCore.loadCharacter('canvas-id', { modelUrl: 'models/ybot.glb', speed: 0.1, pauseMs: 800 })` → returns **`ref`**
- `SigningCore.playSign(ref, 'A')` — single letter
- `SigningCore.playText(ref, 'HELLO', (ch) => { ... })` — letters A–Z only (non-letters stripped)

## License / attribution

Keep the same license as the original Sign-Kit / Mixamo asset terms for `ybot.glb` and animation data.
