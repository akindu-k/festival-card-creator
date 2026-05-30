import type { CommunityTemplate, Profile } from '../types'

export const MOCK_PROFILES: Profile[] = [
  { id: 'm1', username: 'dharma_artist',    display_name: 'Dharma Artist',     avatar_url: null, bio: 'Spreading Dhamma through digital art 🪷',   follower_count: 1240, following_count: 89,  template_count: 12, total_likes: 4830 },
  { id: 'm2', username: 'lotus_temple',     display_name: 'Lotus Temple',      avatar_url: null, bio: 'Buddhist art & culture enthusiast',         follower_count: 890,  following_count: 134, template_count: 8,  total_likes: 2150 },
  { id: 'm3', username: 'vesak_vibes',      display_name: 'Vesak Vibes',       avatar_url: null, bio: 'Creating beautiful Vesak memories',         follower_count: 2340, following_count: 211, template_count: 21, total_likes: 9120 },
  { id: 'm4', username: 'mindful_designs',  display_name: 'Mindful Designs',   avatar_url: null, bio: 'Minimalist Buddhist aesthetics',            follower_count: 567,  following_count: 78,  template_count: 5,  total_likes: 1340 },
  { id: 'm5', username: 'golden_sangha',    display_name: 'Golden Sangha',     avatar_url: null, bio: 'Honoring the Triple Gem with creativity',   follower_count: 3100, following_count: 445, template_count: 18, total_likes: 12600 },
  { id: 'm6', username: 'poya_creator',     display_name: 'Poya Creator',      avatar_url: null, bio: 'Vesak card designs from Sri Lanka 🇱🇰',    follower_count: 421,  following_count: 65,  template_count: 6,  total_likes: 980 },
]

const base = (overrides: Partial<CommunityTemplate>): CommunityTemplate => ({
  id:                'ct-' + Math.random().toString(36).slice(2, 8),
  creator_id:        'm1',
  name:              'Template',
  description:       'A beautiful Vesak card template.',
  category:          'traditional',
  tags:              ['vesak', 'poya'],
  thumbnail_url:     null,
  base_template_id:  'lantern',
  font_family:       'Playfair Display',
  font_color:        '#FFFFFF',
  text_align:        'center',
  orientation:       'portrait',
  default_message:   'May the light of Vesak illuminate your path with peace, wisdom, and happiness.',
  is_published:      true,
  is_featured:       false,
  view_count:        0,
  download_count:    0,
  generation_count:  0,
  like_count:        0,
  save_count:        0,
  comment_count:     0,
  created_at:        '2025-05-01T10:00:00Z',
  updated_at:        '2025-05-01T10:00:00Z',
  creator:           MOCK_PROFILES[0],
  user_has_liked:    false,
  user_has_saved:    false,
  ...overrides,
})

