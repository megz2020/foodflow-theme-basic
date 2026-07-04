# -*- coding: utf-8 -*-
from odoo import fields, models

from ..constants import (
    CONFIG_PARAM_ENABLED,
    CONFIG_PARAM_PRESET,
    FOODFLOW_APP_URL,
    FOODFLOW_DOCS_URL,
    FOODFLOW_PRO_URL,
    FOODFLOW_SIGNUP_URL,
    FOODFLOW_WEBSITE_URL,
    PRESET_CAFE,
    PRESET_RESTAURANT,
)


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    foodflow_theme_basic_enabled = fields.Boolean(
        string="FoodFlow Theme Basic",
        config_parameter=CONFIG_PARAM_ENABLED,
        help="Apply warm restaurant/café styling across your Odoo back office.",
    )
    foodflow_theme_basic_preset = fields.Selection(
        [
            (PRESET_RESTAURANT, "Restaurant — bold FoodFlow red"),
            (PRESET_CAFE, "Café — warm terracotta & cream"),
        ],
        string="Hospitality style",
        config_parameter=CONFIG_PARAM_PRESET,
        default=PRESET_RESTAURANT,
    )
    foodflow_portal_url = fields.Char(
        string="FoodFlow dashboard",
        default=FOODFLOW_APP_URL,
        readonly=True,
    )
    foodflow_website_url = fields.Char(
        string="FoodFlow website",
        default=FOODFLOW_WEBSITE_URL,
        readonly=True,
    )
    foodflow_signup_url = fields.Char(
        string="FoodFlow signup",
        default=FOODFLOW_SIGNUP_URL,
        readonly=True,
    )
    foodflow_docs_url = fields.Char(
        string="FoodFlow docs",
        default=FOODFLOW_DOCS_URL,
        readonly=True,
    )
    foodflow_pro_url = fields.Char(
        string="FoodFlow Theme Pro",
        default=FOODFLOW_PRO_URL,
        readonly=True,
    )

    def action_open_foodflow_app(self):
        return {"type": "ir.actions.act_url", "url": FOODFLOW_APP_URL, "target": "new"}

    def action_open_foodflow_signup(self):
        return {"type": "ir.actions.act_url", "url": FOODFLOW_SIGNUP_URL, "target": "new"}

    def action_open_foodflow_docs(self):
        return {"type": "ir.actions.act_url", "url": FOODFLOW_DOCS_URL, "target": "new"}

    def action_open_foodflow_pro(self):
        return {"type": "ir.actions.act_url", "url": FOODFLOW_PRO_URL, "target": "new"}
