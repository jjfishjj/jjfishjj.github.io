import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
  await page.goto('/projects/index.html')
})

test('supports project search, favorites, and share without changing favorites', async ({ page }) => {
  const search = page.getByRole('searchbox', { name: '搜尋專案' })
  await search.fill('NVIDIA Skills Showcase')
  await expect(page.locator('.project-card')).toHaveCount(1)

  const card = page.locator('.project-card').first()
  const favorite = card.getByRole('button', { name: /收藏/ })
  await favorite.click()
  await expect(card.getByRole('button', { name: /已收藏/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.summary-stat').filter({ hasText: '已收藏' })).toContainText('1')

  await card.getByRole('button', { name: /分享/ }).click()
  await expect(page.locator('.status-message')).toContainText(/分享|複製/)
  await expect(page.locator('.project-card').first().getByRole('button', { name: /已收藏/ })).toHaveAttribute('aria-pressed', 'true')
})

test('focuses a project card from a hash deep link', async ({ page }) => {
  await page.goto('/projects/index.html#project-nvidia-skills-showcase')
  const card = page.locator('#project-nvidia-skills-showcase')
  await expect(card).toBeVisible()
  await expect(card).toBeFocused()
})
