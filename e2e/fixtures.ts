import { test as base, Page } from '@playwright/test'

// 테스트 계정
export const TEST_ACCOUNTS = {
  admin:  { email: 'admin@church.com',  password: 'admin123',  name: '관리자' },
  leader: { email: 'leader@church.com', password: 'leader123', name: '리더' },
  member: { email: 'member@church.com', password: 'member123', name: '회원' },
}

// 로그인 헬퍼
export async function login(page: Page, role: keyof typeof TEST_ACCOUNTS = 'admin') {
  const { email, password } = TEST_ACCOUNTS[role]
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL('/')
}

// 로그인된 상태로 시작하는 픽스처
export const test = base.extend<{ loggedInPage: Page }>({
  loggedInPage: async ({ page }, use) => {
    await login(page)
    await use(page)
  },
})

export { expect } from '@playwright/test'
