/** @odoo-module **/

import { session } from "@web/session";

const LOGO_SRC = "/foodflow_theme_basic/static/img/foodflow-logo.jpg";
const FOODFLOW_APP_URL = "https://foodflo.app";
const BRAND_TITLE = "FoodFlow";

function brandEnabled() {
    return Boolean(session.foodflow_theme_enabled);
}

function buildNavbarBrandHtml() {
    return `
        <div class="foodflow-navbar-brand foodflow-navbar-brand--link d-none d-lg-flex align-items-center gap-2 ms-2"
             role="button" tabindex="0" title="About FoodFlow">
            <img src="${LOGO_SRC}" alt="FoodFlow" class="foodflow-navbar-brand__logo"/>
            <div class="foodflow-navbar-brand__text">
                <span class="foodflow-navbar-brand__title">${BRAND_TITLE}</span>
            </div>
        </div>
    `;
}

function bindNavbarBrandClick(brand) {
    const open = () => document.dispatchEvent(new CustomEvent("foodflow-open-details"));
    brand.addEventListener("click", open);
    brand.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            open();
        }
    });
}

function injectNavbarBrand() {
    const navbar = document.querySelector(".o_main_navbar");
    if (!navbar || navbar.querySelector(".foodflow-navbar-brand")) {
        return;
    }
    const apps = navbar.querySelector(".o_navbar_apps_menu, .o_menu_toggle");
    const wrapper = document.createElement("div");
    wrapper.innerHTML = buildNavbarBrandHtml();
    const brand = wrapper.firstElementChild;
    bindNavbarBrandClick(brand);
    if (apps && apps.parentElement) {
        apps.parentElement.insertBefore(brand, apps.nextSibling);
    } else {
        navbar.prepend(brand);
    }
}

function injectPosPortalLink() {
    const header = document.querySelector(".pos-topheader");
    if (!header || header.querySelector(".foodflow-pos-portal-link")) {
        return;
    }
    const tray = header.querySelector(".status-buttons");
    if (!tray) {
        return;
    }
    const link = document.createElement("a");
    link.href = FOODFLOW_APP_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "btn btn-light btn-lg lh-lg foodflow-pos-portal-link";
    link.title = "Open FoodFlow dashboard";
    link.setAttribute("aria-label", "Open FoodFlow dashboard");
    link.innerHTML = '<i class="fa fa-external-link fa-fw fa-lg"/>';
    tray.insertBefore(link, tray.firstChild);
}

function injectPosBrand() {
    const header = document.querySelector(".pos-topheader");
    if (!header || header.querySelector(".foodflow-pos-brand")) {
        return;
    }
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div class="foodflow-pos-brand d-flex align-items-center gap-2 px-2" title="${BRAND_TITLE}">
            <img src="${LOGO_SRC}" alt="${BRAND_TITLE}" class="foodflow-pos-brand__logo"/>
            <div class="foodflow-pos-brand__text d-none d-sm-flex">
                <span class="foodflow-pos-brand__title">${BRAND_TITLE}</span>
            </div>
        </div>
    `;
    const brand = wrapper.firstElementChild;
    const left = header.querySelector(".pos-leftheader");
    if (left) {
        left.prepend(brand);
    } else {
        header.prepend(brand);
    }
}

export function injectFoodflowBrand() {
    if (!brandEnabled()) {
        return;
    }
    injectNavbarBrand();
    if (document.body.classList.contains("o_foodflow_pos")) {
        injectPosBrand();
        injectPosPortalLink();
    }
}

export function startFoodflowBrandObserver() {
    if (!brandEnabled()) {
        return;
    }
    injectFoodflowBrand();
    const observer = new MutationObserver(() => injectFoodflowBrand());
    observer.observe(document.body, { childList: true, subtree: true });
}
