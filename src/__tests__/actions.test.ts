import { describe, it, expect } from 'vitest'
import {
  createChatAction,
  createNavigateAction,
  createFileUploadAction,
  createExpandChatAction,
  createCopyTextAction,
  createDownloadAction,
  createExternalLinkAction,
  createSuggestedMessage,
  createBadgeAction,
  createSimpleBadge,
  getChatMessage,
  cleanStreamingContent,
  extractSuggestionsFromResponse,
  stripMetadata,
} from '../types/actions'

describe('Action factories', () => {
  it('createChatAction produces correct shape', () => {
    const action = createChatAction('hello')
    expect(action).toEqual({ type: 'chat', message: 'hello', expandChat: false })
  })

  it('createChatAction with expandChat', () => {
    const action = createChatAction('hello', true)
    expect(action.expandChat).toBe(true)
  })

  it('createNavigateAction uses string target', () => {
    const action = createNavigateAction('bio')
    expect(action).toEqual({ type: 'navigate', target: 'bio' })
  })

  it('createFileUploadAction defaults', () => {
    const action = createFileUploadAction()
    expect(action).toEqual({ type: 'file_upload', accept: undefined, multiple: false, targetTab: undefined })
  })

  it('createFileUploadAction with params', () => {
    const action = createFileUploadAction('.pdf', true, 2)
    expect(action.accept).toBe('.pdf')
    expect(action.multiple).toBe(true)
    expect(action.targetTab).toBe(2)
  })

  it('createExpandChatAction', () => {
    expect(createExpandChatAction()).toEqual({ type: 'expand_chat' })
  })

  it('createCopyTextAction', () => {
    const action = createCopyTextAction('copied')
    expect(action).toEqual({ type: 'copy_text', text: 'copied' })
  })

  it('createDownloadAction', () => {
    const action = createDownloadAction('/file.pdf', 'resume.pdf')
    expect(action).toEqual({ type: 'download', url: '/file.pdf', filename: 'resume.pdf' })
  })

  it('createExternalLinkAction defaults openInNew', () => {
    const action = createExternalLinkAction('https://example.com')
    expect(action.openInNew).toBe(true)
  })

  it('createSuggestedMessage', () => {
    const msg = createSuggestedMessage('assistant', 'Tell me more', 'More?')
    expect(msg).toEqual({ role: 'assistant', content: 'Tell me more', compactContent: 'More?' })
  })
})

describe('createBadgeAction', () => {
  it('creates badge with default variant', () => {
    const badge = createBadgeAction('Test', [createChatAction('hi')])
    expect(badge.label).toBe('Test')
    expect(badge.variant).toBe('purple')
    expect(badge.disabled).toBe(false)
    expect(badge.actions).toHaveLength(1)
  })

  it('applies options', () => {
    const badge = createBadgeAction('Nav', [createNavigateAction('jobs')], {
      icon: '💼',
      variant: 'blue',
      disabled: true,
    })
    expect(badge.icon).toBe('💼')
    expect(badge.variant).toBe('blue')
    expect(badge.disabled).toBe(true)
  })

  it('auto-generates tooltip from single chat action', () => {
    const badge = createBadgeAction('Ask', [createChatAction('What is the meaning of life?')])
    expect(badge.tooltip).toContain('Ask:')
    expect(badge.tooltip).toContain('What is the meaning of life?')
  })

  it('auto-generates tooltip from navigate action', () => {
    const badge = createBadgeAction('Go', [createNavigateAction('bio')])
    expect(badge.tooltip).toBe('Navigate to bio')
  })

  it('auto-generates tooltip for multi-action badge', () => {
    const badge = createBadgeAction('Multi', [
      createNavigateAction('jobs'),
      createChatAction('hello'),
    ])
    expect(badge.tooltip).toContain('2 actions')
  })
})

