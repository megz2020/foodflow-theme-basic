# FoodFlow Theme Basic

Free Odoo hospitality theme — **backend branding only**.

**Distribution:** This repo is **public** and listed on the **Odoo Apps Store**.  
Pro modules are **private** — see [DISTRIBUTION.md](DISTRIBUTION.md).  
**Publishing steps:** [ODOO_APPS_STORE.md](ODOO_APPS_STORE.md)

**Supported Odoo versions:** 17.0, 18.0, 19.0 (Community & Enterprise).  
Use git branch `17.0`, `18.0`, or `19.0` matching your install — see [VERSIONING.md](VERSIONING.md).

| | Basic (this repo) | Pro (`foodflow-connector`) |
|---|---|---|
| Price | Free · LGPL-3 | FoodFlow subscription |
| Odoo versions | 17, 18, 19 | 17, 18, 19 |
| Back office theme | ✓ | ✓ |
| POS v2 styling | — | ✓ |
| FoodFlow Connector | — | ✓ |
| Analytics dashboard | — | ✓ |

## Preview page

Open the marketing comparison page **before** publishing to Odoo Apps:

```bash
open docs/index.html
# or
python3 -m http.server 8765 --directory docs
# then visit http://localhost:8765/index.html
```

## Install

1. Copy `foodflow_theme_basic` into your Odoo addons path.
2. Update apps list → install **FoodFlow Theme Basic**.
3. Settings → FoodFlow Theme Basic → enable & pick Restaurant or Café preset.

**Do not install Basic and Pro together** — they overlap on branding.

## Docker (local test)

```bash
docker compose up odoo17-basic   # http://localhost:8037
docker compose up odoo18-basic   # http://localhost:8019
docker compose up odoo19-basic   # http://localhost:8039
```

## Screenshots

```bash
cd scripts && npm install && node capture-tier-screenshots.mjs basic
```

Saves PNGs to `screenshots/` for `docs/index.html`.

## Upgrade path

Settings → **Upgrade to Pro** → [foodflo.app](https://foodflo.app).
Pro modules: `foodflow_theme` + `foodflow_connector` in the private **foodflow-connector** repo (not on Odoo Apps).
