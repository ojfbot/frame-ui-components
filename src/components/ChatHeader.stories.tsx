import type { Meta, StoryObj } from '@storybook/react'
import { ChatHeader } from './ChatHeader'

const meta: Meta<typeof ChatHeader> = {
  title: 'Components/ChatHeader',
  component: ChatHeader,
  decorators: [
    (Story) => (
      <div style={{ width: 400, background: 'var(--cds-layer-01, #262626)', borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ChatHeader>

export const Collapsed: Story = {
  args: {
    displayState: 'collapsed',
    onDisplayStateChange: () => {},
    title: 'AI Assistant',
  },
}

export const Expanded: Story = {
  args: {
    displayState: 'expanded',
    onDisplayStateChange: () => {},
    title: 'AI Assistant',
  },
}

export const WithSummary: Story = {
  args: {
    displayState: 'collapsed',
    onDisplayStateChange: () => {},
    title: 'AI Assistant',
    chatSummary: 'Analyzing resume...',
  },
}

export const Loading: Story = {
  args: {
    displayState: 'collapsed',
    onDisplayStateChange: () => {},
    title: 'AI Assistant',
    isLoading: true,
  },
}

export const WithUnread: Story = {
  args: {
    displayState: 'collapsed',
    onDisplayStateChange: () => {},
    title: 'AI Assistant',
    unreadCount: 3,
  },
}
