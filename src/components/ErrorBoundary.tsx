import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

/**
 * Structured error report — enough context for a recovery agent to
 * identify which component, in which client app, at which point in the
 * render tree failed, and produce a targeted hotfix.
 */
export interface FrameErrorReport {
  /** Component name extracted from React's component stack. */
  componentName: string
  /** Full component stack trace for tree location. */
  componentStack: string
  /** JS error message. */
  errorMessage: string
  /** JS stack trace. */
  errorStack: string
  /** Client app identifier (e.g. "cv-builder", "blogengine"). */
  appName: string
  /** Boundary name for multi-boundary setups. */
  boundaryName: string
  /** ISO timestamp of the crash. */
  timestamp: string
}

export interface ErrorBoundaryProps {
  children: ReactNode
  /** Custom fallback UI. Receives the structured error report. */
  fallback?: ReactNode | ((error: Error, report: FrameErrorReport) => ReactNode)
  /** Called with structured error report on crash. Wire to Sentry, logging API, etc. */
  onError?: (error: Error, errorInfo: ErrorInfo, report: FrameErrorReport) => void
  /** Identifies the client app (e.g. "cv-builder"). Used in error reports. */
  appName?: string
  /** Identifies this boundary instance (e.g. "chat-panel", "research-dashboard"). */
  boundaryName?: string
}

interface State {
  error: Error | null
  report: FrameErrorReport | null
}

/** Extract the crashing component name from React's componentStack. */
function extractComponentName(componentStack: string): string {
  // React componentStack format: "\n    at ComponentName (url:line:col)"
  const match = componentStack.match(/^\s*at\s+(\S+)/m)
  return match?.[1] ?? 'Unknown'
}

/**
 * Production-grade error boundary with structured logging.
 *
 * Every crash produces a FrameErrorReport with:
 * - Which component crashed (extracted from React's component stack)
 * - Which app it's in (appName prop)
 * - Which boundary caught it (boundaryName prop)
 * - Full stack traces for both JS and React component tree
 * - Timestamp for correlation with other logs
 *
 * Default behavior: logs to console.error with structured JSON.
 * Override with onError prop to forward to Sentry, logging API, etc.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null, report: null }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const report: FrameErrorReport = {
      componentName: extractComponentName(errorInfo.componentStack ?? ''),
      componentStack: errorInfo.componentStack ?? '',
      errorMessage: error.message,
      errorStack: error.stack ?? '',
      appName: this.props.appName ?? 'unknown',
      boundaryName: this.props.boundaryName ?? 'default',
      timestamp: new Date().toISOString(),
    }

    // Always log — even if onError is provided — so recovery agents can find it
    console.error(
      `[frame-ui] ErrorBoundary crash in ${report.appName}/${report.boundaryName}`,
      `\n  Component: ${report.componentName}`,
      `\n  Error: ${report.errorMessage}`,
      `\n  Report:`,
      JSON.stringify(report, null, 2),
    )

    this.setState({ report })
    this.props.onError?.(error, errorInfo, report)
  }

  handleRetry = () => {
    this.setState({ error: null, report: null })
  }

  render() {
    if (this.state.error) {
      const { fallback } = this.props
      // report may be null on the first render tick (getDerivedStateFromError
      // fires before componentDidCatch). Build a minimal placeholder if needed.
      const report: FrameErrorReport = this.state.report ?? {
        componentName: 'Unknown',
        componentStack: '',
        errorMessage: this.state.error.message,
        errorStack: this.state.error.stack ?? '',
        appName: this.props.appName ?? 'unknown',
        boundaryName: this.props.boundaryName ?? 'default',
        timestamp: new Date().toISOString(),
      }

      if (typeof fallback === 'function') return fallback(this.state.error, report)
      if (fallback) return fallback

      return (
        <div
          className="error-boundary-fallback"
          data-error-boundary={report.boundaryName}
          data-error-app={report.appName}
          data-error-component={report.componentName}
          style={{
            padding: '1.5rem',
            margin: '1rem 0',
            border: '1px solid var(--cds-support-error, #da1e28)',
            borderRadius: '4px',
            background: 'var(--cds-layer-01, #f4f4f4)',
          }}
        >
          <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>
            Component error in {report.boundaryName}
          </p>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--cds-text-secondary, #525252)' }}>
            {report.componentName} failed to render: {report.errorMessage}
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              border: '1px solid var(--cds-border-strong, #8d8d8d)',
              borderRadius: '4px',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
