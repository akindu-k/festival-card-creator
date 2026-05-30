import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Bookmark, Download, Eye, Star, Crown } from 'lucide-react'
import CardTemplate from '../../templates/CardTemplate'
import UserAvatar from './UserAvatar'
import { useLike, useSave } from '../../hooks/useCommunity'
import { useAuthStore } from '../../authStore'
import type { CommunityTemplate, CardData } from '../../types'
import toast from 'react-hot-toast'

interface Props {
  template: CommunityTemplate
  onUse?: (t: CommunityTemplate) => void
  compact?: boolean
}

const toCardData = (t: CommunityTemplate): CardData => ({
  templateId:     t.base_template_id,
  senderName:     '',
  senderOrg:      '',
  receiverName:   '',
  customGreeting: '',
  message:        t.default_message,
  fontFamily:     t.font_family,
  fontSize:       14,
  fontColor:      t.font_color,
  textAlign:      t.text_align,
  orientation:    t.orientation,
  showDecor:      true,
})

const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)

export default function CommunityTemplateCard({ template: initial, onUse, compact }: Props) {
  const [template, setTemplate] = useState(initial)
  const [hovered, setHovered]   = useState(false)
  const user     = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { liked, toggle: toggleLike } = useLike(template, setTemplate)
  const { saved, toggle: toggleSave } = useSave(template, setTemplate)

  const scale    = compact ? 100 / 600 : 140 / 600
  const thumbH   = compact ? 133 : 187
  const cardData = toCardData(template)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { navigate('/auth/login'); return }
    toggleLike()
    toast.success(liked ? 'Removed like' : 'Liked!', { icon: liked ? '💔' : '❤️', duration: 1500 })
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { navigate('/auth/login'); return }
    toggleSave()
    toast.success(saved ? 'Removed from saved' : 'Saved to collection!', { icon: saved ? '🗂️' : '🔖', duration: 1500 })
  }

  return (
    <div
      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gold-300 dark:hover:border-gold-700 hover:shadow-xl hover:shadow-gold-400/10 hover:-translate-y-1 transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <Link to={`/community/template/${template.id}`} className="block relative overflow-hidden" style={{ height: thumbH }}>
        <div style={{ width: 600, height: 800, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none', userSelect: 'none' }}>
          <CardTemplate data={cardData} isPreview />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {template.is_featured && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500 text-white shadow">
              <Star size={9} fill="currentColor" /> Featured
            </span>
          )}
          {(template.like_count ?? 0) > 300 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white shadow">
              <Crown size={9} /> Hot
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 p-3"
            >
              <Link
                to={`/community/template/${template.id}`}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition-colors"
              >
                <Eye size={12} /> Preview
              </Link>
              {onUse && (
                <button
                  onClick={(e) => { e.preventDefault(); onUse(template) }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gold-500 text-white text-xs font-bold hover:bg-gold-600 transition-colors shadow-lg"
                >
                  Use This Template
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* Footer */}
      <div className="p-3">
        {/* Template name + creator */}
        <div className="flex items-start gap-2 mb-2">
          <UserAvatar profile={template.creator} size="xs" linkable />
          <div className="flex-1 min-w-0">
            <Link to={`/community/template/${template.id}`}>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate hover:text-gold-600 transition-colors">{template.name}</p>
            </Link>
            <Link to={`/profile/${template.creator?.username}`}>
              <p className="text-[10px] text-gray-400 hover:text-gold-500 transition-colors truncate">@{template.creator?.username}</p>
            </Link>
          </div>
        </div>

        {/* Stats + actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[10px] text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-0.5"><Download size={10} /> {fmt(template.download_count)}</span>
            <span className="flex items-center gap-0.5"><Eye size={10} /> {fmt(template.view_count)}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleSave} className={`p-1.5 rounded-lg transition-all ${saved ? 'text-gold-500' : 'text-gray-300 hover:text-gold-400'}`}>
              <Bookmark size={13} fill={saved ? 'currentColor' : 'none'} />
            </button>
            <button onClick={handleLike} className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[10px] font-medium transition-all ${liked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-red-400'}`}>
              <Heart size={11} fill={liked ? 'currentColor' : 'none'} />
              <span>{fmt(template.like_count)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
