# 디자인 시스템 가이드

## 개요
교회 청년부 관리 시스템을 위한 따뜻하고 신뢰감 있는 디자인 시스템입니다.  
Primary 컬러인 **#DE5252**(Coral Red)를 중심으로 베이지 톤과 조합하여 따뜻한 느낌을 구현했습니다.

---

## 색상 팔레트

### Primary Color (Coral Red)
```css
--color-primary-500: #DE5252  /* Main brand color */
--color-primary-600: #dc2626  /* Hover state */
--color-primary-700: #b91c1c  /* Active state */
```

### Secondary Color (Warm Beige)
```css
--color-secondary-500: #b8a890  /* Main secondary */
--color-secondary-600: #a08968  /* Hover */
--color-secondary-700: #7d6b52  /* Active */
```

### Accent Color (Warm Orange)
```css
--color-accent-500: #f97316
--color-accent-600: #ea580c
```

### Neutral Colors (Warm Grays)
```css
--color-neutral-50: #fafaf9   /* Lightest */
--color-neutral-500: #78716c  /* Mid */
--color-neutral-900: #1c1917  /* Darkest */
```

### Semantic Colors
- **Success**: `#22c55e`
- **Warning**: `#eab308`
- **Error**: `#ef4444`
- **Info**: `#3b82f6`

---

## 타이포그래피

### Font Family
```css
--font-sans: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Sizes
- `--text-xs`: 0.75rem (12px)
- `--text-sm`: 0.875rem (14px)
- `--text-base`: 1rem (16px)
- `--text-lg`: 1.125rem (18px)
- `--text-xl`: 1.25rem (20px)
- `--text-2xl`: 1.5rem (24px)
- `--text-3xl`: 1.875rem (30px)

### Font Weights
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## 간격 시스템

```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
```

---

## Border Radius

```css
--radius-sm: 0.375rem   /* 6px */
--radius-md: 0.5rem     /* 8px */
--radius-lg: 0.75rem    /* 12px */
--radius-xl: 1rem       /* 16px */
--radius-2xl: 1.5rem    /* 24px */
--radius-full: 9999px   /* Fully rounded */
```

---

## 컴포넌트

### Button

**사용법:**
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md">
  클릭하기
</Button>
```

**Variants:**
- `primary`: Coral red background
- `secondary`: Warm beige background
- `outline`: Outlined with coral border
- `ghost`: Transparent with coral text
- `danger`: Red background

**Sizes:**
- `sm`: Small (px-3 py-1.5)
- `md`: Medium (px-4 py-2.5)
- `lg`: Large (px-6 py-3.5)

---

### Card

**사용법:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

<Card variant="default" padding="md">
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>
    내용
  </CardContent>
</Card>
```

**Variants:**
- `default`: Shadow effect
- `bordered`: Border only
- `elevated`: Strong shadow

**Padding:**
- `none`, `sm`, `md`, `lg`

---

### Badge

**사용법:**
```tsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="primary" size="md" dot>
  승인 대기
</Badge>
```

**Variants:**
- `primary`: Coral red
- `secondary`: Warm beige
- `success`: Green
- `warning`: Yellow
- `error`: Red
- `neutral`: Gray

---

### Input / Textarea

**사용법:**
```tsx
import { Input, Textarea } from '@/components/ui';

<Input 
  placeholder="이름을 입력하세요"
  error={false}
  helperText="도움말 텍스트"
/>

<Textarea 
  placeholder="내용을 입력하세요"
  rows={4}
/>
```

---

## 배경 그라디언트

따뜻한 베이지 그라디언트:
```css
background: linear-gradient(135deg, #faf9f7 0%, #fff7ed 50%, #fef2f2 100%);
```

---

## 사용 예시

### 버튼 조합
```tsx
<div className="flex gap-3">
  <Button variant="primary">저장</Button>
  <Button variant="outline">취소</Button>
</div>
```

### 상태 뱃지
```tsx
<Badge variant="success" dot>승인</Badge>
<Badge variant="warning" dot>대기중</Badge>
<Badge variant="error" dot>반려</Badge>
```

### 카드 레이아웃
```tsx
<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle>플랫폼 제목</CardTitle>
    <CardDescription>청년 독서 모임</CardDescription>
  </CardHeader>
  <CardContent>
    <p>활동 내용...</p>
  </CardContent>
</Card>
```

---

## 디자인 원칙

1. **따뜻함과 신뢰**: Coral red와 베이지 톤으로 친근하면서도 전문적인 느낌
2. **명확한 계층**: 일관된 간격과 타이포그래피로 정보 구조화
3. **직관적 인터랙션**: 명확한 hover/active 상태와 피드백
4. **모바일 우선**: 터치 친화적인 버튼 크기와 간격
5. **접근성**: 충분한 색상 대비와 명확한 레이블

---

## 참고

모든 디자인 토큰은 `/src/styles/design-tokens.css`에서 확인할 수 있으며,  
컴포넌트는 `/src/app/components/ui/` 디렉토리에 위치합니다.
