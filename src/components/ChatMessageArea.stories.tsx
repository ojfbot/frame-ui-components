import type { Meta, StoryObj } from '@storybook/react'
import { ChatMessageArea } from './ChatMessageArea'
import { ChatMessage } from './ChatMessage'
import { MarkdownMessage } from './MarkdownMessage'
import { InlineLoading } from '@carbon/react'
import '../styles/ChatShell.css'

const meta: Meta<typeof ChatMessageArea> = {
  title: 'Components/ChatMessageArea',
  component: ChatMessageArea,
  decorators: [
    (Story) => (
      <div style={{ width: 400, height: 400, background: 'var(--cds-layer-01, #262626)', borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ChatMessageArea>

export const WithMessages: Story = {
  args: {
    isExpanded: true,
    children: (
      <>
        <ChatMessage role="user">
          <span>Help me plan a trip to Berlin</span>
        </ChatMessage>
        <ChatMessage role="assistant">
          <MarkdownMessage content="I'd be happy to help plan your trip to Berlin! Here are some suggestions..." compact />
        </ChatMessage>
        <ChatMessage role="user">
          <span>What about restaurants?</span>
        </ChatMessage>
      </>
    ),
  },
}

export const WithStreamingContent: Story = {
  args: {
    isExpanded: true,
    children: (
      <ChatMessage role="user">
        <span>What is Module Federation?</span>
      </ChatMessage>
    ),
    streamingContent: (
      <ChatMessage role="assistant" isStreaming>
        <MarkdownMessage content="Module Federation is a webpack feature that allows..." compact />
      </ChatMessage>
    ),
  },
}

export const Loading: Story = {
  args: {
    isExpanded: true,
    isLoading: true,
    children: (
      <ChatMessage role="user">
        <span>Analyze this codebase</span>
      </ChatMessage>
    ),
  },
}

export const CollapsedHidden: Story = {
  name: 'Collapsed (hidden)',
  args: {
    isExpanded: false,
    children: <ChatMessage role="user"><span>This should not render</span></ChatMessage>,
  },
}
