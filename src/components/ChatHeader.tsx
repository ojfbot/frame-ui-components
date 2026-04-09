import type { ReactNode, MouseEvent } from 'react'
import { Button, InlineLoading } from '@carbon/react'
import { Chat, Subtract, Minimize } from '@carbon/icons-react'
import type { ChatDisplayState } from './ChatShell'

export interface ChatHeaderProps {
  displayState: ChatDisplayState
  onDisplayStateChange: (state: ChatDisplayState) => void
  title: string
  chatSummary?: string
  isLoading?: boolean
  unreadCount?: number
  headerExtra?: ReactNode
}

export function ChatHeader({
  displayState,
  onDisplayStateChange,
  title,
  chatSummary,
  isLoading = false,
  unreadCount = 0,
  headerExtra,
}: ChatHeaderProps) {
  const isExpanded = displayState === 'expanded'
  const isCollapsed = displayState === 'collapsed'
  const displayTitle = chatSummary ? `${title} - ${chatSummary}` : title

  return (
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
            onClick={(e: MouseEvent) => {
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
            onClick={(e: MouseEvent) => {
              e.stopPropagation()
              onDisplayStateChange('collapsed')
            }}
          />
        )}
      </div>
    </div>
  )
}
