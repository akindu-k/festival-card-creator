export type Orientation = 'portrait' | 'landscape'
export type TextAlign  = 'left' | 'center' | 'right'
export type View       = 'gallery' | 'editor'

/* ── Card editor ──────────────────────────────────────────── */
export interface CardData {
  templateId:     string
  senderName:     string
  senderOrg:      string
  receiverName:   string
  customGreeting: string
  message:        string
  fontFamily:     string
  fontSize:       number
  fontColor:      string
  textAlign:      TextAlign
  orientation:    Orientation
  showDecor:      boolean
}

export interface TemplateInfo {
  id:           string
  name:         string
  category:     TemplateCategory
  description:  string
  tags:         string[]
  primaryColor: string
  accentColor:  string
  textColor:    string
  bgPreview:    string
}

export type TemplateCategory =
  | 'traditional'
  | 'floral'
  | 'spiritual'
  | 'festive'
  | 'minimalist'
  | 'modern'

export interface MessageCategory {
  id:       string
  label:    string
  icon:     string
  messages: string[]
}

/* ── Community ────────────────────────────────────────────── */
export interface Profile {
  id:              string
  username:        string
  display_name:    string
  avatar_url:      string | null
  bio:             string | null
  website?:        string | null
  follower_count:  number
  following_count: number
  template_count:  number
  total_likes:     number
  created_at?:     string
  badges?:         Badge[]
}

export interface CommunityTemplate {
  id:               string
  creator_id:       string
  name:             string
  description:      string | null
  category:         string
  tags:             string[]
  thumbnail_url:    string | null
  base_template_id: string
  font_family:      string
  font_color:       string
  text_align:       TextAlign
  orientation:      Orientation
  default_message:  string
  is_published:     boolean
  is_featured:      boolean
  view_count:       number
  download_count:   number
  generation_count: number
  like_count:       number
  save_count:       number
  comment_count:    number
  created_at:       string
  updated_at:       string
  // joined
  creator?:         Profile
  user_has_liked?:  boolean
  user_has_saved?:  boolean
}

export interface Comment {
  id:          string
  template_id: string
  user_id:     string
  parent_id:   string | null
  content:     string
  like_count:  number
  is_edited:   boolean
  created_at:  string
  updated_at?: string
  user:        Profile
  replies?:    Comment[]
  user_has_liked?: boolean
}

export interface Badge {
  id:          string
  name:        string
  description: string
  icon:        string
  color:       string
}

export interface Notification {
  id:          string
  user_id:     string
  actor_id:    string | null
  type:        'like' | 'comment' | 'follow' | 'reply' | 'featured'
  entity_type: string | null
  entity_id:   string | null
  message:     string | null
  is_read:     boolean
  created_at:  string
  actor?:      Profile
}

export type CommunityFeedSort = 'trending' | 'new' | 'liked' | 'following' | 'featured'
