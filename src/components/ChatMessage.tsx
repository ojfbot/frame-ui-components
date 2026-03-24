import type { ReactNode } from 'react'
import { Tile, InlineLoading } from '@carbon/react'

export interface ChatMessageProps {
  role: 'user' | 'assistant'
  /** Content — use MarkdownMessage for rich rendering, or plain text. */
  children: ReactNode
  isStreaming?: boolean
  /** Label shown next to role when streaming. Defaults to "Typing...". */
  streamingLabel?: string
  /** Extra content after message body (e.g. metadata loading indicator). */
  footer?: ReactNode
}

/**
 * Single chat message tile. Pure presentational.
 * Uses Carbon Tile for consistent elevation and spacing.
 */
export function ChatMessage({
  role,
  children,
  isStreaming = false,
  streamingLabel = 'Typing...',
  footer,
}: ChatMessageProps) {
  return (
    <Tile
      className={[
        'chat-message',
        `chat-message--${role}`,
        isStreaming ? 'chat-message--streaming' : '',
      ].filter(Boolean).join(' ')}
    >
      <div className="chat-message__header">
        <strong className="chat-message__role">
          {role === 'user' ? 'You' : 'Assistant'}
        </strong>
        {isStreaming && (
          <span className="chat-message__streaming-label">{streamingLabel}</span>
        )}
      </div>
      <div className="chat-message__content">{children}</div>
      {footer}
    </Tile>
  )
}

/**
 * Metadata loading indicator — shown when agent response metadata is streaming.
 */
export function MetadataLoadingIndicator() {
  return (
    <div className="chat-message__metadata-loading">
      <InlineLoading
        description="Loading suggestions..."
        status="active"
        aria-live="polite"
        aria-label="Loading action suggestions"
      />
    </div>
  )
}
