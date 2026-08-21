import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
  await page.goto('/')
})

test('supports combined search, category filter, and sorting', async ({ page }) => {
  const cards = page.locator('.card')
  const sort = page.getByRole('combobox', { name: '案例排序' })

  await expect(page.getByText(/顯示 63 \/ 63/)).toBeVisible()
  await page.getByRole('button', { name: 'Agent / Safety' }).click()
  await page.getByRole('searchbox', { name: '搜尋 skill、關鍵字、場景或技術' }).fill('Agent')
  await expect(page.getByText(/顯示 4 \/ 63/)).toBeVisible()
  await expect(cards).toHaveCount(4)

  await sort.selectOption('title-asc')
  const titles = await cards.locator('.card-title').allTextContents()
  expect(titles).toEqual([...titles].sort((left, right) => left.localeCompare(right, 'zh-Hant')))

  await sort.selectOption('level-desc')
  const levels = await cards.locator('.level-dot').allTextContents()
  const levelRank = { 探索: 0, 中階: 1, 進階: 2 }
  expect(levels.map((level) => levelRank[level])).toEqual([...levels].map((level) => levelRank[level]).sort((left, right) => right - left))
})

test('supports favorites, compare limit, and recent view state', async ({ page }) => {
  const cards = page.locator('.card')

  await cards.nth(0).getByRole('button', { name: /收藏/ }).click()
  await expect(page.getByRole('button', { name: /我的收藏 1/ })).toBeVisible()
  await page.getByRole('button', { name: /我的收藏 1/ }).click()
  await expect(cards).toHaveCount(1)
  await page.getByRole('button', { name: '全部案例' }).click()

  for (let index = 0; index < 4; index += 1) {
    await cards.nth(index).getByRole('button', { name: '加入比較' }).click()
  }
  await expect(page.getByRole('region', { name: '案例比較工具' })).toContainText('3 個案例正在比較')
  await expect(page.getByRole('status')).toContainText('最多同時比較 3 個案例')

  await cards.nth(0).getByRole('button', { name: /查看詳細/ }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page).toHaveURL(/\?skill=/)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(page.getByRole('button', { name: /最近瀏覽 1/ })).toBeVisible()
})

test('restores a direct-link detail page and closes with Escape', async ({ page }) => {
  await page.goto('/?skill=agentic-rag-orchestration')
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('Agentic RAG 編排')
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/$/)
})
