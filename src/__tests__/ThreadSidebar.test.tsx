import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThreadSidebar } from '../components/ThreadSidebar'
import type { ThreadItem } from '../components/ThreadSidebar'

const threads: ThreadItem[] = [
  { threadId: '1', title: 'Resume Review', updatedAt: new Date().toISOString() },
  { threadId: '2', title: 'Job Analysis', updatedAt: new Date(Date.now() - 3600000).toISOString() },
]

const defaultProps = {
  isExpanded: true,
  onToggle: vi.fn(),
  threads,
  currentThreadId: '1',
  onCreateThread: vi.fn(),
  onSelectThread: vi.fn(),
  onDeleteThread: vi.fn(),
}

describe('ThreadSidebar', () => {
  it('renders thread titles', () => {
    render(<ThreadSidebar {...defaultProps} />)
    expect(screen.getByText('Resume Review')).toBeInTheDocument()
    expect(screen.getByText('Job Analysis')).toBeInTheDocument()
  })

  it('renders custom title', () => {
    render(<ThreadSidebar {...defaultProps} title="Sessions" />)
    expect(screen.getByText('Sessions')).toBeInTheDocument()
  })

  it('highlights active thread', () => {
    const { container } = render(<ThreadSidebar {...defaultProps} />)
    const active = container.querySelector('.thread-item.active')
    expect(active).toBeTruthy()
    expect(active?.textContent).toContain('Resume Review')
  })

  it('calls onSelectThread on click', () => {
    const onSelect = vi.fn()
    render(<ThreadSidebar {...defaultProps} onSelectThread={onSelect} />)
    fireEvent.click(screen.getByText('Job Analysis'))
    expect(onSelect).toHaveBeenCalledWith('2')
  })

  it('shows empty state when no threads', () => {
    render(<ThreadSidebar {...defaultProps} threads={[]} />)
    expect(screen.getByText('No conversations yet')).toBeInTheDocument()
    expect(screen.getByText('Start your first conversation')).toBeInTheDocument()
  })

  it('shows loading skeleton when loading with no threads', () => {
    const { container } = render(
      <ThreadSidebar {...defaultProps} threads={[]} isLoading />,
    )
    expect(container.querySelector('.thread-sidebar-loading')).toBeTruthy()
  })

  it('calls onCreateThread', () => {
    const onCreate = vi.fn()
    render(<ThreadSidebar {...defaultProps} onCreateThread={onCreate} />)
    fireEvent.click(screen.getByLabelText('New conversation'))
    expect(onCreate).toHaveBeenCalledOnce()
  })

  it('shows delete button on hover and opens confirmation modal', () => {
    render(<ThreadSidebar {...defaultProps} />)
    const threadItem = screen.getByText('Resume Review').closest('.thread-item')!

    // Hover to reveal delete button
    fireEvent.mouseEnter(threadItem)
    const deleteBtn = screen.getByLabelText('Delete conversation')
    fireEvent.click(deleteBtn)

    // Modal should open — "Delete conversation" appears in both tooltip and modal heading
    expect(screen.getByText(/Are you sure/)).toBeInTheDocument()
    // Modal heading uses role="heading"
    expect(screen.getByRole('heading', { name: 'Delete conversation' })).toBeInTheDocument()
  })

  it('confirms delete', () => {
    const onDelete = vi.fn()
    render(<ThreadSidebar {...defaultProps} onDeleteThread={onDelete} />)

    // Hover + click delete
    const threadItem = screen.getByText('Resume Review').closest('.thread-item')!
    fireEvent.mouseEnter(threadItem)
    fireEvent.click(screen.getByLabelText('Delete conversation'))

    // Confirm
    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('renders refresh button when onRefresh provided', () => {
    const onRefresh = vi.fn()
    render(<ThreadSidebar {...defaultProps} onRefresh={onRefresh} />)
    const refreshBtn = screen.getByLabelText('Refresh')
    fireEvent.click(refreshBtn)
    expect(onRefresh).toHaveBeenCalledOnce()
  })

  it('uses custom date formatter', () => {
    const formatter = (s: string) => `custom: ${s.slice(0, 4)}`
    render(<ThreadSidebar {...defaultProps} formatDate={formatter} />)
    // Both threads show custom-formatted dates
    const dateElements = screen.getAllByText(/^custom: \d{4}$/)
    expect(dateElements.length).toBe(2)
  })

  it('renders overlay when expanded', () => {
    const { container } = render(<ThreadSidebar {...defaultProps} isExpanded />)
    expect(container.querySelector('.thread-sidebar-overlay')).toBeTruthy()
  })

  it('overlay click calls onToggle', () => {
    const onToggle = vi.fn()
    const { container } = render(<ThreadSidebar {...defaultProps} onToggle={onToggle} />)
    fireEvent.click(container.querySelector('.thread-sidebar-overlay')!)
    expect(onToggle).toHaveBeenCalledOnce()
  })
})
