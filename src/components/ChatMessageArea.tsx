import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import type { ReactNode } from 'react'
import { InlineLoading } from '@carbon/react'

export interface ChatMessageAreaProps {
  isExpanded: boolean
  isLoading?: boolean
  children: ReactNode
  streamingContent?: ReactNode
}

export interface ChatMessageAreaHandle {
  scrollToBottom: (smooth?: boolean) => void
}

export const ChatMessageArea = forwardRef<ChatMessageAreaHandle, ChatMessageAreaProps>(
  function ChatMessageArea({ isExpanded, isLoading = false, children, streamingContent }, ref) {
    const messagesRef = useRef<HTMLDivElement>(null)

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

    useImperativeHandle(ref, () => ({ scrollToBottom }), [scrollToBottom])

    // Auto-scroll when children change (new messages)
    useEffect(() => {
      if (isExpanded) scrollToBottom()
    })

    // Auto-scroll when streaming content changes
    useEffect(() => {
      if (isExpanded && streamingContent) scrollToBottom()
    }, [streamingContent, isExpanded, scrollToBottom])

    if (!isExpanded) return null

    return (
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
    )
  },
)
