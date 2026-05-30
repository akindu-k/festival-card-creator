import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { MOCK_COMMUNITY_TEMPLATES, MOCK_COMMENTS, MOCK_PROFILES } from '../lib/mockData'
import type { CommunityTemplate, Comment, Profile, CommunityFeedSort } from '../types'
import { useAuthStore } from '../authStore'

/* ── Feed ──────────────────────────────────────────────────── */
export function useCommunityFeed(sort: CommunityFeedSort, search = '', category = 'all') {
  const [templates, setTemplates] = useState<CommunityTemplate[]>([])
  const [loading, setLoading]     = useState(true)
  const user = useAuthStore((s) => s.user)

  const fetch = useCallback(async () => {
    setLoading(true)
    if (!isSupabaseConfigured) {
      await new Promise((r) => setTimeout(r, 400))
      let results = [...MOCK_COMMUNITY_TEMPLATES]
      if (search) results = results.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some((g) => g.includes(search.toLowerCase())))
      if (category !== 'all') results = results.filter((t) => t.category === category)
      if (sort === 'trending') results.sort((a, b) => (b.view_count + b.like_count * 5) - (a.view_count + a.like_count * 5))
      else if (sort === 'new')  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      else if (sort === 'liked') results.sort((a, b) => b.like_count - a.like_count)
      else if (sort === 'featured') results = results.filter((t) => t.is_featured)
      setTemplates(results)
      setLoading(false)
      return
    }
    let q = supabase.from('community_templates')
      .select('*, creator:creator_id(id,username,display_name,avatar_url)')
      .eq('is_published', true)
      .eq('is_archived', false)
    if (search)        q = q.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    if (category !== 'all') q = q.eq('category', category)
    if (sort === 'featured') q = q.eq('is_featured', true)
    if (sort === 'new')     q = q.order('created_at', { ascending: false })
    else if (sort === 'liked') q = q.order('like_count', { ascending: false })
    else                    q = q.order('view_count', { ascending: false })
    const { data } = await q.limit(32)
    if (data) setTemplates(data as unknown as CommunityTemplate[])
    setLoading(false)
  }, [sort, search, category, user])

  useEffect(() => { fetch() }, [fetch])
  return { templates, loading, refresh: fetch }
}

/* ── Single template ────────────────────────────────────────── */
export function useTemplateDetail(id: string) {
  const [template, setTemplate] = useState<CommunityTemplate | null>(null)
  const [loading, setLoading]   = useState(true)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    async function load() {
      setLoading(true)
      if (!isSupabaseConfigured) {
        await new Promise((r) => setTimeout(r, 300))
        setTemplate(MOCK_COMMUNITY_TEMPLATES.find((t) => t.id === id) ?? null)
        setLoading(false)
        return
      }
      // Increment view count
      supabase.rpc('increment', { table_name: 'community_templates', row_id: id, column_name: 'view_count' }).then(() => {})
      const { data } = await supabase.from('community_templates')
        .select('*, creator:creator_id(id,username,display_name,avatar_url,bio)')
        .eq('id', id).single()
      if (data && user) {
        const [{ count: liked }, { count: saved }] = await Promise.all([
          supabase.from('template_likes').select('*', { count: 'exact', head: true }).eq('template_id', id).eq('user_id', user.id),
          supabase.from('template_saves').select('*', { count: 'exact', head: true }).eq('template_id', id).eq('user_id', user.id),
        ])
        setTemplate({ ...data, user_has_liked: (liked ?? 0) > 0, user_has_saved: (saved ?? 0) > 0 } as unknown as CommunityTemplate)
      } else {
        setTemplate(data as unknown as CommunityTemplate)
      }
      setLoading(false)
    }
    load()
  }, [id, user])

  return { template, loading }
}

/* ── Like toggle ───────────────────────────────────────────── */
export function useLike(template: CommunityTemplate | null, onUpdate?: (t: CommunityTemplate) => void) {
  const user = useAuthStore((s) => s.user)
  const [optimistic, setOptimistic] = useState<boolean | null>(null)

  const toggle = async () => {
    if (!user || !template) return
    const liked = optimistic ?? template.user_has_liked ?? false
    setOptimistic(!liked)
    onUpdate?.({ ...template, user_has_liked: !liked, like_count: template.like_count + (liked ? -1 : 1) })
    if (!isSupabaseConfigured) return
    if (liked) {
      await supabase.from('template_likes').delete().eq('template_id', template.id).eq('user_id', user.id)
    } else {
      await supabase.from('template_likes').insert({ template_id: template.id, user_id: user.id })
    }
  }
  return { liked: optimistic ?? template?.user_has_liked ?? false, toggle }
}

