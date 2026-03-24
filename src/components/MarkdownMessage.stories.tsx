import type { Meta, StoryObj } from '@storybook/react'
import { MarkdownMessage } from './MarkdownMessage'
import { createSimpleBadge, createBadgeAction, createChatAction, createNavigateAction } from '../types/actions'

const meta: Meta<typeof MarkdownMessage> = {
  title: 'Components/MarkdownMessage',
  component: MarkdownMessage,
  argTypes: {
    onExecute: { action: 'executed' },
  },
}

export default meta
type Story = StoryObj<typeof MarkdownMessage>

export const PlainText: Story = {
  args: {
    content: 'Here is a simple response from the agent. Nothing fancy.',
  },
}

export const RichMarkdown: Story = {
  args: {
    content: `# Agent Response

Here's what I found:

## Key Findings

1. **First item** — important detail
2. **Second item** — another detail
3. *Third item* — less critical

> This is a quoted section from the source material.

### Code Example

\`\`\`typescript
const result = await agent.classify(message)
\`\`\`

Inline \`code\` works too.

---

| Feature | Status | Priority |
|---------|--------|----------|
| Routing | Done | P0 |
| Threads | In Progress | P1 |
| Badges | Planned | P2 |

[Learn more](https://example.com)`,
  },
}

export const WithSuggestions: Story = {
  args: {
    content: 'I can help you with several things. What would you like to do?',
    suggestions: [
      createSimpleBadge('Write Post', 'Write a new blog post', { variant: 'purple' }),
      createSimpleBadge('Edit Draft', 'Edit my current draft', { variant: 'blue' }),
      createSimpleBadge('Publish', 'Publish to production', { variant: 'green' }),
    ],
  },
}

export const WithActionLinks: Story = {
  args: {
    content: `Here are some actions you can take:

- [Write Blog Post](action:write-blog-post)
- [Update Resume](action:update-resume)
- [Plan Trip](action:plan-trip-berlin)`,
  },
}

export const WithUploadLinks: Story = {
  args: {
    content: `Upload your resume to get started:

- [Click here](upload:.pdf,.docx) to browse files
- Or drag and drop a file into the chat`,
  },
}

export const WithRichSuggestions: Story = {
  args: {
    content: 'Here are your options:',
    suggestions: [
      createBadgeAction('Add Experience', [createNavigateAction('bio')], { icon: '👤', variant: 'purple' }),
      createBadgeAction('Analyze Job', [createNavigateAction('jobs'), createChatAction('Analyze this listing')], { icon: '🔍', variant: 'cyan' }),
      createSimpleBadge('Generate Resume', 'Generate a professional resume', { icon: '📄', variant: 'green' }),
    ],
  },
}

export const Compact: Story = {
  args: {
    content: 'A short compact message with `inline code` and **bold text**.',
    compact: true,
  },
}

export const Empty: Story = {
  args: {
    content: '',
  },
}
