/** @odoo-module **/

import { Component, onMounted, onWillUnmount, proxy, useEffect } from "@odoo/owl";
import { useBus, useService } from "@web/core/utils/hooks";
import { session } from "@web/session";

export class FoodflowMobileBar extends Component {
    static template = "foodflow_theme.FoodflowMobileBar";

    setup() {
        if (!session.foodflow_theme_enabled) {
            return;
        }
        this.launcher = useService("foodflow_launcher");
        this.menuService = useService("menu");
        this.ui = proxy(useService("ui"));
        // Enterprise only: its own home menu replaces the launcher there.
        this.homeMenu = this.env.services.home_menu;
        this.state = proxy({
            launcherOpen: this.launcher.isOpen,
            hasHomeMenu: Boolean(this.homeMenu?.hasHomeMenu),
            appTick: 0,
        });
        useBus(this.env.bus, "HOME-MENU:TOGGLED", () => {
            this.state.hasHomeMenu = Boolean(this.homeMenu?.hasHomeMenu);
        });
        // The current app lives in the menu service, which isn't reactive.
        useBus(this.env.bus, "MENUS:APP-CHANGED", () => this.state.appTick++);

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

        // Tracks ui.isSmall and state.launcherOpen.
        useEffect(() => {
            syncBodyClass();
        });
    }

    get visible() {
        return session.foodflow_theme_enabled && this.ui.isSmall;
    }

    get homeActive() {
        return this.state.launcherOpen || this.state.hasHomeMenu;
    }

    get currentAppLabel() {
        this.state.appTick; // re-render when the app changes
        if (this.homeActive) {
            return "FoodFlow";
        }
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
        if (this.homeMenu) {
            // Same as Enterprise's own home toggle: home menu <-> last app.
            this.homeMenu.toggle();
            return;
        }
        this._closeLauncherIfNeeded();
        this.env.bus.trigger("FOODFLOW:OPEN_MOBILE_SIDEBAR_ALL_APPS");
    }

    async openCurrentAppMenus() {
        this._closeLauncherIfNeeded();
        if (this.state.hasHomeMenu) {
            await this.homeMenu.toggle(false);
        }
        this.env.bus.trigger("FOODFLOW:OPEN_MOBILE_SIDEBAR_APP");
    }

    openAllApps() {
        this._closeLauncherIfNeeded();
        this.env.bus.trigger("FOODFLOW:OPEN_MOBILE_SIDEBAR_ALL_APPS");
    }
}
