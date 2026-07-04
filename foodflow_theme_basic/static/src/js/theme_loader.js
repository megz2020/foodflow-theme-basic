/** @odoo-module **/

import { WebClient } from "@web/webclient/webclient";
import { patch } from "@web/core/utils/patch";
import { session } from "@web/session";
import { startFoodflowBrandObserver } from "./foodflow_brand";

function applyFoodflowTheme() {
    if (!session.foodflow_theme_enabled) {
        return;
    }
    document.body.classList.add("o_foodflow_theme");
    const preset = session.foodflow_theme_preset || "restaurant";
    document.body.classList.add(`o_foodflow_preset_${preset}`);
    if (session.foodflow_theme_rtl) {
        document.body.classList.add("o_foodflow_rtl");
        document.documentElement.setAttribute("dir", "rtl");
        document.documentElement.setAttribute("lang", "ar");
    }
}

patch(WebClient.prototype, {
    setup() {
        super.setup(...arguments);
        applyFoodflowTheme();
        startFoodflowBrandObserver();
    },
});
