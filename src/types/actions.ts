/**
 * Shared action type system for badge buttons and markdown action links.
 *
 * Unified model: every BadgeAction carries actions: Action[].
 * Simple badges are just badges with a single ChatAction.
 * No discriminated union — one type, one callback.
 *
 * Based on cv-builder's mature action system, generalized for all apps.
 * No Zod dependency — plain TypeScript interfaces.
 */

export type BadgeVariant = 'purple' | 'blue' | 'cyan' | 'teal' | 'green' | 'gray' | 'red' | 'magenta'

// ── Action primitives ──────────────────────────────────────────────────

export type ActionType = 'chat' | 'navigate' | 'file_upload' | 'expand_chat' | 'copy_text' | 'download' | 'external_link'

export interface ChatAction {
  type: 'chat'
  message: string
  expandChat?: boolean
}

export interface NavigateAction {
  type: 'navigate'
  /** Generic string target — each app maps to its own tab/route keys. */
  target: string
}

export interface FileUploadAction {
  type: 'file_upload'
  accept?: string
  multiple?: boolean
  targetTab?: number
}

export interface ExpandChatAction {
  type: 'expand_chat'
}

export interface CopyTextAction {
  type: 'copy_text'
  text: string
}

export interface DownloadAction {
  type: 'download'
  url: string
  filename: string
}

export interface ExternalLinkAction {
  type: 'external_link'
  url: string
  openInNew?: boolean
}

export type Action =
  | ChatAction
  | NavigateAction
  | FileUploadAction
  | ExpandChatAction
  | CopyTextAction
  | DownloadAction
  | ExternalLinkAction

// ── Suggested message (follow-up after badge click) ──────────────────────

export interface SuggestedMessage {
  role: 'user' | 'assistant'
  content: string
  compactContent?: string
}

// ── Badge action ────────────────────────────────────────────────────────

export interface BadgeAction {
  label: string
  icon?: string
  actions: Action[]
  suggestedMessage?: SuggestedMessage
  disabled?: boolean
  variant?: BadgeVariant
  tooltip?: string
}

// ── Factories ───────────────────────────────────────────────────────────

export const createChatAction = (message: string, expandChat = false): ChatAction => ({
  type: 'chat',
  message,
  expandChat,
})

export const createNavigateAction = (target: string): NavigateAction => ({
  type: 'navigate',
  target,
})

export const createFileUploadAction = (
  accept?: string,
  multiple = false,
  targetTab?: number,
): FileUploadAction => ({
  type: 'file_upload',
  accept,
  multiple,
  targetTab,
})

export const createExpandChatAction = (): ExpandChatAction => ({
  type: 'expand_chat',
})

export const createCopyTextAction = (text: string): CopyTextAction => ({
  type: 'copy_text',
  text,
})

export const createDownloadAction = (url: string, filename: string): DownloadAction => ({
  type: 'download',
  url,
  filename,
})

export const createExternalLinkAction = (url: string, openInNew = true): ExternalLinkAction => ({
  type: 'external_link',
  url,
  openInNew,
})

export const createSuggestedMessage = (
  role: 'user' | 'assistant',
  content: string,
  compactContent?: string,
): SuggestedMessage => ({
  role,
  content,
  compactContent,
})

/**
 * Create a badge action. All badges carry actions: Action[].
 * For simple "send this message" badges, pass a single ChatAction.
 */
export const createBadgeAction = (
  label: string,
  actions: Action[],
  options?: {
    icon?: string
    variant?: BadgeVariant
    tooltip?: string
    disabled?: boolean
    suggestedMessage?: SuggestedMessage
  },
): BadgeAction => ({
  label,
  actions,
  icon: options?.icon,
  variant: options?.variant ?? 'purple',
  tooltip: options?.tooltip ?? generateTooltip(actions),
  disabled: options?.disabled ?? false,
  suggestedMessage: options?.suggestedMessage,
})

/**
 * Convenience: create a badge that sends a single chat message.
 * Equivalent to createBadgeAction(label, [createChatAction(message)], ...).
 */
export const createSimpleBadge = (
  label: string,
  message: string,
  options?: { icon?: string; variant?: BadgeVariant; tooltip?: string; disabled?: boolean },
): BadgeAction => createBadgeAction(label, [createChatAction(message)], options)

/** Auto-generate tooltip from actions. */
const generateTooltip = (actions: Action[]): string => {
  if (actions.length === 1) {
    const action = actions[0] as Action
    switch (action.type) {
      case 'chat':
        return `Ask: "${action.message.slice(0, 50)}${action.message.length > 50 ? '...' : ''}"`
      case 'navigate':
        return `Navigate to ${action.target}`
      case 'file_upload':
        return `Upload ${action.multiple ? 'files' : 'file'}${action.accept ? ` (${action.accept})` : ''}`
      case 'expand_chat':
        return 'Expand chat'
      case 'copy_text':
        return 'Copy to clipboard'
      case 'download':
        return `Download ${action.filename}`
      case 'external_link':
        return `Open ${action.url}`
    }
  }
  return `${actions.length} actions: ${actions.map(a => a.type).join(', ')}`
}

// ── Utilities ────────────────────────────────────────────────────────────

/** Extract the first chat action's message from a badge, or null. */
export const getChatMessage = (badge: BadgeAction): string | null => {
  const chatAction = badge.actions.find((a): a is ChatAction => a.type === 'chat')
  return chatAction?.message ?? null
}

/** Clean streaming content: strip metadata tags, fix incomplete code blocks. */
export const cleanStreamingContent = (content: string): { cleaned: string; isMetadataStreaming: boolean } => {
  // Strip complete metadata blocks
  let cleaned = content.replace(/<metadata>[\s\S]*?<\/metadata>/gi, '')

  // Strip incomplete metadata that's still streaming
  const metadataStartIndex = cleaned.search(/<\s*metadata/i)
  let isMetadataStreaming = false

  if (metadataStartIndex !== -1) {
    cleaned = cleaned.substring(0, metadataStartIndex).trim()
    isMetadataStreaming = true
  }

  // Remove old bracket-style navigation tags
  cleaned = cleaned.replace(/\[NAVIGATE_TO_TAB:\d+:[^\]]+\]/g, '')

  // Fix incomplete code blocks during streaming
  const backtickMatches = cleaned.match(/```/g)
  const backtickCount = backtickMatches ? backtickMatches.length : 0
  if (backtickCount % 2 !== 0) {
    cleaned += '\n```\n*[Streaming...]*'
  }

  return { cleaned: cleaned.trim(), isMetadataStreaming }
}

/** Extract badge action suggestions from agent response metadata. */
export const extractSuggestionsFromResponse = (response: string): BadgeAction[] => {
  const metadataMatch = response.match(/<metadata>([\s\S]*?)<\/metadata>/i)
  if (!metadataMatch) return []

  try {
    const metadata = JSON.parse(metadataMatch[1]!.trim())
    if (metadata.suggestions && Array.isArray(metadata.suggestions)) {
      return metadata.suggestions.slice(0, 6)
    }
  } catch {
    // Not valid JSON metadata
  }

  return []
}

/** Strip metadata from final displayed content. */
export const stripMetadata = (content: string): string => {
  return content
    .replace(/<metadata>[\s\S]*?<\/metadata>/gi, '')
    .replace(/\[NAVIGATE_TO_TAB:\d+:[^\]]+\]/g, '')
    .trim()
}
