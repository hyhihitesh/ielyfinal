import { test, expect } from '@playwright/test';

test('landing page has key sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Make better startup decisions')).toBeVisible();
    await expect(page.getByText('Pricing')).toBeVisible();
});

test('login page loads', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('button', { name: /continue/i })).toBeVisible();
});

test('legal pages load', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
    await page.goto('/terms');
    await expect(page.getByRole('heading', { name: 'Terms' })).toBeVisible();
});
