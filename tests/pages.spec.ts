import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {

    test('Landing Page should load and display brand', async ({ page }) => {
        await page.goto('/');
        // Relaxed check: Just look for the brand text anywhere visible
        // We use .first() because mobile/desktop wrappers often duplicate headers
        await expect(page.getByText('PIELY').first()).toBeVisible();
    });

    test('Pricing Page should redirect to section', async ({ page }) => {
        await page.goto('/pricing');
        // Verify key pricing elements are visible (Redirection successful)
        await expect(page.getByText('Free').first()).toBeVisible();
        await expect(page.getByText('Pro').first()).toBeVisible();
    });

    test('Privacy Policy should be accessible', async ({ page }) => {
        await page.goto('/privacy');
        // Check for common Policy text
        await expect(page.getByRole('heading', { name: /Privacy/i }).first()).toBeVisible();
    });

    test('Terms page should be accessible', async ({ page }) => {
        await page.goto('/terms');
        // Check for common Terms text
        await expect(page.getByRole('heading', { name: /Terms/i }).first()).toBeVisible();
    });

    test('404 Page should render for unknown routes', async ({ page }) => {
        await page.goto('/super-fake-route-xcvbn');
        // Check for specific unique text on 404 page
        await expect(page.getByText('Off the map')).toBeVisible();
    });

});
