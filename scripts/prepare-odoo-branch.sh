#!/usr/bin/env bash
# Bump manifest version for an Odoo major version branch (17 / 18 / 19).
set -euo pipefail

VER="${1:-}"
if [[ ! "$VER" =~ ^(17|18|19)$ ]]; then
  echo "Usage: $0 <17|18|19>" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT/foodflow_theme_basic/__manifest__.py"
MANIFEST_VER="${VER}.0.1.0.0"

python3 - "$MANIFEST" "$MANIFEST_VER" <<'PY'
import re, sys
path, ver = sys.argv[1], sys.argv[2]
text = open(path, encoding="utf-8").read()
text = re.sub(
    r'"version":\s*"[0-9]+(?:\.[0-9]+)+"',
    f'"version": "{ver}"',
    text,
    count=1,
)
open(path, "w", encoding="utf-8").write(text)
print(f"  {path} → {ver}")
PY

echo "Done. Branch ready for Odoo ${VER}.0 (manifest ${MANIFEST_VER})."
