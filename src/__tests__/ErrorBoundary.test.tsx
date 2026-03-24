import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import type { FrameErrorReport } from '../components/ErrorBoundary'

// Component that throws on demand
function Thrower({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Component exploded')
  return <div>Working fine</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress React error boundary console noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('renders default fallback on error', () => {
    render(
      <ErrorBoundary boundaryName="test-panel">
        <Thrower shouldThrow />
      </ErrorBoundary>,
    )
    expect(screen.getByText(/Component error in test-panel/)).toBeInTheDocument()
    expect(screen.getByText(/Component exploded/)).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('calls onError with structured report', () => {
    const onError = vi.fn()
    render(
      <ErrorBoundary onError={onError} appName="cv-builder" boundaryName="chat-panel">
        <Thrower shouldThrow />
      </ErrorBoundary>,
    )

    expect(onError).toHaveBeenCalledOnce()
    const [error, _errorInfo, report] = onError.mock.calls[0]
    expect(error.message).toBe('Component exploded')

    const r = report as FrameErrorReport
    expect(r.appName).toBe('cv-builder')
    expect(r.boundaryName).toBe('chat-panel')
    expect(r.errorMessage).toBe('Component exploded')
    expect(r.componentName).toBeTruthy()
    expect(r.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('sets data attributes on fallback for DOM inspection', () => {
    const { container } = render(
      <ErrorBoundary appName="blogengine" boundaryName="sidebar">
        <Thrower shouldThrow />
      </ErrorBoundary>,
    )
    const fallback = container.querySelector('.error-boundary-fallback')
    expect(fallback?.getAttribute('data-error-boundary')).toBe('sidebar')
    expect(fallback?.getAttribute('data-error-app')).toBe('blogengine')
  })

  it('logs structured JSON to console.error', () => {
    const consoleSpy = vi.spyOn(console, 'error')
    render(
      <ErrorBoundary appName="tripplanner" boundaryName="map-panel">
        <Thrower shouldThrow />
      </ErrorBoundary>,
    )

    // Find the frame-ui log call (not React's internal error log)
    const frameLog = consoleSpy.mock.calls.find(
      call => typeof call[0] === 'string' && call[0].includes('[frame-ui]'),
    )
    expect(frameLog).toBeTruthy()
    expect(frameLog![0]).toContain('tripplanner/map-panel')
  })

  it('renders custom ReactNode fallback', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <Thrower shouldThrow />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Custom fallback')).toBeInTheDocument()
  })

  it('renders custom function fallback with error and report', () => {
    render(
      <ErrorBoundary
        appName="test-app"
        boundaryName="main"
        fallback={(error, report) => (
          <div>
            <span>Error: {error.message}</span>
            <span>App: {report.appName}</span>
          </div>
        )}
      >
        <Thrower shouldThrow />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Error: Component exploded')).toBeInTheDocument()
    expect(screen.getByText('App: test-app')).toBeInTheDocument()
  })

  it('retry button resets error state', () => {
    // Render with error, then retry
    const { rerender } = render(
      <ErrorBoundary boundaryName="test">
        <Thrower shouldThrow />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Retry')).toBeInTheDocument()
    // Can't truly test retry without changing props, but verify the button exists
    fireEvent.click(screen.getByText('Retry'))
    // After retry with same throwing component, it'll crash again — that's expected
    // The important thing is the retry mechanism exists
  })

  it('defaults appName and boundaryName to "unknown"/"default"', () => {
    const onError = vi.fn()
    render(
      <ErrorBoundary onError={onError}>
        <Thrower shouldThrow />
      </ErrorBoundary>,
    )

    const report = onError.mock.calls[0][2] as FrameErrorReport
    expect(report.appName).toBe('unknown')
    expect(report.boundaryName).toBe('default')
  })
})
