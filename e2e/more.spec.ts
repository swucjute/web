import { test, expect } from './fixtures'

test.describe('더보기 메뉴', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/more')
    await page.waitForLoadState('networkidle')
  })

  test('프로필 정보가 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('관리자').first()).toBeVisible()
    await expect(page.getByText('admin@church.com')).toBeVisible()
  })

  test('활동 메뉴 항목들이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('내 기도제목 모아보기')).toBeVisible()
    await expect(page.getByText('참여한 설문보기')).toBeVisible()
    await expect(page.getByText('작성한 글보기')).toBeVisible()
    await expect(page.getByText('참여한 플랫폼보기')).toBeVisible()
  })

  test('관리자에게는 관리 메뉴가 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('교적 관리')).toBeVisible()
    await expect(page.getByText('재정 관리')).toBeVisible()
    await expect(page.getByText('플랫폼 관리')).toBeVisible()
    await expect(page.getByText('예배 관리')).toBeVisible()
    await expect(page.getByText('찬양 관리')).toBeVisible()
    await expect(page.getByText('설문 관리')).toBeVisible()
  })

  test('로그아웃 버튼이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('로그아웃')).toBeVisible()
  })

  test('참여한 플랫폼보기 클릭 시 내 플랫폼 페이지로 이동한다', async ({ loggedInPage: page }) => {
    await page.getByText('참여한 플랫폼보기').click()
    await expect(page).toHaveURL('/more/my-platforms')
    await expect(page.getByText('참여한 플랫폼')).toBeVisible()
  })
})

test.describe('내 플랫폼 페이지', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/more/my-platforms')
    await page.waitForLoadState('networkidle')
  })

  test('내가 제안한 플랫폼과 참여한 플랫폼이 나뉘어 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('내가 제안한 플랫폼')).toBeVisible()
    await expect(page.getByText('내가 참여한 플랫폼')).toBeVisible()
  })
})

test.describe('내 프로필 수정', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/more/profile')
    await page.waitForLoadState('networkidle')
  })

  test('프로필 수정 폼이 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('내 정보 수정')).toBeVisible()
    await expect(page.getByText('계정 정보')).toBeVisible()
    await expect(page.getByText('기본 정보')).toBeVisible()
    await expect(page.getByText('계좌 정보')).toBeVisible()
  })

  test('저장 버튼이 있다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('button', { name: '저장하기' })).toBeVisible()
  })
})

test.describe('로그아웃', () => {
  test('로그아웃 후 로그인 페이지로 이동한다', async ({ loggedInPage: page }) => {
    await page.goto('/more')
    await page.getByText('로그아웃').click()
    await expect(page).toHaveURL('/login')
  })
})
