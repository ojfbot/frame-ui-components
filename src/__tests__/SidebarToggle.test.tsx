import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SidebarToggle } from '../components/SidebarToggle'

describe('SidebarToggle', () => {
  it('renders with "Open conversations" label when collapsed', () => {
    render(<SidebarToggle isExpanded={false} onToggle={() => {}} />)
    expect(screen.getByLabelText('Open conversations')).toBeDefined()
  })

  it('renders with "Close conversations" label when expanded', () => {
    render(<SidebarToggle isExpanded={true} onToggle={() => {}} />)
    expect(screen.getByLabelText('Close conversations')).toBeDefined()
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<SidebarToggle isExpanded={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('has sidebar-toggle-btn class', () => {
    render(<SidebarToggle isExpanded={false} onToggle={() => {}} />)
    expect(screen.getByRole('button').className).toBe('sidebar-toggle-btn')
  })
})
