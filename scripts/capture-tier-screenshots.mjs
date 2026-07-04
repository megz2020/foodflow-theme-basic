/** Fresh marketing screenshots — current FoodFlow Basic & Pro themes only. */
import { chromium, devices } from 'playwright';
import { mkdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHOTS = join(__dirname, '..', 'screenshots');
mkdirSync(SHOTS, { recursive: true });

const LOGIN = process.env.ODOO_LOGIN || 'admin';
const PASS = process.env.ODOO_PASSWORD || 'admin';
const MOBILE = devices['iPhone 14'];

async function waitForTheme(page) {
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(800);
}

async function login(page, baseUrl) {
    await page.goto(`${baseUrl}/web/login`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await waitForTheme(page);
    const form = page.locator('form.oe_login_form');
    if (await form.count()) {
        await form.evaluate((el) => el.classList.remove('d-none'));
    }
    await page.fill('input[name="login"]', LOGIN);
    await page.fill('input[name="password"]', PASS);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(web|odoo)/, { timeout: 120000 });
    await waitForTheme(page);
}

async function captureBasic(baseUrl) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    await login(page, baseUrl);
    await page.goto(`${baseUrl}/odoo`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await waitForTheme(page);
    await page.screenshot({ path: join(SHOTS, 'basic-backend.png') });

    const mobilePage = await browser.newPage({ ...MOBILE });
    await login(mobilePage, baseUrl);
    await mobilePage.goto(`${baseUrl}/odoo`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await waitForTheme(mobilePage);
    await mobilePage.waitForSelector('.foodflow-mobile-bar', { timeout: 20000 }).catch(() => {});
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({ path: join(SHOTS, 'basic-mobile.png') });
    await mobilePage.close();

    await browser.close();
    console.log('  basic-backend.png, basic-mobile.png');
}

async function openFoodflowDashboard(page, baseUrl) {
    await page.goto(`${baseUrl}/odoo`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await waitForTheme(page);

    const foodflowMenu = page.locator('.o_menu_sections a, .o_nav_entry').filter({ hasText: /^FoodFlow$/ });
    const dashNav = page.locator('.o_menu_sections a, .o_nav_entry').filter({ hasText: /^Dashboard$/ });

    if (await foodflowMenu.count()) {
        await foodflowMenu.first().click();
        await waitForTheme(page);
    }
    if (await dashNav.count()) {
        await dashNav.first().click();
        await waitForTheme(page);
        await page.waitForSelector('.ff-dash', { timeout: 30000 }).catch(() => {});
        await page.waitForTimeout(2000);
        return true;
    }

    const app = page.locator('.o_app').filter({ hasText: /FoodFlow/i });
    if (await app.count()) {
        await app.first().click();
        await waitForTheme(page);
        await page.waitForSelector('.ff-dash', { timeout: 30000 }).catch(() => {});
        await page.waitForTimeout(2000);
        return true;
    }
    return false;
}

async function openPos(page, baseUrl) {
    await page.goto(`${baseUrl}/odoo/point-of-sale`, {
        waitUntil: 'domcontentloaded',
        timeout: 120000,
    });
    await waitForTheme(page);

    const openBtn = page.getByRole('button', { name: /open|new session|continue|resume/i }).first();
    const kanban = page.locator('.o_kanban_record').first();
    if (await openBtn.count()) {
        await openBtn.click({ timeout: 15000 }).catch(() => {});
    } else if (await kanban.count()) {
        await kanban.click({ timeout: 15000 }).catch(() => {});
    }
    await waitForTheme(page);
    await page.waitForTimeout(4000);

    if (!(await page.locator('.pos, .pos-content').count())) {
        await page.goto(`${baseUrl}/pos/ui?config_id=1`, {
            waitUntil: 'domcontentloaded',
            timeout: 120000,
        });
        await waitForTheme(page);
        await page.waitForTimeout(8000);
    }

    await page.waitForSelector('.pos .product, .pos-content .product, .product-list .product', {
        timeout: 45000,
    }).catch(() => {});
}

async function capturePosDesktop(page, baseUrl) {
    await openPos(page, baseUrl);
    await page.screenshot({ path: join(SHOTS, 'pro-pos.png') });

    const productGrid = page.locator('.rightpane, .product-list-screen, .products-widget').first();
    if (await productGrid.count()) {
        await productGrid.screenshot({ path: join(SHOTS, 'pro-products.png') });
    } else {
        await page.screenshot({
            path: join(SHOTS, 'pro-products.png'),
            clip: { x: 480, y: 120, width: 960, height: 780 },
        });
    }
}

async function capturePro(baseUrl) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    await login(page, baseUrl);

    const dashOk = await openFoodflowDashboard(page, baseUrl);
    if (dashOk) {
        await page.screenshot({ path: join(SHOTS, 'pro-dashboard.png') });
    } else {
        console.warn('  Warning: FoodFlow dashboard not found — skipping pro-dashboard.png');
    }

    await capturePosDesktop(page, baseUrl);

    const mobilePage = await browser.newPage({ ...MOBILE });
    await login(mobilePage, baseUrl);
    await openPos(mobilePage, baseUrl);
    await mobilePage.waitForTimeout(1500);
    await mobilePage.screenshot({ path: join(SHOTS, 'pro-mobile-pos.png') });
    await mobilePage.close();

    await browser.close();
    console.log('  pro-dashboard.png, pro-pos.png, pro-products.png, pro-mobile-pos.png');
}

// Drop legacy login shots — not featured on marketing page
for (const legacy of ['basic-login.png', 'pro-login.png']) {
    try {
        unlinkSync(join(SHOTS, legacy));
    } catch {
        // missing is fine
    }
}

const tier = process.argv[2] || 'all';
const basicUrl = process.env.BASIC_URL || 'http://localhost:8019';
const proUrl = process.env.PRO_URL || 'http://localhost:8018';

console.log(`Capturing to ${SHOTS}`);
if (tier === 'basic' || tier === 'all') {
    console.log(`Basic @ ${basicUrl}`);
    await captureBasic(basicUrl);
}
if (tier === 'pro' || tier === 'all') {
    console.log(`Pro @ ${proUrl}`);
    await capturePro(proUrl);
}
console.log('Done.');
