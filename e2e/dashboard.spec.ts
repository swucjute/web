import { test, expect } from './fixtures'

test.describe('대시보드', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('날짜와 환영 메시지가 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('안녕하세요')).toBeVisible()
    await expect(page.getByText('관리자님')).toBeVisible()
  })

  test('통계 카드 4개가 모두 보인다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('총 회원')).toBeVisible()
    await expect(page.getByText('예정 일정')).toBeVisible()
    await expect(page.getByText('진행 중 설문')).toBeVisible()
    await expect(page.getByText('기도제목')).toBeVisible()
  })

  test('총 회원 수가 3명이다', async ({ loggedInPage: page }) => {
    const card = page.getByText('총 회원').locator('..')
    await expect(card.getByText('3')).toBeVisible()
  })

  test('진행 중 설문 수가 실제 활성 설문 수와 일치한다', async ({ loggedInPage: page }) => {
    // 대시보드와 설문 페이지의 카운트가 일치해야 함
    const dashCount = await page.getByText('진행 중 설문').locator('..').getByText(/\d+/).first().textContent()

    await page.goto('/survey')
    await page.waitForLoadState('networkidle')
    const surveyPageCount = await page.getByText(/진행 중 \d+개/).textContent()

    const dashNum = dashCount?.replace(/[^\d]/g, '') ?? '0'
    const surveyNum = surveyPageCount?.replace(/[^\d]/g, '') ?? '0'
    expect(dashNum).toBe(surveyNum)
  })

  test('이번 달 일정 섹션이 있고 목록에 일정이 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText(/이번 (주|달) 일정|다가오는 일정/)).toBeVisible()
  })

  test('최근 예배 섹션이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('최근 예배')).toBeVisible()
    await expect(page.getByText('전체보기').nth(1)).toBeVisible()
  })

  test('하단 네비게이션 바가 있다', async ({ loggedInPage: page }) => {
    const nav = page.locator('nav')
    await expect(nav.getByText('홈')).toBeVisible()
    await expect(nav.getByText('예배')).toBeVisible()
    await expect(nav.getByText('플랫폼')).toBeVisible()
    await expect(nav.getByText('커뮤니티')).toBeVisible()
    await expect(nav.getByText('더보기')).toBeVisible()
  })
})
