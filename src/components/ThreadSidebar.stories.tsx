import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ThreadSidebar } from './ThreadSidebar'
import type { ThreadItem } from './ThreadSidebar'

const meta: Meta<typeof ThreadSidebar> = {
  title: 'Components/ThreadSidebar',
  component: ThreadSidebar,
  argTypes: {
    onCreateThread: { action: 'createThread' },
    onSelectThread: { action: 'selectThread' },
    onDeleteThread: { action: 'deleteThread' },
    onToggle: { action: 'toggle' },
    onRefresh: { action: 'refresh' },
  },
}

export default meta
type Story = StoryObj<typeof ThreadSidebar>

const now = new Date()
const sampleThreads: ThreadItem[] = [
  { threadId: '1', title: 'Resume review session', updatedAt: new Date(now.getTime() - 5 * 60000).toISOString() },
  { threadId: '2', title: 'Berlin trip planning', updatedAt: new Date(now.getTime() - 2 * 3600000).toISOString() },
  { threadId: '3', title: 'Blog post draft', updatedAt: new Date(now.getTime() - 86400000).toISOString() },
  { threadId: '4', title: 'TypeScript migration', updatedAt: new Date(now.getTime() - 5 * 86400000).toISOString() },
]

export const Expanded: Story = {
  args: {
    isExpanded: true,
    threads: sampleThreads,
    currentThreadId: '1',
    title: 'Conversations',
  },
}

export const Collapsed: Story = {
  args: {
    isExpanded: false,
    threads: sampleThreads,
    currentThreadId: '1',
  },
}

export const Empty: Story = {
  args: {
    isExpanded: true,
    threads: [],
    currentThreadId: null,
  },
}

export const Loading: Story = {
  args: {
    isExpanded: true,
    threads: [],
    currentThreadId: null,
    isLoading: true,
  },
}

export const WithRefresh: Story = {
  args: {
    isExpanded: true,
    threads: sampleThreads,
    currentThreadId: '2',
    onRefresh: () => {},
  },
}

export const CustomTitle: Story = {
  args: {
    isExpanded: true,
    threads: sampleThreads,
    currentThreadId: '1',
    title: 'Study Sessions',
  },
}

export const Interactive: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(true)
    const [threads, setThreads] = useState<ThreadItem[]>(sampleThreads)
    const [activeId, setActiveId] = useState<string | null>('1')

    return (
      <div style={{ height: '500px', position: 'relative' }}>
        <ThreadSidebar
          isExpanded={expanded}
          onToggle={() => setExpanded(!expanded)}
          threads={threads}
          currentThreadId={activeId}
          title="Conversations"
          onCreateThread={() => {
            const id = crypto.randomUUID()
            setThreads(prev => [
              { threadId: id, title: `New conversation`, updatedAt: new Date().toISOString() },
              ...prev,
            ])
            setActiveId(id)
          }}
          onSelectThread={setActiveId}
          onDeleteThread={(id) => {
            setThreads(prev => prev.filter(t => t.threadId !== id))
            if (activeId === id) setActiveId(null)
          }}
          onRefresh={() => {}}
        />
      </div>
    )
  },
}
