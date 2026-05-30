import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Globe, Lock, Tag, Loader2, CheckCircle2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAuthStore } from '../../authStore'
import { useAppStore } from '../../store'
import type { CardData } from '../../types'
import toast from 'react-hot-toast'

const CATEGORIES = ['traditional','floral','spiritual','festive','minimalist','modern']

interface Props {
  open:    boolean
  onClose: () => void
  cardData: CardData
  cardRef: React.RefObject<HTMLDivElement | null>
}

export default function PublishModal({ open, onClose, cardData, cardRef }: Props) {
  const user    = useAuthStore((s) => s.user)
  const [name, setName]         = useState('')
  const [desc, setDesc]         = useState('')
  const [category, setCategory] = useState('traditional')
  const [tags, setTags]         = useState('')
  const [publishing, setPublishing] = useState(false)
  const [done, setDone]         = useState(false)

  const reset = () => { setName(''); setDesc(''); setCategory('traditional'); setTags(''); setDone(false) }

  const publish = async () => {
    if (!name.trim()) { toast.error('Please enter a template name'); return }
    if (!user) { toast.error('You must be signed in to publish'); return }
    setPublishing(true)
    try {
      let thumbnailUrl: string | null = null

      // Generate thumbnail
      if (cardRef.current && isSupabaseConfigured) {
        try {
          const canvas = await html2canvas(cardRef.current, { scale: 1, useCORS: true, logging: false })
          const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/png', 0.8))
          const fileName = `${user.id}/${Date.now()}.png`
          const { data } = await supabase.storage.from('template-thumbnails').upload(fileName, blob)
          if (data) {
            const { data: urlData } = supabase.storage.from('template-thumbnails').getPublicUrl(fileName)
            thumbnailUrl = urlData.publicUrl
          }
        } catch { /* thumbnail optional */ }
      }

      const payload = {
        creator_id:       user.id,
        name:             name.trim(),
        description:      desc.trim() || null,
        category,
        tags:             tags.split(',').map((t) => t.trim()).filter(Boolean),
        thumbnail_url:    thumbnailUrl,
        base_template_id: cardData.templateId,
        font_family:      cardData.fontFamily,
        font_color:       cardData.fontColor,
        text_align:       cardData.textAlign,
        orientation:      cardData.orientation,
        default_message:  cardData.message || 'May the light of Vesak illuminate your path.',
        is_published:     true,
      }

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('community_templates').insert(payload)
        if (error) throw error
      }

      setDone(true)
      toast.success('Template published to community! 🎉')
      setTimeout(() => { onClose(); reset() }, 2000)
    } catch (err) {
      console.error(err)
      toast.error('Publish failed. Please try again.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white">Publish to Community</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Share your card design as a reusable template</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <X size={16} />
              </button>
            </div>

            {done ? (
              <div className="p-8 text-center">
                <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Published!</h3>
                <p className="text-sm text-gray-500">Your template is now live in the community feed.</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">Template Name *</label>
                  <input className="input-base" placeholder="e.g. Golden Lantern Night" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">Description</label>
                  <textarea className="input-base resize-none" rows={2} placeholder="Describe your template design..." value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={280} />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button key={c} onClick={() => setCategory(c)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize ${
                          category === c ? 'bg-gold-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gold-50 dark:hover:bg-gray-700'
                        }`}
                      >{c}</button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                    <Tag size={10} className="inline mr-1" />Tags (comma-separated)
                  </label>
                  <input className="input-base" placeholder="lotus, serene, pink, floral" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>

                {/* Visibility info */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-400">
                  <Globe size={12} />
                  Your template will be publicly visible in the community feed.
                </div>

                {!isSupabaseConfigured && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
                    <Lock size={12} />
                    Demo mode — connect Supabase to enable real publishing.
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">Cancel</button>
                  <button
                    onClick={publish}
                    disabled={publishing || !name.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 hover:from-gold-700 hover:to-gold-600 transition-all shadow-lg shadow-gold-400/30"
                  >
                    {publishing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {publishing ? 'Publishing...' : 'Publish Template'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
