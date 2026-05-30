import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Trash2, Reply, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import UserAvatar from './UserAvatar'
import { useComments } from '../../hooks/useCommunity'
import { useAuthStore } from '../../authStore'
import type { Comment } from '../../types'

interface Props { templateId: string }

export default function CommentSection({ templateId }: Props) {
  const { comments, loading, addComment, deleteComment } = useComments(templateId)
  const user     = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [text, setText]       = useState('')
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    if (!user) { navigate('/auth/login'); return }
    setSubmitting(true)
    await addComment(text.trim(), replyTo?.id)
    setText('')
    setReplyTo(null)
    setSubmitting(false)
  }

  return (
    <div>
      <h3 className="flex items-center gap-2 font-semibold text-sm text-gray-700 dark:text-gray-300 mb-4">
        <MessageCircle size={15} className="text-gold-500" />
        Comments ({comments.length})
      </h3>

      {/* Compose */}
      <form onSubmit={submit} className="mb-6">
        {replyTo && (
          <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 text-xs text-gold-700 dark:text-gold-400">
            <Reply size={12} />
            Replying to @{replyTo.user.username}
            <button type="button" onClick={() => setReplyTo(null)} className="ml-auto text-gray-400 hover:text-gray-600">✕</button>
          </div>
        )}
        <div className="flex gap-2">
          <UserAvatar profile={user ? { id: user.id, username: user.email ?? '', display_name: user.email ?? '', avatar_url: null, bio: null, follower_count: 0, following_count: 0, template_count: 0, total_likes: 0 } : null} size="sm" />
          <div className="flex-1 relative">
            <textarea
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={user ? 'Write a comment...' : 'Sign in to comment'}
              disabled={!user}
              className="input-base pr-12 resize-none text-sm"
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(e) } }}
            />
            <button
              type="submit"
              disabled={!text.trim() || submitting}
              className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-gold-500 text-white disabled:opacity-40 hover:bg-gold-600 transition-all"
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      </form>

      {/* List */}
      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <CommentSkeleton key={i} />)}</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
          <MessageCircle size={28} className="mx-auto mb-2 opacity-40" />
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <AnimatePresence>
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              currentUserId={user?.id}
              onDelete={deleteComment}
              onReply={setReplyTo}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  )
}

function CommentItem({ comment: c, currentUserId, onDelete, onReply }: {
  comment: Comment
  currentUserId?: string
  onDelete: (id: string) => void
  onReply: (c: Comment) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const timeAgo = (() => { try { return formatDistanceToNow(new Date(c.created_at), { addSuffix: true }) } catch { return '' } })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`flex gap-3 mb-4 ${c.parent_id ? 'ml-10 border-l-2 border-gray-100 dark:border-gray-800 pl-4' : ''}`}
    >
      <UserAvatar profile={c.user} size="sm" linkable />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{c.user?.display_name}</span>
          <span className="text-[10px] text-gray-400">@{c.user?.username}</span>
          <span className="text-[10px] text-gray-400 ml-auto">{timeAgo}</span>
          {c.is_edited && <span className="text-[10px] text-gray-400">(edited)</span>}
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{c.content}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <button
            onClick={() => onReply(c)}
            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gold-500 transition-colors"
          >
            <Reply size={10} /> Reply
          </button>
          {currentUserId === c.user_id && (
            confirmDelete ? (
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-red-500">Delete?</span>
                <button onClick={() => onDelete(c.id)} className="text-red-500 font-semibold hover:underline">Yes</button>
                <button onClick={() => setConfirmDelete(false)} className="text-gray-400 hover:underline">No</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-400 transition-colors">
                <Trash2 size={10} /> Delete
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  )
}

function CommentSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>
    </div>
  )
}
