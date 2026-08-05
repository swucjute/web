import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

export function DesignSystemDemo() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-neutral-200">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-50 active:bg-neutral-100 transition">
            <ArrowLeft size={20} className="text-neutral-800" />
          </button>
          <span className="font-bold text-neutral-800 text-base flex-1">디자인 시스템 데모</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 space-y-6">
        {/* Colors */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>색상 팔레트</CardTitle>
            <CardDescription>Primary (Coral Red) &amp; Secondary (Warm Beige)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2 mt-4">
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-primary-500" />
                <p className="text-[10px] text-center text-neutral-500">Primary</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-secondary-500" />
                <p className="text-[10px] text-center text-neutral-500">Secondary</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-accent-500" />
                <p className="text-[10px] text-center text-neutral-500">Accent</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-success-500" />
                <p className="text-[10px] text-center text-neutral-500">Success</p>
              </div>
              <div className="space-y-1">
                <div className="h-12 rounded-lg bg-neutral-500" />
                <p className="text-[10px] text-center text-neutral-500">Neutral</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>버튼</CardTitle>
            <CardDescription>다양한 variants와 sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
              <Button variant="primary" fullWidth>Full Width Button</Button>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>배지</CardTitle>
            <CardDescription>상태 표시용 뱃지</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="primary" dot>Primary</Badge>
              <Badge variant="secondary" dot>Secondary</Badge>
              <Badge variant="success" dot>Success</Badge>
              <Badge variant="warning" dot>Warning</Badge>
              <Badge variant="error" dot>Error</Badge>
              <Badge variant="neutral" dot>Neutral</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="primary" size="sm">Small</Badge>
              <Badge variant="primary" size="md">Medium</Badge>
              <Badge variant="primary" size="lg">Large</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>카드</CardTitle>
            <CardDescription>다양한 카드 스타일</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-4">
              <Card variant="default" padding="md">
                <p className="text-sm text-neutral-500">Default Card (shadow)</p>
              </Card>
              <Card variant="bordered" padding="md">
                <p className="text-sm text-neutral-500">Bordered Card</p>
              </Card>
              <Card variant="elevated" padding="md">
                <p className="text-sm text-neutral-500">Elevated Card (strong shadow)</p>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Inputs */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>입력 필드</CardTitle>
            <CardDescription>Input &amp; Textarea</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              <Input placeholder="일반 입력 필드" />
              <Input placeholder="에러 상태" error helperText="필수 항목입니다" />
              <Input placeholder="도움말 포함" helperText="이름을 입력해주세요" />
              <Textarea placeholder="여러 줄 입력" rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>타이포그래피</CardTitle>
            <CardDescription>폰트 크기와 스타일</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-4">
              <div className="text-neutral-800">
                <p className="text-xs mb-1 text-neutral-500">Text XS (12px)</p>
                <p className="text-xs">빠른 갈색 여우가 게으른 개를 뛰어넘습니다</p>
              </div>
              <div className="text-neutral-800">
                <p className="text-xs mb-1 text-neutral-500">Text SM (14px)</p>
                <p className="text-sm">빠른 갈색 여우가 게으른 개를 뛰어넘습니다</p>
              </div>
              <div className="text-neutral-800">
                <p className="text-xs mb-1 text-neutral-500">Text Base (16px)</p>
                <p className="text-base">빠른 갈색 여우가 게으른 개를 뛰어넘습니다</p>
              </div>
              <div className="text-neutral-800">
                <p className="text-xs mb-1 text-neutral-500">Text LG (18px)</p>
                <p className="text-lg">빠른 갈색 여우가 게으른 개를 뛰어넘습니다</p>
              </div>
              <div className="text-neutral-800">
                <p className="text-xs mb-1 text-neutral-500">Text XL (20px)</p>
                <p className="text-xl font-semibold">빠른 갈색 여우가 게으른 개를 뛰어넘습니다</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="h-4" />
      </div>
    </div>
  );
}