/* ── Save toggle ───────────────────────────────────────────── */
export function useSave(template: CommunityTemplate | null, onUpdate?: (t: CommunityTemplate) => void) {
  const user = useAuthStore((s) => s.user)
  const [optimistic, setOptimistic] = useState<boolean | null>(null)

  const toggle = async () => {
    if (!user || !template) return
    const saved = optimistic ?? template.user_has_saved ?? false
    setOptimistic(!saved)
    onUpdate?.({ ...template, user_has_saved: !saved, save_count: template.save_count + (saved ? -1 : 1) })
    if (!isSupabaseConfigured) return
    if (saved) {
      await supabase.from('template_saves').delete().eq('template_id', template.id).eq('user_id', user.id)
    } else {
      await supabase.from('template_saves').insert({ template_id: template.id, user_id: user.id })
    }
  }
  return { saved: optimistic ?? template?.user_has_saved ?? false, toggle }
}

/* ── Comments ──────────────────────────────────────────────── */
export function useComments(templateId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading]   = useState(true)
  const user = useAuthStore((s) => s.user)

  const load = useCallback(async () => {
    setLoading(true)
    if (!isSupabaseConfigured) {
      await new Promise((r) => setTimeout(r, 200))
      setComments(MOCK_COMMENTS.filter((c) => c.template_id === templateId) as unknown as Comment[])
      setLoading(false)
      return
    }
    const { data } = await supabase.from('comments')
      .select('*, user:user_id(id,username,display_name,avatar_url)')
      .eq('template_id', templateId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })
    setComments((data ?? []) as unknown as Comment[])
    setLoading(false)
  }, [templateId])

  useEffect(() => { load() }, [load])

  const addComment = async (content: string, parentId?: string) => {
    if (!user) return
    const newComment: Comment = {
      id: 'temp-' + Date.now(),
      template_id: templateId, user_id: user.id, parent_id: parentId ?? null,
      content, like_count: 0, is_edited: false,
      created_at: new Date().toISOString(),
      user: { id: user.id, username: user.email ?? '', display_name: user.email ?? '', avatar_url: null, bio: null, follower_count: 0, following_count: 0, template_count: 0, total_likes: 0 },
    }
    setComments((prev) => [newComment, ...prev])
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('comments')
        .insert({ template_id: templateId, user_id: user.id, content, parent_id: parentId ?? null })
        .select('*, user:user_id(id,username,display_name,avatar_url)')
        .single()
      if (data) setComments((prev) => prev.map((c) => c.id === newComment.id ? data as unknown as Comment : c))
    }
  }

  const deleteComment = async (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId))
    if (isSupabaseConfigured) await supabase.from('comments').delete().eq('id', commentId)
  }

  return { comments, loading, addComment, deleteComment, refresh: load }
}

/* ── Follow toggle ─────────────────────────────────────────── */
export function useFollow(targetUserId: string | undefined) {
  const [following, setFollowing] = useState(false)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!user || !targetUserId || !isSupabaseConfigured) return
    supabase.from('follows').select('*', { count: 'exact', head: true })
      .eq('follower_id', user.id).eq('following_id', targetUserId)
      .then(({ count }) => setFollowing((count ?? 0) > 0))
  }, [user, targetUserId])

  const toggle = async () => {
    if (!user || !targetUserId) return
    setFollowing((f) => !f)
    if (!isSupabaseConfigured) return
    if (following) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', targetUserId)
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: targetUserId })
    }
  }
  return { following, toggle }
}

