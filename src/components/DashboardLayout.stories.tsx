import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DashboardLayout } from './DashboardLayout'

const meta: Meta<typeof DashboardLayout> = {
  title: 'Components/DashboardLayout',
  component: DashboardLayout,
}

export default meta
type Story = StoryObj<typeof DashboardLayout>

export const Default: Story = {
  render: () => (
    <DashboardLayout>
      <DashboardLayout.Header>
        <h2 style={{ margin: 0 }}>My Dashboard</h2>
      </DashboardLayout.Header>
      <div style={{ padding: '1rem' }}>
        <p>Dashboard content goes here.</p>
      </div>
    </DashboardLayout>
  ),
}

export const ShellMode: Story = {
  render: () => (
    <DashboardLayout shellMode>
      <DashboardLayout.Header>
        <h2 style={{ margin: 0 }}>Shell Mode Dashboard</h2>
      </DashboardLayout.Header>
      <div style={{ padding: '1rem' }}>
        <p>In shell mode, standalone margins are suppressed and the layout fills the shell frame.</p>
      </div>
    </DashboardLayout>
  ),
}

export const WithSidebarOpen: Story = {
  render: () => (
    <DashboardLayout sidebarExpanded>
      <DashboardLayout.Header>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <button style={{ marginLeft: 'auto' }}>Toggle Sidebar</button>
      </DashboardLayout.Header>
      <div style={{ padding: '1rem' }}>
        <p>Content is shifted to make room for the sidebar.</p>
      </div>
    </DashboardLayout>
  ),
}

export const WithChatExpanded: Story = {
  render: () => (
    <DashboardLayout chatExpanded>
      <DashboardLayout.Header>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
      </DashboardLayout.Header>
      <div style={{ padding: '1rem' }}>
        <p>Content adjusts when the chat panel is expanded.</p>
      </div>
    </DashboardLayout>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [sidebar, setSidebar] = useState(false)
    const [shell, setShell] = useState(false)

    return (
      <div>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setSidebar(!sidebar)}>
            Sidebar: {sidebar ? 'Open' : 'Closed'}
          </button>
          <button onClick={() => setShell(!shell)}>
            Shell Mode: {shell ? 'On' : 'Off'}
          </button>
        </div>
        <DashboardLayout shellMode={shell} sidebarExpanded={sidebar}>
          <DashboardLayout.Header>
            <h2 style={{ margin: 0 }}>Interactive Demo</h2>
          </DashboardLayout.Header>
          <div style={{ padding: '1rem' }}>
            <p>Toggle the controls above to see layout changes.</p>
            <p>Shell mode: <strong>{shell ? 'active' : 'inactive'}</strong></p>
            <p>Sidebar: <strong>{sidebar ? 'expanded' : 'collapsed'}</strong></p>
          </div>
        </DashboardLayout>
      </div>
    )
  },
}
