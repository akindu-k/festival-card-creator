import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CardData, View } from './types'

interface HistoryEntry {
  data: CardData
}

interface AppState {
  view:        View
  darkMode:    boolean
  cardData:    CardData
  history:     HistoryEntry[]
  historyIdx:  number
  recentIds:   string[]
  favoriteIds: string[]

  // Actions
  setView:        (v: View) => void
  toggleDark:     () => void
  selectTemplate: (id: string) => void
  updateCard:     (patch: Partial<CardData>) => void
  undo:           () => void
  redo:           () => void
  canUndo:        () => boolean
  canRedo:        () => boolean
  toggleFavorite: (id: string) => void
  isFavorite:     (id: string) => boolean
}

const DEFAULT_CARD: CardData = {
  templateId:     'lantern',
  senderName:     '',
  senderOrg:      '',
  receiverName:   '',
  customGreeting: '',
  message:        'May the light of Vesak illuminate your path with peace, wisdom, and happiness.',
  fontFamily:     'Playfair Display',
  fontSize:       16,
  fontColor:      '#FFFFFF',
  textAlign:      'center',
  orientation:    'portrait',
  showDecor:      true,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view:        'gallery',
      darkMode:    true,
      cardData:    DEFAULT_CARD,
      history:     [{ data: DEFAULT_CARD }],
      historyIdx:  0,
      recentIds:   [],
      favoriteIds: [],

      setView: (v) => set({ view: v }),

      toggleDark: () => set((s) => ({ darkMode: !s.darkMode })),

      selectTemplate: (id) => {
        const current = get().cardData
        const fontColorMap: Record<string, string> = {
          lantern:     '#FFFFFF',
          lotus:       '#5B2C6F',
          temple:      '#FFFFFF',
          pandal:      '#FFFFFF',
          minimalist:  '#2C1810',
          golden:      '#FFFFFF',
          custom:      '#FFFFFF',
        }
        const next: CardData = {
          ...current,
          templateId: id,
          fontColor: fontColorMap[id] ?? '#FFFFFF',
          // keep photo only on custom; clear it when switching to a built-in template
          backgroundImage:   id === 'custom' ? current.backgroundImage   : undefined,
          bgOverlayOpacity:  id === 'custom' ? current.bgOverlayOpacity  : undefined,
        }
        const state = get()
        const newHistory = state.history.slice(0, state.historyIdx + 1)
        newHistory.push({ data: next })
        set({
          cardData:   next,
          history:    newHistory,
          historyIdx: newHistory.length - 1,
          view:       'editor',
          recentIds:  [id, ...state.recentIds.filter((x) => x !== id)].slice(0, 5),
        })
      },

      updateCard: (patch) => {
        const next: CardData = { ...get().cardData, ...patch }
        const state = get()
        const newHistory = state.history.slice(0, state.historyIdx + 1)
        newHistory.push({ data: next })
        set({ cardData: next, history: newHistory, historyIdx: newHistory.length - 1 })
      },

      undo: () => {
        const { history, historyIdx } = get()
        if (historyIdx > 0) {
          const idx = historyIdx - 1
          set({ historyIdx: idx, cardData: history[idx].data })
        }
      },

      redo: () => {
        const { history, historyIdx } = get()
        if (historyIdx < history.length - 1) {
          const idx = historyIdx + 1
          set({ historyIdx: idx, cardData: history[idx].data })
        }
      },

      canUndo: () => get().historyIdx > 0,
      canRedo: () => get().historyIdx < get().history.length - 1,

      toggleFavorite: (id) => {
        const { favoriteIds } = get()
        set({
          favoriteIds: favoriteIds.includes(id)
            ? favoriteIds.filter((x) => x !== id)
            : [...favoriteIds, id],
        })
      },

      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: 'vesak-card-store',
      partialize: (s) => ({
        darkMode:    s.darkMode,
        cardData:    s.cardData,
        recentIds:   s.recentIds,
        favoriteIds: s.favoriteIds,
      }),
    }
  )
)
