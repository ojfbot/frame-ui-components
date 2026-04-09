import type { Meta, StoryObj } from '@storybook/react'
import { SidebarToggle } from './SidebarToggle'
import '../styles/DashboardLayout.css'

const meta: Meta<typeof SidebarToggle> = {
  title: 'Components/SidebarToggle',
  component: SidebarToggle,
  argTypes: {
    onToggle: { action: 'toggle' },
  },
}

export default meta
type Story = StoryObj<typeof SidebarToggle>

export const Collapsed: Story = {
  args: {
    isExpanded: false,
  },
}

export const Expanded: Story = {
  args: {
    isExpanded: true,
  },
}
