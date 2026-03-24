import { useState } from 'react'
import { Button, SkeletonText, Modal } from '@carbon/react'
import { Add, Renew, Chat, TrashCan } from '@carbon/icons-react'
import '../styles/ThreadSidebar.css'

export interface ThreadItem {
  threadId: string
  title: string
  updatedAt: string
}

export interface ThreadSidebarProps {
  isExpanded: boolean
  onToggle: () => void
  threads: ThreadItem[]
  currentThreadId: string | null
  isLoading?: boolean
  isCreatingThread?: boolean
  onCreateThread: () => void
  onSelectThread: (threadId: string) => void
  onDeleteThread: (threadId: string) => void
  onRefresh?: () => void
  /** Custom date formatter. Defaults to relative time (e.g. "5m ago"). */
  formatDate?: (dateString: string) => string
  /** Sidebar title. Defaults to "Conversations". */
  title?: string
}

/** Default relative-time formatter. */
function defaultFormatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Pure presentational thread sidebar — no Redux, no store.
 * Each app wires this via a thin Connected wrapper.
 */
export function ThreadSidebar({
  isExpanded,
  onToggle,
  threads,
  currentThreadId,
  isLoading = false,
  isCreatingThread = false,
  onCreateThread,
  onSelectThread,
  onDeleteThread,
  onRefresh,
  formatDate = defaultFormatDate,
  title = 'Conversations',
}: ThreadSidebarProps) {
  const [hoveredThreadId, setHoveredThreadId] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null)

  const handleDeleteClick = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setThreadToDelete(threadId)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (threadToDelete) {
      onDeleteThread(threadToDelete)
      setDeleteModalOpen(false)
      setThreadToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteModalOpen(false)
    setThreadToDelete(null)
  }

  return (
    <>
      <div
        className={`thread-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
        {...(!isExpanded ? { inert: '' } : {})}
      >
        <div className="thread-sidebar-header">
          <h3 className="thread-sidebar-title">{title}</h3>
          <div className="thread-sidebar-actions">
            {onRefresh && (
              <Button
                kind="ghost"
                size="sm"
                hasIconOnly
                iconDescription="Refresh"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <Renew />
              </Button>
            )}
            <Button
              kind="primary"
              size="sm"
              hasIconOnly
              iconDescription="New conversation"
              onClick={onCreateThread}
              disabled={isCreatingThread}
            >
              <Add />
            </Button>
          </div>
        </div>

        <div className="thread-sidebar-content">
          {isLoading && threads.length === 0 ? (
            <div className="thread-sidebar-loading">
              <SkeletonText />
              <SkeletonText />
              <SkeletonText />
            </div>
          ) : threads.length === 0 ? (
            <div className="thread-sidebar-empty">
              <Chat size={48} className="empty-icon" />
              <p className="empty-message">No conversations yet</p>
              <Button
                kind="tertiary"
                size="sm"
                onClick={onCreateThread}
                disabled={isCreatingThread}
              >
                Start your first conversation
              </Button>
            </div>
          ) : (
            <div className="thread-list">
              {threads.map(thread => (
                <div
                  key={thread.threadId}
                  className={`thread-item ${currentThreadId === thread.threadId ? 'active' : ''}`}
                  onClick={() => onSelectThread(thread.threadId)}
                  onMouseEnter={() => setHoveredThreadId(thread.threadId)}
                  onMouseLeave={() => setHoveredThreadId(null)}
                >
                  <div className="thread-item-content">
                    <div className="thread-item-title">
                      {thread.title || 'Untitled conversation'}
                    </div>
                    <div className="thread-item-date">
                      {formatDate(thread.updatedAt)}
                    </div>
                  </div>
                  {hoveredThreadId === thread.threadId && (
                    <Button
                      kind="ghost"
                      size="sm"
                      hasIconOnly
                      iconDescription="Delete conversation"
                      onClick={(e: React.MouseEvent) => handleDeleteClick(thread.threadId, e)}
                      className="thread-item-delete"
                    >
                      <TrashCan />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="thread-sidebar-overlay" onClick={onToggle} />
      )}

      <Modal
        open={deleteModalOpen}
        onRequestClose={handleCancelDelete}
        onRequestSubmit={handleConfirmDelete}
        modalHeading="Delete conversation"
        modalLabel="Confirm action"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        danger
        size="sm"
      >
        <p>Are you sure you want to delete this conversation? This action cannot be undone.</p>
      </Modal>
    </>
  )
}
