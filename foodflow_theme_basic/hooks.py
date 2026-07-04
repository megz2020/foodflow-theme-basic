# -*- coding: utf-8 -*-
import logging

from .constants import CONFIG_PARAM_ENABLED

_logger = logging.getLogger(__name__)


def post_init_hook(env):
    """Enable theme branding on install (Community-friendly, optional module)."""
    env["ir.config_parameter"].sudo().set_param(CONFIG_PARAM_ENABLED, "True")
    _logger.info("FoodFlow Theme Basic installed — backend branding active.")


def uninstall_hook(env):
    env["ir.config_parameter"].sudo().set_param(CONFIG_PARAM_ENABLED, "False")
