import { Chat, Close } from '@carbon/icons-react'

export interface SidebarToggleProps {
  isExpanded: boolean
  onToggle: () => void
}

/**
 * Standardized sidebar toggle button for DashboardLayout headers.
 * Uses Chat/Close icons from Carbon. Styled via `.sidebar-toggle-btn`
 * in DashboardLayout.css.
 */
export function SidebarToggle({ isExpanded, onToggle }: SidebarToggleProps) {
  return (
    <button
      className="sidebar-toggle-btn"
      onClick={onToggle}
      aria-label={isExpanded ? 'Close conversations' : 'Open conversations'}
    >
      {isExpanded ? <Close size={20} /> : <Chat size={20} />}
    </button>
  )
}
