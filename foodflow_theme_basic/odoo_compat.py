# -*- coding: utf-8 -*-
"""Odoo version compatibility helpers (17 / 18 / 19)."""

from odoo import release

SUPPORTED_ODOO_VERSIONS = ("17.0", "18.0", "19.0")


def odoo_version_major():
    return release.version_info[0]


def odoo_version_string():
    return f"{odoo_version_major()}.0"


def view_modes(*modes):
    """Normalize tree/list for the running Odoo major version."""
    if odoo_version_major() >= 18:
        return ",".join("list" if m == "tree" else m for m in modes)
    return ",".join("tree" if m == "list" else m for m in modes)


def list_view_tag():
    """XML arch root tag for list/tree views."""
    return "list" if odoo_version_major() >= 18 else "tree"
