import { test, expect } from './fixtures/index.js'

test.skip('allows creating a new post', async ({ page, auth }) => {
  const testUser = await auth.signUpAndLogIn()

  await page.getByRole('textbox', { name: 'Title:' }).click()
  await page.getByRole('textbox', { name: 'Title:' }).fill('Test Post')
  await page.getByRole('textbox', { name: 'Title:' }).press('Tab')
  await page.locator('textarea').fill('Hello World!')
  await page.locator('textarea').press('Tab')
  await page.getByRole('textbox', { name: 'add tags' }).fill('test')
  await page.getByRole('textbox', { name: 'add tags' }).press('Enter')
  await page.getByRole('textbox', { name: 'add tags' }).press('Tab')
  await page.getByRole('button', { name: 'Create' }).press('Enter')

  await expect(page.getByText(`Test PostWritten by ${testUser}`)).toBeVisible()
})
