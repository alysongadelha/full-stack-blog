import { test, expect } from '@playwright/test'

test.skip('allows sign up and log in', async ({ page }) => {
  const testUser = 'test' + Date.now()

  await page.goto('/')
  await page.getByRole('link', { name: 'Sign Up' }).click()
  await page.getByRole('textbox', { name: 'Username:' }).click()
  await page.getByRole('textbox', { name: 'Username:' }).fill(testUser)
  await page.getByRole('textbox', { name: 'Password:' }).click()
  await page.getByRole('textbox', { name: 'Password:' }).fill('test')
  await page.getByRole('button', { name: 'Sign up' }).click()
  await page.waitForURL('**/login')
  await page.getByRole('textbox', { name: 'Username:' }).click()
  await page.getByRole('textbox', { name: 'Username:' }).fill(testUser)
  await page.getByRole('textbox', { name: 'Password:' }).click()
  await page.getByRole('textbox', { name: 'Password:' }).fill('test')
  await page.getByRole('button', { name: 'Log In' }).click()
  await page.waitForURL('**/')

  await expect(page.locator('nav')).toContainText('Logged in as ' + testUser)
})
