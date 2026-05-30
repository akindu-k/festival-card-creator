export type Orientation = 'portrait' | 'landscape'
export type TextAlign  = 'left' | 'center' | 'right'
export type View       = 'gallery' | 'editor'

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
  id:          string
  name:        string
  category:    TemplateCategory
  description: string
  tags:        string[]
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
