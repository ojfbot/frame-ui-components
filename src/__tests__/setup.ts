import '@testing-library/jest-dom/vitest'

// Stub CSS imports
vi.mock('../styles/BadgeButton.css', () => ({}))
vi.mock('../styles/MarkdownMessage.css', () => ({}))
vi.mock('../styles/ChatShell.css', () => ({}))
vi.mock('../styles/ThreadSidebar.css', () => ({}))
vi.mock('../styles/Dashboard.css', () => ({}))
vi.mock('../styles/DashboardLayout.css', () => ({}))

// Polyfill ResizeObserver for Carbon components (TextArea, Modal)
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any
}
