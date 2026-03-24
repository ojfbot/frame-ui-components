import { useRef, useEffect, useCallback } from 'react'
import type { ReactNode, KeyboardEvent } from 'react'
import { Button, TextInput, TextArea, InlineLoading } from '@carbon/react'
import {
  Chat,
  Subtract,
  Minimize,
  SendFilled,
} from '@carbon/icons-react'
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
  const messagesRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isExpanded = displayState === 'expanded'
  const isCollapsed = displayState === 'collapsed'

  // Reliable auto-scroll using double RAF
  const scrollToBottom = useCallback((smooth = false) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (messagesRef.current) {
          const container = messagesRef.current
          if (smooth) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
          } else {
            container.scrollTop = container.scrollHeight
          }
        }
      })
    })
  }, [])

  // Auto-focus input and scroll when expanding
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => textAreaRef.current?.focus(), 100)
      scrollToBottom(true)
    }
  }, [isExpanded, scrollToBottom])

  // Auto-scroll when children change (new messages)
  useEffect(() => {
    if (isExpanded) scrollToBottom()
  })

  // Auto-scroll when streaming content changes
  useEffect(() => {
    if (isExpanded && streamingContent) scrollToBottom()
  }, [streamingContent, isExpanded, scrollToBottom])

  const handleSend = () => {
    const trimmed = draftInput.trim()
    if (!trimmed || inputDisabled || isLoading) return
    onSend(trimmed)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputFocus = () => {
    if (!isExpanded && onInputFocus) {
      onInputFocus()
    }
  }

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

  const displayTitle = chatSummary ? `${title} - ${chatSummary}` : title

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
      {/* Header */}
      <div
        className="chat-shell__header"
        onClick={isCollapsed ? () => onDisplayStateChange('expanded') : undefined}
        style={{ cursor: isCollapsed ? 'pointer' : 'default' }}
      >
        <div className="chat-shell__header-left">
          <Chat size={20} />
          <span className="chat-shell__title">{displayTitle}</span>
          {isCollapsed && isLoading && (
            <span className="chat-shell__spinner">
              <InlineLoading status="active" />
            </span>
          )}
          {isCollapsed && !isLoading && unreadCount > 0 && (
            <span className="chat-shell__unread">new</span>
          )}
          {headerExtra}
        </div>
        <div className="chat-shell__header-actions">
          {isExpanded && (
            <Button
              kind="ghost"
              size="sm"
              hasIconOnly
              iconDescription="Minimize"
              renderIcon={Subtract}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                onDisplayStateChange('minimized')
              }}
            />
          )}
          {isExpanded && (
            <Button
              kind="ghost"
              size="sm"
              hasIconOnly
              iconDescription="Collapse"
              renderIcon={Minimize}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                onDisplayStateChange('collapsed')
              }}
            />
          )}
        </div>
      </div>

      {/* Messages — only visible when expanded */}
      {isExpanded && (
        <>
          <div
            className="chat-shell__messages"
            ref={messagesRef}
            data-element="chat-messages"
          >
            {children}
            {streamingContent}
            {isLoading && !streamingContent && (
              <div className="chat-shell__thinking">
                <InlineLoading description="Thinking..." />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="chat-shell__input" data-element="condensed-chat-input-wrapper">
            {inputDisabled && disabledMessage ? (
              <p className="chat-shell__disabled-msg">{disabledMessage}</p>
            ) : (
              <div className="chat-shell__input-row">
                <div className="chat-shell__textarea">
                  <TextArea
                    ref={textAreaRef}
                    id="chat-shell-input"
                    labelText="Message"
                    hideLabel
                    placeholder={placeholder}
                    value={draftInput}
                    onChange={(e: any) => onDraftChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    rows={3}
                    disabled={inputDisabled}
                    data-element="chat-input"
                  />
                </div>
                <div className="chat-shell__input-actions">
                  {inputExtra}
                  <Button
                    kind="primary"
                    size="sm"
                    hasIconOnly
                    iconDescription="Send"
                    renderIcon={SendFilled}
                    onClick={handleSend}
                    disabled={!draftInput.trim() || inputDisabled || isLoading}
                    className="chat-shell__send"
                    data-element="chat-send-button"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Collapsed: single-line input */}
      {isCollapsed && (
        <div className="chat-shell__input" data-element="condensed-chat-input-wrapper">
          <div className="chat-shell__input-row">
            <TextInput
              ref={inputRef}
              id="chat-shell-collapsed-input"
              labelText=""
              hideLabel
              placeholder={placeholder}
              value={draftInput}
              onChange={(e: any) => onDraftChange(e.target.value)}
              onKeyDown={(e: any) => {
                if (e.key === 'Enter' && !isLoading) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              onFocus={handleInputFocus}
              disabled={inputDisabled}
              size="md"
              data-element="chat-input"
            />
            <Button
              kind="primary"
              size="sm"
              hasIconOnly
              iconDescription="Send"
              renderIcon={SendFilled}
              onClick={handleSend}
              disabled={!draftInput.trim() || inputDisabled || isLoading}
              className="chat-shell__send"
              data-element="chat-send-button"
            />
          </div>
        </div>
      )}
    </div>
  )
}
