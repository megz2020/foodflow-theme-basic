# Odoo version support

FoodFlow Theme Basic supports **Odoo 17.0, 18.0, and 19.0** (Community & Enterprise).

| Git branch | Odoo | Manifest version | Notes |
|------------|------|------------------|-------|
| `17.0` | 17.0 | `17.0.x.x` | Same assets; manifest prefix only |
| `18.0` | 18.0 | `18.0.x.x` | **Default** — primary development |
| `19.0` | 19.0 | `19.0.x.x` | Same as 18.0 unless Odoo API diverges |

## Compatibility layer

- `foodflow_theme_basic/odoo_compat.py` — shared helpers for `tree` ↔ `list` when Python code returns `view_mode`.
- Backend OWL/SCSS assets are identical across 17–19 (no POS bundle in Basic).

## Docker smoke tests

```bash
docker compose up odoo17-basic   # http://localhost:8017
docker compose up odoo17-basic   # http://localhost:8037
docker compose up odoo18-basic   # http://localhost:8019
docker compose up odoo19-basic   # http://localhost:8039
```

## Creating version branches

```bash
git checkout -b 17.0
# set __manifest__.py version to 17.0.1.0.0

git checkout 18.0
# version 18.0.1.0.0 (current)

git checkout -b 19.0
# version 19.0.1.0.0
```

Use `scripts/prepare-odoo-branch.sh 17` (or `18` / `19`) to bump the manifest version automatically.

## Pro + Connector

Full POS theme and FoodFlow Connector live in the **private** `foodflow-connector` repo — **not** on Odoo Apps. See `foodflow-connector/DISTRIBUTION.md`.
