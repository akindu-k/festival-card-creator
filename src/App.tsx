import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Palette, Download, Layers, ChevronDown, ChevronUp } from 'lucide-react'

import Header from './components/Header'
import TemplateGallery from './components/TemplateGallery'
import TextEditor from './components/TextEditor'
import StylePanel from './components/StylePanel'
import MessagePicker from './components/MessagePicker'
import CardPreviewPanel from './components/CardPreviewPanel'
import DownloadPanel from './components/DownloadPanel'

import CommunityFeed    from './pages/CommunityFeed'
import TemplateDetail   from './pages/TemplateDetail'
import UserProfile      from './pages/UserProfile'
import CreatorDashboard from './pages/CreatorDashboard'
import SavedTemplates   from './pages/SavedTemplates'
import NotificationsPage from './pages/NotificationsPage'
import AuthPage         from './pages/AuthPage'
import ComingSoon       from './pages/ComingSoon'

import { useAppStore } from './store'
import { TEMPLATES } from './data/templates'
import CardTemplate from './templates/CardTemplate'
import type { CardData } from './types'

/* ─── Collapsible section ─────────────────────────────────── */
function Section({ icon, title, defaultOpen = true, children }: {
  icon: React.ReactNode; title: string; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="panel overflow-hidden">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="w-full panel-header hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
      >
        <span className="text-gold-500">{icon}</span>
        {title}
        <span className="ml-auto text-gray-400">{open ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
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

/* ─── Quick template switcher (right panel) ───────────────── */
const DEMO_DATA: CardData = {
  templateId: '', senderName: '', senderOrg: '', receiverName: '',
  customGreeting: '', message: 'May the light of Vesak illuminate your path.',
  fontFamily: 'Playfair Display', fontSize: 13, fontColor: '#FFFFFF',
  textAlign: 'center', orientation: 'portrait', showDecor: true,
}

function TemplateSwitcher() {
  const { cardData, selectTemplate } = useAppStore()
  return (
    <div className="grid grid-cols-3 gap-2">
      {TEMPLATES.map((t) => {
        const demo  = { ...DEMO_DATA, templateId: t.id, fontColor: t.textColor }
        const scale = 60 / 600
        return (
          <button type="button" key={t.id} onClick={() => selectTemplate(t.id)}
            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
              cardData.templateId === t.id ? 'border-gold-500 shadow-md shadow-gold-400/30' : 'border-transparent hover:border-gold-300'
            }`}
            title={t.name}
          >
            <div className="h-20 overflow-hidden" style={{ background: t.bgPreview }}>
              <div className="thumb-inner-portrait" style={{ transform: `scale(${scale})` }}>
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

/* ─── Editor layout ───────────────────────────────────────── */
function EditorView() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mobileTab, setMobileTab] = useState<'content' | 'style' | 'save'>('content')

  const mobileTabs = [
    { id: 'content' as const, icon: <MessageSquare size={13} />, label: 'Content' },
    { id: 'style'   as const, icon: <Palette size={13} />,       label: 'Style'   },
    { id: 'save'    as const, icon: <Download size={13} />,      label: 'Save'    },
  ]

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

      {/* ── Desktop: 3-column layout ── */}
      <div className="hidden lg:flex gap-5 editor-layout">
        <div className="lg:w-72 xl:w-80 shrink-0 space-y-4 lg:overflow-y-auto lg:max-h-[calc(100vh-120px)] scrollbar-thin">
          <Section icon={<MessageSquare size={14}/>} title="Card Content">
            <TextEditor />
          </Section>
          <Section icon={<MessageSquare size={14}/>} title="Vesak Messages" defaultOpen={false}>
            <MessagePicker />
          </Section>
        </div>

        <div className="flex-1 min-h-0">
          <CardPreviewPanel cardRef={cardRef} />
        </div>

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

      {/* ── Mobile: card preview + sticky tab bar + panel ── */}
      <div className="lg:hidden flex flex-col gap-3">

        {/* Card preview */}
        <div className="h-[360px] sm:h-[420px]">
          <CardPreviewPanel cardRef={cardRef} />
        </div>

        {/* Sticky tab bar — sits just below the header */}
        <div className="sticky top-16 z-10 flex gap-1 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-sm">
          {mobileTabs.map(({ id, icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMobileTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                mobileTab === id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mobileTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-3 pb-10"
          >
            {mobileTab === 'content' && (
              <>
                <Section icon={<MessageSquare size={14}/>} title="Card Content">
                  <TextEditor />
                </Section>
                <Section icon={<MessageSquare size={14}/>} title="Vesak Messages" defaultOpen={false}>
                  <MessagePicker />
                </Section>
              </>
            )}
            {mobileTab === 'style' && (
              <>
                <Section icon={<Palette size={14}/>} title="Style">
                  <StylePanel />
                </Section>
                <Section icon={<Layers size={14}/>} title="Template" defaultOpen={false}>
                  <TemplateSwitcher />
                </Section>
              </>
            )}
            {mobileTab === 'save' && (
              <Section icon={<Download size={14}/>} title="Download & Share">
                <DownloadPanel cardRef={cardRef} />
              </Section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── Home view (gallery OR editor) ──────────────────────── */
function HomeView() {
  const { view } = useAppStore()
  return (
    <AnimatePresence mode="wait">
      {view === 'gallery' ? (
        <motion.div key="gallery" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
          <TemplateGallery />
          <Footer />
        </motion.div>
      ) : (
        <motion.div key="editor" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
          <EditorView />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── App shell (layout) ──────────────────────────────────── */
function AppShell() {
  const { darkMode } = useAppStore()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header />
      <main>
        <Outlet />
      </main>
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

/* ─── Root ────────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomeView />} />
          <Route path="community" element={<ComingSoon />} />
          <Route path="community/*" element={<ComingSoon />} />
          <Route path="profile/:username" element={<ComingSoon />} />
          <Route path="dashboard" element={<ComingSoon />} />
          <Route path="saved" element={<ComingSoon />} />
          <Route path="notifications" element={<ComingSoon />} />
          <Route path="auth/login"  element={<AuthPage mode="login" />} />
          <Route path="auth/signup" element={<AuthPage mode="signup" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
