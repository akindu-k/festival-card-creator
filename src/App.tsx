import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Palette, Download, Layers, ChevronDown, ChevronUp } from 'lucide-react'
import Header from './components/Header'
import TemplateGallery from './components/TemplateGallery'
import TextEditor from './components/TextEditor'
import StylePanel from './components/StylePanel'
import MessagePicker from './components/MessagePicker'
import CardPreviewPanel from './components/CardPreviewPanel'
import DownloadPanel from './components/DownloadPanel'
import { useAppStore } from './store'

/* ─── Collapsible section ──────────────────────────────────────────── */
function Section({
  icon, title, defaultOpen = true, children,
}: {
  icon: React.ReactNode; title: string; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="panel overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full panel-header hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
      >
        <span className="text-gold-500">{icon}</span>
        {title}
        <span className="ml-auto text-gray-400">{open ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Editor layout ────────────────────────────────────────────────── */
function EditorView() {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col lg:flex-row gap-5" style={{ minHeight: 'calc(100vh - 120px)' }}>

        {/* Left panel: text & messages */}
        <div className="lg:w-72 xl:w-80 shrink-0 space-y-4 lg:overflow-y-auto lg:max-h-[calc(100vh-120px)] scrollbar-thin">
          <Section icon={<MessageSquare size={14}/>} title="Card Content">
            <TextEditor />
          </Section>
          <Section icon={<MessageSquare size={14}/>} title="Vesak Messages" defaultOpen={false}>
            <MessagePicker />
          </Section>
        </div>

        {/* Center: live preview */}
        <div className="flex-1 min-h-[420px] lg:min-h-0">
          <CardPreviewPanel cardRef={cardRef} />
        </div>

        {/* Right panel: style & download */}
        <div className="lg:w-64 xl:w-72 shrink-0 space-y-4 lg:overflow-y-auto lg:max-h-[calc(100vh-120px)] scrollbar-thin">
          <Section icon={<Palette size={14}/>} title="Style">
            <StylePanel />
          </Section>
          <Section icon={<Layers size={14}/>} title="Template" defaultOpen={false}>
            <TemplateSwitcher />
          </Section>
          <Section icon={<Download size={14}/>} title="Download & Share">
            <DownloadPanel cardRef={cardRef} />
          </Section>
        </div>
      </div>
    </div>
  )
}

/* ─── Quick template switcher in the right panel ───────────────────── */
import { TEMPLATES } from './data/templates'
import CardTemplate from './templates/CardTemplate'
import type { CardData } from './types'

const DEMO_DATA: CardData = {
  templateId:     '',
  senderName:     '',
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

function TemplateSwitcher() {
  const { cardData, selectTemplate } = useAppStore()
  return (
    <div className="grid grid-cols-3 gap-2">
      {TEMPLATES.map((t) => {
        const demo = { ...DEMO_DATA, templateId: t.id, fontColor: t.textColor }
        const scale = 60 / 600
        return (
          <button
            key={t.id}
            onClick={() => selectTemplate(t.id)}
            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
              cardData.templateId === t.id
                ? 'border-gold-500 shadow-md shadow-gold-400/30'
                : 'border-transparent hover:border-gold-300'
            }`}
            title={t.name}
          >
            <div style={{ height: 80, overflow: 'hidden', background: t.bgPreview }}>
              <div style={{ width: 600, height: 800, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
                <CardTemplate data={demo} isPreview />
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-black/50 px-1.5 py-0.5">
              <p className="text-[9px] text-white text-center truncate">{t.name}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

/* ─── Root App ──────────────────────────────────────────────────────── */
export default function App() {
  const { view, darkMode } = useAppStore()

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header />

      <AnimatePresence mode="wait">
        {view === 'gallery' ? (
          <motion.main
            key="gallery"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <TemplateGallery />
            <Footer />
          </motion.main>
        ) : (
          <motion.main
            key="editor"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <EditorView />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-6 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          🪷 Made with compassion for Vesak Poya Day &nbsp;·&nbsp; Spread the light of Dhamma
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
          "May all beings be happy, may all beings be at peace."
        </p>
      </div>
    </footer>
  )
}
