/** @odoo-module **/

import { WebClient } from "@web/webclient/webclient";
import { NavBar } from "@web/webclient/navbar/navbar";
import { patch } from "@web/core/utils/patch";
import { useBus } from "@web/core/utils/hooks";
import { useCommand } from "@web/core/commands/command_hook";
import { _t } from "@web/core/l10n/translation";
import { session } from "@web/session";
import { FoodflowHomeMenu } from "./foodflow_home_menu";
import { FoodflowMobileBar } from "./foodflow_mobile_bar";

import "./foodflow_launcher_service";

patch(WebClient, {
    components: { ...WebClient.components, FoodflowHomeMenu, FoodflowMobileBar },
});

patch(WebClient.prototype, {
    async _loadDefaultApp() {
        if (session.foodflow_use_launcher) {
            this.env.services.foodflow_launcher.open();
            return;
        }
        return super._loadDefaultApp(...arguments);
    },
});

patch(NavBar.prototype, {
    setup() {
        super.setup(...arguments);
        if (!session.foodflow_theme_enabled) {
            return;
        }
        if (session.foodflow_use_launcher) {
            useCommand(_t("Home Menu"), () => this.env.services.foodflow_launcher.open(), {
                hotkey: "h",
                category: "navigation",
            });
        }
        useBus(this.env.bus, "FOODFLOW:OPEN_MOBILE_SIDEBAR_ALL_APPS", () => {
            this._openMobileSidebar({ allApps: true });
        });
        useBus(this.env.bus, "FOODFLOW:OPEN_MOBILE_SIDEBAR_APP", () => {
            this._openMobileSidebar({ allApps: false });
        });
        // Legacy bus name used by earlier builds
        useBus(this.env.bus, "FOODFLOW:OPEN_MOBILE_SIDEBAR", () => {
            this._openMobileSidebar({ allApps: true });
        });
    },

    _openMobileSidebar({ allApps = false } = {}) {
        this.state.isAllAppsMenuOpened = allApps;
        this.state.isAppMenuSidebarOpened = true;
    },

    openFoodflowLauncher() {
        if (session.foodflow_use_launcher) {
            this.env.services.foodflow_launcher.open();
        }
    },
});
