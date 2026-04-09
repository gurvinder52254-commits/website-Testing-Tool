const { test, expect } = require('@playwright/test');

test.describe('Apple Website Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://apple.com');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Apple');
  });

  test('header navigation links are visible and clickable', async ({ page }) => {
    const links = ['Store', 'Mac', 'iPad', 'iPhone', 'Watch', 'TV & Home', 'Entertainment', 'Accessories', 'Support'];
    for (const link of links) {
      const navigationLink = page.locator('header').getByText(link);
      await expect(navigationLink).toBeVisible();
      await navigationLink.click();
      await expect(page).toHaveURL(/.*$/);
      await page.goBack();
    }
  });

  test('Shop iPhone button is visible and clickable', async ({ page }) => {
    const shopIPhoneButton = page.locator('header').getByText('Shop iPhone');
    await expect(shopIPhoneButton).toBeVisible();
    await shopIPhoneButton.click();
    await expect(page).toHaveURL(/.*iphone.*/);
  });

  test('Learn more buttons are visible and clickable', async ({ page }) => {
    const learnMoreButtons = page.locator('body').getByText('Learn more');
    for (const button of learnMoreButtons) {
      await expect(button).toBeVisible();
      await button.click();
      await expect(page).toHaveURL(/.*$/);
      await page.goBack();
    }
  });

  test('Buy buttons are visible and clickable', async ({ page }) => {
    const buyButtons = page.locator('body').getByText('Buy');
    for (const button of buyButtons) {
      await expect(button).toBeVisible();
      await button.click();
      await expect(page).toHaveURL(/.*$/);
      await page.goBack();
    }
  });
});