import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatHeader } from '../components/ChatHeader'

const defaultProps = {
  displayState: 'expanded' as const,
  onDisplayStateChange: vi.fn(),
  title: 'Test Chat',
}

describe('ChatHeader', () => {
  it('renders title', () => {
    render(<ChatHeader {...defaultProps} />)
    expect(screen.getByText('Test Chat')).toBeInTheDocument()
  })

  it('renders title with chatSummary', () => {
    render(<ChatHeader {...defaultProps} chatSummary="Analyzing..." />)
    expect(screen.getByText('Test Chat - Analyzing...')).toBeInTheDocument()
  })

  it('shows minimize and collapse buttons when expanded', () => {
    render(<ChatHeader {...defaultProps} />)
    expect(screen.getByLabelText('Minimize')).toBeInTheDocument()
    expect(screen.getByLabelText('Collapse')).toBeInTheDocument()
  })

  it('hides action buttons when collapsed', () => {
    render(<ChatHeader {...defaultProps} displayState="collapsed" />)
    expect(screen.queryByLabelText('Minimize')).toBeNull()
    expect(screen.queryByLabelText('Collapse')).toBeNull()
  })

  it('calls onDisplayStateChange("minimized") on minimize click', () => {
    const onChange = vi.fn()
    render(<ChatHeader {...defaultProps} onDisplayStateChange={onChange} />)
    fireEvent.click(screen.getByLabelText('Minimize'))
    expect(onChange).toHaveBeenCalledWith('minimized')
  })

  it('calls onDisplayStateChange("collapsed") on collapse click', () => {
    const onChange = vi.fn()
    render(<ChatHeader {...defaultProps} onDisplayStateChange={onChange} />)
    fireEvent.click(screen.getByLabelText('Collapse'))
    expect(onChange).toHaveBeenCalledWith('collapsed')
  })

  it('expands on header click when collapsed', () => {
    const onChange = vi.fn()
    render(<ChatHeader {...defaultProps} displayState="collapsed" onDisplayStateChange={onChange} />)
    fireEvent.click(screen.getByText('Test Chat'))
    expect(onChange).toHaveBeenCalledWith('expanded')
  })

  it('shows loading spinner when collapsed and isLoading', () => {
    const { container } = render(
      <ChatHeader {...defaultProps} displayState="collapsed" isLoading />,
    )
    expect(container.querySelector('.chat-shell__spinner')).toBeTruthy()
  })

  it('shows unread indicator when collapsed with unread messages', () => {
    render(<ChatHeader {...defaultProps} displayState="collapsed" unreadCount={2} />)
    expect(screen.getByText('new')).toBeInTheDocument()
  })

  it('does not show unread when loading', () => {
    render(<ChatHeader {...defaultProps} displayState="collapsed" isLoading unreadCount={2} />)
    expect(screen.queryByText('new')).toBeNull()
  })

  it('renders headerExtra content', () => {
    render(<ChatHeader {...defaultProps} headerExtra={<span>Extra</span>} />)
    expect(screen.getByText('Extra')).toBeInTheDocument()
  })
})
