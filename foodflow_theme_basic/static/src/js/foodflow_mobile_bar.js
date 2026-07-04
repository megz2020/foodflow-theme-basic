/** @odoo-module **/

import { Component, onMounted, onWillUnmount, useEffect, useState } from "@odoo/owl";
import { useBus, useService } from "@web/core/utils/hooks";
import { session } from "@web/session";

export class FoodflowMobileBar extends Component {
    static template = "foodflow_theme.FoodflowMobileBar";
    static props = {};

    setup() {
        if (!session.foodflow_theme_enabled) {
            return;
        }
        this.launcher = useService("foodflow_launcher");
        this.menuService = useService("menu");
        this.ui = useState(useService("ui"));
        this.state = useState({
            launcherOpen: this.launcher.isOpen,
        });

        const syncLauncher = () => {
            this.state.launcherOpen = this.launcher.isOpen;
        };

        useBus(this.env.bus, "FOODFLOW_LAUNCHER:CHANGED", syncLauncher);

        const syncBodyClass = () => {
            const isMobile = session.foodflow_theme_enabled && this.ui.isSmall;
            document.body.classList.toggle("o_foodflow_mobile_bar", isMobile);
            document.body.classList.toggle(
                "o_foodflow_launcher_mobile",
                isMobile && this.state.launcherOpen && session.foodflow_use_launcher
            );
        };

        onMounted(syncBodyClass);
        onWillUnmount(() => {
            document.body.classList.remove("o_foodflow_mobile_bar", "o_foodflow_launcher_mobile");
        });

        useBus(this.env.bus, "FOODFLOW_LAUNCHER:CHANGED", syncBodyClass);

        useEffect(
            () => {
                syncBodyClass();
            },
            () => [this.ui.isSmall, this.state.launcherOpen]
        );
    }

    get visible() {
        return session.foodflow_theme_enabled && this.ui.isSmall;
    }

    get homeActive() {
        return this.state.launcherOpen;
    }

    get currentAppLabel() {
        return this.menuService.getCurrentApp()?.name || "FoodFlow";
    }

    get currentAppTitle() {
        const app = this.menuService.getCurrentApp();
        return app ? `${app.name} — open menus` : "Open app menus";
    }

    _closeLauncherIfNeeded() {
        if (this.state.launcherOpen) {
            this.launcher.close();
        }
    }

    toggleHome() {
        if (session.foodflow_use_launcher) {
            if (this.state.launcherOpen) {
                this.launcher.close();
            } else {
                this.launcher.open();
            }
            return;
        }
        this._closeLauncherIfNeeded();
        this.env.bus.trigger("FOODFLOW:OPEN_MOBILE_SIDEBAR_ALL_APPS");
    }

    openCurrentAppMenus() {
        this._closeLauncherIfNeeded();
        this.env.bus.trigger("FOODFLOW:OPEN_MOBILE_SIDEBAR_APP");
    }

    openAllApps() {
        this._closeLauncherIfNeeded();
        this.env.bus.trigger("FOODFLOW:OPEN_MOBILE_SIDEBAR_ALL_APPS");
    }
}
