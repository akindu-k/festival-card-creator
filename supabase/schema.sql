-- ============================================================
--  Vesak Card Creator — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles ────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id            UUID    REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username      TEXT    UNIQUE NOT NULL,
  display_name  TEXT    NOT NULL,
  avatar_url    TEXT,
  bio           TEXT,
  website       TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are public"        ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile"   ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile"   ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ── Community Templates ──────────────────────────────────────
CREATE TABLE public.community_templates (
  id                 UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id         UUID    REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name               TEXT    NOT NULL,
  description        TEXT,
  category           TEXT    NOT NULL DEFAULT 'traditional',
  tags               TEXT[]  DEFAULT '{}',
  thumbnail_url      TEXT,
  -- Design settings
  base_template_id   TEXT    NOT NULL DEFAULT 'lantern',
  font_family        TEXT    DEFAULT 'Playfair Display',
  font_color         TEXT    DEFAULT '#FFFFFF',
  text_align         TEXT    DEFAULT 'center',
  orientation        TEXT    DEFAULT 'portrait',
  default_message    TEXT    DEFAULT 'Wishing you a blessed Vesak filled with peace and harmony.',
  -- Meta
  is_published       BOOLEAN DEFAULT false,
  is_featured        BOOLEAN DEFAULT false,
  is_archived        BOOLEAN DEFAULT false,
  view_count         INTEGER DEFAULT 0,
  download_count     INTEGER DEFAULT 0,
  generation_count   INTEGER DEFAULT 0,
  like_count         INTEGER DEFAULT 0,
  save_count         INTEGER DEFAULT 0,
  comment_count      INTEGER DEFAULT 0,
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.community_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published templates are public"  ON public.community_templates FOR SELECT USING (is_published = true OR creator_id = auth.uid());
CREATE POLICY "Creators manage own templates"   ON public.community_templates FOR ALL  USING (creator_id = auth.uid());

-- ── Likes ────────────────────────────────────────────────────
CREATE TABLE public.template_likes (
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id  UUID REFERENCES public.community_templates(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, template_id)
);
ALTER TABLE public.template_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes are public"        ON public.template_likes FOR SELECT USING (true);
CREATE POLICY "Users manage own likes"  ON public.template_likes FOR ALL  USING (auth.uid() = user_id);

-- ── Saves ────────────────────────────────────────────────────
CREATE TABLE public.template_saves (
  user_id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id      UUID REFERENCES public.community_templates(id) ON DELETE CASCADE,
  collection_name  TEXT DEFAULT 'Saved',
  created_at       TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, template_id)
);
ALTER TABLE public.template_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own saves"     ON public.template_saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own saves"  ON public.template_saves FOR ALL  USING (auth.uid() = user_id);

-- ── Comments ─────────────────────────────────────────────────
CREATE TABLE public.comments (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id  UUID    REFERENCES public.community_templates(id) ON DELETE CASCADE NOT NULL,
  user_id      UUID    REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id    UUID    REFERENCES public.comments(id) ON DELETE CASCADE,
  content      TEXT    NOT NULL,
  like_count   INTEGER DEFAULT 0,
  is_edited    BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are public"       ON public.comments FOR SELECT USING (true);
CREATE POLICY "Auth users can comment"    ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users edit own comments"   ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- ── Comment likes ────────────────────────────────────────────
CREATE TABLE public.comment_likes (
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment_id  UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, comment_id)
);
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comment likes public"           ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Users manage own comment likes" ON public.comment_likes FOR ALL  USING (auth.uid() = user_id);

