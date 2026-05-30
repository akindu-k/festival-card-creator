import { UserPlus, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../authStore'
import { useFollow } from '../../hooks/useCommunity'

interface Props {
  targetUserId: string | undefined
  className?: string
}

export default function FollowButton({ targetUserId, className = '' }: Props) {
  const user     = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { following, toggle } = useFollow(targetUserId)

  if (!targetUserId || (user && user.id === targetUserId)) return null

  const handleClick = () => {
    if (!user) { navigate('/auth/login'); return }
    toggle()
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        following
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20'
          : 'bg-gold-500 text-white hover:bg-gold-600 shadow-md shadow-gold-400/30'
      } ${className}`}
    >
      {following ? <UserCheck size={13} /> : <UserPlus size={13} />}
      {following ? 'Following' : 'Follow'}
    </button>
  )
}
