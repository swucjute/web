import { test, expect } from './fixtures'

test.describe('예배 탭 (WorshipTab)', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/worship')
    await page.waitForLoadState('networkidle')
  })

  test('이번 주 / 다시보기 탭이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('button', { name: '이번 주' })).toBeVisible()
    await expect(page.getByRole('button', { name: '다시보기' })).toBeVisible()
  })

  test('이번 주 탭에 최신 예배 정보가 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('포도나무 안에 거하라')).toBeVisible()
    await expect(page.getByText('김성훈 목사')).toBeVisible()
  })

  test('이번 주 탭에 아코디언 섹션이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('본문 말씀')).toBeVisible()
    await expect(page.getByText('주보')).toBeVisible()
    await expect(page.getByText('광고')).toBeVisible()
  })

  test('본문 말씀 아코디언을 열면 말씀 내용이 표시된다', async ({ loggedInPage: page }) => {
    await page.getByText('본문 말씀').click()
    await expect(page.getByText('나는 참포도나무요')).toBeVisible()
  })

  test('다시보기 탭에 지난 예배 목록이 표시된다', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: '다시보기' }).click()
    await expect(page.getByText('선한 목자 되신 주님')).toBeVisible()
    await expect(page.getByText('모든 것이 합력하여 선을 이루느니라')).toBeVisible()
  })

  test('다시보기 항목에 AI 요약 버튼이 있다', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: '다시보기' }).click()
    // Sparkles 아이콘이 있는 버튼
    const aiButtons = page.locator('button[title="AI 설교 요약"]')
    await expect(aiButtons.first()).toBeVisible()
  })

  test('다시보기 항목 클릭 시 인라인 상세 뷰가 열린다', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: '다시보기' }).click()
    await page.getByText('선한 목자 되신 주님').click()
    await expect(page.getByText('목록으로 돌아가기')).toBeVisible()
    await expect(page.getByText('선한 목자 되신 주님')).toBeVisible()
  })
})

test.describe('예배 관리 (/worship/manage)', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/worship/manage')
    await page.waitForLoadState('networkidle')
  })

  test('예배 기록 목록이 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('예배 관리')).toBeVisible()
    await expect(page.getByText('총 3회 기록')).toBeVisible()
  })

  test('예배 기록 아이템에 설교자와 참석 인원이 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('45명')).toBeVisible()
    await expect(page.getByText('32만원')).toBeVisible()
  })

  test('기록 추가 버튼이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('button', { name: '기록 추가' })).toBeVisible()
  })
})
