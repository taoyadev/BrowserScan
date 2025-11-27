import { test, expect } from '@playwright/test';

test.describe('BrowserScan experience', () => {
  test('dashboard renders authority data', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Authority Health Ring')).toBeVisible();
    await expect(page.getByText('Identity')).toBeVisible();
    await expect(page.getByText('Risk Board')).toBeVisible();
  });

  test('tools index lists professional utilities', async ({ page }) => {
    await page.goto('/tools');
    await expect(page.getByRole('heading', { name: 'Tools' })).toBeVisible();
    await expect(page.getByText('IP Intelligence')).toBeVisible();
    await expect(page.getByText('PDF Generator')).toBeVisible();
  });
});
