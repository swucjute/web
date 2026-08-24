import type { Platform } from '../types';

export interface StatusBadge {
  label: string;
  color: string;
  dot: string;
}

/**
 * 플랫폼 상태 배지 목록. 승인대기/반려/종료/취소는 배지 1개, 그 외엔 모집중/운영중이 각각
 * 독립적으로 켜질 수 있어 최대 2개(동시 표시)까지 반환한다.
 */
export function platformStatusBadges(platform: Platform): StatusBadge[] {
  if (platform.approvalStatus === 'PENDING') {
    return [{ label: '승인 대기', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' }];
  }
  if (platform.approvalStatus === 'REJECTED') {
    return [{ label: '반려됨', color: 'bg-red-100 text-red-700', dot: 'bg-red-400' }];
  }
  if (platform.closedStatus === 'FINISHED') {
    return [{ label: '운영종료', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' }];
  }
  if (platform.closedStatus === 'CANCELLED') {
    return [{ label: '취소됨', color: 'bg-gray-100 text-gray-400', dot: 'bg-gray-300' }];
  }

  const badges: StatusBadge[] = [];
  if (platform.recruiting) {
    badges.push({ label: '모집중', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' });
  }
  if (platform.operating) {
    badges.push({ label: '운영중', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' });
  }
  if (badges.length === 0) {
    badges.push({ label: '대기', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' });
  }
  return badges;
}
