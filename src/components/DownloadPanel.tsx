import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileImage, FileText, Copy, Share2, Loader2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'

interface DownloadPanelProps {
  cardRef: React.RefObject<HTMLDivElement | null>
}

type Quality = 'standard' | 'high' | 'print'
const QUALITY_SCALE: Record<Quality, number> = { standard: 1, high: 2, print: 3 }
const QUALITY_LABELS: Record<Quality, string> = {
  standard: 'Standard  (1×)',
  high:     'High-Res  (2×)',
  print:    'Print     (3×)',
}

export default function DownloadPanel({ cardRef }: DownloadPanelProps) {
  const [quality, setQuality] = useState<Quality>('high')
  const [loading, setLoading] = useState<string | null>(null)

  const capture = async (): Promise<HTMLCanvasElement> => {
    const el = cardRef.current
    if (!el) throw new Error('Card not ready')
    return html2canvas(el, {
      scale:       QUALITY_SCALE[quality],
      useCORS:     true,
      allowTaint:  false,
      logging:     false,
      backgroundColor: null,
    })
  }

  const downloadPNG = async () => {
    setLoading('png')
    try {
      const canvas = await capture()
      const link = document.createElement('a')
      link.download = `vesak-card-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('Card downloaded as PNG!', { icon: '🖼️' })
    } catch {
      toast.error('Download failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const downloadPDF = async () => {
    setLoading('pdf')
    try {
      const canvas = await capture()
      const imgData = canvas.toDataURL('image/png')
      const w = canvas.width  / QUALITY_SCALE[quality]
      const h = canvas.height / QUALITY_SCALE[quality]
      const isLandscape = w > h
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'px',
        format: [w, h],
        hotfixes: ['px_scaling'],
      })
      pdf.addImage(imgData, 'PNG', 0, 0, w, h)
      pdf.save(`vesak-card-${Date.now()}.pdf`)
      toast.success('Card downloaded as PDF!', { icon: '📄' })
    } catch {
      toast.error('PDF export failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const copyToClipboard = async () => {
    setLoading('copy')
    try {
      const canvas = await capture()
      canvas.toBlob(async (blob) => {
        if (!blob) { toast.error('Could not create image.'); return }
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        toast.success('Card copied to clipboard!', { icon: '📋' })
      })
    } catch {
      toast.error('Clipboard copy failed. Try PNG download instead.')
    } finally {
      setLoading(null)
    }
  }

  const share = async () => {
    setLoading('share')
    try {
      const canvas = await capture()
      canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], 'vesak-card.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Happy Vesak!',
            text:  'Sending you Vesak blessings 🪷',
            files: [file],
          })
          toast.success('Shared successfully!')
        } else {
          // Fallback: just download
          const link = document.createElement('a')
          link.download = 'vesak-card.png'
          link.href     = canvas.toDataURL('image/png')
          link.click()
          toast.success('Saved for sharing!')
        }
      })
    } catch {
      toast.error('Share failed.')
    } finally {
      setLoading(null)
    }
  }

  const Btn = ({
    id, icon, label, sub, onClick, color = 'gold',
  }: {
    id: string; icon: React.ReactNode; label: string; sub: string
    onClick: () => void; color?: 'gold' | 'blue' | 'purple' | 'green'
  }) => {
    const isLoading = loading === id
    const colors = {
      gold:   'from-gold-600 to-gold-500 shadow-gold-400/30',
      blue:   'from-blue-600 to-blue-500 shadow-blue-400/30',
      purple: 'from-purple-600 to-purple-500 shadow-purple-400/30',
      green:  'from-green-600 to-green-500 shadow-green-400/30',
    }
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        disabled={!!loading}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${colors[color]} text-white font-medium text-sm shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-opacity`}
      >
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          {isLoading ? <Loader2 size={15} className="animate-spin" /> : icon}
        </div>
        <div className="text-left">
          <div className="text-sm font-semibold leading-tight">{label}</div>
          <div className="text-[10px] opacity-75 leading-tight mt-0.5">{sub}</div>
        </div>
      </motion.button>
    )
  }

  return (
    <div className="space-y-4">

      {/* Quality selector */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
          Export Quality
        </label>
        <div className="flex gap-2">
          {(Object.keys(QUALITY_LABELS) as Quality[]).map((q) => (
            <button
              key={q}
              onClick={() => setQuality(q)}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                quality === q
                  ? 'bg-gold-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gold-50 dark:hover:bg-gray-700'
              }`}
            >
              {q.charAt(0).toUpperCase() + q.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-1">{QUALITY_LABELS[quality]}</p>
      </div>

      {/* Download buttons */}
      <div className="space-y-2">
        <Btn id="png" icon={<FileImage size={15}/>} label="Download PNG" sub="Best for sharing online" onClick={downloadPNG} color="gold" />
        <Btn id="pdf" icon={<FileText size={15}/>} label="Download PDF" sub="Ready for printing" onClick={downloadPDF} color="blue" />
        <Btn id="copy" icon={<Copy size={15}/>} label="Copy to Clipboard" sub="Paste directly into chats" onClick={copyToClipboard} color="purple" />
        <Btn id="share" icon={<Share2 size={15}/>} label="Share Card" sub="Share via apps & messaging" onClick={share} color="green" />
      </div>

      {/* Tip */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800">
        <Download size={13} className="text-gold-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-gold-700 dark:text-gold-400 leading-relaxed">
          Use <strong>Print (3×)</strong> quality for high-resolution prints. Standard is great for WhatsApp &amp; social media.
        </p>
      </div>
    </div>
  )
}
