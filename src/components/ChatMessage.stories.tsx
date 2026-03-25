import type { Meta, StoryObj } from '@storybook/react'
import { ChatMessage, MetadataLoadingIndicator } from './ChatMessage'
import { MarkdownMessage } from './MarkdownMessage'
import { createSimpleBadge } from '../types/actions'

const meta: Meta<typeof ChatMessage> = {
  title: 'Components/ChatMessage',
  component: ChatMessage,
}

export default meta
type Story = StoryObj<typeof ChatMessage>

export const UserMessage: Story = {
  args: {
    role: 'user',
    children: <span style={{ whiteSpace: 'pre-wrap' }}>Can you help me plan a trip to Berlin?</span>,
  },
}

export const AssistantPlainText: Story = {
  args: {
    role: 'assistant',
    children: <span>Sure! I can help you plan a trip to Berlin. What dates are you considering?</span>,
  },
}

export const AssistantWithMarkdown: Story = {
  render: () => (
    <ChatMessage role="assistant">
      <MarkdownMessage
        content={`Here are some suggestions for Berlin:

1. **Brandenburg Gate** — iconic landmark
2. **Museum Island** — UNESCO World Heritage site
3. **East Side Gallery** — longest remaining section of the Berlin Wall

> "Berlin is a city of contrasts." — Travel Guide

Would you like more details on any of these?`}
        suggestions={[
          createSimpleBadge('Hotels', 'Show me hotels near Brandenburg Gate', { variant: 'blue' }),
          createSimpleBadge('Flights', 'Find flights to Berlin', { variant: 'green' }),
        ]}
        compact
      />
    </ChatMessage>
  ),
}

export const StreamingMessage: Story = {
  args: {
    role: 'assistant',
    isStreaming: true,
    children: <span>Analyzing your resume and comparing it with the job requirements...</span>,
  },
}

export const CustomStreamingLabel: Story = {
  args: {
    role: 'assistant',
    isStreaming: true,
    streamingLabel: 'Generating...',
    children: <span>Building your itinerary for the next 5 days in Tokyo</span>,
  },
}

export const WithMetadataFooter: Story = {
  render: () => (
    <ChatMessage
      role="assistant"
      footer={<MetadataLoadingIndicator />}
    >
      <span>Here is your analysis. Loading additional suggestions...</span>
    </ChatMessage>
  ),
}

export const ConversationThread: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '600px' }}>
      <ChatMessage role="user">
        <span>Write a blog post about TypeScript best practices</span>
      </ChatMessage>
      <ChatMessage role="assistant">
        <MarkdownMessage
          content={`# TypeScript Best Practices

Here are some key practices:

- Use \`strict\` mode in \`tsconfig.json\`
- Prefer \`interface\` over \`type\` for object shapes
- Use \`unknown\` instead of \`any\`

\`\`\`typescript
// Good
function parse(input: unknown): Result {
  if (typeof input === 'string') {
    return JSON.parse(input)
  }
  throw new Error('Expected string')
}
\`\`\`

Would you like me to expand on any of these?`}
          compact
        />
      </ChatMessage>
      <ChatMessage role="user">
        <span>Yes, tell me more about strict mode</span>
      </ChatMessage>
      <ChatMessage role="assistant" isStreaming streamingLabel="Writing...">
        <span>Strict mode in TypeScript enables a set of type-checking flags that...</span>
      </ChatMessage>
    </div>
  ),
}