-- ── Follows ──────────────────────────────────────────────────
CREATE TABLE public.follows (
  follower_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Follows are public"       ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users manage own follows" ON public.follows FOR ALL  USING (auth.uid() = follower_id);

-- ── Notifications ────────────────────────────────────────────
CREATE TABLE public.notifications (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID    REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  actor_id     UUID    REFERENCES public.profiles(id) ON DELETE SET NULL,
  type         TEXT    NOT NULL,  -- 'like','comment','follow','reply','featured'
  entity_type  TEXT,
  entity_id    UUID,
  message      TEXT,
  is_read      BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifs"    ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifs" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- ── Reports ──────────────────────────────────────────────────
CREATE TABLE public.reports (
  id           UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id  UUID  REFERENCES public.profiles(id) ON DELETE SET NULL,
  entity_type  TEXT  NOT NULL,
  entity_id    UUID  NOT NULL,
  reason       TEXT  NOT NULL,
  status       TEXT  DEFAULT 'pending',
  created_at   TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users submit reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- ── Badges ───────────────────────────────────────────────────
CREATE TABLE public.badges (
  id          TEXT  PRIMARY KEY,
  name        TEXT  NOT NULL,
  description TEXT,
  icon        TEXT,
  color       TEXT  DEFAULT '#D4AF37'
);
INSERT INTO public.badges VALUES
  ('first_upload',    'First Upload',      'Published your first template',         '🌱', '#22c55e'),
  ('rising_star',     'Rising Star',       'Received 10 likes',                     '⭐', '#f59e0b'),
  ('popular',         'Popular Creator',   'Received 100 likes',                    '🔥', '#ef4444'),
  ('template_master', 'Template Master',   'Published 10 templates',               '🎨', '#8b5cf6'),
  ('community_pillar','Community Pillar',  '50 followers',                          '🏛️', '#3b82f6'),
  ('diamond_creator', 'Diamond Creator',   '1,000 downloads',                       '💎', '#06b6d4');

CREATE TABLE public.user_badges (
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id   TEXT REFERENCES public.badges(id),
  earned_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User badges are public" ON public.user_badges FOR SELECT USING (true);

-- ── Trigger: create profile on signup ────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username',  SPLIT_PART(NEW.email,'@',1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Trigger: update like_count ───────────────────────────────
CREATE OR REPLACE FUNCTION public.update_template_like_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_templates SET like_count = like_count + 1 WHERE id = NEW.template_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_templates SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.template_id;
  END IF;
  RETURN NULL;
END;
$$;
CREATE TRIGGER on_template_like AFTER INSERT OR DELETE ON public.template_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_template_like_count();

-- ── Trigger: update save_count ───────────────────────────────
CREATE OR REPLACE FUNCTION public.update_template_save_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_templates SET save_count = save_count + 1 WHERE id = NEW.template_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_templates SET save_count = GREATEST(save_count - 1, 0) WHERE id = OLD.template_id;
  END IF;
  RETURN NULL;
END;
$$;
CREATE TRIGGER on_template_save AFTER INSERT OR DELETE ON public.template_saves
  FOR EACH ROW EXECUTE FUNCTION public.update_template_save_count();

-- ── Trigger: update comment_count ────────────────────────────
CREATE OR REPLACE FUNCTION public.update_comment_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_templates SET comment_count = comment_count + 1 WHERE id = NEW.template_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_templates SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.template_id;
  END IF;
  RETURN NULL;
END;
$$;
CREATE TRIGGER on_comment AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_comment_count();

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_templates_creator    ON public.community_templates(creator_id);
CREATE INDEX idx_templates_published  ON public.community_templates(is_published, created_at DESC);
CREATE INDEX idx_templates_featured   ON public.community_templates(is_featured) WHERE is_featured = true;
CREATE INDEX idx_comments_template    ON public.comments(template_id, created_at DESC);
CREATE INDEX idx_notifications_user   ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_follows_follower     ON public.follows(follower_id);
CREATE INDEX idx_follows_following    ON public.follows(following_id);

-- ── Storage: template-thumbnails bucket ──────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('template-thumbnails', 'template-thumbnails', true)
ON CONFLICT DO NOTHING;
CREATE POLICY "Public thumbnail read"
  ON storage.objects FOR SELECT USING (bucket_id = 'template-thumbnails');
CREATE POLICY "Auth thumbnail upload"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'template-thumbnails' AND auth.role() = 'authenticated');
CREATE POLICY "Auth thumbnail delete"
  ON storage.objects FOR DELETE USING (bucket_id = 'template-thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);
