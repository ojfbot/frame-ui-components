# @ojfbot/frame-ui-components

> Shared UI component library for Frame OS sub-apps — dashboard chrome, chat, threads, and error handling.

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

## Consuming Apps

All Frame OS sub-apps import from this library:

- **cv-builder** — DashboardLayout, ChatShell, ThreadSidebar, MarkdownMessage
- **blogengine** — DashboardLayout, ChatShell, ThreadSidebar, MarkdownMessage
- **TripPlanner** — DashboardLayout, ChatShell, ThreadSidebar, MarkdownMessage
- **core-reader** — DashboardLayout, ThreadSidebar
- **lean-canvas** — DashboardLayout
- **gastown-pilot** — DashboardLayout
- **seh-study** — DashboardLayout

## Getting Started

**Prerequisites:** Node >= 24 (via `fnm use`), pnpm 9

**Peer dependencies:** `react`, `react-dom`, `@carbon/react`

```bash
# Development
pnpm install
pnpm dev     # watch mode
pnpm build   # compile

# In a consuming app
pnpm add @ojfbot/frame-ui-components
```

## Contributing

All changes go through pull requests. Changes here affect all 9 sub-apps — test in at least one consuming app before merging.

## License

MIT

## Frame OS Ecosystem

Part of [Frame OS](https://github.com/ojfbot/shell) — an AI-native application OS.

| Repo | Description |
|------|-------------|
| [shell](https://github.com/ojfbot/shell) | Module Federation host + frame-agent LLM gateway |
| [core](https://github.com/ojfbot/core) | Workflow framework — 30+ slash commands + TypeScript engine |
| [cv-builder](https://github.com/ojfbot/cv-builder) | AI-powered resume builder with LangGraph agents |
| [blogengine](https://github.com/ojfbot/BlogEngine) | AI blog content creation platform |
| [TripPlanner](https://github.com/ojfbot/TripPlanner) | AI trip planner with 11-phase pipeline |
| [core-reader](https://github.com/ojfbot/core-reader) | Documentation viewer for the core framework |
| [lean-canvas](https://github.com/ojfbot/lean-canvas) | AI-powered lean canvas business model tool |
| [gastown-pilot](https://github.com/ojfbot/gastown-pilot) | Multi-agent coordination dashboard |
| [seh-study](https://github.com/ojfbot/seh-study) | NASA SEH spaced repetition study tool |
| [daily-logger](https://github.com/ojfbot/daily-logger) | Automated daily dev blog pipeline |
| [purefoy](https://github.com/ojfbot/purefoy) | Roger Deakins cinematography knowledge base |
| [MrPlug](https://github.com/ojfbot/MrPlug) | Chrome extension for AI UI feedback |
| **frame-ui-components** | **Shared component library — Carbon DS (this repo)** |
