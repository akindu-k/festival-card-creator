import type { MessageCategory } from '../types'

export const MESSAGE_CATEGORIES: MessageCategory[] = [
  {
    id:    'peace',
    label: 'Peace & Wisdom',
    icon:  '☮️',
    messages: [
      'May the light of Vesak illuminate your path with peace, wisdom, and happiness.',
      'May the teachings of the Buddha guide you towards a life of peace and harmony.',
      'On this sacred Vesak day, may your heart be filled with kindness and serenity.',
      'May the wisdom of the Dhamma light your way through all of life\'s journeys.',
      'Wishing you a peaceful Vesak filled with the joy of inner stillness.',
      'May you find clarity, wisdom, and lasting peace on this auspicious Vesak day.',
      'As the Vesak lanterns glow, may wisdom and peace shine in your heart.',
    ],
  },
  {
    id:    'blessings',
    label: 'Blessings',
    icon:  '🙏',
    messages: [
      'May you and your family be blessed with health, happiness, and inner peace this Vesak.',
      'Wishing you a blessed Vesak filled with compassion, joy, and spiritual growth.',
      'May the Triple Gem bless you and your loved ones on this holy Vesak day.',
      'May the sacred blessings of Vesak bring abundance and joy to your life.',
      'Sending heartfelt Vesak blessings to you and your entire family.',
      'May the grace of the Buddha, Dhamma, and Sangha guide and protect you always.',
      'May this Vesak bring abundant blessings of health, prosperity, and happiness.',
    ],
  },
  {
    id:    'compassion',
    label: 'Compassion & Love',
    icon:  '💛',
    messages: [
      'On this sacred Vesak day, may your heart overflow with compassion and loving-kindness.',
      'May the spirit of Metta — unconditional love — fill your heart and radiate to all beings.',
      'Vesak reminds us to practice compassion. May you embody kindness in every moment.',
      'May this Vesak Day inspire you to live with greater love, compassion, and generosity.',
      'Wishing you a Vesak filled with the warmth of compassion and the joy of giving.',
      'May the boundless compassion of the Buddha inspire your every action this Vesak.',
      'Let us celebrate Vesak by spreading kindness and love to all beings around us.',
    ],
  },
  {
    id:    'spiritual',
    label: 'Spiritual Growth',
    icon:  '🪷',
    messages: [
      'May this Vesak mark a new chapter in your spiritual journey towards enlightenment.',
      'As the lotus rises from muddy waters, may you rise above challenges with grace.',
      'May this sacred Vesak day inspire you to walk the Noble Eightfold Path with devotion.',
      'Vesak is a reminder of the path to liberation. May your journey be filled with light.',
      'May the Dhamma be your guiding light and the Sangha your strength this Vesak.',
      'May you progress along the path of mindfulness and find liberation from suffering.',
      'On this Vesak Poya, may you deepen your practice and experience the joy of Dhamma.',
    ],
  },
  {
    id:    'family',
    label: 'Family & Friends',
    icon:  '🌸',
    messages: [
      'Sending warm Vesak wishes to you and all your loved ones. May joy fill your home.',
      'May this Vesak bring your family closer together in love, unity, and harmony.',
      'Wishing you and your family a joyful and blessed Vesak celebration.',
      'May this Vesak be a time of togetherness, warmth, and cherished memories.',
      'To my dear friend, may this Vesak bring you all the happiness you deserve.',
      'May the spirit of Vesak bring peace and joy to every corner of your home.',
      'Wishing you and your loved ones a beautiful Vesak filled with love and laughter.',
    ],
  },
]

export const ALL_MESSAGES = MESSAGE_CATEGORIES.flatMap((c) => c.messages)

export const getRandomMessage = (): string => {
  const idx = Math.floor(Math.random() * ALL_MESSAGES.length)
  return ALL_MESSAGES[idx]
}
