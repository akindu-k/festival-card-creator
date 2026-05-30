import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, Flame, Clock, Star, Users, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { TEMPLATES, CATEGORIES } from '../data/templates'
import { useAppStore } from '../store'
import CardTemplate from '../templates/CardTemplate'
import type { CardData } from '../types'

const DEMO_DATA: CardData = {
  templateId:     '',
  senderName:     'Nimal',
  senderOrg:      '',
  receiverName:   '',
  customGreeting: '',
  message:        'May the light of Vesak illuminate your path.',
  fontFamily:     'Playfair Display',
  fontSize:       13,
  fontColor:      '#FFFFFF',
  textAlign:      'center',
  orientation:    'portrait',
  showDecor:      true,
}

export default function TemplateGallery() {
  const { selectTemplate, recentIds, favoriteIds, toggleFavorite, isFavorite } = useAppStore()
  const [query, setQuery]       = useState('')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchCat = category === 'all' || t.category === category
      const matchQ   = !query || t.name.toLowerCase().includes(query.toLowerCase()) ||
                       t.tags.some((g) => g.includes(query.toLowerCase()))
      return matchCat && matchQ
    })
  }, [query, category])

  const recents   = recentIds.map((id) => TEMPLATES.find((t) => t.id === id)).filter(Boolean)
  const favorites = TEMPLATES.filter((t) => isFavorite(t.id))

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">

      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 text-gold-700 dark:text-gold-400 text-xs font-medium mb-4">
          <Flame size={12} className="text-vesak-saffron" />
          Vesak Poya Day Card Creator
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Choose Your{' '}
          <span className="text-gradient-gold">Vesak Template</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
          Select a beautifully designed template, personalize your message, and share the light of Dhamma with your loved ones.
        </p>
      </motion.div>

      {/* Search + filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-base pl-10"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                category === cat.id
                  ? 'bg-gold-500 text-white shadow-md shadow-gold-400/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gold-50 dark:hover:bg-gray-700 hover:text-gold-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recently used */}
      {recents.length > 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
          <SectionTitle icon={<Clock size={14} />} label="Recently Used" />
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {recents.map((t) => t && (
              <TemplateCard key={t.id} template={t} compact onSelect={selectTemplate} onFav={toggleFavorite} favd={isFavorite(t.id)} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Favorites */}
      {favorites.length > 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
          <SectionTitle icon={<Star size={14} className="text-gold-500" />} label="Favorites" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.map((t) => (
              <TemplateCard key={t.id} template={t} onSelect={selectTemplate} onFav={toggleFavorite} favd />
            ))}
          </div>
        </motion.section>
      )}

      {/* Main gallery */}
      <section>
        <SectionTitle icon={<Star size={14} />} label={query ? `Results for "${query}"` : 'All Templates'} count={filtered.length} />
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-16 text-gray-400 dark:text-gray-600"
            >
              <div className="text-4xl mb-3">🪷</div>
              <p className="text-sm">No templates match your search.</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {filtered.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <TemplateCard template={t} onSelect={selectTemplate} onFav={toggleFavorite} favd={isFavorite(t.id)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Community coming soon banner ─────────────────── */}
      <section className="mt-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-gold-200 dark:border-gold-800 bg-gradient-to-br from-gold-50 to-vesak-cream dark:from-gray-900 dark:to-gray-800 p-8 text-center"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gold-200/30 dark:bg-gold-700/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-vesak-saffron/20 dark:bg-vesak-saffron/10 blur-2xl pointer-events-none" />

          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="text-4xl mb-3 select-none">🪷</motion.div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 dark:bg-gold-900/30 border border-gold-300 dark:border-gold-700 text-gold-700 dark:text-gold-400 text-[11px] font-semibold mb-3">
            <Sparkles size={10} /> Coming Soon
          </div>

          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-1.5">Community Templates</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-5">
            Share your Vesak card designs, discover templates created by others, and follow your favourite creators — coming very soon.
          </p>

          <Link to="/community" className="btn-gold text-sm inline-flex gap-2 items-center px-5 py-2.5">
            <Users size={13} /> See What's Coming
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

function SectionTitle({ icon, label, count }: { icon: React.ReactNode; label: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-gold-500">{icon}</span>
      <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">{label}</h3>
      {count !== undefined && (
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">{count} templates</span>
      )}
    </div>
  )
}

interface TemplateCardProps {
  template: typeof TEMPLATES[0]
  compact?: boolean
  onSelect: (id: string) => void
  onFav:    (id: string) => void
  favd:     boolean
}

function TemplateCard({ template: t, compact, onSelect, onFav, favd }: TemplateCardProps) {
  const [hovered, setHovered] = useState(false)

  const demoData: CardData = {
    ...DEMO_DATA,
    templateId: t.id,
    fontColor:  t.textColor,
    message:    DEMO_DATA.message,
  }

  const thumbW = compact ? 100 : 140
  const thumbH = compact ? 133 : 187
  const scale  = thumbW / 600

  return (
    <div
      className={`template-card group ${compact ? 'w-[100px] shrink-0' : 'w-full'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(t.id)}
    >
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden bg-gray-100 dark:bg-gray-800"
        style={{ height: thumbH }}
      >
        <div
          style={{
            width:           600,
            height:          800,
            transform:       `scale(${scale})`,
            transformOrigin: 'top left',
            pointerEvents:   'none',
            userSelect:      'none',
          }}
        >
          <CardTemplate data={demoData} isPreview />
        </div>

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
            >
              <span className="px-3 py-1.5 rounded-lg bg-gold-500 text-white text-xs font-medium shadow-lg">
                Use Template
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); onFav(t.id) }}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
            favd
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-black/30 text-white/70 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart size={11} fill={favd ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Label */}
      {!compact && (
        <div className="p-2.5 bg-white dark:bg-gray-900">
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{t.name}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 capitalize mt-0.5">{t.category}</p>
        </div>
      )}
    </div>
  )
}
