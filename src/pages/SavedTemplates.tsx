import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import CommunityTemplateCard from '../components/community/CommunityTemplateCard'
import { useSavedTemplates } from '../hooks/useCommunity'
import { useAuthStore } from '../authStore'
import { useAppStore } from '../store'
import type { CommunityTemplate } from '../types'
import toast from 'react-hot-toast'

export default function SavedTemplates() {
  const user     = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { selectTemplate, updateCard } = useAppStore()
  const { templates, loading } = useSavedTemplates()

  const useTemplate = (t: CommunityTemplate) => {
    selectTemplate(t.base_template_id)
    updateCard({ fontFamily: t.font_family, fontColor: t.font_color, textAlign: t.text_align, orientation: t.orientation, message: t.default_message })
    toast.success('Template applied!')
    navigate('/')
  }

  if (!user) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">🔖</div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Sign in to view saved templates</h2>
        <Link to="/auth/login" className="btn-gold text-sm mt-4 inline-flex">Sign In</Link>
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Bookmark size={20} className="text-gold-500" />
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Saved Templates</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-800" />
              <div className="p-3 space-y-2"><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" /></div>
            </div>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <Bookmark size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm mb-4">You haven't saved any templates yet.</p>
          <Link to="/community" className="btn-gold text-sm inline-flex">Explore Community</Link>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {templates.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <CommunityTemplateCard template={t} onUse={useTemplate} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
