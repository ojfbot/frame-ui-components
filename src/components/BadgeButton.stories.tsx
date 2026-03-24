import type { Meta, StoryObj } from '@storybook/react'
import { BadgeButton } from './BadgeButton'
import { createSimpleBadge, createBadgeAction, createChatAction, createNavigateAction } from '../types/actions'
import type { BadgeAction } from '../types/actions'

const meta: Meta<typeof BadgeButton> = {
  title: 'Components/BadgeButton',
  component: BadgeButton,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
    onExecute: { action: 'executed' },
  },
}

export default meta
type Story = StoryObj<typeof BadgeButton>

const baseBadge: BadgeAction = createSimpleBadge(
  'Write Blog Post',
  'Write a new blog post about React patterns',
  { variant: 'purple' },
)

export const Default: Story = {
  args: { badgeAction: baseBadge },
}

export const WithIcon: Story = {
  args: {
    badgeAction: createSimpleBadge('Draft Resume', 'Draft a new resume', { icon: '\u{1F4DD}' }),
  },
}

export const Small: Story = {
  args: { badgeAction: baseBadge, size: 'sm' },
}

export const Disabled: Story = {
  args: {
    badgeAction: createSimpleBadge('Disabled', 'This is disabled', { disabled: true }),
  },
}

export const RichAction: Story = {
  args: {
    badgeAction: createBadgeAction(
      'Analyze Job',
      [createNavigateAction('jobs'), createChatAction('Analyze this job listing')],
      { icon: '🔍', variant: 'cyan' },
    ),
  },
}

export const AllVariants: Story = {
  render: (args) => {
    const variants = ['purple', 'blue', 'cyan', 'teal', 'green', 'gray', 'red', 'magenta'] as const
    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {variants.map((variant) => (
          <BadgeButton
            key={variant}
            badgeAction={createSimpleBadge(variant, `Action for ${variant}`, { variant })}
            onExecute={args.onExecute}
          />
        ))}
      </div>
    )
  },
  args: {},
}
