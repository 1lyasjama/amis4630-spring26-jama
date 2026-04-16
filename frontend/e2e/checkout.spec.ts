import { test, expect } from '@playwright/test';

function uniqueEmail(): string {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 10_000);
  return `e2e_${ts}_${rand}@buckeye.test`;
}

test('happy path: register, login, browse, add to cart, checkout, view order in history', async ({ page }) => {
  const email = uniqueEmail();
  const password = 'E2eUser1!';

  await page.goto('/register');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /create account/i }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: /buckeye marketplace/i })).toBeVisible();

  await page.getByRole('button', { name: /logout/i }).click();
  await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();

  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL('/');

  const firstAddBtn = page.getByRole('button', { name: /add to cart/i }).first();
  await firstAddBtn.click();
  await expect(page.locator('.cart-badge')).toContainText('1');

  await page.getByRole('link', { name: /^cart/i }).click();
  await expect(page.getByRole('heading', { name: /shopping cart/i })).toBeVisible();

  await page.getByRole('link', { name: /proceed to checkout/i }).click();
  await expect(page.getByRole('heading', { name: /^checkout$/i })).toBeVisible();

  await page.getByLabel(/address/i).fill('123 Main Street, Columbus, OH 43210');
  await page.getByRole('button', { name: /place order/i }).click();

  await expect(page.getByRole('heading', { name: /thank you for your order/i })).toBeVisible();
  const confirmationText = await page.locator('.confirmation-number').innerText();
  expect(confirmationText).toMatch(/[A-Z0-9-]+/);

  await page.getByRole('link', { name: /view order history/i }).click();
  await expect(page).toHaveURL('/orders');
  await expect(page.getByRole('heading', { name: /my orders/i })).toBeVisible();
  await expect(page.locator('.order-card').first()).toBeVisible();
});
