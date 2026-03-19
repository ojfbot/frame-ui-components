import type { Meta, StoryObj } from '@storybook/react'
import { ErrorBoundary } from './ErrorBoundary'

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
}

export default meta
type Story = StoryObj<typeof ErrorBoundary>

function ThrowingChild(): React.ReactNode {
  throw new Error('Test error: component crashed')
}

export const WithError: Story = {
  render: () => (
    <ErrorBoundary>
      <ThrowingChild />
    </ErrorBoundary>
  ),
}

export const WithCustomFallback: Story = {
  render: () => (
    <ErrorBoundary fallback={<div style={{ padding: '2rem', color: '#da1e28' }}>Custom fallback: something broke.</div>}>
      <ThrowingChild />
    </ErrorBoundary>
  ),
}

export const WithFallbackFunction: Story = {
  render: () => (
    <ErrorBoundary fallback={(error) => (
      <div style={{ padding: '2rem', color: '#da1e28' }}>
        <strong>Error:</strong> {error.message}
      </div>
    )}>
      <ThrowingChild />
    </ErrorBoundary>
  ),
}

export const Healthy: Story = {
  render: () => (
    <ErrorBoundary>
      <div style={{ padding: '1rem' }}>Everything is fine.</div>
    </ErrorBoundary>
  ),
}
