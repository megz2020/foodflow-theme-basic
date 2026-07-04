/**
 * FoodFlow Theme Basic — headed demo (desktop + mobile)
 * Run: node scripts/demo-basic-headed.mjs
 * Env: BASIC_URL=http://localhost:8019  HEADED=1 (default)
 */
import { chromium, devices } from 'playwright';

const BASE = process.env.BASIC_URL || 'http://localhost:8019';
const LOGIN = process.env.ODOO_LOGIN || 'admin';
const PASS = process.env.ODOO_PASSWORD || 'admin';
const HEADED = process.env.HEADED !== '0';
const SLOW = Number(process.env.SLOW_MO || 350);
const PAUSE_MS = Number(process.env.PAUSE_MS || 12000);

async function pause(page, label) {
    console.log(`  → ${label} (${PAUSE_MS / 1000}s)`);
    await page.waitForTimeout(PAUSE_MS);
}

async function waitReady(page) {
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(600);
}

async function login(page) {
    await page.goto(`${BASE}/web/login`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await waitReady(page);
    const form = page.locator('form.oe_login_form');
    if (await form.count()) {
        await form.evaluate((el) => el.classList.remove('d-none'));
    }
    await pause(page, 'Login screen — FoodFlow branding');
    await page.fill('input[name="login"]', LOGIN);
    await page.fill('input[name="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(web|odoo)/, { timeout: 120000 });
    await waitReady(page);
}

async function openApps(page) {
    // Launcher is often already open on /odoo — close first so navbar is clickable
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    const btn = page.locator('button.o_navbar_apps_menu, .o_menu_toggle, nav button[title="Home Menu"]');
    if (await btn.count()) {
        await btn.first().click({ force: true }).catch(async () => {
            await page.keyboard.press('h');
        });
        await page.waitForTimeout(800);
        return true;
    }
    return false;
}

console.log(`\nFoodFlow Theme Basic demo → ${BASE}`);
console.log(`Headed=${HEADED}  slowMo=${SLOW}ms  pause=${PAUSE_MS}ms\n`);

const browser = await chromium.launch({
    headless: !HEADED,
    slowMo: HEADED ? SLOW : 0,
});

try {
    // ── Desktop ──
    console.log('Desktop (1440×900)');
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await login(desktop);
    await desktop.goto(`${BASE}/odoo`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await waitReady(desktop);
    await pause(desktop, 'App launcher — warm hospitality theme');

    if (await openApps(desktop)) {
        await pause(desktop, 'Apps menu open');
        await desktop.keyboard.press('Escape');
        await waitReady(desktop);
    }

    await desktop.goto(`${BASE}/odoo/settings`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await waitReady(desktop);
    const search = desktop.getByPlaceholder(/search/i);
    if (await search.count()) {
        await search.first().fill('FoodFlow');
        await waitReady(desktop);
    }
    await pause(desktop, 'Settings → FoodFlow Theme Basic');

    await desktop.goto(`${BASE}/odoo/discuss`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await waitReady(desktop);
    await pause(desktop, 'Discuss — backend styling');

    // ── Mobile ──
    console.log('\nMobile (iPhone 14)');
    const mobile = await browser.newPage({ ...devices['iPhone 14'] });
    await login(mobile);
    await mobile.goto(`${BASE}/odoo`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await waitReady(mobile);
    await mobile.waitForSelector('.foodflow-mobile-bar', { timeout: 20000 }).catch(() => {});
    await pause(mobile, 'Mobile launcher + bottom bar');

    const homeBtn = mobile.locator('.foodflow-mobile-bar__btn').first();
    if (await homeBtn.count()) {
        await homeBtn.click();
        await waitReady(mobile);
        await pause(mobile, 'Mobile home / apps');
    }

    const appsBtn = mobile.locator('.foodflow-mobile-bar__btn').filter({ hasText: 'Apps' });
    if (await appsBtn.count()) {
        await appsBtn.first().click();
        await waitReady(mobile);
        await pause(mobile, 'Mobile apps grid');
    }

    console.log('\n✓ Demo complete — close browser windows when done.\n');
    if (HEADED) {
        await mobile.waitForTimeout(60000);
    }
    await mobile.close();
    await desktop.close();
} finally {
    await browser.close();
}
