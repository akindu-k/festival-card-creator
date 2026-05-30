import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Heart, MessageCircle, Bookmark, ArrowLeft, Sparkles } from 'lucide-react'

const FEATURES = [
  { icon: <Users size={16} />,         label: 'Community Template Feed' },
  { icon: <Heart size={16} />,         label: 'Likes & Reactions' },
  { icon: <MessageCircle size={16} />, label: 'Comments & Discussions' },
  { icon: <Bookmark size={16} />,      label: 'Save to Collections' },
  { icon: <Users size={16} />,         label: 'Follow Creators' },
  { icon: <Sparkles size={16} />,      label: 'Creator Dashboard & Badges' },
]

export default function ComingSoon() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">

        {/* Animated lotus */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-7xl mb-6 select-none"
        >
          🪷
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 text-gold-700 dark:text-gold-400 text-xs font-semibold mb-5"
        >
          <Sparkles size={12} className="text-vesak-saffron" />
          Coming Soon
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3"
        >
          Community is on{' '}
          <span className="text-gradient-gold">its way</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8"
        >
          We're building a space where creators can share Vesak card templates,
          follow each other, and spread the light of Dhamma together.
          Stay tuned — it won't be long.
        </motion.p>

        {/* Feature list */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-2.5 mb-8"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.06 }}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-left"
            >
              <span className="text-gold-500 shrink-0">{f.icon}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{f.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to="/" className="btn-gold px-6 py-2.5 text-sm">
            <ArrowLeft size={14} /> Back to Card Creator
          </Link>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Create &amp; download cards while you wait 🎨
          </p>
        </motion.div>
      </div>
    </div>
  )
}
