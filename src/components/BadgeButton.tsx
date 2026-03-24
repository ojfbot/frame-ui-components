import { Tag } from '@carbon/react'
import type { BadgeAction } from '../types/actions.js'
import '../styles/BadgeButton.css'

export interface BadgeButtonProps {
  badgeAction: BadgeAction
  /** Unified callback — receives the full badge action. */
  onExecute: (badgeAction: BadgeAction) => void
  className?: string
  size?: 'sm' | 'md'
}

export function BadgeButton({
  badgeAction,
  onExecute,
  className = '',
  size = 'md',
}: BadgeButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (badgeAction.disabled) return
    onExecute(badgeAction)
  }

  const carbonType = badgeAction.variant || 'purple'
  const dataElement = `badge-${badgeAction.label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <Tag
      type={carbonType}
      className={`badge-button ${size} ${badgeAction.disabled ? 'disabled' : ''} ${className}`}
      onClick={handleClick}
      title={badgeAction.tooltip}
      data-element={dataElement}
    >
      {badgeAction.icon && <span className="badge-icon">{badgeAction.icon}</span>}
      <span className="badge-label">{badgeAction.label}</span>
    </Tag>
  )
}
