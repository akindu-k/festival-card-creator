import { motion } from 'framer-motion'
import { Moon, Sun, Undo2, Redo2, ArrowLeft, Sparkles } from 'lucide-react'
import { useAppStore } from '../store'

export default function Header() {
  const { view, darkMode, toggleDark, setView, undo, redo, canUndo, canRedo } = useAppStore()

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

        {/* Back button (editor only) */}
        {view === 'editor' && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setView('gallery')}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gold-600 transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Templates</span>
          </motion.button>
        )}

        {/* Logo */}
        <div className="flex items-center gap-2.5 mr-auto">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500 to-vesak-saffron flex items-center justify-center shadow-lg shadow-gold-400/30">
            <span className="text-white text-lg leading-none select-none">🪷</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display text-lg font-semibold text-gray-900 dark:text-white leading-tight">
              Vesak Card Creator
            </h1>
            <p className="text-[10px] text-gold-600 uppercase tracking-widest leading-none">
              Spread the Light of Dhamma
            </p>
          </div>
          <div className="sm:hidden font-display text-base font-semibold text-gray-900 dark:text-white">
            Vesak Cards
          </div>
        </div>

        {/* Undo / Redo (editor only) */}
        {view === 'editor' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1"
          >
            <button
              onClick={undo}
              disabled={!canUndo()}
              title="Undo"
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              title="Redo"
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Redo2 size={16} />
            </button>
          </motion.div>
        )}

        {/* Create new CTA (gallery only) */}
        {view === 'gallery' && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-gold-600 dark:text-gold-400 font-medium">
            <Sparkles size={13} />
            <span>Pick a template to begin</span>
          </div>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          title={darkMode ? 'Light mode' : 'Dark mode'}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gold-400 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gray-800 transition-all"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}
