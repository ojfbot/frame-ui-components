import { describe, it, expect } from 'vitest'
import { defaultMatchAction, parseListItem, extractText } from '../components/markdown-message/utils'
import type { BadgeAction } from '../types/actions'

const makeBadge = (label: string): BadgeAction => ({
  label,
  actions: [],
})

describe('defaultMatchAction', () => {
  it('returns null for empty suggestions', () => {
    expect(defaultMatchAction('test', [])).toBeNull()
  })

  it('returns exact match', () => {
    const suggestions = [makeBadge('Upload Resume'), makeBadge('Review')]
    expect(defaultMatchAction('Review', suggestions)).toBe(suggestions[1])
  })

  it('returns partial match (label contains search)', () => {
    const suggestions = [makeBadge('Upload Resume PDF')]
    expect(defaultMatchAction('Upload Resume', suggestions)).toBe(suggestions[0])
  })

  it('returns partial match (search contains label)', () => {
    const suggestions = [makeBadge('Upload')]
    expect(defaultMatchAction('Upload Resume PDF', suggestions)).toBe(suggestions[0])
  })

  it('returns null when no match', () => {
    const suggestions = [makeBadge('Upload')]
    expect(defaultMatchAction('Download', suggestions)).toBeNull()
  })

  it('prefers exact over partial', () => {
    const suggestions = [makeBadge('Upload File'), makeBadge('Upload')]
    expect(defaultMatchAction('Upload', suggestions)).toBe(suggestions[1])
  })
})

describe('parseListItem', () => {
  it('parses bold label with description', () => {
    const result = parseListItem('**Resume**: Upload your current resume')
    expect(result).toEqual({ label: 'Resume', description: 'Upload your current resume' })
  })

  it('parses plain label with description', () => {
    const result = parseListItem('Resume: Upload your current resume')
    expect(result).toEqual({ label: 'Resume', description: 'Upload your current resume' })
  })

  it('returns null for plain text without colon', () => {
    expect(parseListItem('Just some text')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(parseListItem('')).toBeNull()
  })

  it('trims label and description', () => {
    const result = parseListItem('**Label**:  description here ')
    expect(result).toEqual({ label: 'Label', description: 'description here' })
  })
})

describe('extractText', () => {
  it('returns string as-is', () => {
    expect(extractText('hello')).toBe('hello')
  })

  it('converts number to string', () => {
    expect(extractText(42)).toBe('42')
  })

  it('returns empty for null/undefined', () => {
    expect(extractText(null)).toBe('')
    expect(extractText(undefined)).toBe('')
  })

  it('joins array elements', () => {
    expect(extractText(['hello', ' ', 'world'])).toBe('hello world')
  })

  it('extracts from React-like element with props.children', () => {
    expect(extractText({ props: { children: 'nested' } })).toBe('nested')
  })

  it('handles nested arrays and elements', () => {
    const node = { props: { children: ['a', { props: { children: 'b' } }] } }
    expect(extractText(node)).toBe('ab')
  })
})
