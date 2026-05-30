import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, Heart, MessageCircle, UserPlus, Star, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import UserAvatar from '../components/community/UserAvatar'
import { useAuthStore } from '../authStore'
import type { Notification } from '../types'

const TYPE_ICON: Record<string, React.ReactNode> = {
  like:     <Heart size={13} className="text-red-400" />,
  comment:  <MessageCircle size={13} className="text-blue-400" />,
  follow:   <UserPlus size={13} className="text-purple-400" />,
  reply:    <MessageCircle size={13} className="text-green-400" />,
  featured: <Star size={13} className="text-gold-400" />,
}

const TYPE_MSG: Record<string, string> = {
  like:     'liked your template',
  comment:  'commented on your template',
  follow:   'started following you',
  reply:    'replied to your comment',
  featured: 'Your template was featured! 🌟',
}

export default function NotificationsPage() {
  const user             = useAuthStore((s) => s.user)
  const navigate         = useNavigate()
  const { notifications, unreadCount, fetchNotifications, markAllRead } = useAuthStore()

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  if (!user) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">🔔</div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Sign in to see notifications</h2>
        <Link to="/auth/login" className="btn-gold text-sm mt-4 inline-flex">Sign In</Link>
      </div>
    )
  }

  // Demo notifications when no real ones
  const demoNotifs: Notification[] = [
    { id: 'd1', user_id: user.id, actor_id: 'm2', type: 'like',     entity_type: 'template', entity_id: 'ct-001', message: null, is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'd2', user_id: user.id, actor_id: 'm3', type: 'comment',  entity_type: 'template', entity_id: 'ct-001', message: null, is_read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'd3', user_id: user.id, actor_id: 'm5', type: 'follow',   entity_type: null,       entity_id: null,     message: null, is_read: true,  created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'd4', user_id: user.id, actor_id: null, type: 'featured', entity_type: 'template', entity_id: 'ct-006', message: 'Your template "Sacred Gold Mandala" was featured!', is_read: true, created_at: new Date(Date.now() - 172800000).toISOString() },
  ]

  const items = notifications.length > 0 ? notifications : demoNotifs

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-gold-500" />
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs text-gold-600 hover:underline">
            <CheckCheck size={13} /> Mark all read
          </button>
        )}
      </div>

      <div className="panel overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center text-gray-400 dark:text-gray-600">
            <Bell size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {items.map((n, i) => (
              <NotifItem key={n.id} notif={n} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NotifItem({ notif: n, index }: { notif: Notification; index: number }) {
  const timeAgo = (() => { try { return formatDistanceToNow(new Date(n.created_at), { addSuffix: true }) } catch { return '' } })()
  const message = n.message ?? `${n.actor?.display_name ?? 'Someone'} ${TYPE_MSG[n.type] ?? 'interacted with your content'}`

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${!n.is_read ? 'bg-gold-50/50 dark:bg-gold-900/10' : ''}`}
    >
      {/* Actor avatar or icon */}
      <div className="relative">
        <UserAvatar profile={n.actor} size="sm" linkable={!!n.actor} />
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
          {TYPE_ICON[n.type]}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{message}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo}</p>
      </div>

      {!n.is_read && <div className="w-2 h-2 rounded-full bg-gold-500 mt-1.5 shrink-0" />}
    </motion.div>
  )

  if (n.entity_id && n.entity_type === 'template') {
    return <Link to={`/community/template/${n.entity_id}`}>{content}</Link>
  }
  if (n.actor && n.type === 'follow') {
    return <Link to={`/profile/${n.actor.username}`}>{content}</Link>
  }
  return <div>{content}</div>
}
