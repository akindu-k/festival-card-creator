import { Link } from 'react-router-dom'
import type { Profile } from '../../types'

interface Props {
  profile: Profile | null | undefined
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  linkable?: boolean
  className?: string
}

const SIZE = { xs: 'w-6 h-6 text-[9px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' }

const COLORS = [
  'from-gold-500 to-vesak-saffron',
  'from-purple-500 to-pink-400',
  'from-blue-500 to-teal-400',
  'from-green-500 to-emerald-400',
  'from-red-400 to-orange-400',
]

export default function UserAvatar({ profile, size = 'md', linkable = false, className = '' }: Props) {
  const initials = profile
    ? (profile.display_name || profile.username || '?').slice(0, 2).toUpperCase()
    : '?'
  const colorIdx = profile ? profile.username.charCodeAt(0) % COLORS.length : 0
  const cls = `${SIZE[size]} rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden bg-gradient-to-br ${COLORS[colorIdx]} text-white ${className}`

  const inner = profile?.avatar_url
    ? <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
    : <span>{initials}</span>

  if (linkable && profile) {
    return <Link to={`/profile/${profile.username}`} className={cls}>{inner}</Link>
  }
  return <div className={cls}>{inner}</div>
}
