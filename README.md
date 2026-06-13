# kirmy.org

**Kirmy** — a privacy-first browser concept. Block trackers, shield your fingerprint, route tabs through Tor, and search without being followed.

🔗 Live at **[kirmy.org](https://kirmy.org)**

## What's here

A single-page concept site built with plain HTML and JavaScript, with a small interactive canvas and a live "tweaks" panel. Like the rest of my sites, it runs behind a strict Content Security Policy.

## Running it locally

> **Heads up:** the strict CSP blocks `file://` URLs, so open it through a local server — don't just double-click `index.html`.

```bash
git clone https://github.com/Officialckazros/Kirmy.org.git
cd Kirmy.org
python3 -m http.server 8080
# open http://localhost:8080/
```

## Layout

```
index.html              The page
app.js                  App entry / wiring
design-canvas.js        The interactive canvas
kirmy-components.js     UI components
tweaks-panel.js         Live tweaks panel
assets/js/              Vendored React
robots.txt
.well-known/security.txt
```

## License

[GPL-3.0](LICENSE).

---

A concept by me — feedback always welcome. 💜
