import { Tag } from '@carbon/react'
import '../styles/BadgeButton.css'

export interface BadgeAction {
  label: string
  icon?: string
  message: string
  disabled?: boolean
  variant?: 'purple' | 'blue' | 'cyan' | 'teal' | 'green' | 'gray' | 'red' | 'magenta'
}

export interface BadgeButtonProps {
  badgeAction: BadgeAction
  onExecute: (message: string) => void
  className?: string
  size?: 'sm' | 'md'
}

export function BadgeButton({ badgeAction, onExecute, className = '', size = 'md' }: BadgeButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (badgeAction.disabled) return
    onExecute(badgeAction.message)
  }

  const carbonType = badgeAction.variant || 'purple'
  const dataElement = `badge-${badgeAction.label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <Tag
      type={carbonType}
      className={`badge-button ${size} ${badgeAction.disabled ? 'disabled' : ''} ${className}`}
      onClick={handleClick}
      data-element={dataElement}
    >
      {badgeAction.icon && <span className="badge-icon">{badgeAction.icon}</span>}
      <span className="badge-label">{badgeAction.label}</span>
    </Tag>
  )
}
