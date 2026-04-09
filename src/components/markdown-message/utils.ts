import type { BadgeAction } from '../../types/actions.js'

export const defaultMatchAction = (label: string, suggestions: BadgeAction[]): BadgeAction | null => {
  if (suggestions.length === 0) return null

  const exact = suggestions.find(s => s.label === label)
  if (exact) return exact

  const lowerLabel = label.toLowerCase()
  return suggestions.find(s =>
    s.label.toLowerCase().includes(lowerLabel) ||
    lowerLabel.includes(s.label.toLowerCase())
  ) ?? null
}

export const parseListItem = (text: string): { label: string; description: string } | null => {
  const match = text.match(/^\*\*(.+?)\*\*:\s*(.+)$/) || text.match(/^(.+?):\s*(.+)$/)
  if (match && match[1] && match[2]) {
    return { label: match[1].trim(), description: match[2].trim() }
  }
  return null
}

export const extractText = (node: any): string => {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (!node) return ''
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node.props?.children) return extractText(node.props.children)
  return ''
}
