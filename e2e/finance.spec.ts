import { test, expect } from './fixtures'

test.describe('재정 관리', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/finance')
    await page.waitForLoadState('networkidle')
  })

  test('재정 페이지가 렌더링된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('재정 관리')).toBeVisible()
    await expect(page.getByText('수입').first()).toBeVisible()
    await expect(page.getByText('지출').first()).toBeVisible()
    await expect(page.getByText('잔액')).toBeVisible()
  })

  test('탭 필터가 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('button', { name: '전체' })).toBeVisible()
    await expect(page.getByRole('button', { name: '수입' })).toBeVisible()
    await expect(page.getByRole('button', { name: '지출' })).toBeVisible()
  })

  test('거래 추가 모달이 열린다', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: '추가' }).click()
    await expect(page.getByText('거래 추가')).toBeVisible()
    await expect(page.getByText('카테고리')).toBeVisible()
    await expect(page.getByText('금액')).toBeVisible()
    await expect(page.getByText('날짜')).toBeVisible()
  })

  test('거래를 추가하면 목록에 나타난다', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: '추가' }).click()
    await page.getByPlaceholder('예: 헌금, 식비, 교재비').fill('주일헌금')
    await page.locator('input[type="number"]').fill('500000')
    await page.locator('button[type="submit"]').click()
    await expect(page.getByText('주일헌금')).toBeVisible()
    await expect(page.getByText('50만원').first()).toBeVisible()
  })
})
