# -*- coding: utf-8 -*-
{
    "name": "FoodFlow Theme Basic",
    "version": "18.0.1.0.4",
    "summary": "Free hospitality theme for Odoo - backend branding, login and app launcher",
    "description": """
FoodFlow Theme Basic (free)
============================

Warm restaurant and cafe styling for the **Odoo back office** - no POS overhaul.

* FoodFlow login and navbar branding
* Cream backgrounds, soft cards, hospitality presets (Restaurant / Cafe)
* Enterprise-style app launcher on Community
* Forms, lists, kanban, Discuss - comfortable for daily staff use
* Arabic RTL tweaks and translations
* Toggle in Settings - FoodFlow Theme Basic
* FoodFlow platform details card (QR menu, online orders, WhatsApp, loyalty)

**Does not include** POS v2 layout, channel pills, product cards, or dashboard.
Upgrade to **FoodFlow Theme Pro** + **FoodFlow Connector** for the full experience.

**Supported Odoo versions:** 17.0, 18.0, 19.0 (Community and Enterprise).
Use git branch `17.0`, `18.0`, or `19.0` matching your Odoo install.
""",
    "category": "Theme/Creative",
    "license": "LGPL-3",
    "author": "FoodFlow",
    "maintainer": "FoodFlow",
    "website": "https://foodflo.app",
    "support": "support@foodflo.app",
    "depends": ["web", "mail"],
    "data": [
        "data/foodflow_theme_data.xml",
        "views/web_branding.xml",
        "views/web_login_layout.xml",
        "views/res_config_settings_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "foodflow_theme_basic/static/src/js/foodflow_launcher_service.js",
            "foodflow_theme_basic/static/src/xml/foodflow_templates.xml",
            "foodflow_theme_basic/static/src/js/foodflow_home_menu.js",
            "foodflow_theme_basic/static/src/js/foodflow_mobile_bar.js",
            "foodflow_theme_basic/static/src/js/foodflow_launcher.js",
            "foodflow_theme_basic/static/src/js/foodflow_push_quiet.js",
            "foodflow_theme_basic/static/src/js/foodflow_brand.js",
            "foodflow_theme_basic/static/src/js/foodflow_white_label.js",
            "foodflow_theme_basic/static/src/js/theme_loader.js",
            "foodflow_theme_basic/static/src/scss/_foodflow_tokens.scss",
            "foodflow_theme_basic/static/src/scss/_brand.scss",
            "foodflow_theme_basic/static/src/scss/_launcher.scss",
            "foodflow_theme_basic/static/src/scss/_hospitality.scss",
            "foodflow_theme_basic/static/src/scss/_dashboard_products.scss",
            "foodflow_theme_basic/static/src/scss/_mobile.scss",
            "foodflow_theme_basic/static/src/scss/_login.scss",
            "foodflow_theme_basic/static/src/scss/_rtl.scss",
        ],
        "web.assets_frontend": [
            "foodflow_theme_basic/static/src/scss/_foodflow_tokens.scss",
            "foodflow_theme_basic/static/src/scss/_brand.scss",
            "foodflow_theme_basic/static/src/scss/_hospitality.scss",
            "foodflow_theme_basic/static/src/scss/_login.scss",
            "foodflow_theme_basic/static/src/scss/_rtl.scss",
        ],
    },
    "images": [
        "static/description/banner.png",
        "static/description/icon.png",
        "static/description/screenshots/backend.png",
        "static/description/screenshots/mobile.png",
    ],
    "installable": True,
    "auto_install": False,
    "post_init_hook": "post_init_hook",
    "uninstall_hook": "uninstall_hook",
}
