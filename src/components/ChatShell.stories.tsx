import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ChatShell } from './ChatShell'
import type { ChatDisplayState } from './ChatShell'
import { ChatMessage } from './ChatMessage'
import { MarkdownMessage } from './MarkdownMessage'

const meta: Meta<typeof ChatShell> = {
  title: 'Components/ChatShell',
  component: ChatShell,
}

export default meta
type Story = StoryObj<typeof ChatShell>

function ChatShellDemo({ initialState = 'collapsed' as ChatDisplayState }) {
  const [displayState, setDisplayState] = useState<ChatDisplayState>(initialState)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hello! How can I help you today?' },
  ])

  const handleSend = (message: string) => {
    setMessages(prev => [
      ...prev,
      { role: 'user' ,content: message },
    ])
    setDraft('')
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'assistant' ,content: `You said: "${message}". This is a demo response.` },
      ])
    }, 500)
  }

  return (
    <div style={{ height: '600px', position: 'relative', background: '#262626' }}>
      <ChatShell
        displayState={displayState}
        onDisplayStateChange={setDisplayState}
        title="AI Assistant"
        draftInput={draft}
        onDraftChange={setDraft}
        onSend={handleSend}
        onInputFocus={() => { if (displayState !== 'expanded') setDisplayState('expanded') }}
        placeholder="Type a message..."
      >
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role}>
            {msg.role === 'user' ? (
              <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
            ) : (
              <MarkdownMessage content={msg.content} compact />
            )}
          </ChatMessage>
        ))}
      </ChatShell>
    </div>
  )
}

export const Collapsed: Story = {
  render: () => <ChatShellDemo initialState="collapsed" />,
}

export const Expanded: Story = {
  render: () => <ChatShellDemo initialState="expanded" />,
}

export const Minimized: Story = {
  render: () => <ChatShellDemo initialState="minimized" />,
}

export const WithLoadingState: Story = {
  render: () => (
    <div style={{ height: '400px', position: 'relative', background: '#262626' }}>
      <ChatShell
        displayState="expanded"
        onDisplayStateChange={() => {}}
        title="AI Assistant"
        isLoading
        draftInput=""
        onDraftChange={() => {}}
        onSend={() => {}}
        placeholder="Waiting for response..."
      >
        <ChatMessage role="user">
          <span>What is Module Federation?</span>
        </ChatMessage>
      </ChatShell>
    </div>
  ),
}

export const WithUnreadBadge: Story = {
  render: () => (
    <div style={{ height: '200px', position: 'relative', background: '#262626' }}>
      <ChatShell
        displayState="collapsed"
        onDisplayStateChange={() => {}}
        title="AI Assistant"
        unreadCount={3}
        draftInput=""
        onDraftChange={() => {}}
        onSend={() => {}}
      >
        {null}
      </ChatShell>
    </div>
  ),
}

export const WithSummary: Story = {
  render: () => (
    <div style={{ height: '200px', position: 'relative', background: '#262626' }}>
      <ChatShell
        displayState="collapsed"
        onDisplayStateChange={() => {}}
        title="AI Assistant"
        chatSummary="Analyzing resume..."
        isLoading
        draftInput=""
        onDraftChange={() => {}}
        onSend={() => {}}
      >
        {null}
      </ChatShell>
    </div>
  ),
}

export const DisabledInput: Story = {
  render: () => (
    <div style={{ height: '400px', position: 'relative', background: '#262626' }}>
      <ChatShell
        displayState="expanded"
        onDisplayStateChange={() => {}}
        title="AI Assistant"
        draftInput=""
        onDraftChange={() => {}}
        onSend={() => {}}
        inputDisabled
        disabledMessage="Chat is disabled while processing..."
      >
        <ChatMessage role="assistant">
          <span>Processing your request...</span>
        </ChatMessage>
      </ChatShell>
    </div>
  ),
}
