import type { Badge } from '../../types'

interface Props {
  badge: Badge
  size?: 'sm' | 'md'
}

export default function BadgeChip({ badge, size = 'sm' }: Props) {
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
  return (
    <span
      title={badge.description}
      className={`inline-flex items-center gap-1 rounded-full font-medium ${pad} border`}
      style={{ borderColor: badge.color + '60', background: badge.color + '18', color: badge.color }}
    >
      <span>{badge.icon}</span>
      {size === 'md' && <span>{badge.name}</span>}
    </span>
  )
}
