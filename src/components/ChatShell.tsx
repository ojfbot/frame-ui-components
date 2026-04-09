import { useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Chat } from '@carbon/icons-react'
import { ChatHeader } from './ChatHeader'
import { ChatMessageArea } from './ChatMessageArea'
import type { ChatMessageAreaHandle } from './ChatMessageArea'
import { ChatInput } from './ChatInput'
import '../styles/ChatShell.css'

export type ChatDisplayState = 'collapsed' | 'expanded' | 'minimized'

export interface ChatShellProps {
  displayState: ChatDisplayState
  onDisplayStateChange: (state: ChatDisplayState) => void
  /** Push chat left when sidebar is open. */
  sidebarExpanded?: boolean
  /** Header title. Defaults to "AI Assistant". */
  title?: string
  /** Summary text appended to title (e.g. "- Summarizing..."). */
  chatSummary?: string
  /** Show spinner in header. */
  isLoading?: boolean
  /** Unread message count badge. */
  unreadCount?: number
  /** Extra content in header (e.g. status indicator). */
  headerExtra?: ReactNode
  /** Extra content next to input (e.g. microphone button). */
  inputExtra?: ReactNode
  /** Controlled input value. */
  draftInput: string
  onDraftChange: (value: string) => void
  onSend: (message: string) => void
  /** Called when input is focused while collapsed — typically expands the chat. */
  onInputFocus?: () => void
  /** Placeholder text for the input. */
  placeholder?: string
  /** Whether the input should be disabled. */
  inputDisabled?: boolean
  /** Disabled message shown instead of input. */
  disabledMessage?: string
  /** Message list — rendered inside scrollable container. */
  children: ReactNode
  /** Streaming content below messages — auto-scrolls when present. */
  streamingContent?: ReactNode
}

/**
 * Composable chat container — handles positioning, expand/collapse,
 * auto-scroll, TextInput/TextArea switching, and input area.
 *
 * Pure component — no Redux, no store.
 *
 * Delegates to ChatHeader, ChatMessageArea, and ChatInput sub-components.
 */
export function ChatShell({
  displayState,
  onDisplayStateChange,
  sidebarExpanded = false,
  title = 'AI Assistant',
  chatSummary,
  isLoading = false,
  unreadCount = 0,
  headerExtra,
  inputExtra,
  draftInput,
  onDraftChange,
  onSend,
  onInputFocus,
  placeholder = 'Ask me anything...',
  inputDisabled = false,
  disabledMessage,
  children,
  streamingContent,
}: ChatShellProps) {
  const messageAreaRef = useRef<ChatMessageAreaHandle>(null)
  const isExpanded = displayState === 'expanded'

  // Smooth scroll when expanding
  useEffect(() => {
    if (isExpanded) {
      messageAreaRef.current?.scrollToBottom(true)
    }
  }, [isExpanded])

  // Minimized: FAB button
  if (displayState === 'minimized') {
    return (
      <button
        className={`chat-shell-fab ${sidebarExpanded ? 'chat-shell-fab--sidebar' : ''}`}
        onClick={() => onDisplayStateChange('expanded')}
        aria-label="Open chat"
      >
        <Chat size={20} />
        {unreadCount > 0 && (
          <span className="chat-shell-fab__badge">{unreadCount}</span>
        )}
      </button>
    )
  }

  return (
    <div
      className={[
        'chat-shell',
        isExpanded ? 'chat-shell--expanded' : '',
        sidebarExpanded ? 'chat-shell--sidebar' : '',
      ].filter(Boolean).join(' ')}
      data-element="chat-window"
      data-state={displayState}
    >
      <ChatHeader
        displayState={displayState}
        onDisplayStateChange={onDisplayStateChange}
        title={title}
        chatSummary={chatSummary}
        isLoading={isLoading}
        unreadCount={unreadCount}
        headerExtra={headerExtra}
      />

      <ChatMessageArea
        ref={messageAreaRef}
        isExpanded={isExpanded}
        isLoading={isLoading}
        streamingContent={streamingContent}
      >
        {children}
      </ChatMessageArea>

      {(isExpanded || displayState === 'collapsed') && (
        <ChatInput
          mode={isExpanded ? 'expanded' : 'collapsed'}
          draftInput={draftInput}
          onDraftChange={onDraftChange}
          onSend={onSend}
          onInputFocus={onInputFocus}
          placeholder={placeholder}
          inputDisabled={inputDisabled}
          disabledMessage={disabledMessage}
          isLoading={isLoading}
          inputExtra={inputExtra}
        />
      )}
    </div>
  )
}
