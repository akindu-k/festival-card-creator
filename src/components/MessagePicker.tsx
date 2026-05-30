import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, Check, Search } from 'lucide-react'
import { MESSAGE_CATEGORIES, getRandomMessage } from '../data/messages'
import { useAppStore } from '../store'
import toast from 'react-hot-toast'

export default function MessagePicker() {
  const { updateCard } = useAppStore()
  const [activeTab, setActiveTab]   = useState(MESSAGE_CATEGORIES[0].id)
  const [search, setSearch]         = useState('')
  const [selected, setSelected]     = useState<string | null>(null)

  const category = MESSAGE_CATEGORIES.find((c) => c.id === activeTab)!

  const messages = search
    ? MESSAGE_CATEGORIES.flatMap((c) => c.messages).filter((m) =>
        m.toLowerCase().includes(search.toLowerCase())
      )
    : category.messages

  const apply = (msg: string) => {
    setSelected(msg)
    updateCard({ message: msg })
    toast.success('Message applied!', { icon: '🪷' })
  }

  const random = () => {
    const msg = getRandomMessage()
    apply(msg)
  }

  return (
    <div className="space-y-3">

      {/* Search + random */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9 text-xs"
          />
        </div>
        <button
          onClick={random}
          className="btn-outline text-xs px-3 py-2 shrink-0"
          title="Random message"
        >
          <Shuffle size={13} />
          <span className="hidden sm:inline">Random</span>
        </button>
      </div>

      {/* Category tabs */}
      {!search && (
        <div className="flex gap-1.5 flex-wrap">
          {MESSAGE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTab === c.id
                  ? 'bg-gold-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gold-50 dark:hover:bg-gray-700'
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Messages list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + search}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin pr-1"
        >
          {messages.length === 0 && (
            <p className="text-xs text-center text-gray-400 py-4">No messages found.</p>
          )}
          {messages.map((msg, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => apply(msg)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs leading-relaxed transition-all border ${
                selected === msg
                  ? 'bg-gold-50 dark:bg-gold-900/20 border-gold-300 dark:border-gold-700 text-gold-800 dark:text-gold-300'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-transparent hover:border-gold-200 dark:hover:border-gold-800 text-gray-700 dark:text-gray-300 hover:bg-gold-50/50 dark:hover:bg-gold-900/10'
              }`}
            >
              <span className="flex items-start gap-2">
                {selected === msg && <Check size={12} className="text-gold-500 shrink-0 mt-0.5" />}
                <span>{msg}</span>
              </span>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