describe('createSimpleBadge', () => {
  it('wraps message in ChatAction', () => {
    const badge = createSimpleBadge('Send', 'hello world')
    expect(badge.actions).toHaveLength(1)
    expect(badge.actions[0].type).toBe('chat')
    expect(getChatMessage(badge)).toBe('hello world')
  })
})

describe('getChatMessage', () => {
  it('extracts first chat action message', () => {
    const badge = createBadgeAction('Test', [
      createNavigateAction('bio'),
      createChatAction('found me'),
    ])
    expect(getChatMessage(badge)).toBe('found me')
  })

  it('returns null when no chat action', () => {
    const badge = createBadgeAction('Nav', [createNavigateAction('bio')])
    expect(getChatMessage(badge)).toBeNull()
  })
})

describe('cleanStreamingContent', () => {
  it('strips complete metadata blocks', () => {
    const input = 'Hello world\n<metadata>{"suggestions":[]}</metadata>'
    const { cleaned, isMetadataStreaming } = cleanStreamingContent(input)
    expect(cleaned).toBe('Hello world')
    expect(isMetadataStreaming).toBe(false)
  })

  it('strips incomplete metadata and signals streaming', () => {
    const input = 'Hello world\n<metadata>{"sugges'
    const { cleaned, isMetadataStreaming } = cleanStreamingContent(input)
    expect(cleaned).toBe('Hello world')
    expect(isMetadataStreaming).toBe(true)
  })

  it('fixes incomplete code blocks', () => {
    const input = 'Here is code:\n```js\nconst x = 1'
    const { cleaned } = cleanStreamingContent(input)
    expect(cleaned).toContain('```')
    // Should have even number of ``` markers (opening + auto-close)
    const count = (cleaned.match(/```/g) || []).length
    expect(count % 2).toBe(0)
  })

  it('strips legacy bracket navigation tags', () => {
    const input = 'Go here [NAVIGATE_TO_TAB:1:Bio] now'
    const { cleaned } = cleanStreamingContent(input)
    expect(cleaned).toBe('Go here  now')
  })

  it('handles empty input', () => {
    const { cleaned, isMetadataStreaming } = cleanStreamingContent('')
    expect(cleaned).toBe('')
    expect(isMetadataStreaming).toBe(false)
  })
})

describe('extractSuggestionsFromResponse', () => {
  it('extracts valid JSON suggestions', () => {
    const response = `Here's my analysis.

<metadata>{"suggestions":[{"label":"View Bio","icon":"👤","actions":[{"type":"navigate","target":"bio"}],"variant":"purple"}]}</metadata>`

    const suggestions = extractSuggestionsFromResponse(response)
    expect(suggestions).toHaveLength(1)
    expect(suggestions[0].label).toBe('View Bio')
    expect(suggestions[0].actions[0].type).toBe('navigate')
  })

  it('returns empty for no metadata', () => {
    expect(extractSuggestionsFromResponse('Just a normal response')).toEqual([])
  })

  it('returns empty for malformed JSON', () => {
    const response = '<metadata>{broken json</metadata>'
    expect(extractSuggestionsFromResponse(response)).toEqual([])
  })

  it('caps at 6 suggestions', () => {
    const many = Array.from({ length: 10 }, (_, i) => ({
      label: `Item ${i}`,
      actions: [{ type: 'chat', message: `msg ${i}` }],
    }))
    const response = `<metadata>{"suggestions":${JSON.stringify(many)}}</metadata>`
    expect(extractSuggestionsFromResponse(response)).toHaveLength(6)
  })
})

describe('stripMetadata', () => {
  it('removes metadata tags from content', () => {
    const input = 'Hello\n<metadata>{"suggestions":[]}</metadata>\nWorld'
    expect(stripMetadata(input)).toBe('Hello\n\nWorld')
  })

  it('removes bracket tags', () => {
    const input = 'Go [NAVIGATE_TO_TAB:2:Jobs] here'
    expect(stripMetadata(input)).toBe('Go  here')
  })

  it('handles content with no metadata', () => {
    expect(stripMetadata('clean content')).toBe('clean content')
  })
})
