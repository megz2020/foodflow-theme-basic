/** @odoo-module **/

import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { session } from "@web/session";

export const foodflowLauncherService = {
    start(env) {
        const state = reactive({
            isOpen: false,
            search: "",
            category: "all",
        });

        const notify = () => env.bus.trigger("FOODFLOW_LAUNCHER:CHANGED");

        return {
            get isOpen() {
                return state.isOpen;
            },
            get search() {
                return state.search;
            },
            get category() {
                return state.category;
            },
            open() {
                if (!session.foodflow_use_launcher) {
                    return;
                }
                state.isOpen = true;
                state.search = "";
                state.category = "all";
                notify();
            },
            close() {
                state.isOpen = false;
                state.search = "";
                state.category = "all";
                notify();
            },
            setSearch(value) {
                state.search = value;
                notify();
            },
            setCategory(value) {
                state.category = value;
                notify();
            },
        };
    },
};

registry.category("services").add("foodflow_launcher", foodflowLauncherService);