export const MOCK_COMMUNITY_TEMPLATES: CommunityTemplate[] = [
  base({ id: 'ct-001', name: 'Golden Lantern Night',      creator_id: 'm1', creator: MOCK_PROFILES[0], base_template_id: 'lantern',    category: 'traditional', tags: ['lantern','night','golden'],   like_count: 234, download_count: 1847, view_count: 5621, is_featured: true,  description: 'A breathtaking Vesak night scene with glowing traditional lanterns reflected on still waters. Perfect for sharing with family and friends.', created_at: '2025-04-28T08:00:00Z' }),
  base({ id: 'ct-002', name: 'Sacred Lotus Serenity',     creator_id: 'm2', creator: MOCK_PROFILES[1], base_template_id: 'lotus',      category: 'floral',      tags: ['lotus','serene','pink'],      like_count: 189, download_count: 1203, view_count: 4128, is_featured: true,  description: 'Soft lotus petals floating on tranquil waters. A serene, meditative design for spreading compassion this Vesak.',               created_at: '2025-04-29T09:00:00Z' }),
  base({ id: 'ct-003', name: 'Saffron Sunrise Temple',    creator_id: 'm3', creator: MOCK_PROFILES[2], base_template_id: 'temple',     category: 'spiritual',   tags: ['temple','sunrise','saffron'], like_count: 312, download_count: 2104, view_count: 6890, is_featured: false, description: 'Majestic temple silhouette against a vivid saffron dawn. Inspired by the ancient temples of Sri Lanka.',                       created_at: '2025-04-30T07:00:00Z' }),
  base({ id: 'ct-004', name: 'Pandal Festival Lights',    creator_id: 'm5', creator: MOCK_PROFILES[4], base_template_id: 'pandal',     category: 'festive',     tags: ['pandal','festive','colorful'], like_count: 445, download_count: 3210, view_count: 9840, is_featured: true,  description: 'Vibrant Vesak pandal ablaze with colorful lights. Captures the festive spirit of Vesak night celebrations.',                  created_at: '2025-05-01T06:00:00Z' }),
  base({ id: 'ct-005', name: 'Zen White Lotus',           creator_id: 'm4', creator: MOCK_PROFILES[3], base_template_id: 'minimalist', category: 'minimalist',  tags: ['zen','minimal','white'],      like_count: 156, download_count: 987,  view_count: 3214, font_color: '#2C1810', description: 'A breathingly minimal design. Clean lines and a single lotus motif for those who prefer understated elegance.',         created_at: '2025-04-27T10:00:00Z' }),
  base({ id: 'ct-006', name: 'Sacred Gold Mandala',       creator_id: 'm1', creator: MOCK_PROFILES[0], base_template_id: 'golden',     category: 'spiritual',   tags: ['gold','mandala','sacred'],    like_count: 378, download_count: 2645, view_count: 7234, is_featured: true,  description: 'Rich golden mandala patterns inspired by ancient Buddhist art. A premium design worthy of the most auspicious occasion.',      created_at: '2025-05-02T08:00:00Z' }),
  base({ id: 'ct-007', name: 'Blue Night Lotus',          creator_id: 'm6', creator: MOCK_PROFILES[5], base_template_id: 'lotus',      category: 'floral',      tags: ['lotus','blue','night'],       like_count: 98,  download_count: 634,  view_count: 1987, font_color: '#1a0a4e', description: 'A beautiful twist on the lotus theme with midnight blue tones and moonlit reflections.',                                   created_at: '2025-04-26T14:00:00Z' }),
  base({ id: 'ct-008', name: 'Dharma Wheel Dawn',         creator_id: 'm3', creator: MOCK_PROFILES[2], base_template_id: 'temple',     category: 'spiritual',   tags: ['dharma','wheel','dawn'],      like_count: 267, download_count: 1892, view_count: 5430, description: 'The eternal Dharmachakra at first light. A powerful spiritual design for sharing the Buddha\'s teachings.',                   created_at: '2025-04-25T11:00:00Z' }),
  base({ id: 'ct-009', name: 'Festive Lantern Row',       creator_id: 'm2', creator: MOCK_PROFILES[1], base_template_id: 'lantern',    category: 'traditional', tags: ['lanterns','festive','row'],   like_count: 143, download_count: 891,  view_count: 2943, description: 'Three glowing lanterns in a row, casting warm light across a still reflecting pond.',                                        created_at: '2025-04-24T09:00:00Z' }),
  base({ id: 'ct-010', name: 'Minimal Vesak Wish',        creator_id: 'm4', creator: MOCK_PROFILES[3], base_template_id: 'minimalist', category: 'minimalist',  tags: ['minimal','clean','elegant'],  like_count: 87,  download_count: 543,  view_count: 1654, font_color: '#2C1810', description: 'Less is more. A supremely minimal card design with just the essential lotus and gold accents.',                            created_at: '2025-04-23T16:00:00Z' }),
  base({ id: 'ct-011', name: 'Royal Golden Blessings',    creator_id: 'm5', creator: MOCK_PROFILES[4], base_template_id: 'golden',     category: 'spiritual',   tags: ['royal','gold','blessings'],  like_count: 521, download_count: 3890, view_count: 10120, description: 'Royal golden design with ornate mandala borders. The premium choice for wishing loved ones a truly blessed Vesak.',       created_at: '2025-05-03T07:00:00Z' }),
  base({ id: 'ct-012', name: 'Night Pandal Festival',     creator_id: 'm6', creator: MOCK_PROFILES[5], base_template_id: 'pandal',     category: 'festive',     tags: ['pandal','night','lights'],   like_count: 176, download_count: 1123, view_count: 3876, description: 'Inspired by the magnificent Vesak pandals of Colombo — a dazzling spectacle of lights and devotion.',                       created_at: '2025-04-22T20:00:00Z' }),
]

export const MOCK_COMMENTS = [
  { id: 'c1', template_id: 'ct-001', user_id: 'm2', content: 'This is absolutely stunning! The lanterns look so realistic. 🙏', like_count: 12, is_edited: false, created_at: '2025-05-05T10:00:00Z', user: MOCK_PROFILES[1], parent_id: null },
  { id: 'c2', template_id: 'ct-001', user_id: 'm3', content: 'Used this for my family Vesak cards — everyone loved it! Thank you!', like_count: 8, is_edited: false, created_at: '2025-05-05T12:00:00Z', user: MOCK_PROFILES[2], parent_id: null },
  { id: 'c3', template_id: 'ct-001', user_id: 'm4', content: 'Beautiful design. Would be nice with a landscape option too.', like_count: 4, is_edited: false, created_at: '2025-05-06T09:00:00Z', user: MOCK_PROFILES[3], parent_id: null },
  { id: 'c4', template_id: 'ct-001', user_id: 'm1', content: 'Thank you all for the kind words! Landscape version coming soon 🌟', like_count: 15, is_edited: false, created_at: '2025-05-06T10:00:00Z', user: MOCK_PROFILES[0], parent_id: 'c3' },
]
