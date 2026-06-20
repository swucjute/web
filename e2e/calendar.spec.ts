import { test, expect } from './fixtures'

test.describe('일정 관리', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/calendar')
    await page.waitForLoadState('networkidle')
  })

  test('달력 UI가 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('일정 관리')).toBeVisible()
    await expect(page.getByText('2026년 6월').first()).toBeVisible()
    // 요일 헤더
    await expect(page.getByText('일', { exact: true })).toBeVisible()
    await expect(page.getByText('월', { exact: true })).toBeVisible()
  })

  test('오늘 버튼이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('button', { name: '오늘' })).toBeVisible()
  })

  test('다가오는 일정 섹션이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('다가오는 일정')).toBeVisible()
  })

  test('커뮤니티 게시글이 일정으로 통합 표시된다', async ({ loggedInPage: page }) => {
    // 커뮤니티 게시글의 날짜가 캘린더에 통합됨
    await expect(page.getByText('청년부 체육대회 참가자 모집')).toBeVisible()
    await expect(page.getByText('여름 전도 캠프 팀원 모집')).toBeVisible()
  })

  test('일정 추가 버튼이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('button', { name: '추가' })).toBeVisible()
  })

  test('일정 추가 버튼 클릭 시 폼이 열린다', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: '추가' }).click()
    await expect(page.getByText('일정 추가')).toBeVisible()
  })

  test('이전/다음 달로 이동할 수 있다', async ({ loggedInPage: page }) => {
    await page.locator('button').filter({ has: page.locator('svg.lucide-chevron-right') }).click()
    await expect(page.getByText('2026년 7월').first()).toBeVisible()
  })
})
