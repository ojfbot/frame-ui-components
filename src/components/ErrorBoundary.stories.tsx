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
    <ErrorBoundary appName="storybook" boundaryName="demo-panel">
      <ThrowingChild />
    </ErrorBoundary>
  ),
}

export const WithAppContext: Story = {
  render: () => (
    <ErrorBoundary
      appName="cv-builder"
      boundaryName="chat-panel"
      onError={(_error, _errorInfo, report) => {
        console.log('[Storybook] Error report:', report)
      }}
    >
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
    <ErrorBoundary
      appName="blogengine"
      boundaryName="thread-list"
      fallback={(error, report) => (
        <div style={{ padding: '2rem', color: '#da1e28' }}>
          <strong>Error in {report.boundaryName}:</strong> {error.message}
          <br />
          <small>Component: {report.componentName} | App: {report.appName}</small>
        </div>
      )}
    >
      <ThrowingChild />
    </ErrorBoundary>
  ),
}

export const Healthy: Story = {
  render: () => (
    <ErrorBoundary appName="storybook" boundaryName="healthy-demo">
      <div style={{ padding: '1rem' }}>Everything is fine.</div>
    </ErrorBoundary>
  ),
}
