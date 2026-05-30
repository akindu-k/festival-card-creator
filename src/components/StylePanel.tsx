import { useRef } from 'react'
import { Type, AlignLeft, AlignCenter, AlignRight, RotateCcw, ImagePlus, X } from 'lucide-react'
import { useAppStore } from '../store'
import type { TextAlign } from '../types'

function resizeImageToBase64(file: File, maxPx = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = e.target!.result as string
    }
    reader.readAsDataURL(file)
  })
}

const FONTS = [
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond' },
  { label: 'Josefin Sans', value: 'Josefin Sans' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Times New Roman', value: 'Times New Roman' },
]

const PRESET_COLORS = [
  '#FFFFFF','#F5F5F5','#FFF8E7','#FFD700','#FF9933',
  '#E8A0BF','#C9A0DC','#2C1810','#1a0a4e','#000000',
]

export default function StylePanel() {
  const { cardData, updateCard } = useAppStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const base64 = await resizeImageToBase64(file)
      updateCard({ backgroundImage: base64 })
    } catch {
      // file read failed — silently ignore
    }
    e.target.value = ''
  }

  const handleFontSize = (v: number) => {
    updateCard({ fontSize: v })
    const el = document.getElementById('fontSize-range') as HTMLInputElement | null
    if (el) el.style.setProperty('--val', `${((v - 10) / 22) * 100}%`)
  }

  const isCustom = cardData.templateId === 'custom'

  return (
    <div className="space-y-5">

      {/* ── Custom template: photo upload (shown first) ── */}
      {isCustom && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
            <ImagePlus size={12} className="inline mr-1.5 text-gold-500" />
            Background Photo
          </label>

          {cardData.backgroundImage ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <img
                src={cardData.backgroundImage}
                alt="Background preview"
                className="w-full h-24 object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => updateCard({ backgroundImage: undefined })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium shadow"
                >
                  <X size={12} /> Remove photo
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-gold-300 dark:border-gold-700 bg-gold-50/50 dark:bg-gold-900/10 text-gold-600 dark:text-gold-400 hover:border-gold-500 hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-all"
            >
              <ImagePlus size={22} />
              <span className="text-xs font-medium">Upload your photo</span>
              <span className="text-[11px] opacity-60">JPG, PNG, WebP — any size</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            aria-label="Upload background image"
            className="hidden"
            onChange={handleImageUpload}
          />

          {cardData.backgroundImage && (
            <>
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Dark overlay</span>
                  <span className="text-[10px] font-mono text-gold-600 dark:text-gold-400">
                    {Math.round((cardData.bgOverlayOpacity ?? 0.35) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0} max={85}
                  aria-label="Overlay opacity"
                  value={Math.round((cardData.bgOverlayOpacity ?? 0.35) * 100)}
                  onChange={(e) => updateCard({ bgOverlayOpacity: Number(e.target.value) / 100 })}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>None</span><span>Darker</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] text-gray-400 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gray-800 transition-all"
              >
                <ImagePlus size={11} /> Change photo
              </button>
            </>
          )}

          {/* Vesak title toggle — always shown on custom template */}
          <button
            type="button"
            onClick={() => updateCard({ showDecor: !cardData.showDecor })}
            className="mt-3 w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-gold-300 dark:hover:border-gold-700 transition-all"
          >
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Show "Happy Vesak" title</span>
            <span className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${cardData.showDecor ? 'bg-gold-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <span className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${cardData.showDecor ? 'translate-x-4' : 'translate-x-0'}`} />
            </span>
          </button>

          <hr className="border-gray-100 dark:border-gray-800 mt-4" />
        </div>
      )}

      {/* Font family */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
          <Type size={12} className="inline mr-1.5 text-gold-500" />
          Font Family
        </label>
        <select
          className="input-base"
          value={cardData.fontFamily}
          onChange={(e) => updateCard({ fontFamily: e.target.value })}
          style={{ fontFamily: cardData.fontFamily }}
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font size */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Font Size
          </label>
          <span className="text-xs font-mono text-gold-600 dark:text-gold-400 bg-gold-50 dark:bg-gold-900/20 px-2 py-0.5 rounded">
            {cardData.fontSize}px
          </span>
        </div>
        <input
          id="fontSize-range"
          type="range"
          min={10} max={32}
          value={cardData.fontSize}
          onChange={(e) => handleFontSize(Number(e.target.value))}
          className="w-full"
          style={{ '--val': `${((cardData.fontSize - 10) / 22) * 100}%` } as React.CSSProperties}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>10px</span><span>32px</span>
        </div>
      </div>

      {/* Font color */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
          Font Color
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => updateCard({ fontColor: c })}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                cardData.fontColor === c
                  ? 'border-gold-500 scale-110 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:scale-105'
              }`}
              style={{ background: c }}
              title={c}
            />
          ))}
          {/* Custom color */}
          <label className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-gold-400 transition-colors overflow-hidden" title="Custom color">
            <input
              type="color"
              className="opacity-0 absolute w-0 h-0"
              value={cardData.fontColor}
              onChange={(e) => updateCard({ fontColor: e.target.value })}
            />
            <span className="text-gray-400 text-xs">+</span>
          </label>
        </div>
      </div>

      {/* Text alignment */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
          Text Alignment
        </label>
        <div className="flex gap-2">
          {([
            { value: 'left',   icon: <AlignLeft size={14} /> },
            { value: 'center', icon: <AlignCenter size={14} /> },
            { value: 'right',  icon: <AlignRight size={14} /> },
          ] as { value: TextAlign; icon: React.ReactNode }[]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateCard({ textAlign: opt.value })}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-all ${
                cardData.textAlign === opt.value
                  ? 'bg-gold-500 text-white shadow-md shadow-gold-400/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gold-50 dark:hover:bg-gray-700'
              }`}
            >
              {opt.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Orientation */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
          Card Orientation
        </label>
        <div className="flex gap-2">
          {(['portrait', 'landscape'] as const).map((o) => (
            <button
              key={o}
              onClick={() => updateCard({ orientation: o })}
              className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                cardData.orientation === o
                  ? 'bg-gold-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gold-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`border-2 border-current rounded-sm ${o === 'portrait' ? 'w-3 h-4' : 'w-4 h-3'}`} />
              {o.charAt(0).toUpperCase() + o.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => updateCard({ fontFamily: 'Playfair Display', fontSize: 16, fontColor: '#FFFFFF', textAlign: 'center' })}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 transition-all"
      >
        <RotateCcw size={12} />
        Reset Style Defaults
      </button>
    </div>
  )
}
