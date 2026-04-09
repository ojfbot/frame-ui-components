// ── Components ───────────────────────────────────────────────────────────
export { BadgeButton } from './components/BadgeButton.js'
export type { BadgeButtonProps } from './components/BadgeButton.js'
export { MarkdownMessage } from './components/MarkdownMessage.js'
export type { MarkdownMessageProps } from './components/MarkdownMessage.js'
export { ErrorBoundary } from './components/ErrorBoundary.js'
export type { ErrorBoundaryProps, FrameErrorReport } from './components/ErrorBoundary.js'
export { DashboardLayout } from './components/DashboardLayout.js'
export type { DashboardLayoutProps, DashboardHeaderProps } from './components/DashboardLayout.js'
export { ThreadSidebar } from './components/ThreadSidebar.js'
export type { ThreadSidebarProps, ThreadItem } from './components/ThreadSidebar.js'
export { SidebarToggle } from './components/SidebarToggle.js'
export type { SidebarToggleProps } from './components/SidebarToggle.js'
export { ChatShell } from './components/ChatShell.js'
export type { ChatShellProps, ChatDisplayState } from './components/ChatShell.js'
export { ChatHeader } from './components/ChatHeader.js'
export type { ChatHeaderProps } from './components/ChatHeader.js'
export { ChatMessageArea } from './components/ChatMessageArea.js'
export type { ChatMessageAreaProps, ChatMessageAreaHandle } from './components/ChatMessageArea.js'
export { ChatInput } from './components/ChatInput.js'
export type { ChatInputProps } from './components/ChatInput.js'
export { ChatMessage, MetadataLoadingIndicator } from './components/ChatMessage.js'
export type { ChatMessageProps } from './components/ChatMessage.js'

// ── Types ────────────────────────────────────────────────────────────────
export type {
  BadgeVariant,
  ActionType,
  ChatAction,
  NavigateAction,
  FileUploadAction,
  ExpandChatAction,
  CopyTextAction,
  DownloadAction,
  ExternalLinkAction,
  Action,
  SuggestedMessage,
  BadgeAction,
} from './types/actions.js'

// ── Factories + utilities ────────────────────────────────────────────────
export {
  createChatAction,
  createNavigateAction,
  createFileUploadAction,
  createExpandChatAction,
  createCopyTextAction,
  createDownloadAction,
  createExternalLinkAction,
  createSuggestedMessage,
  createBadgeAction,
  createSimpleBadge,
  getChatMessage,
  cleanStreamingContent,
  extractSuggestionsFromResponse,
  stripMetadata,
} from './types/actions.js'
