const { test, expect } = require('@playwright/test');

test.describe('Lipsum Generator Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.lipsum.com/');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Lorem Ipsum - All the facts - Lipsum generator');
  });

  test('should have a donate button', async ({ page }) => {
    const donateButton = await page.locator('text=Donate');
    await expect(donateButton).toBeVisible();
  });

  test('should have a generate lorem ipsum button', async ({ page }) => {
    const generateButton = await page.locator('text=Generate Lorem Ipsum');
    await expect(generateButton).toBeVisible();
  });

  test('should have input fields', async ({ page }) => {
    const paragraphsInput = await page.locator('label=paragraphs');
    const wordsInput = await page.locator('label=words');
    const bytesInput = await page.locator('label=bytes');
    const listsInput = await page.locator('label=lists');
    await expect(paragraphsInput).toBeVisible();
    await expect(wordsInput).toBeVisible();
    await expect(bytesInput).toBeVisible();
    await expect(listsInput).toBeVisible();
  });

  test('should generate lorem ipsum on submit', async ({ page }) => {
    await page.fill('label=paragraphs', '5');
    await page.click('text=Generate Lorem Ipsum');
    await expect(page.locator('#lipsum')).not.toBeEmpty();
  });

  test('should have a privacy policy link in the footer', async ({ page }) => {
    const privacyPolicyLink = await page.locator('text=Privacy Policy');
    await expect(privacyPolicyLink).toBeVisible();
  });

  test('should have a help email link in the footer', async ({ page }) => {
    const helpEmailLink = await page.locator('text=help@lipsum.com');
    await expect(helpEmailLink).toBeVisible();
  });
});