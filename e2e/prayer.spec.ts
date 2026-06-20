import { test, expect } from './fixtures'

test.describe('기도제목', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/prayer')
    await page.waitForLoadState('networkidle')
  })

  test('기도제목 페이지가 렌더링된다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('heading', { name: '기도제목' })).toBeVisible()
    await expect(page.getByRole('button', { name: '내 기도제목' })).toBeVisible()
    await expect(page.getByRole('button', { name: '공개 기도제목' })).toBeVisible()
  })

  test('추가 버튼이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('button', { name: '추가' })).toBeVisible()
  })

  test('기도제목 추가 폼이 열린다', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: '추가' }).click()
    await expect(page.getByText('기도제목 추가')).toBeVisible()
    await expect(page.getByPlaceholder('기도 내용을 적어주세요...')).toBeVisible()
  })

  test('기도제목을 추가하면 목록에 나타난다', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: '추가' }).click()
    await page.getByPlaceholder('기도 내용을 적어주세요...').fill('E2E 테스트 기도제목')
    await page.locator('button[type="submit"]').click()
    await expect(page.getByText('E2E 테스트 기도제목')).toBeVisible()
  })
})
