# -*- coding: utf-8 -*-
"""FoodFlow Theme Basic design tokens."""

CONFIG_PARAM_ENABLED = "foodflow_theme_basic.enabled"
CONFIG_PARAM_PRESET = "foodflow_theme_basic.preset"

BRAND_PRIMARY = "#d63a32"
BRAND_PRIMARY_DARK = "#a82e28"
BRAND_PRIMARY_LIGHT = "#f06b63"
BRAND_NAVBAR = "#8f2620"
BRAND_NAVBAR_GRADIENT_END = "#6b1c18"

SURFACE_PAGE = "#f7f3ee"
SURFACE_CARD = "#ffffff"
SURFACE_ELEVATED = "#fffdf9"
SURFACE_ACCENT = "#f0e6d8"

TEXT_PRIMARY = "#2a211c"
TEXT_MUTED = "#6b5e54"
TEXT_ON_BRAND = "#ffffff"

ACCENT_SAGE = "#5a7a52"
ACCENT_GOLD = "#c9a227"
ACCENT_WARM = "#e8c9a0"

RADIUS_SM = "8px"
RADIUS_MD = "12px"
RADIUS_LG = "16px"
SHADOW_SOFT = "0 2px 12px rgba(42, 33, 28, 0.06)"
SHADOW_CARD = "0 4px 20px rgba(42, 33, 28, 0.08)"

PRESET_RESTAURANT = "restaurant"
PRESET_CAFE = "cafe"
PRESET_DEFAULT = PRESET_RESTAURANT

FOODFLOW_BASE_URL = "https://foodflo.app"


def foodflow_url(path, content):
    """foodflo.app link tagged so sign-ups from this module show up in analytics."""
    return (
        f"{FOODFLOW_BASE_URL}{path}?utm_source=odoo_apps&utm_medium=theme_basic"
        f"&utm_campaign=odoo_theme&utm_content={content}"
    )


FOODFLOW_WEBSITE_URL = foodflow_url("/", "website")
FOODFLOW_APP_URL = foodflow_url("/login", "open_app")
FOODFLOW_PRO_BASE_URL = FOODFLOW_BASE_URL
FOODFLOW_PRO_URL = foodflow_url("/", "pro") + "#pricing"
FOODFLOW_SIGNUP_URL = foodflow_url("/signup", "signup")
FOODFLOW_DOCS_URL = foodflow_url("/guide", "docs")
FOODFLOW_LOGIN_PAGE_URL = foodflow_url("/", "login_page")
