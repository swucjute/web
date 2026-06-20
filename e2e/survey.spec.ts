import { test, expect } from './fixtures'

test.describe('설문 조사', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/survey')
    await page.waitForLoadState('networkidle')
  })

  test('진행 중인 설문이 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('설문 조사')).toBeVisible()
    await expect(page.getByText('진행 중인 설문')).toBeVisible()
    await expect(page.getByText('청년부 만족도 조사')).toBeVisible()
  })

  test('설문 마감일이 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText(/마감 7월 31일/)).toBeVisible()
  })

  test('미응답 배지가 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('미응답')).toBeVisible()
  })

  test('설문 클릭 시 응답 폼이 열린다', async ({ loggedInPage: page }) => {
    await page.getByText('청년부 만족도 조사').click()
    await expect(page.getByText('주일 예배가 은혜로웠나요?')).toBeVisible()
  })

  test('설문에 응답하고 제출할 수 있다', async ({ loggedInPage: page }) => {
    await page.getByText('청년부 만족도 조사').click()
    await page.getByText('매우 만족').click()
    await page.getByRole('button', { name: '제출' }).click()
    await expect(page.getByText(/응답이 저장|이미 응답/)).toBeVisible()
  })

  test('리더/관리자는 설문 만들기 버튼이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('button', { name: '만들기' })).toBeVisible()
  })
})
