import { test, expect } from './fixtures'

test.describe('플랫폼 목록', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/platform')
    await page.waitForLoadState('networkidle')
  })

  test('탭 필터가 4개 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('모집중').first()).toBeVisible()
    await expect(page.getByText('운영중').first()).toBeVisible()
    await expect(page.getByText('종료').first()).toBeVisible()
    await expect(page.getByText('활동').first()).toBeVisible()
  })

  test('모집중 탭에 플랫폼이 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('청년 독서 모임')).toBeVisible()
    await expect(page.getByText('모집중').first()).toBeVisible()
  })

  test('운영중 탭으로 전환하면 해당 플랫폼이 표시된다', async ({ loggedInPage: page }) => {
    await page.getByText('운영중').first().click()
    await expect(page.getByText('청년 배드민턴')).toBeVisible()
  })

  test('제안하기 버튼이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('button', { name: '제안하기' })).toBeVisible()
  })
})

test.describe('플랫폼 상세 페이지', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/platform/1')
    await page.waitForLoadState('networkidle')
  })

  test('플랫폼 기본 정보가 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('heading', { name: '청년 독서 모임' })).toBeVisible()
    await expect(page.getByText('교회 소그룹실')).toBeVisible()
    await expect(page.getByText('2025-06-01')).toBeVisible()
  })

  test('정보/활동 탭이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('button', { name: '정보' })).toBeVisible()
    await expect(page.getByRole('button', { name: /활동/ })).toBeVisible()
  })

  test('참여 멤버 수가 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText(/현재 \d+명 참여중/)).toBeVisible()
  })
})

test.describe('플랫폼 제안', () => {
  test('제안 폼이 렌더링된다', async ({ loggedInPage: page }) => {
    await page.goto('/platform/propose')
    await expect(page.getByText('플랫폼 제안하기')).toBeVisible()
    await expect(page.getByPlaceholder('플랫폼 이름을 입력하세요')).toBeVisible()
    await expect(page.getByRole('button', { name: '제안 제출하기' })).toBeVisible()
  })
})

test.describe('플랫폼 관리 (admin only)', () => {
  test('승인 대기 목록이 표시된다', async ({ loggedInPage: page }) => {
    await page.goto('/platform/manage')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('승인 대기')).toBeVisible()
    await expect(page.getByText('청년 기도 모임')).toBeVisible()
    await expect(page.getByRole('button', { name: '승인' })).toBeVisible()
    await expect(page.getByRole('button', { name: '반려' })).toBeVisible()
  })

  test('활성 플랫폼의 상태 토글이 있다', async ({ loggedInPage: page }) => {
    await page.goto('/platform/manage')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('플랫폼 상태 관리')).toBeVisible()
    await expect(page.getByText('모집중').first()).toBeVisible()
    await expect(page.getByText('운영중').first()).toBeVisible()
  })
})
