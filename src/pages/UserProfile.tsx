import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Grid3X3, Bookmark, Award, LinkIcon, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import UserAvatar from '../components/community/UserAvatar'
import FollowButton from '../components/community/FollowButton'
import BadgeChip from '../components/community/BadgeChip'
import CommunityTemplateCard from '../components/community/CommunityTemplateCard'
import { useUserProfile } from '../hooks/useCommunity'
import { useAppStore } from '../store'
import type { CommunityTemplate } from '../types'
import toast from 'react-hot-toast'

type ProfileTab = 'templates' | 'saved'

export default function UserProfile() {
  const { username }  = useParams<{ username: string }>()
  const navigate       = useNavigate()
  const { selectTemplate, updateCard } = useAppStore()
  const { profile, templates, loading } = useUserProfile(username ?? '')
  const [tab, setTab] = useState<ProfileTab>('templates')

  const useTemplate = (t: CommunityTemplate) => {
    selectTemplate(t.base_template_id)
    updateCard({ fontFamily: t.font_family, fontColor: t.font_color, textAlign: t.text_align, orientation: t.orientation, message: t.default_message })
    toast.success('Template applied!')
    navigate('/')
  }

  if (loading) return <ProfileSkeleton />

  if (!profile) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">👤</div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">User not found</h2>
        <Link to="/community" className="btn-gold text-sm mt-4 inline-flex">Browse Community</Link>
      </div>
    )
  }

  const joinedAgo = (() => { try { return formatDistanceToNow(new Date(profile.created_at ?? ''), { addSuffix: true }) } catch { return '' } })()

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-12">

      {/* Profile header */}
      <div className="relative mb-8">
        {/* Banner */}
        <div className="h-32 sm:h-44 rounded-2xl bg-gradient-to-br from-gold-600 via-vesak-saffron to-purple-500 opacity-80" />

        {/* Avatar + info row */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-14 px-4 sm:px-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <UserAvatar profile={profile} size="xl" className="ring-4 ring-white dark:ring-gray-950 shadow-xl" />
          </motion.div>
          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{profile.display_name}</h1>
              {profile.badges && profile.badges.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {profile.badges.slice(0, 3).map((b) => <BadgeChip key={b.id} badge={b} />)}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>
          </div>
          <div className="pb-1">
            <FollowButton targetUserId={profile.id} />
          </div>
        </div>
      </div>

      <div className="px-2 sm:px-0 grid lg:grid-cols-[260px,1fr] gap-8">

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Bio */}
          {profile.bio && (
            <div className="panel p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div className="panel p-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Stats</h3>
            <div className="space-y-2">
              {[
                { label: 'Templates Published', val: profile.template_count.toLocaleString() },
                { label: 'Total Likes Received', val: profile.total_likes.toLocaleString() },
                { label: 'Followers',            val: profile.follower_count.toLocaleString() },
                { label: 'Following',            val: profile.following_count.toLocaleString() },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          {profile.badges && profile.badges.length > 0 && (
            <div className="panel p-4">
              <h3 className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                <Award size={12} className="text-gold-500" /> Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((b) => <BadgeChip key={b.id} badge={b} size="md" />)}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="space-y-1.5 px-1">
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gold-600 hover:underline"
              >
                <LinkIcon size={11} /> {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {joinedAgo && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={11} /> Joined {joinedAgo}
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div>
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl w-fit mb-6">
            {([
              { id: 'templates' as ProfileTab, icon: <Grid3X3 size={12} />, label: `Templates (${profile.template_count})` },
              { id: 'saved'     as ProfileTab, icon: <Bookmark  size={12} />, label: 'Saved' },
            ]).map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  tab === t.id ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >{t.icon}{t.label}</button>
            ))}
          </div>

          {tab === 'templates' && (
            templates.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-600">
                <Grid3X3 size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No published templates yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {templates.map((t, i) => (
                  <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <CommunityTemplateCard template={t} onUse={useTemplate} />
                  </motion.div>
                ))}
              </div>
            )
          )}

          {tab === 'saved' && (
            <div className="text-center py-12 text-gray-400 dark:text-gray-600">
              <Bookmark size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Saved templates are private.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 animate-pulse">
      <div className="h-44 rounded-2xl bg-gray-200 dark:bg-gray-800 mb-8" />
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-40" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24" />
        </div>
      </div>
    </div>
  )
}
