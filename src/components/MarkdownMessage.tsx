import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BadgeButton } from './BadgeButton.js'
import type { BadgeAction } from '../types/actions.js'
import { defaultMatchAction } from './markdown-message/utils.js'
import { CodeBlock } from './markdown-message/CodeBlock.js'
import { createMarkdownLink } from './markdown-message/MarkdownLink.js'
import { createMarkdownListItem } from './markdown-message/MarkdownListItem.js'
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
    code: CodeBlock,
    a: createMarkdownLink({ findBadgeAction, handleBadgeExecute, onFileUpload }),
    ul({ children, ...props }: any) {
      return <ul className="markdown-list" {...props}>{children}</ul>
    },
    ol({ children, ...props }: any) {
      return <ol className="markdown-list" {...props}>{children}</ol>
    },
    li: createMarkdownListItem({ findBadgeAction, handleBadgeExecute, onExecute, compact }),
    blockquote({ children, ...props }: any) {
      return <blockquote className="markdown-blockquote" {...props}>{children}</blockquote>
    },
    table({ children, ...props }: any) {
      return <table className="markdown-table" {...props}>{children}</table>
    },
  }

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
