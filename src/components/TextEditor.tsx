import { MessageSquare, User, Building2, UserCheck } from 'lucide-react'
import { useAppStore } from '../store'

export default function TextEditor() {
  const { cardData, updateCard } = useAppStore()
  const u = (k: string, v: string) => updateCard({ [k]: v } as never)

  return (
    <div className="space-y-5">

      {/* Receiver */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
          <UserCheck size={12} className="inline mr-1.5 text-gold-500" />
          To
        </label>
        <input
          className="input-base"
          placeholder="Recipient's name (optional)"
          value={cardData.receiverName}
          onChange={(e) => u('receiverName', e.target.value)}
        />
        <input
          className="input-base mt-2"
          placeholder="Custom greeting, e.g. Dear Friend,"
          value={cardData.customGreeting}
          onChange={(e) => u('customGreeting', e.target.value)}
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
          <MessageSquare size={12} className="inline mr-1.5 text-gold-500" />
          Message
        </label>
        <textarea
          className="input-base resize-none"
          rows={5}
          placeholder="Enter your Vesak message..."
          value={cardData.message}
          onChange={(e) => u('message', e.target.value)}
        />
        <p className="text-right text-[10px] text-gray-400 mt-1">{cardData.message.length} chars</p>
      </div>

      {/* Sender */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
          <User size={12} className="inline mr-1.5 text-gold-500" />
          From
        </label>
        <input
          className="input-base"
          placeholder="Your name"
          value={cardData.senderName}
          onChange={(e) => u('senderName', e.target.value)}
        />
        <div className="relative mt-2">
          <Building2 size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input-base pl-9"
            placeholder="Organization / family (optional)"
            value={cardData.senderOrg}
            onChange={(e) => u('senderOrg', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
