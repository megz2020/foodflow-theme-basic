# Distribution — Basic (public)

| | Basic (this repo) |
|---|---|
| **Product** | FoodFlow Theme Basic |
| **Odoo Apps Store** | **Yes — publish here** |
| **License** | LGPL-3 |
| **Price** | Free |
| **Git visibility** | Public repository |
| **Module** | `foodflow_theme_basic` |

## Odoo version branches

Use one branch per Odoo major version — all are store-eligible:

| Branch | Odoo | Publish to Apps as |
|--------|------|-------------------|
| `17.0` | 17.0 | `17.0.x.x` |
| `18.0` | 18.0 | `18.0.x.x` (default dev) |
| `19.0` | 19.0 | `19.0.x.x` |

```bash
./scripts/prepare-odoo-branch.sh 18   # bump manifest for target Odoo
```

## Odoo Apps assets

- `foodflow_theme_basic/static/description/banner.png` (560×280)
- `foodflow_theme_basic/static/description/icon.png` (128×128)
- `foodflow_theme_basic/static/description/index.html`

## What Basic includes

Back-office hospitality theme only — **no POS v2**, no Connector, no dashboard.

In-app **FoodFlow details card** and Settings links point to [foodflo.app](https://foodflo.app).

## What is NOT in this repo

**FoodFlow Theme Pro** and **FoodFlow Connector** live in the private `foodflow-connector` repo — **not** submitted to Odoo Apps.

## Install rule

Customers install **either** Basic **or** Pro theme — never both.
