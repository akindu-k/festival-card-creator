import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import type { Profile, Notification } from './types'

interface AuthStore {
  user:            User | null
  profile:         Profile | null
  notifications:   Notification[]
  unreadCount:     number
  authLoading:     boolean
  profileLoading:  boolean

  // Setters (internal)
  _setUser:        (u: User | null) => void
  _setProfile:     (p: Profile | null) => void

  // Actions
  signOut:         () => Promise<void>
  fetchProfile:    (uid: string) => Promise<void>
  fetchNotifications: () => Promise<void>
  markAllRead:     () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user:           null,
  profile:        null,
  notifications:  [],
  unreadCount:    0,
  authLoading:    true,
  profileLoading: false,

  _setUser: (user) => set({ user, authLoading: false }),
  _setProfile: (profile) => set({ profile }),

  signOut: async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    set({ user: null, profile: null, notifications: [], unreadCount: 0 })
  },

  fetchProfile: async (uid) => {
    if (!isSupabaseConfigured) return
    set({ profileLoading: true })
    const { data } = await supabase
      .from('profiles')
      .select(`*, user_badges(badge_id, earned_at, badges(*))`)
      .eq('id', uid)
      .single()
    if (data) {
      // Count follower/following/templates via separate aggregated fields or fallback
      const profile: Profile = {
        id:              data.id,
        username:        data.username,
        display_name:    data.display_name,
        avatar_url:      data.avatar_url,
        bio:             data.bio,
        website:         data.website,
        follower_count:  0,
        following_count: 0,
        template_count:  0,
        total_likes:     0,
        badges:          (data.user_badges as { badges: { id: string; name: string; description: string; icon: string; color: string }; badge_id: string }[])?.map((ub) => ub.badges) ?? [],
      }
      set({ profile, profileLoading: false })
    } else {
      set({ profileLoading: false })
    }
  },

  fetchNotifications: async () => {
    const { user } = get()
    if (!user || !isSupabaseConfigured) return
    const { data } = await supabase
      .from('notifications')
      .select('*, actor:actor_id(id,username,display_name,avatar_url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)
    if (data) {
      set({
        notifications: data as unknown as Notification[],
        unreadCount: data.filter((n) => !n.is_read).length,
      })
    }
  },

  markAllRead: async () => {
    const { user } = get()
    if (!user || !isSupabaseConfigured) return
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    set({ unreadCount: 0, notifications: get().notifications.map((n) => ({ ...n, is_read: true })) })
  },
}))

/* Boot: subscribe to Supabase auth changes */
if (isSupabaseConfigured) {
  supabase.auth.getSession().then(({ data: { session } }) => {
    useAuthStore.getState()._setUser(session?.user ?? null)
    if (session?.user) useAuthStore.getState().fetchProfile(session.user.id)
  })
  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState()._setUser(session?.user ?? null)
    if (session?.user) useAuthStore.getState().fetchProfile(session.user.id)
    else useAuthStore.getState()._setProfile(null)
  })
} else {
  // No Supabase configured — just mark auth as not loading
  useAuthStore.setState({ authLoading: false })
}
