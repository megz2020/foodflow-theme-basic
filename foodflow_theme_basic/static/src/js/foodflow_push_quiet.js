/** @odoo-module **/

import { WebClient } from "@web/webclient/webclient";
import { patch } from "@web/core/utils/patch";

function shouldQuietPushErrors() {
    if (!window.isSecureContext) {
        return true;
    }
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1";
}

patch(WebClient.prototype, {
    async _subscribePush(numberTry = 1) {
        if (!shouldQuietPushErrors()) {
            return super._subscribePush(numberTry);
        }
        const notify = this.notification?.add?.bind(this.notification);
        if (!notify) {
            return super._subscribePush(numberTry);
        }
        this.notification.add = (message, options = {}) => {
            const title = String(options?.title ?? "").toLowerCase();
            const body = String(message ?? "").toLowerCase();
            if (title.includes("push notification") || body.includes("push service")) {
                console.info("Push notifications skipped (dev/local environment).");
                return;
            }
            return notify(message, options);
        };
        try {
            return await super._subscribePush(numberTry);
        } finally {
            this.notification.add = notify;
        }
    },
});
