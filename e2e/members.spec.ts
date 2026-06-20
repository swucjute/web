import { test, expect } from './fixtures'

test.describe('교적 관리', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/members')
    await page.waitForLoadState('networkidle')
  })

  test('멤버 목록이 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('교적 관리')).toBeVisible()
    await expect(page.getByText('총 3명')).toBeVisible()
    await expect(page.getByText('관리자').first()).toBeVisible()
    await expect(page.getByText('리더').first()).toBeVisible()
    await expect(page.getByText('회원').first()).toBeVisible()
  })

  test('역할 배지가 표시된다', async ({ loggedInPage: page }) => {
    // 역할 배지: 관리자, 리더, 회원
    const badges = page.getByText(/^(관리자|리더|회원)$/)
    await expect(badges.first()).toBeVisible()
  })

  test('이름으로 검색하면 결과가 필터링된다', async ({ loggedInPage: page }) => {
    await page.fill('input[placeholder*="검색"]', '리더')
    await expect(page.getByText('관리자').nth(1)).not.toBeVisible() // 이름 텍스트, 배지 말고
    await expect(page.getByText('리더').first()).toBeVisible()
  })

  test('멤버 편집 페이지로 이동한다', async ({ loggedInPage: page }) => {
    // 편집 아이콘 버튼 클릭
    await page.locator('button.bg-blue-50').first().click()
    await expect(page).toHaveURL(/\/members\/edit\//)
    await expect(page.getByText('회원 정보 수정')).toBeVisible()
  })
})

test.describe('회원 편집', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/members/edit/1')
    await page.waitForLoadState('networkidle')
  })

  test('기존 정보가 폼에 채워져 있다', async ({ loggedInPage: page }) => {
    await expect(page.locator('input[type="email"]')).toHaveValue('admin@church.com')
    await expect(page.locator('input[type="text"]').first()).toHaveValue('관리자')
    await expect(page.locator('input[type="tel"]')).toHaveValue('010-1234-5678')
  })

  test('저장 버튼이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('button', { name: '저장하기' })).toBeVisible()
  })
})
