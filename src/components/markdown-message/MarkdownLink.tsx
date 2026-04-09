import { BadgeButton } from '../BadgeButton.js'
import type { BadgeAction } from '../../types/actions.js'
import { createBadgeAction, createChatAction } from '../../types/actions.js'

interface MarkdownLinkContext {
  findBadgeAction: (label: string) => BadgeAction | null
  handleBadgeExecute: (badgeAction: BadgeAction) => void
  onFileUpload?: (accept: string, multiple: boolean) => void
}

export function createMarkdownLink(ctx: MarkdownLinkContext) {
  return function MarkdownLink({ children, href, ...props }: any) {
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
            if (ctx.onFileUpload) {
              const uploadAction = badge.actions.find(a => a.type === 'file_upload')
              if (uploadAction && uploadAction.type === 'file_upload') {
                ctx.onFileUpload(uploadAction.accept || '', uploadAction.multiple || false)
              }
            }
            ctx.handleBadgeExecute(badge)
          }}
          className="inline-action"
          size="sm"
        />
      )
    }

    if (href?.startsWith('action:')) {
      const query = href.replace('action:', '')
      const label = typeof children === 'string' ? children : children?.join?.('') || 'Action'

      const iconMatch = label.match(/^([\u{1F300}-\u{1F9FF}])\s*(.+)$/u)
      const icon = iconMatch ? iconMatch[1] : undefined
      const cleanLabel = iconMatch ? iconMatch[2] : label

      const matchedBadge = ctx.findBadgeAction(cleanLabel) ?? createBadgeAction(
        cleanLabel,
        [createChatAction(query)],
        { icon },
      )

      return (
        <BadgeButton
          badgeAction={matchedBadge}
          onExecute={ctx.handleBadgeExecute}
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
  }
}
