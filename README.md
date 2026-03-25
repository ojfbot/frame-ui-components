# @ojfbot/frame-ui-components

Shared UI component library for Frame OS sub-apps. Single source of truth for dashboard chrome, chat, thread management, and error handling across 9 applications.

## Install

```bash
# In a sibling ojfbot repo:
pnpm add @ojfbot/frame-ui-components
# package.json → "file:../../../frame-ui-components"
```

## Usage

```tsx
import { ChatShell, ChatMessage, MarkdownMessage } from '@ojfbot/frame-ui-components'
import '@ojfbot/frame-ui-components/styles/chat-shell'
import '@ojfbot/frame-ui-components/styles/markdown-message'
```

### Connected wrapper pattern

Components are pure and prop-driven. Wire Redux state via thin Connected wrappers in each app:

```tsx
// ThreadSidebarConnected.tsx
import { ThreadSidebar } from '@ojfbot/frame-ui-components'
import type { ThreadItem } from '@ojfbot/frame-ui-components'
import '@ojfbot/frame-ui-components/styles/thread-sidebar'

export default function ThreadSidebarConnected({ isExpanded, onToggle }) {
  const threads = useAppSelector(s => s.threads.threads)
  const threadItems: ThreadItem[] = threads.map(t => ({
    threadId: t.id, title: t.name, updatedAt: t.updatedAt,
  }))
  return (
    <ThreadSidebar
      isExpanded={isExpanded} onToggle={onToggle}
      threads={threadItems} currentThreadId={activeThreadId}
      onCreateThread={...} onSelectThread={...} onDeleteThread={...}
    />
  )
}
```

## Components

| Component | Description | Style import |
|-----------|-------------|-------------|
| DashboardLayout | Page shell with header slot + sidebar margin | `styles/dashboard-layout` |
| ChatShell | Collapsible chat container with input, header, scroll | `styles/chat-shell` |
| ChatMessage | Single message bubble (user/assistant) | (included in chat-shell) |
| ThreadSidebar | Slide-out thread list with CRUD controls | `styles/thread-sidebar` |
| MarkdownMessage | Markdown renderer with action links + badge suggestions | `styles/markdown-message` |
| BadgeButton | Clickable action tag with variant colors | `styles/badge-button` |
| ErrorBoundary | React error boundary with app/boundary naming | (no styles) |

## Action type system

```tsx
import { createSimpleBadge, getChatMessage } from '@ojfbot/frame-ui-components'
import type { BadgeAction } from '@ojfbot/frame-ui-components'

const badge = createSimpleBadge('Write Post', 'Write a blog post about...', { variant: 'purple' })
const message = getChatMessage(badge) // → "Write a blog post about..."
```

## Architecture

See [ADR-0030](../core/decisions/adr/0030-shared-frame-ui-components-library.md).
