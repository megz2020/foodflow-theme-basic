#!/usr/bin/env bash
# Create Odoo Apps version branches (17.0, 18.0, 19.0) from current 18.0 dev tree.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Run from an initialized git repo (git init + first commit on 18.0)." >&2
  exit 1
fi

CURRENT="$(git branch --show-current)"
if [[ "$CURRENT" != "18.0" ]]; then
  git checkout 18.0
fi

for VER in 17 19; do
  BRANCH="${VER}.0"
  if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
    echo "Branch $BRANCH already exists — skip"
    continue
  fi
  git checkout -b "$BRANCH"
  ./scripts/prepare-odoo-branch.sh "$VER"
  git add foodflow_theme_basic/__manifest__.py
  git commit -m "chore: set manifest to ${VER}.0.1.0.0 for Odoo Apps branch"
  git checkout 18.0
done

echo ""
echo "Branches ready:"
git branch -a
echo ""
echo "Push: git push -u origin 18.0 && git push -u origin 17.0 && git push -u origin 19.0"
