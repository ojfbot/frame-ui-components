import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BadgeButton } from './BadgeButton.js'
import type { BadgeAction } from './BadgeButton.js'
import '../styles/MarkdownMessage.css'

export interface MarkdownMessageProps {
  content: string
  suggestions?: BadgeAction[]
  onExecute?: (message: string) => void
  compact?: boolean
}

export function MarkdownMessage({ content, suggestions, onExecute, compact: _compact = false }: MarkdownMessageProps) {
  const handleExecute = (message: string) => {
    onExecute?.(message)
  }

  return (
    <div className="markdown-message">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) => {
          if (url.startsWith('action:')) return url
          return url
        }}
        skipHtml={false}
        components={{
          a: ({ href, children, ...props }: any) => {
            if (href?.startsWith('action:')) {
              const actionMessage = href.replace('action:', '')
              const label = typeof children === 'string' ? children : children?.join?.('') || 'Action'
              const iconMatch = label.match(/^([\u{1F300}-\u{1F9FF}])\s*(.+)$/u)
              const icon = iconMatch ? iconMatch[1] : undefined
              const cleanLabel = iconMatch?.[2] || label

              return (
                <BadgeButton
                  badgeAction={{
                    label: cleanLabel,
                    icon,
                    message: actionMessage,
                    variant: 'purple',
                  }}
                  onExecute={handleExecute}
                  className="inline-action"
                  size="sm"
                />
              )
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            )
          },
          ul: ({ children, ...props }: any) => (
            <ul className="markdown-list" {...props}>{children}</ul>
          ),
          ol: ({ children, ...props }: any) => (
            <ol className="markdown-list" {...props}>{children}</ol>
          ),
          blockquote: ({ children, ...props }: any) => (
            <blockquote className="markdown-blockquote" {...props}>{children}</blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      {suggestions && suggestions.length > 0 && (
        <div className="markdown-suggestions">
          {suggestions.map((badgeAction, idx) => (
            <BadgeButton
              key={idx}
              badgeAction={badgeAction}
              onExecute={handleExecute}
              size="sm"
            />
          ))}
        </div>
      )}
    </div>
  )
}
