import type { Meta, StoryObj } from '@storybook/react'
import { BadgeButton } from './BadgeButton'
import type { BadgeAction } from './BadgeButton'

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

const baseBadge: BadgeAction = {
  label: 'Write Blog Post',
  message: 'Write a new blog post about React patterns',
  variant: 'purple',
}

export const Default: Story = {
  args: {
    badgeAction: baseBadge,
  },
}

export const WithIcon: Story = {
  args: {
    badgeAction: { ...baseBadge, icon: '\u{1F4DD}', label: 'Draft Resume' },
  },
}

export const Small: Story = {
  args: {
    badgeAction: baseBadge,
    size: 'sm',
  },
}

export const Disabled: Story = {
  args: {
    badgeAction: { ...baseBadge, disabled: true },
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
            badgeAction={{ ...baseBadge, variant, label: variant }}
            onExecute={args.onExecute}
          />
        ))}
      </div>
    )
  },
  args: {},
}
