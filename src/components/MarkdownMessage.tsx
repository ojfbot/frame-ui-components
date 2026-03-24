import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeSnippet } from '@carbon/react'
import { BadgeButton } from './BadgeButton.js'
import type { BadgeAction } from '../types/actions.js'
import { createBadgeAction, createChatAction } from '../types/actions.js'
import '../styles/MarkdownMessage.css'

export interface MarkdownMessageProps {
  content: string
  suggestions?: BadgeAction[]
  /** Called when any badge is clicked. Receives the full badge action. */
  onExecute?: (badgeAction: BadgeAction) => void
  /**
   * Optional action matcher: given a label from markdown content (e.g. a list
   * item heading), return a matching BadgeAction from suggestions or patterns.
   * Used by cv-builder for TabKey pattern matching.
   */
  matchAction?: (label: string, suggestions: BadgeAction[]) => BadgeAction | null
  /** File upload callback for upload: links. */
  onFileUpload?: (accept: string, multiple: boolean) => void
  /** Override ReactMarkdown component renderers. Merged over defaults. */
  components?: Partial<Components>
  /** Additional remark plugins beyond remarkGfm. */
  remarkPlugins?: any[]
  /** Additional rehype plugins (e.g. rehype-highlight). */
  rehypePlugins?: any[]
  compact?: boolean
}

/**
 * Default action matcher: exact or partial label match against suggestions.
 */
const defaultMatchAction = (label: string, suggestions: BadgeAction[]): BadgeAction | null => {
  if (suggestions.length === 0) return null

  // Exact match
  const exact = suggestions.find(s => s.label === label)
  if (exact) return exact

  // Case-insensitive partial match
  const lowerLabel = label.toLowerCase()
  return suggestions.find(s =>
    s.label.toLowerCase().includes(lowerLabel) ||
    lowerLabel.includes(s.label.toLowerCase())
  ) ?? null
}

/** Parse "**Label**: Description" patterns from list items. */
const parseListItem = (text: string): { label: string; description: string } | null => {
  const match = text.match(/^\*\*(.+?)\*\*:\s*(.+)$/) || text.match(/^(.+?):\s*(.+)$/)
  if (match && match[1] && match[2]) {
    return { label: match[1].trim(), description: match[2].trim() }
  }
  return null
}

/** Recursively extract text content from React children. */
const extractText = (node: any): string => {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (!node) return ''
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node.props?.children) return extractText(node.props.children)
  return ''
}

export function MarkdownMessage({
  content,
  suggestions = [],
  onExecute,
  matchAction,
  onFileUpload,
  components: componentOverrides,
  remarkPlugins: extraRemarkPlugins,
  rehypePlugins,
  compact = false,
}: MarkdownMessageProps) {
  const matcher = matchAction ?? defaultMatchAction

  const handleBadgeExecute = (badgeAction: BadgeAction) => {
    if (onExecute) onExecute(badgeAction)
  }

  const findBadgeAction = (label: string): BadgeAction | null => {
    return matcher(label, suggestions)
  }

  const defaultComponents: Partial<Components> = {
    // Code blocks with copy functionality
    code({ className, children, ...props }: any) {
      const inline = !className
      const codeString = String(children).replace(/\n$/, '')

      if (!inline) {
        return (
          <CodeSnippet
            type="multi"
            feedback="Copied!"
            feedbackTimeout={2000}
            className="code-block"
          >
            {codeString}
          </CodeSnippet>
        )
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },

    // Links: action: and upload: protocols → badge buttons
    a({ children, href, ...props }: any) {
      // File upload link
      if (href?.startsWith('upload:')) {
        const uploadParams = href.replace('upload:', '')
        const label = typeof children === 'string' ? children : children?.join?.('') || 'Upload'
        const accept = uploadParams || '.pdf,.docx,.txt'

        const badgeAction = createBadgeAction(
          label,
          [{ type: 'file_upload', accept, multiple: false }],
          { icon: '📎', variant: 'blue' },
        )

        return (
          <BadgeButton
            badgeAction={badgeAction}
            onExecute={(badge) => {
              if (onFileUpload) {
                const uploadAction = badge.actions.find(a => a.type === 'file_upload')
                if (uploadAction && uploadAction.type === 'file_upload') {
                  onFileUpload(uploadAction.accept || '', uploadAction.multiple || false)
                }
              }
              handleBadgeExecute(badge)
            }}
            className="inline-action"
            size="sm"
          />
        )
      }

      // Action link
      if (href?.startsWith('action:')) {
        const query = href.replace('action:', '')
        const label = typeof children === 'string' ? children : children?.join?.('') || 'Action'

        // Extract icon from label if present
        const iconMatch = label.match(/^([\u{1F300}-\u{1F9FF}])\s*(.+)$/u)
        const icon = iconMatch ? iconMatch[1] : undefined
        const cleanLabel = iconMatch ? iconMatch[2] : label

        // Try matching against suggestions first
        const matchedBadge = findBadgeAction(cleanLabel) ?? createBadgeAction(
          cleanLabel,
          [createChatAction(query)],
          { icon },
        )

        return (
          <BadgeButton
            badgeAction={matchedBadge}
            onExecute={handleBadgeExecute}
            className="inline-action"
            size="sm"
          />
        )
      }

      // Regular link
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      )
    },

    // Lists
    ul({ children, ...props }: any) {
      return <ul className="markdown-list" {...props}>{children}</ul>
    },
    ol({ children, ...props }: any) {
      return <ol className="markdown-list" {...props}>{children}</ol>
    },

    // List items: parse "**Label**: Description" → badge + description
    li({ children, ...props }: any) {
      if (!onExecute) return <li {...props}>{children}</li>

      const textContent = extractText(children)
      const parsed = parseListItem(textContent)

      if (parsed) {
        const badgeAction = findBadgeAction(parsed.label) ?? createBadgeAction(
          parsed.label,
          [createChatAction(parsed.description)],
          { icon: '💡' },
        )

        return (
          <li className="markdown-action-item" {...props}>
            <BadgeButton
              badgeAction={badgeAction}
              onExecute={handleBadgeExecute}
              size="sm"
            />
            {!compact && <span className="action-description">{parsed.description}</span>}
          </li>
        )
      }

      return <li {...props}>{children}</li>
    },

    // Blockquotes
    blockquote({ children, ...props }: any) {
      return <blockquote className="markdown-blockquote" {...props}>{children}</blockquote>
    },

    // Tables
    table({ children, ...props }: any) {
      return <table className="markdown-table" {...props}>{children}</table>
    },
  }

  // Merge: overrides win over defaults
  const mergedComponents = { ...defaultComponents, ...componentOverrides }

  const remarkPluginList = extraRemarkPlugins
    ? [remarkGfm, ...extraRemarkPlugins]
    : [remarkGfm]

  return (
    <div className="markdown-message">
      <ReactMarkdown
        remarkPlugins={remarkPluginList}
        rehypePlugins={rehypePlugins}
        urlTransform={(url) => {
          if (url.startsWith('action:') || url.startsWith('upload:')) return url
          return url
        }}
        skipHtml={false}
        components={mergedComponents}
      >
        {content}
      </ReactMarkdown>

      {suggestions.length > 0 && onExecute && (
        <div className="markdown-suggestions">
          {suggestions.map((badgeAction, idx) => (
            <BadgeButton
              key={idx}
              badgeAction={badgeAction}
              onExecute={handleBadgeExecute}
              size="sm"
            />
          ))}
        </div>
      )}
    </div>
  )
}
