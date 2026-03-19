import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.error) {
      const { fallback } = this.props
      if (typeof fallback === 'function') return fallback(this.state.error)
      if (fallback) return fallback
      return (
        <div className="error-boundary-fallback">
          <p>Something went wrong.</p>
        </div>
      )
    }
    return this.props.children
  }
}
