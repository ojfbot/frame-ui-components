import type { ReactNode } from 'react'
import '../styles/DashboardLayout.css'

export interface DashboardLayoutProps {
  /** True when mounted inside the Frame shell host. */
  shellMode?: boolean
  /** True when the thread/sessions sidebar is open. */
  sidebarExpanded?: boolean
  /** True when CondensedChat is in expanded state. */
  chatExpanded?: boolean
  children: ReactNode
  className?: string
}

export interface DashboardHeaderProps {
  children: ReactNode
  className?: string
}

/**
 * Shared dashboard layout wrapper — replaces the duplicated
 * .dashboard-wrapper / .shell-mode / .with-sidebar CSS pattern
 * across all Frame sub-apps.
 *
 * Usage:
 *   <DashboardLayout shellMode={shellMode} sidebarExpanded={sidebarOpen}>
 *     <DashboardLayout.Header>
 *       <Heading>My Dashboard</Heading>
 *       <button onClick={toggle}>...</button>
 *     </DashboardLayout.Header>
 *     <Tabs>...</Tabs>
 *   </DashboardLayout>
 */
export function DashboardLayout({
  shellMode = false,
  sidebarExpanded = false,
  chatExpanded = false,
  children,
  className = '',
}: DashboardLayoutProps) {
  const classes = [
    'frame-dashboard',
    shellMode ? 'frame-dashboard--shell' : '',
    sidebarExpanded ? 'frame-dashboard--sidebar' : '',
    chatExpanded ? 'frame-dashboard--chat-expanded' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} data-element="app-container">
      {children}
    </div>
  )
}

function Header({ children, className = '' }: DashboardHeaderProps) {
  return (
    <div className={`frame-dashboard__header ${className}`}>
      {children}
    </div>
  )
}

DashboardLayout.Header = Header
