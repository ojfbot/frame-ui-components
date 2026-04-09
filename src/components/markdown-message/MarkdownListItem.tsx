import { BadgeButton } from '../BadgeButton.js'
import type { BadgeAction } from '../../types/actions.js'
import { createBadgeAction, createChatAction } from '../../types/actions.js'
import { extractText, parseListItem } from './utils.js'

interface MarkdownListItemContext {
  findBadgeAction: (label: string) => BadgeAction | null
  handleBadgeExecute: (badgeAction: BadgeAction) => void
  onExecute?: (badgeAction: BadgeAction) => void
  compact: boolean
}

export function createMarkdownListItem(ctx: MarkdownListItemContext) {
  return function MarkdownListItem({ children, ...props }: any) {
    if (!ctx.onExecute) return <li {...props}>{children}</li>

    const textContent = extractText(children)
    const parsed = parseListItem(textContent)

    if (parsed) {
      const badgeAction = ctx.findBadgeAction(parsed.label) ?? createBadgeAction(
        parsed.label,
        [createChatAction(parsed.description)],
        { icon: '💡' },
      )

      return (
        <li className="markdown-action-item" {...props}>
          <BadgeButton
            badgeAction={badgeAction}
            onExecute={ctx.handleBadgeExecute}
            size="sm"
          />
          {!ctx.compact && <span className="action-description">{parsed.description}</span>}
        </li>
      )
    }

    return <li {...props}>{children}</li>
  }
}
