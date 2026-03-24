import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatMessage, MetadataLoadingIndicator } from '../components/ChatMessage'

describe('ChatMessage', () => {
  it('renders user message with "You" header', () => {
    render(<ChatMessage role="user">Hello</ChatMessage>)
    expect(screen.getByText('You')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders assistant message with "Assistant" header', () => {
    render(<ChatMessage role="assistant">Response</ChatMessage>)
    expect(screen.getByText('Assistant')).toBeInTheDocument()
    expect(screen.getByText('Response')).toBeInTheDocument()
  })

  it('applies role-based CSS class', () => {
    const { container } = render(<ChatMessage role="user">Hi</ChatMessage>)
    expect(container.querySelector('.chat-message--user')).toBeTruthy()
  })

  it('shows streaming label when isStreaming', () => {
    render(
      <ChatMessage role="assistant" isStreaming streamingLabel="Generating...">
        Partial content
      </ChatMessage>,
    )
    expect(screen.getByText('Generating...')).toBeInTheDocument()
  })

  it('uses default streaming label', () => {
    render(
      <ChatMessage role="assistant" isStreaming>
        Content
      </ChatMessage>,
    )
    expect(screen.getByText('Typing...')).toBeInTheDocument()
  })

  it('renders footer content', () => {
    render(
      <ChatMessage role="assistant" footer={<div>Footer content</div>}>
        Body
      </ChatMessage>,
    )
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('applies streaming CSS class', () => {
    const { container } = render(
      <ChatMessage role="assistant" isStreaming>Content</ChatMessage>,
    )
    expect(container.querySelector('.chat-message--streaming')).toBeTruthy()
  })
})

describe('MetadataLoadingIndicator', () => {
  it('renders loading indicator', () => {
    render(<MetadataLoadingIndicator />)
    expect(screen.getByText('Loading suggestions...')).toBeInTheDocument()
  })
})
