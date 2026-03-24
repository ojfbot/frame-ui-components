import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BadgeButton } from '../components/BadgeButton'
import { createSimpleBadge, createBadgeAction, createNavigateAction } from '../types/actions'

describe('BadgeButton', () => {
  it('renders label and icon', () => {
    const badge = createSimpleBadge('Test Label', 'msg', { icon: '🔬' })
    render(<BadgeButton badgeAction={badge} onExecute={() => {}} />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('🔬')).toBeInTheDocument()
  })

  it('calls onExecute with the full badge action on click', () => {
    const onExecute = vi.fn()
    const badge = createSimpleBadge('Click Me', 'hello')
    render(<BadgeButton badgeAction={badge} onExecute={onExecute} />)

    fireEvent.click(screen.getByText('Click Me'))
    expect(onExecute).toHaveBeenCalledOnce()
    expect(onExecute).toHaveBeenCalledWith(badge)
  })

  it('does not fire when disabled', () => {
    const onExecute = vi.fn()
    const badge = createBadgeAction('Disabled', [createNavigateAction('bio')], { disabled: true })
    render(<BadgeButton badgeAction={badge} onExecute={onExecute} />)

    fireEvent.click(screen.getByText('Disabled'))
    expect(onExecute).not.toHaveBeenCalled()
  })

  it('sets data-element attribute from label', () => {
    const badge = createSimpleBadge('View Jobs', 'msg')
    const { container } = render(<BadgeButton badgeAction={badge} onExecute={() => {}} />)
    expect(container.querySelector('[data-element="badge-view-jobs"]')).toBeTruthy()
  })

  it('applies size class', () => {
    const badge = createSimpleBadge('Small', 'msg')
    const { container } = render(<BadgeButton badgeAction={badge} onExecute={() => {}} size="sm" />)
    expect(container.querySelector('.sm')).toBeTruthy()
  })

  it('stops event propagation on click', () => {
    const parentClick = vi.fn()
    const badge = createSimpleBadge('Inner', 'msg')
    render(
      <div onClick={parentClick}>
        <BadgeButton badgeAction={badge} onExecute={() => {}} />
      </div>,
    )
    fireEvent.click(screen.getByText('Inner'))
    expect(parentClick).not.toHaveBeenCalled()
  })
})
