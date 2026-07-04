/** @odoo-module **/

import { Component, onMounted, onWillUnmount, useEffect, useRef, useState } from "@odoo/owl";
import { useBus, useService } from "@web/core/utils/hooks";
import { session } from "@web/session";

const FOODFLOW_MARK = "/foodflow_theme_basic/static/img/foodflow-logo.jpg";
const FOODFLOW_LOGO = "/foodflow_theme_basic/static/img/foodflow-logo.jpg";
const LOGO_FALLBACK = "/web/static/img/default_icon_app.png";

const CATEGORIES = [
    { id: "all", label: "All apps" },
    { id: "front", label: "Front of house" },
    { id: "back", label: "Back of house" },
    { id: "finance", label: "Finance" },
    { id: "team", label: "Team" },
    { id: "foodflow", label: "FoodFlow" },
    { id: "settings", label: "Settings" },
];

function categorizeApp(app) {
    const xml = (app.xmlid || "").toLowerCase();
    const name = (app.name || "").toLowerCase();
    if (xml.includes("point_of_sale") || xml.includes("pos") || name.includes("point of sale")) {
        return "front";
    }
    if (
        xml.includes("stock") ||
        xml.includes("purchase") ||
        xml.includes("inventory") ||
        xml.includes("mrp")
    ) {
        return "back";
    }
    if (xml.includes("account") || xml.includes("invoice") || name.includes("invoic")) {
        return "finance";
    }
    if (xml.includes("discuss") || xml.includes("mail") || name.includes("discuss")) {
        return "team";
    }
    if (xml.includes("foodflow")) {
        return "foodflow";
    }
    if (xml.includes("settings") || name === "settings" || name === "apps") {
        return "settings";
    }
    return "other";
}

function normalizeApp(app) {
    const category = categorizeApp(app);
    const xml = (app.xmlid || "").toLowerCase();
    const isFoodflowApp = xml.includes("foodflow");
    let iconStyle = "";
    let iconClass = "";
    let iconSrc = null;

    if (isFoodflowApp) {
        iconSrc = FOODFLOW_MARK;
    } else if (app.webIconData) {
        iconStyle = `background-image: url("${app.webIconData}"); background-size: cover;`;
    } else if (app.webIcon) {
        const webIcon = app.webIcon;
        if (typeof webIcon === "object") {
            iconStyle = `background-color: ${webIcon.backgroundColor}; color: ${webIcon.color || "#fff"};`;
            iconClass = webIcon.iconClass || "";
        } else {
            const [cls, color, backgroundColor] = String(webIcon).split(",");
            if (backgroundColor !== undefined) {
                iconStyle = `background-color: ${backgroundColor}; color: ${color || "#fff"};`;
                iconClass = cls || "";
            } else {
                iconStyle = `background-image: url("${LOGO_FALLBACK}"); background-size: cover;`;
            }
        }
    } else {
        iconStyle = `background-image: url("${LOGO_FALLBACK}"); background-size: cover;`;
    }

    return {
        id: app.id,
        name: app.name,
        xmlid: app.xmlid,
        actionID: app.actionID,
        category,
        isFoodflowApp,
        iconSrc,
        iconStyle,
        iconClass,
        foodflowMark: FOODFLOW_MARK,
    };
}

export class FoodflowHomeMenu extends Component {
    static template = "foodflow_theme.FoodflowHomeMenu";
    static props = {};

    setup() {
        this.launcher = useService("foodflow_launcher");
        this.menuService = useService("menu");
        this.searchInput = useRef("searchInput");
        this.categories = CATEGORIES;
        this.foodflowLogo = FOODFLOW_LOGO;
        this.foodflowMark = FOODFLOW_MARK;
        this.foodflowWebsiteUrl = session.foodflow_website_url || "https://foodflo.app";
        this.foodflowAppUrl = session.foodflow_app_url || "https://foodflo.app";
        this.foodflowSignupUrl = session.foodflow_signup_url || "https://foodflo.app";
        this.foodflowDocsUrl = session.foodflow_docs_url || "https://foodflo.app";
        this.foodflowProUrl = session.foodflow_pro_url || "https://foodflo.app";
        this.foodflowHasConnector = Boolean(session.foodflow_has_connector);
        this.state = useState({
            isOpen: this.launcher.isOpen,
            search: this.launcher.search,
            category: this.launcher.category,
        });

        const syncFromLauncher = () => {
            this.state.isOpen = this.launcher.isOpen;
            this.state.search = this.launcher.search;
            this.state.category = this.launcher.category;
        };

        useBus(this.env.bus, "FOODFLOW_LAUNCHER:CHANGED", syncFromLauncher);
        useBus(this.env.bus, "FOODFLOW:OPEN_DETAILS", () => this.openFoodflowDetails());

        useEffect(
            () => {
                if (this.state.isOpen && this.searchInput.el) {
                    this.searchInput.el.focus();
                }
                document.body.classList.toggle("o_foodflow_launcher_open", this.state.isOpen);
            },
            () => [this.state.isOpen]
        );

        onMounted(() => {
            syncFromLauncher();
            document.body.classList.toggle("o_foodflow_launcher_open", this.state.isOpen);
            this._onOpenDetailsDoc = () => this.openFoodflowDetails();
            document.addEventListener("foodflow-open-details", this._onOpenDetailsDoc);
        });

        onWillUnmount(() => {
            if (this._onOpenDetailsDoc) {
                document.removeEventListener("foodflow-open-details", this._onOpenDetailsDoc);
            }
        });
    }

    get showFoodflowDetails() {
        return this.state.category === "foodflow" && !(this.state.search || "").trim();
    }

    get apps() {
        return this.menuService.getApps().map((app) => normalizeApp(app));
    }

    get filteredApps() {
        const query = (this.state.search || "").trim().toLowerCase();
        return this.apps.filter((app) => {
            const matchesCategory =
                this.state.category === "all" || app.category === this.state.category;
            const matchesSearch = !query || app.name.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    }

    get hasApps() {
        return this.apps.length > 0;
    }

    onSearchInput(ev) {
        this.launcher.setSearch(ev.target.value);
    }

    setCategory(category) {
        this.launcher.setCategory(category);
    }

    openFoodflowDetails() {
        this.launcher.open();
        this.launcher.setCategory("foodflow");
    }

    clearFilters() {
        this.launcher.setSearch("");
        this.launcher.setCategory("all");
    }

    close() {
        this.launcher.close();
    }

    onKeydown(ev) {
        if (ev.key === "Escape") {
            ev.preventDefault();
            this.close();
        }
    }

    async selectApp(app) {
        const menu = this.menuService.getApps().find((m) => m.id === app.id);
        if (menu) {
            await this.menuService.selectMenu(menu);
        }
        this.close();
    }
}
