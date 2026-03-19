import type { Meta, StoryObj } from '@storybook/react'
import { MarkdownMessage } from './MarkdownMessage'
import type { BadgeAction } from './BadgeButton'

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
      { label: 'Write Post', message: 'Write a new blog post', variant: 'purple' },
      { label: 'Edit Draft', message: 'Edit my current draft', variant: 'blue' },
      { label: 'Publish', message: 'Publish to production', variant: 'green' },
    ] satisfies BadgeAction[],
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
