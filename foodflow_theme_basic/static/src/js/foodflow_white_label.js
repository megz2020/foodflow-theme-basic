/** @odoo-module **/

import { registry } from "@web/core/registry";
import { session } from "@web/session";
import { patch } from "@web/core/utils/patch";
import { TitlePlugin } from "@web/core/browser/title_plugin";
import { browser } from "@web/core/browser/browser";
import { _t } from "@web/core/l10n/translation";
import { resConfigEdition } from "@web/webclient/settings_form_view/widgets/res_config_edition";
import { Component, useProps } from "@odoo/owl";
import { Setting } from "@web/views/form/setting/setting";
import { standardWidgetProps } from "@web/views/widgets/standard_widget_props";

const FOODFLOW_BRAND = "FoodFlow";

function whiteLabelEnabled() {
    return Boolean(session.foodflow_theme_enabled);
}

function foodflowUrl(key, fallback) {
    return session[key] || fallback;
}

patch(TitlePlugin.prototype, {
    setup() {
        super.setup(...arguments);
        if (whiteLabelEnabled()) {
            // Shown alone when no part is set, and as the first part otherwise.
            this.defaultTitle = FOODFLOW_BRAND;
            this.setParts({ brand: FOODFLOW_BRAND });
        }
    },
});

if (whiteLabelEnabled()) {
    const menuRegistry = registry.category("user_menuitems");
    menuRegistry.remove("odoo_account");
    menuRegistry.remove("documentation");
    menuRegistry.remove("support"); // Odoo 20 "Help" (odoo.com)

    const docsUrl = foodflowUrl("foodflow_docs_url", "https://foodflo.app");
    const websiteUrl = foodflowUrl("foodflow_website_url", "https://foodflo.app");
    const appUrl = foodflowUrl("foodflow_app_url", "https://foodflo.app");
    const signupUrl = foodflowUrl("foodflow_signup_url", "https://foodflo.app");
    const proUrl = foodflowUrl("foodflow_pro_url", "https://foodflo.app");

    menuRegistry.add(
        "foodflow_about",
        () => ({
            type: "item",
            id: "foodflow_about",
            description: _t("About FoodFlow"),
            // The details card lives in the launcher, which Enterprise doesn't use.
            callback: () =>
                session.foodflow_use_launcher
                    ? document.dispatchEvent(new CustomEvent("foodflow-open-details"))
                    : browser.open(websiteUrl, "_blank"),
            sequence: 5,
        }),
        { force: true }
    );
    menuRegistry.add(
        "foodflow_help",
        () => ({
            type: "item",
            id: "foodflow_help",
            description: _t("FoodFlow Help"),
            callback: () => browser.open(docsUrl, "_blank"),
            sequence: 10,
        }),
        { force: true }
    );
    menuRegistry.add(
        "foodflow_home",
        () => ({
            type: "item",
            id: "foodflow_home",
            description: _t("Open FoodFlow"),
            callback: () => browser.open(appUrl, "_blank"),
            sequence: 15,
        }),
        { force: true }
    );
    if (!session.foodflow_has_connector) {
        menuRegistry.add(
            "foodflow_signup",
            () => ({
                type: "item",
                id: "foodflow_signup",
                description: _t("Start FoodFlow trial"),
                callback: () => browser.open(signupUrl, "_blank"),
                sequence: 18,
            }),
            { force: true }
        );
        menuRegistry.add(
            "foodflow_pro",
            () => ({
                type: "item",
                id: "foodflow_pro",
                description: _t("Upgrade to Theme Pro"),
                callback: () => browser.open(proUrl, "_blank"),
                sequence: 20,
            }),
            { force: true }
        );
    }

    class FoodflowResConfigEdition extends Component {
        static template = "foodflow_theme.ResConfigEdition";
        static components = { Setting };
        props = useProps({ ...standardWidgetProps });

        setup() {
            this.serverVersion = session.server_version;
            this.foodflowWebsiteUrl = websiteUrl;
            this.foodflowProUrl = proUrl;
        }
    }

    registry.category("view_widgets").add(
        "res_config_edition",
        { component: FoodflowResConfigEdition },
        { force: true }
    );
}
