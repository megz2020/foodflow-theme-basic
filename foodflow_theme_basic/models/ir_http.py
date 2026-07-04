# -*- coding: utf-8 -*-
from odoo import models

from ..constants import (
    CONFIG_PARAM_ENABLED,
    CONFIG_PARAM_PRESET,
    FOODFLOW_APP_URL,
    FOODFLOW_DOCS_URL,
    FOODFLOW_PRO_URL,
    FOODFLOW_SIGNUP_URL,
    FOODFLOW_WEBSITE_URL,
    PRESET_DEFAULT,
)


class IrHttp(models.AbstractModel):
    _inherit = "ir.http"

    def session_info(self):
        info = super().session_info()
        icp = self.env["ir.config_parameter"].sudo()
        enabled = icp.get_param(CONFIG_PARAM_ENABLED, "False") == "True"
        info["foodflow_theme_enabled"] = enabled
        info["foodflow_theme_preset"] = icp.get_param(CONFIG_PARAM_PRESET, PRESET_DEFAULT)
        lang = (info.get("user_context") or {}).get("lang") or ""
        info["foodflow_theme_rtl"] = lang.startswith("ar")
        has_enterprise = bool(
            self.env["ir.module.module"].search_count(
                [("name", "=", "web_enterprise"), ("state", "=", "installed")]
            )
        )
        info["foodflow_use_launcher"] = enabled and not has_enterprise
        info["foodflow_theme_tier"] = "basic"
        info["foodflow_website_url"] = FOODFLOW_WEBSITE_URL
        info["foodflow_app_url"] = FOODFLOW_APP_URL
        info["foodflow_signup_url"] = FOODFLOW_SIGNUP_URL
        info["foodflow_docs_url"] = FOODFLOW_DOCS_URL
        info["foodflow_pro_url"] = FOODFLOW_PRO_URL
        info["foodflow_has_connector"] = bool(
            self.env["ir.module.module"].search_count(
                [("name", "=", "foodflow_connector"), ("state", "=", "installed")]
            )
        )
        return info
