import { Type, AlignLeft, AlignCenter, AlignRight, RotateCcw } from 'lucide-react'
import { useAppStore } from '../store'
import type { TextAlign } from '../types'

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

  const handleFontSize = (v: number) => {
    updateCard({ fontSize: v })
    const el = document.getElementById('fontSize-range') as HTMLInputElement | null
    if (el) el.style.setProperty('--val', `${((v - 10) / 22) * 100}%`)
  }

  return (
    <div className="space-y-5">

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
