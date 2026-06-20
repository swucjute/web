import { test, expect } from './fixtures'

test.describe('커뮤니티', () => {
  test.beforeEach(async ({ loggedInPage: page }) => {
    await page.goto('/community')
    await page.waitForLoadState('networkidle')
  })

  test('게시글 목록이 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByRole('heading', { name: '커뮤니티' })).toBeVisible()
    await expect(page.getByText('이번 주 예배 안내')).toBeVisible()
    await expect(page.getByText('여름 전도 캠프 팀원 모집')).toBeVisible()
  })

  test('유형(공지/참여모집)과 카테고리 배지가 표시된다', async ({ loggedInPage: page }) => {
    await expect(page.getByText('공지').first()).toBeVisible()
    await expect(page.getByText('참여모집').first()).toBeVisible()
    await expect(page.getByText('예배').first()).toBeVisible()
    await expect(page.getByText('전도').first()).toBeVisible()
  })

  test('게시글 클릭 시 상세 페이지로 이동한다', async ({ loggedInPage: page }) => {
    await page.getByText('이번 주 예배 안내').click()
    await expect(page).toHaveURL(/\/community\//)
    await expect(page.getByText('게시글')).toBeVisible()
    await expect(page.getByText('댓글')).toBeVisible()
  })

  test('상세 페이지에서 댓글이 표시된다', async ({ loggedInPage: page }) => {
    await page.getByText('이번 주 예배 안내').click()
    await expect(page.getByText('네 알겠습니다!')).toBeVisible()
  })

  test('상세 페이지에서 댓글을 작성할 수 있다', async ({ loggedInPage: page }) => {
    await page.getByText('이번 주 예배 안내').click()
    await page.getByPlaceholder('댓글을 입력하세요...').fill('테스트 댓글입니다')
    await page.locator('button').filter({ has: page.locator('svg.lucide-send') }).click()
    await expect(page.getByText('테스트 댓글입니다')).toBeVisible()
  })

  test('글쓰기 버튼 클릭 시 작성 폼이 열린다', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: '글쓰기' }).click()
    await expect(page.getByText('새 글 작성')).toBeVisible()
    await expect(page.getByText('공지형')).toBeVisible()
    await expect(page.getByText('참여모집형')).toBeVisible()
    await expect(page.getByPlaceholder('제목을 입력하세요')).toBeVisible()
  })

  test('새 게시글을 작성하고 목록에 나타난다', async ({ loggedInPage: page }) => {
    await page.getByRole('button', { name: '글쓰기' }).click()
    await page.getByPlaceholder('제목을 입력하세요').fill('E2E 테스트 게시글')
    await page.getByPlaceholder('내용을 입력하세요...').fill('테스트 내용입니다')
    await page.getByRole('button', { name: '게시' }).click()
    await expect(page.getByText('E2E 테스트 게시글')).toBeVisible()
  })
})
