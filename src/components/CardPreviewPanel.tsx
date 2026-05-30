import { forwardRef, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import CardTemplate from '../templates/CardTemplate'
import { useAppStore } from '../store'

interface Props {
  cardRef: React.RefObject<HTMLDivElement | null>
}

export default function CardPreviewPanel({ cardRef }: Props) {
  const { cardData } = useAppStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale]   = useState(1)
  const [zoom, setZoom]     = useState(1)

  const cardW = cardData.orientation === 'landscape' ? 800 : 600
  const cardH = cardData.orientation === 'landscape' ? 600 : 800

  // Fit card to container
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      const availW = width  - 48
      const availH = height - 80
      const fit = Math.min(availW / cardW, availH / cardH, 1)
      setScale(fit)
    }
    resize()
    const ro = new ResizeObserver(resize)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [cardW, cardH])

  const effectiveScale = scale * zoom

  return (
    <div ref={containerRef} className="relative flex flex-col h-full bg-gray-50 dark:bg-gray-900/50 rounded-2xl overflow-hidden">

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-1">
        <button
          onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          <ZoomOut size={13} />
        </button>
        <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 px-1">
          {Math.round(effectiveScale * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          <ZoomIn size={13} />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          <RotateCcw size={11} />
        </button>
      </div>

      {/* Preview label */}
      <div className="absolute top-3 left-3 z-20">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-lg">
          Live Preview
        </span>
      </div>

      {/* Card stage */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div
          style={{
            width:           cardW * effectiveScale,
            height:          cardH * effectiveScale,
            position:        'relative',
            flexShrink:      0,
          }}
        >
          {/* Shadow */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              boxShadow: '0 25px 50px rgba(0,0,0,0.35), 0 10px 20px rgba(0,0,0,0.2)',
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
              width:  cardW,
              height: cardH,
              borderRadius: 12,
            }}
          />
          {/* The actual card — this is what gets captured */}
          <div
            ref={cardRef as React.RefObject<HTMLDivElement>}
            style={{
              width:           cardW,
              height:          cardH,
              transform:       `scale(${effectiveScale})`,
              transformOrigin: 'top left',
              borderRadius:    12,
              overflow:        'hidden',
              position:        'absolute',
              top: 0, left: 0,
            }}
          >
            <motion.div
              key={cardData.templateId + cardData.orientation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%' }}
            >
              <CardTemplate data={cardData} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Dimensions badge */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {cardW} × {cardH} px  ·  {cardData.orientation}
        </span>
      </div>
    </div>
  )
}
