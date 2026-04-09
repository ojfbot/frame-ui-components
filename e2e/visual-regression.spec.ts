import { test, expect } from '@playwright/test'

/**
 * Visual regression tests for @ojfbot/frame-ui-components.
 *
 * Each story is rendered in Storybook's iframe and screenshotted.
 * Storybook URL pattern: /iframe.html?id=<story-id>&viewMode=story
 *
 * To update baselines:
 *   pnpm visual-regression --update-snapshots
 */

const stories = [
  // BadgeButton
  { id: 'components-badgebutton--default', name: 'BadgeButton-Default' },
  { id: 'components-badgebutton--success', name: 'BadgeButton-Success' },
  { id: 'components-badgebutton--warning', name: 'BadgeButton-Warning' },
  { id: 'components-badgebutton--error', name: 'BadgeButton-Error' },

  // ChatMessage
  { id: 'components-chatmessage--user-message', name: 'ChatMessage-User' },
  { id: 'components-chatmessage--assistant-message', name: 'ChatMessage-Assistant' },
  { id: 'components-chatmessage--streaming', name: 'ChatMessage-Streaming' },

  // ChatShell
  { id: 'components-chatshell--collapsed', name: 'ChatShell-Collapsed' },
  { id: 'components-chatshell--expanded', name: 'ChatShell-Expanded' },
  { id: 'components-chatshell--minimized', name: 'ChatShell-Minimized' },
  { id: 'components-chatshell--with-loading-state', name: 'ChatShell-Loading' },
  { id: 'components-chatshell--with-unread-badge', name: 'ChatShell-Unread' },
  { id: 'components-chatshell--disabled-input', name: 'ChatShell-Disabled' },

  // DashboardLayout
  { id: 'components-dashboardlayout--default', name: 'DashboardLayout-Default' },
  { id: 'components-dashboardlayout--with-sidebar', name: 'DashboardLayout-Sidebar' },

  // ErrorBoundary
  { id: 'components-errorboundary--with-error', name: 'ErrorBoundary-Error' },
  { id: 'components-errorboundary--healthy', name: 'ErrorBoundary-Healthy' },

  // MarkdownMessage
  { id: 'components-markdownmessage--basic-text', name: 'MarkdownMessage-Basic' },
  { id: 'components-markdownmessage--with-code-block', name: 'MarkdownMessage-CodeBlock' },
  { id: 'components-markdownmessage--compact-mode', name: 'MarkdownMessage-Compact' },

  // ThreadSidebar
  { id: 'components-threadsidebar--default', name: 'ThreadSidebar-Default' },
  { id: 'components-threadsidebar--empty', name: 'ThreadSidebar-Empty' },
]

for (const story of stories) {
  test(`visual: ${story.name}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)
    // Wait for Carbon styles and component render
    await page.waitForLoadState('networkidle')
    // Small delay for animations to settle
    await page.waitForTimeout(500)
    await expect(page).toHaveScreenshot(`${story.name}.png`)
  })
}