/* ── User profile ──────────────────────────────────────────── */
export function useUserProfile(username: string) {
  const [profile, setProfile]     = useState<Profile | null>(null)
  const [templates, setTemplates] = useState<CommunityTemplate[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      if (!isSupabaseConfigured) {
        await new Promise((r) => setTimeout(r, 300))
        const p = MOCK_PROFILES.find((u) => u.username === username) ?? null
        setProfile(p)
        if (p) setTemplates(MOCK_COMMUNITY_TEMPLATES.filter((t) => t.creator_id === p.id))
        setLoading(false)
        return
      }
      const { data: pData } = await supabase.from('profiles')
        .select('*, user_badges(badge_id, badges(*))')
        .eq('username', username).single()
      if (!pData) { setLoading(false); return }
      // Count stats
      const [{ count: fc }, { count: fing }, { count: tc }, { data: likeData }] = await Promise.all([
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', pData.id),
        supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', pData.id),
        supabase.from('community_templates').select('*', { count: 'exact', head: true }).eq('creator_id', pData.id).eq('is_published', true),
        supabase.from('community_templates').select('like_count').eq('creator_id', pData.id).eq('is_published', true),
      ])
      const totalLikes = (likeData ?? []).reduce((s, t) => s + (t.like_count ?? 0), 0)
      setProfile({ ...pData, follower_count: fc ?? 0, following_count: fing ?? 0, template_count: tc ?? 0, total_likes: totalLikes })
      const { data: tData } = await supabase.from('community_templates')
        .select('*, creator:creator_id(id,username,display_name,avatar_url)')
        .eq('creator_id', pData.id).eq('is_published', true).order('created_at', { ascending: false })
      setTemplates((tData ?? []) as unknown as CommunityTemplate[])
      setLoading(false)
    }
    load()
  }, [username])

  return { profile, templates, loading }
}

/* ── Saved templates ────────────────────────────────────────── */
export function useSavedTemplates() {
  const [templates, setTemplates] = useState<CommunityTemplate[]>([])
  const [loading, setLoading]     = useState(true)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    async function load() {
      if (!user) { setLoading(false); return }
      setLoading(true)
      if (!isSupabaseConfigured) {
        await new Promise((r) => setTimeout(r, 300))
        setTemplates(MOCK_COMMUNITY_TEMPLATES.slice(0, 4))
        setLoading(false)
        return
      }
      const { data } = await supabase.from('template_saves')
        .select('template_id, community_templates(*, creator:creator_id(id,username,display_name,avatar_url))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      const tpls = (data ?? []).map((row) => row.community_templates).filter(Boolean)
      setTemplates(tpls as unknown as CommunityTemplate[])
      setLoading(false)
    }
    load()
  }, [user])

  return { templates, loading }
}

/* ── Creator dashboard ──────────────────────────────────────── */
export function useCreatorDashboard() {
  const user    = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const [myTemplates, setMyTemplates] = useState<CommunityTemplate[]>([])
  const [stats, setStats]             = useState({ views: 0, downloads: 0, likes: 0, generations: 0 })
  const [loading, setLoading]         = useState(true)

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    if (!isSupabaseConfigured) {
      await new Promise((r) => setTimeout(r, 300))
      const mine = MOCK_COMMUNITY_TEMPLATES.filter((t) => t.creator_id === 'm1')
      setMyTemplates(mine)
      setStats({ views: mine.reduce((s, t) => s + t.view_count, 0), downloads: mine.reduce((s, t) => s + t.download_count, 0), likes: mine.reduce((s, t) => s + t.like_count, 0), generations: mine.reduce((s, t) => s + t.generation_count, 0) })
      setLoading(false)
      return
    }
    const { data } = await supabase.from('community_templates')
      .select('*').eq('creator_id', user.id).order('created_at', { ascending: false })
    const mine = (data ?? []) as unknown as CommunityTemplate[]
    setMyTemplates(mine)
    setStats({ views: mine.reduce((s, t) => s + t.view_count, 0), downloads: mine.reduce((s, t) => s + t.download_count, 0), likes: mine.reduce((s, t) => s + t.like_count, 0), generations: mine.reduce((s, t) => s + t.generation_count, 0) })
    setLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

  const togglePublish = async (id: string, current: boolean) => {
    setMyTemplates((prev) => prev.map((t) => t.id === id ? { ...t, is_published: !current } : t))
    if (isSupabaseConfigured) await supabase.from('community_templates').update({ is_published: !current }).eq('id', id)
  }

  const deleteTemplate = async (id: string) => {
    setMyTemplates((prev) => prev.filter((t) => t.id !== id))
    if (isSupabaseConfigured) await supabase.from('community_templates').delete().eq('id', id)
  }

  return { myTemplates, stats, loading, profile, refresh: load, togglePublish, deleteTemplate }
}
