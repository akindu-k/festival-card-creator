import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Download, Heart, Users, Globe, Lock, Trash2, BarChart3, Award, Plus, Loader2 } from 'lucide-react'
import UserAvatar from '../components/community/UserAvatar'
import BadgeChip from '../components/community/BadgeChip'
import CardTemplate from '../templates/CardTemplate'
import { useCreatorDashboard } from '../hooks/useCommunity'
import { useAuthStore } from '../authStore'
import type { CardData, CommunityTemplate } from '../types'

const fmt  = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)
const toCardData = (t: CommunityTemplate): CardData => ({
  templateId: t.base_template_id, senderName: '', senderOrg: '', receiverName: '',
  customGreeting: '', message: t.default_message, fontFamily: t.font_family,
  fontSize: 13, fontColor: t.font_color, textAlign: t.text_align,
  orientation: t.orientation, showDecor: true,
})

export default function CreatorDashboard() {
  const user     = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { myTemplates, stats, loading, profile, togglePublish, deleteTemplate } = useCreatorDashboard()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (!user) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Sign in to access your dashboard</h2>
        <Link to="/auth/login" className="btn-gold text-sm mt-4 inline-flex">Sign In</Link>
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <UserAvatar profile={profile} size="lg" />
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Creator Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {profile ? `@${profile.username}` : user.email}
          </p>
          {profile?.badges && profile.badges.length > 0 && (
            <div className="flex gap-1.5 mt-1.5">
              {profile.badges.map((b) => <BadgeChip key={b.id} badge={b} />)}
            </div>
          )}
        </div>
        <button onClick={() => navigate('/')} className="ml-auto btn-gold text-sm">
          <Plus size={14} /> Create New Card
        </button>
      </div>

      {/* Stats cards */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-pulse">
          {[...Array(4)].map((_, i) => <div key={i} className="panel h-24" />)}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Eye size={18} />,      label: 'Total Views',     val: fmt(stats.views),       color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { icon: <Download size={18} />, label: 'Downloads',       val: fmt(stats.downloads),   color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20' },
            { icon: <Heart size={18} />,    label: 'Total Likes',     val: fmt(stats.likes),       color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/20' },
            { icon: <Users size={18} />,    label: 'Followers',       val: fmt(profile?.follower_count ?? 0), color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          ].map(({ icon, label, val, color, bg }) => (
            <div key={label} className="panel p-5">
              <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}>{icon}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{val}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Templates table */}
      <div className="panel overflow-hidden">
        <div className="panel-header">
          <BarChart3 size={14} />
          My Templates ({myTemplates.length})
        </div>

        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}
          </div>
        ) : myTemplates.length === 0 ? (
          <div className="p-12 text-center text-gray-400 dark:text-gray-600">
            <div className="text-4xl mb-3">🎨</div>
            <p className="text-sm mb-4">You haven't published any templates yet.</p>
            <button onClick={() => navigate('/')} className="btn-gold text-sm">
              Create Your First Template
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  {['Template', 'Status', 'Views', 'Likes', 'Downloads', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 dark:text-gray-500 px-4 py-3 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myTemplates.map((t, i) => {
                  const scale = 40 / 600
                  return (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      {/* Template preview + name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link to={`/community/template/${t.id}`}>
                            <div style={{ width: 40, height: 53, overflow: 'hidden', borderRadius: 6, flexShrink: 0 }}>
                              <div style={{ width: 600, height: 800, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
                                <CardTemplate data={toCardData(t)} isPreview />
                              </div>
                            </div>
                          </Link>
                          <div>
                            <Link to={`/community/template/${t.id}`} className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-gold-600 transition-colors">
                              {t.name}
                            </Link>
                            <p className="text-[10px] text-gray-400 capitalize">{t.category}</p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => togglePublish(t.id, t.is_published)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                            t.is_published
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-red-50 hover:text-red-500'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-green-50 hover:text-green-600'
                          }`}
                        >
                          {t.is_published ? <><Globe size={9}/> Published</> : <><Lock size={9}/> Draft</>}
                        </button>
                      </td>

                      {/* Stats */}
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{fmt(t.view_count)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{fmt(t.like_count)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{fmt(t.download_count)}</td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        {confirmDelete === t.id ? (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-red-500">Delete?</span>
                            <button onClick={() => { deleteTemplate(t.id); setConfirmDelete(null) }} className="text-red-500 font-bold hover:underline">Yes</button>
                            <button onClick={() => setConfirmDelete(null)} className="text-gray-400 hover:underline">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(t.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Badges section */}
      {profile?.badges && profile.badges.length > 0 && (
        <div className="panel mt-4 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            <Award size={14} className="text-gold-500" /> Your Achievements
          </h3>
          <div className="flex flex-wrap gap-3">
            {profile.badges.map((b) => <BadgeChip key={b.id} badge={b} size="md" />)}
          </div>
        </div>
      )}
    </div>
  )
}
