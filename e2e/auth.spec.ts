import { test, expect } from '@playwright/test'
import { login, TEST_ACCOUNTS } from './fixtures'

test.describe('인증', () => {
  test('로그인 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('주뜨청년부')).toBeVisible()
    await expect(page.getByText('서울여대 대학교회 청년부 앱')).toBeVisible()
    await expect(page.getByPlaceholder('email@church.com')).toBeVisible()
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible()
  })

  test('잘못된 계정으로 로그인하면 실패한다', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'wrong@church.com')
    await page.fill('input[type="password"]', 'wrongpw')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/login')
  })

  test('admin 계정으로 로그인하면 대시보드로 이동한다', async ({ page }) => {
    await login(page, 'admin')
    await expect(page).toHaveURL('/')
    await expect(page.getByText('관리자님')).toBeVisible()
    await expect(page.getByText('관리자').first()).toBeVisible() // 역할 배지
  })

  test('로그인하지 않으면 보호된 페이지에서 로그인으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')
  })

  test('테스트 계정 펼치기 UI가 있다', async ({ page }) => {
    await page.goto('/login')
    await page.click('text=테스트 계정 보기')
    // 계정 목록이 펼쳐짐
    await expect(page.getByText(TEST_ACCOUNTS.admin.email)).toBeVisible()
  })
})
