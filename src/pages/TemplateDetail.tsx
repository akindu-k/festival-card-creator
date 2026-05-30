import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Bookmark, Download, Eye, Share2, ArrowLeft, Tag, Calendar, MessageCircle, Flag, CheckCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import CardTemplate from '../templates/CardTemplate'
import CommentSection from '../components/community/CommentSection'
import UserAvatar from '../components/community/UserAvatar'
import FollowButton from '../components/community/FollowButton'
import { useTemplateDetail, useLike, useSave } from '../hooks/useCommunity'
import { useAuthStore } from '../authStore'
import { useAppStore } from '../store'
import { MOCK_COMMUNITY_TEMPLATES } from '../lib/mockData'
import type { CardData, CommunityTemplate } from '../types'
import toast from 'react-hot-toast'

const toCardData = (t: CommunityTemplate): CardData => ({
  templateId: t.base_template_id, senderName: '', senderOrg: '', receiverName: '',
  customGreeting: '', message: t.default_message, fontFamily: t.font_family,
  fontSize: 15, fontColor: t.font_color, textAlign: t.text_align,
  orientation: t.orientation, showDecor: true,
})

const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)

export default function TemplateDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate  = useNavigate()
  const user      = useAuthStore((s) => s.user)
  const { selectTemplate, updateCard } = useAppStore()
  const { template: raw, loading } = useTemplateDetail(id ?? '')
  const [template, setTemplate] = useState<CommunityTemplate | null>(null)
  const resolvedTemplate = template ?? raw

  const { liked, toggle: toggleLike } = useLike(resolvedTemplate, setTemplate)
  const { saved, toggle: toggleSave } = useSave(resolvedTemplate, setTemplate)

  const useThisTemplate = () => {
    if (!resolvedTemplate) return
    selectTemplate(resolvedTemplate.base_template_id)
    updateCard({
      fontFamily: resolvedTemplate.font_family,
      fontColor:  resolvedTemplate.font_color,
      textAlign:  resolvedTemplate.text_align,
      orientation: resolvedTemplate.orientation,
      message:    resolvedTemplate.default_message,
    })
    toast.success('Template applied! Customize your card. 🎨')
    navigate('/')
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!', { icon: '🔗' })
    } catch { toast.error('Could not copy link') }
  }

  const handleReport = () => {
    if (!user) { navigate('/auth/login'); return }
    toast('Report submitted for review. Thank you.', { icon: '🚩' })
  }

  if (loading) return <DetailSkeleton />

  if (!resolvedTemplate) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Template not found</h2>
        <Link to="/community" className="btn-gold text-sm mt-4 inline-flex">Browse Templates</Link>
      </div>
    )
  }

  const t     = resolvedTemplate
  const scale = 260 / (t.orientation === 'landscape' ? 800 : 600)
  const cardW = t.orientation === 'landscape' ? 800 : 600
  const cardH = t.orientation === 'landscape' ? 600 : 800

  // Related templates (same category, different id)
  const related = MOCK_COMMUNITY_TEMPLATES.filter((r) => r.category === t.category && r.id !== t.id).slice(0, 4)

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-gold-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/community" className="hover:text-gold-600 transition-colors">Community</Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300 truncate max-w-[200px]">{t.name}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr,340px] gap-8">

        {/* Left — preview + comments */}
        <div>
          {/* Card preview */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="panel p-6 flex items-center justify-center mb-6"
            style={{ minHeight: cardH * scale + 48 }}
          >
            <div style={{
              width: cardW * scale, height: cardH * scale,
              boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 8px 16px rgba(0,0,0,0.15)',
              borderRadius: 12, overflow: 'hidden', flexShrink: 0,
            }}>
              <div style={{ width: cardW, height: cardH, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
                <CardTemplate data={toCardData(t)} />
              </div>
            </div>
          </motion.div>

          {/* Comments */}
          <div className="panel p-6">
            <CommentSection templateId={t.id} />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Main info panel */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="panel p-5">
            {/* Title + category */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white leading-tight">{t.name}</h1>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 border border-gold-200 dark:border-gold-800 capitalize">
                  {t.category}
                </span>
              </div>
              <button onClick={handleReport} className="p-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Report">
                <Flag size={13} />
              </button>
            </div>

            {t.description && <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{t.description}</p>}

            {/* Tags */}
            {t.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {t.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 dark:text-gray-400">
                    <Tag size={8} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { icon: <Eye size={13} />,      val: fmt(t.view_count),     label: 'Views' },
                { icon: <Download size={13} />, val: fmt(t.download_count), label: 'Downloads' },
                { icon: <MessageCircle size={13}/>, val: fmt(t.comment_count), label: 'Comments' },
              ].map(({ icon, val, label }) => (
                <div key={label} className="flex flex-col items-center p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-1 text-gold-500 mb-0.5">{icon}</div>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{val}</span>
                  <span className="text-[10px] text-gray-400">{label}</span>
                </div>
              ))}
            </div>

            {/* Like + Save */}
            <div className="flex gap-2 mb-4">
              <button onClick={() => { if (!user) { navigate('/auth/login'); return } toggleLike() }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  liked ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-200 hover:text-red-400'
                }`}
              >
                <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
                {liked ? 'Liked' : 'Like'} · {fmt(t.like_count)}
              </button>
              <button onClick={() => { if (!user) { navigate('/auth/login'); return } toggleSave() }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  saved ? 'bg-gold-50 dark:bg-gold-900/20 border-gold-200 dark:border-gold-800 text-gold-600' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gold-200 hover:text-gold-500'
                }`}
              >
                <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>

            {/* Use + Share */}
            <button onClick={useThisTemplate} className="w-full btn-gold mb-2 justify-center py-3 text-sm">
              Use This Template
            </button>
            <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <Share2 size={14} /> Share
            </button>
          </motion.div>

          {/* Creator */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="panel p-5">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Created by</h3>
            <div className="flex items-center gap-3">
              <UserAvatar profile={t.creator} size="md" linkable />
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${t.creator?.username}`} className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-gold-600 transition-colors">
                  {t.creator?.display_name}
                </Link>
                <p className="text-xs text-gray-400">@{t.creator?.username}</p>
              </div>
              <FollowButton targetUserId={t.creator?.id} />
            </div>
            {t.creator?.bio && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{t.creator.bio}</p>}
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
              <Calendar size={10} />
              Published {(() => { try { return formatDistanceToNow(new Date(t.created_at), { addSuffix: true }) } catch { return '' } })()}
            </div>
          </motion.div>

          {/* Related */}
          {related.length > 0 && (
            <div className="panel p-5">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Related Templates</h3>
              <div className="space-y-2">
                {related.map((r) => {
                  const rs = 72 / 600
                  return (
                    <Link key={r.id} to={`/community/template/${r.id}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
                    >
                      <div style={{ width: 72, height: 96, overflow: 'hidden', borderRadius: 8, flexShrink: 0 }}>
                        <div style={{ width: 600, height: 800, transform: `scale(${rs})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
                          <CardTemplate data={toCardData(r)} isPreview />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 group-hover:text-gold-600 transition-colors truncate">{r.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{r.like_count.toLocaleString()} likes</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-6" />
      <div className="grid lg:grid-cols-[1fr,340px] gap-8">
        <div className="panel p-6 h-96 flex items-center justify-center">
          <div className="w-64 h-80 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
        <div className="space-y-4">
          <div className="panel p-5 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
          </div>
        </div>
      </div>
    </div>
  )
}
