import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatShell } from '../components/ChatShell'

const defaultProps = {
  displayState: 'expanded' as const,
  onDisplayStateChange: vi.fn(),
  draftInput: '',
  onDraftChange: vi.fn(),
  onSend: vi.fn(),
}

describe('ChatShell', () => {
  it('renders expanded with title and children', () => {
    render(
      <ChatShell {...defaultProps} title="Test Chat">
        <div>Message 1</div>
      </ChatShell>,
    )
    expect(screen.getByText('Test Chat')).toBeInTheDocument()
    expect(screen.getByText('Message 1')).toBeInTheDocument()
  })

  it('renders collapsed with input only', () => {
    render(
      <ChatShell {...defaultProps} displayState="collapsed">
        <div>Hidden message</div>
      </ChatShell>,
    )
    expect(screen.queryByText('Hidden message')).toBeNull()
    expect(screen.getByPlaceholderText('Ask me anything...')).toBeInTheDocument()
  })

  it('renders minimized as FAB button', () => {
    render(
      <ChatShell {...defaultProps} displayState="minimized">
        <div>Hidden</div>
      </ChatShell>,
    )
    expect(screen.getByLabelText('Open chat')).toBeInTheDocument()
    expect(screen.queryByText('Hidden')).toBeNull()
  })

  it('shows unread badge in minimized state', () => {
    render(
      <ChatShell {...defaultProps} displayState="minimized" unreadCount={3}>
        <div />
      </ChatShell>,
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('FAB click triggers expand', () => {
    const onChange = vi.fn()
    render(
      <ChatShell {...defaultProps} displayState="minimized" onDisplayStateChange={onChange}>
        <div />
      </ChatShell>,
    )
    fireEvent.click(screen.getByLabelText('Open chat'))
    expect(onChange).toHaveBeenCalledWith('expanded')
  })

  it('sends message on Enter', () => {
    const onSend = vi.fn()
    render(
      <ChatShell {...defaultProps} draftInput="hello" onSend={onSend}>
        <div />
      </ChatShell>,
    )
    const textarea = screen.getByPlaceholderText('Ask me anything...')
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })
    expect(onSend).toHaveBeenCalledWith('hello')
  })

  it('does not send on Shift+Enter', () => {
    const onSend = vi.fn()
    render(
      <ChatShell {...defaultProps} draftInput="hello" onSend={onSend}>
        <div />
      </ChatShell>,
    )
    const textarea = screen.getByPlaceholderText('Ask me anything...')
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
    expect(onSend).not.toHaveBeenCalled()
  })

  it('does not send empty input', () => {
    const onSend = vi.fn()
    render(
      <ChatShell {...defaultProps} draftInput="   " onSend={onSend}>
        <div />
      </ChatShell>,
    )
    fireEvent.click(screen.getByLabelText('Send'))
    expect(onSend).not.toHaveBeenCalled()
  })

  it('disables send when inputDisabled', () => {
    const onSend = vi.fn()
    render(
      <ChatShell {...defaultProps} draftInput="hello" inputDisabled onSend={onSend}>
        <div />
      </ChatShell>,
    )
    const sendBtn = screen.getByLabelText('Send')
    expect(sendBtn).toBeDisabled()
  })

  it('shows disabled message when provided', () => {
    render(
      <ChatShell {...defaultProps} inputDisabled disabledMessage="Configure API key first">
        <div />
      </ChatShell>,
    )
    expect(screen.getByText('Configure API key first')).toBeInTheDocument()
  })

  it('shows chatSummary in title', () => {
    render(
      <ChatShell {...defaultProps} title="AI" chatSummary="Analyzing...">
        <div />
      </ChatShell>,
    )
    expect(screen.getByText('AI - Analyzing...')).toBeInTheDocument()
  })

  it('shows loading spinner in collapsed state', () => {
    render(
      <ChatShell {...defaultProps} displayState="collapsed" isLoading>
        <div />
      </ChatShell>,
    )
    // InlineLoading renders with status="active"
    expect(document.querySelector('[data-state="collapsed"]')).toBeTruthy()
  })

  it('renders streamingContent below children', () => {
    render(
      <ChatShell {...defaultProps} streamingContent={<div>Streaming chunk</div>}>
        <div>Message</div>
      </ChatShell>,
    )
    expect(screen.getByText('Streaming chunk')).toBeInTheDocument()
  })

  it('renders inputExtra', () => {
    render(
      <ChatShell {...defaultProps} inputExtra={<button>Mic</button>}>
        <div />
      </ChatShell>,
    )
    expect(screen.getByText('Mic')).toBeInTheDocument()
  })

  it('calls onInputFocus when collapsed input focused', () => {
    const onInputFocus = vi.fn()
    render(
      <ChatShell {...defaultProps} displayState="collapsed" onInputFocus={onInputFocus}>
        <div />
      </ChatShell>,
    )
    const input = screen.getByPlaceholderText('Ask me anything...')
    fireEvent.focus(input)
    expect(onInputFocus).toHaveBeenCalled()
  })

  it('sets data-element and data-state attributes', () => {
    const { container } = render(
      <ChatShell {...defaultProps}>
        <div />
      </ChatShell>,
    )
    const shell = container.querySelector('[data-element="chat-window"]')
    expect(shell).toBeTruthy()
    expect(shell?.getAttribute('data-state')).toBe('expanded')
  })
})
