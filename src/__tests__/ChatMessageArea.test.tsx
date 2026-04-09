import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { ChatMessageArea } from '../components/ChatMessageArea'
import type { ChatMessageAreaHandle } from '../components/ChatMessageArea'

// Mock requestAnimationFrame for scroll tests
beforeEach(() => {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(0)
    return 0
  })
})

describe('ChatMessageArea', () => {
  it('renders children when expanded', () => {
    render(
      <ChatMessageArea isExpanded>
        <div>Message 1</div>
      </ChatMessageArea>,
    )
    expect(screen.getByText('Message 1')).toBeInTheDocument()
  })

  it('renders nothing when not expanded', () => {
    const { container } = render(
      <ChatMessageArea isExpanded={false}>
        <div>Message 1</div>
      </ChatMessageArea>,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders streaming content', () => {
    render(
      <ChatMessageArea isExpanded streamingContent={<div>Streaming...</div>}>
        <div>Message 1</div>
      </ChatMessageArea>,
    )
    expect(screen.getByText('Streaming...')).toBeInTheDocument()
  })

  it('shows loading indicator when isLoading and no streaming content', () => {
    render(
      <ChatMessageArea isExpanded isLoading>
        <div>Message 1</div>
      </ChatMessageArea>,
    )
    expect(screen.getByText('Thinking...')).toBeInTheDocument()
  })

  it('hides loading indicator when streaming content is present', () => {
    render(
      <ChatMessageArea isExpanded isLoading streamingContent={<div>Stream</div>}>
        <div>Message 1</div>
      </ChatMessageArea>,
    )
    expect(screen.queryByText('Thinking...')).toBeNull()
  })

  it('exposes scrollToBottom via ref', () => {
    const ref = createRef<ChatMessageAreaHandle>()
    render(
      <ChatMessageArea ref={ref} isExpanded>
        <div>Message 1</div>
      </ChatMessageArea>,
    )
    expect(ref.current?.scrollToBottom).toBeDefined()
    expect(() => ref.current?.scrollToBottom()).not.toThrow()
  })

  it('sets data-element attribute', () => {
    const { container } = render(
      <ChatMessageArea isExpanded>
        <div>Message</div>
      </ChatMessageArea>,
    )
    expect(container.querySelector('[data-element="chat-messages"]')).toBeTruthy()
  })
})
