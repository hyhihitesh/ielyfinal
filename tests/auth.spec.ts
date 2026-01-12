import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('should redirect unauthenticated user to login', async ({ page }) => {
        // 1. Try to access protected route
        await page.goto('/dashboard');

        // 2. Expect redirect to login
        await expect(page).toHaveURL(/.*\/auth\/login/);

        // 3. Check for specific, accessible elements
        // The "PIELY" heading is duplicated for visual effect, so we take the first one
        await expect(page.getByRole('heading', { name: 'PIELY' }).first()).toBeVisible();

        // Check for Email input (Label 'Email' -> Input)
        await expect(page.getByLabel('Email', { exact: true })).toBeVisible();
    });

    test.skip('should allow navigation to signup', async ({ page }) => {
        await page.goto('/auth/login');

        // Click "Sign Up" - using robust CSS selector for the link itself
        await page.locator('a[href="/auth/signup"]').click();

        // Expect redirect to signup
        await expect(page).toHaveURL(/.*\/auth\/signup/);

        // Check for "Email Address" label in signup form
        await expect(page.getByLabel('Email Address')).toBeVisible();
    });
});
