import { expect, test } from '@playwright/test'

test('exposes working links to the main workspace pages', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: '主要連結' })

  await expect(nav.getByRole('link', { name: '作品集' })).toHaveAttribute('href', '/projects/')
  await expect(nav.getByRole('link', { name: '經歷儀表板' })).toHaveAttribute('href', '/linkedin/')
  await expect(nav.getByRole('link', { name: '講座' })).toHaveAttribute('href', '/lectures/')

  await page.goto('/linkedin/index.html')
  await expect(page).toHaveTitle(/LinkedIn|Profile|經歷/i)
  await expect(page.locator('body')).toContainText(/Skill Workspace|63|經歷/)

  await page.goto('/projects/index.html')
  await expect(page).toHaveTitle(/作品集|Projects|Portfolio/i)
  await expect(page.getByRole('main')).toBeVisible()
})
