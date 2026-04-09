import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ChatInput } from './ChatInput'
import '../styles/ChatShell.css'

const meta: Meta<typeof ChatInput> = {
  title: 'Components/ChatInput',
  component: ChatInput,
  decorators: [
    (Story) => (
      <div style={{ width: 400, background: 'var(--cds-layer-01, #262626)', borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ChatInput>

function InteractiveChatInput({ mode }: { mode: 'expanded' | 'collapsed' }) {
  const [draft, setDraft] = useState('')
  return (
    <ChatInput
      mode={mode}
      draftInput={draft}
      onDraftChange={setDraft}
      onSend={(msg) => { setDraft(''); console.log('sent:', msg) }}
      placeholder="Type a message..."
    />
  )
}

export const ExpandedMode: Story = {
  render: () => <InteractiveChatInput mode="expanded" />,
}

export const CollapsedMode: Story = {
  render: () => <InteractiveChatInput mode="collapsed" />,
}

export const Disabled: Story = {
  args: {
    mode: 'expanded',
    draftInput: '',
    onDraftChange: () => {},
    onSend: () => {},
    inputDisabled: true,
    disabledMessage: 'Chat is disabled while processing...',
  },
}

export const WithDraft: Story = {
  args: {
    mode: 'expanded',
    draftInput: 'Hello, I need help with my resume',
    onDraftChange: () => {},
    onSend: () => {},
  },
}
