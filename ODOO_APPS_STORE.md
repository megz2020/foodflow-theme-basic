# Publish FoodFlow Theme Basic on Odoo Apps

Public repo · free module · branches `17.0`, `18.0`, `19.0`.

## Repository layout (required)

```
foodflow-theme-basic/          ← git repo root
├── foodflow_theme_basic/      ← technical module name (one folder per module)
│   ├── __manifest__.py        ← version prefix matches branch (e.g. 18.0.x.x on 18.0)
│   └── static/description/
│       ├── index.html         ← store description page
│       ├── banner.png         ← 560×280 recommended
│       ├── icon.png           ← 128×128
│       └── screenshots/
└── README.md
```

## Git branches (required)

| Branch | Odoo series | Manifest version |
|--------|-------------|------------------|
| `17.0` | 17.0 | `17.0.1.0.0` |
| `18.0` | 18.0 | `18.0.1.0.3` (default dev) |
| `19.0` | 19.0 | `19.0.1.0.0` |

Create or refresh a version branch:

```bash
git checkout 18.0
./scripts/prepare-odoo-branch.sh 18   # only when starting a new series branch
```

## GitHub remote (public)

```bash
# one-time — replace ORG with your GitHub org/user
gh repo create foodflow/foodflow-theme-basic --public --source=. --remote=origin

git push -u origin 18.0
git push -u origin 17.0
git push -u origin 19.0
```

**Repo must be public** (no `online-odoo` collaborator needed for public repos).

## Register on Odoo Apps

1. Sign in at [apps.odoo.com](https://apps.odoo.com) with your publisher account.
2. Open [Submit your Apps](https://apps.odoo.com/apps/upload).
3. Register each Odoo series separately using **SSH URL + branch**:

| Series | Repository URL to register |
|--------|---------------------------|
| Odoo 17 | `ssh://git@github.com/foodflow/foodflow-theme-basic#17.0` |
| Odoo 18 | `ssh://git@github.com/foodflow/foodflow-theme-basic#18.0` |
| Odoo 19 | `ssh://git@github.com/foodflow/foodflow-theme-basic#19.0` |

4. Click **Validate** on each draft repository.
5. Set module metadata on the store listing (category **Theme/Creative**, price **Free**, LGPL-3).

### Private repo only

If the repo were private, grant GitHub user **`online-odoo`** read access on the repository (not the whole org).

## Manifest checklist

- [x] `license`: `LGPL-3`
- [x] `author` / `maintainer`: `FoodFlow`
- [x] `website`: `https://foodflo.app`
- [x] `support`: `support@foodflo.app`
- [x] `images`: banner, icon, screenshots
- [x] `version`: matches branch (`18.0.x.x` on `18.0`)
- [x] `installable`: `True`
- [x] No hard dependency on paid / private modules

## Store assets checklist

- [x] `static/description/index.html` — Odoo `oe_container` layout
- [x] `static/description/banner.png`
- [x] `static/description/icon.png`
- [x] Screenshots in `static/description/screenshots/`
- [x] All external links → `https://foodflo.app` (until dedicated pages exist)

## After publish

1. Install from Apps on a test database (17 / 18 / 19).
2. Bump manifest patch version on the matching branch for each release.
3. Push branch → Odoo Apps re-syncs automatically.

## Do not publish from this repo

**FoodFlow Theme Pro** and **FoodFlow Connector** stay in the private `foodflow-connector` repo — never register that repo on Odoo Apps. See [DISTRIBUTION.md](DISTRIBUTION.md).
