import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Flame, Clock, Heart, Star, Users, TrendingUp, Crown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import CommunityTemplateCard from '../components/community/CommunityTemplateCard'
import UserAvatar from '../components/community/UserAvatar'
import { useCommunityFeed } from '../hooks/useCommunity'
import { useAppStore } from '../store'
import type { CommunityTemplate, CommunityFeedSort } from '../types'
import { MOCK_PROFILES } from '../lib/mockData'

const SORT_TABS: { id: CommunityFeedSort; label: string; icon: React.ReactNode }[] = [
  { id: 'trending',  label: 'Trending',   icon: <TrendingUp size={13} /> },
  { id: 'new',       label: 'New',        icon: <Clock size={13} /> },
  { id: 'liked',     label: 'Most Liked', icon: <Heart size={13} /> },
  { id: 'featured',  label: 'Featured',   icon: <Star size={13} /> },
]

const CATEGORIES = ['all','traditional','floral','spiritual','festive','minimalist','modern']

export default function CommunityFeed() {
  const navigate     = useNavigate()
  const { selectTemplate, updateCard } = useAppStore()
  const [sort, setSort]         = useState<CommunityFeedSort>('trending')
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('all')
  const [query, setQuery]       = useState('')

  const { templates, loading } = useCommunityFeed(sort, search, category)

  const useTemplate = (t: CommunityTemplate) => {
    selectTemplate(t.base_template_id)
    updateCard({
      fontFamily: t.font_family, fontColor: t.font_color,
      textAlign:  t.text_align, orientation: t.orientation,
      message:    t.default_message,
    })
    navigate('/')
  }

  const featured = templates.filter((t) => t.is_featured).slice(0, 1)[0]

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 text-gold-700 dark:text-gold-400 text-xs font-medium">
            <Users size={11} /> Community Templates
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Discover <span className="text-gradient-gold">Community</span> Designs
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg">
          Explore templates created by the community. Use them for your Vesak cards, or publish your own for others to enjoy.
        </p>
      </motion.div>

      {/* Featured spotlight */}
      {featured && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Crown size={14} className="text-gold-500" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Editor's Pick</span>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gold-200 dark:border-gold-800 shadow-xl shadow-gold-400/10 flex flex-col sm:flex-row">
            {/* Preview */}
            <div className="sm:w-48 h-48 sm:h-auto relative overflow-hidden shrink-0" style={{ background: 'linear-gradient(135deg, #1a0a4e, #050215)' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gold-400 text-5xl opacity-40">🪷</span>
              </div>
              <div className="absolute top-3 left-3">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gold-500 text-white shadow-lg">
                  <Star size={9} fill="white" /> Featured
                </span>
              </div>
            </div>
            {/* Info */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-1">{featured.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{featured.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <UserAvatar profile={featured.creator} size="xs" />
                  <span>by <Link to={`/profile/${featured.creator?.username}`} className="font-medium text-gold-600 hover:underline">@{featured.creator?.username}</Link></span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Heart size={11} /> {featured.like_count.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Link to={`/community/template/${featured.id}`} className="btn-outline text-xs py-2">View Details</Link>
                <button onClick={() => useTemplate(featured)} className="btn-gold text-xs py-2">Use This Template</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Search templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearch(query)}
            onBlur={() => setSearch(query)}
            className="input-base pl-10 text-sm"
          />
        </div>
        {/* Sort tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {SORT_TABS.map((t) => (
            <button key={t.id} onClick={() => setSort(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                sort === t.id ? 'bg-gold-500 text-white shadow-md shadow-gold-400/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gold-50 dark:hover:bg-gray-700'
              }`}
            >{t.icon}{t.label}</button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
              category === c ? 'bg-gold-500/20 text-gold-700 dark:text-gold-400 border border-gold-400' : 'border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gold-300'
            }`}
          >{c === 'all' ? 'All Categories' : c}</button>
        ))}
      </div>

      {/* Featured creators strip */}
      <div className="mb-8 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
          <Flame size={12} className="text-vesak-saffron" /> Top Creators
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-thin">
          {MOCK_PROFILES.slice(0, 5).map((p) => (
            <Link key={p.id} to={`/profile/${p.username}`} className="flex flex-col items-center gap-1.5 shrink-0 group">
              <UserAvatar profile={p} size="md" className="group-hover:ring-2 group-hover:ring-gold-400 ring-offset-2 transition-all" />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 group-hover:text-gold-600 transition-colors max-w-[64px] truncate">{p.display_name}</span>
              <span className="text-[9px] text-gray-400">{p.follower_count.toLocaleString()} followers</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm">No templates found. Try a different search or filter.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {templates.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <CommunityTemplateCard template={t} onUse={useTemplate} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-800" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  )
}
