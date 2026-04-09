import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatInput } from '../components/ChatInput'

const defaultProps = {
  mode: 'expanded' as const,
  draftInput: '',
  onDraftChange: vi.fn(),
  onSend: vi.fn(),
}

describe('ChatInput', () => {
  describe('expanded mode', () => {
    it('renders textarea with placeholder', () => {
      render(<ChatInput {...defaultProps} />)
      expect(screen.getByPlaceholderText('Ask me anything...')).toBeInTheDocument()
    })

    it('renders custom placeholder', () => {
      render(<ChatInput {...defaultProps} placeholder="Type here..." />)
      expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument()
    })

    it('sends message on Enter', () => {
      const onSend = vi.fn()
      render(<ChatInput {...defaultProps} draftInput="hello" onSend={onSend} />)
      const textarea = screen.getByPlaceholderText('Ask me anything...')
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })
      expect(onSend).toHaveBeenCalledWith('hello')
    })

    it('does not send on Shift+Enter', () => {
      const onSend = vi.fn()
      render(<ChatInput {...defaultProps} draftInput="hello" onSend={onSend} />)
      const textarea = screen.getByPlaceholderText('Ask me anything...')
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
      expect(onSend).not.toHaveBeenCalled()
    })

    it('does not send empty input', () => {
      const onSend = vi.fn()
      render(<ChatInput {...defaultProps} draftInput="   " onSend={onSend} />)
      fireEvent.click(screen.getByLabelText('Send'))
      expect(onSend).not.toHaveBeenCalled()
    })

    it('disables send button when inputDisabled', () => {
      render(<ChatInput {...defaultProps} draftInput="hello" inputDisabled />)
      expect(screen.getByLabelText('Send')).toBeDisabled()
    })

    it('disables send button when isLoading', () => {
      render(<ChatInput {...defaultProps} draftInput="hello" isLoading />)
      expect(screen.getByLabelText('Send')).toBeDisabled()
    })

    it('shows disabled message when inputDisabled with disabledMessage', () => {
      render(<ChatInput {...defaultProps} inputDisabled disabledMessage="Configure API key" />)
      expect(screen.getByText('Configure API key')).toBeInTheDocument()
    })

    it('renders inputExtra', () => {
      render(<ChatInput {...defaultProps} inputExtra={<button>Mic</button>} />)
      expect(screen.getByText('Mic')).toBeInTheDocument()
    })
  })

  describe('collapsed mode', () => {
    it('renders single-line input', () => {
      render(<ChatInput {...defaultProps} mode="collapsed" />)
      expect(screen.getByPlaceholderText('Ask me anything...')).toBeInTheDocument()
    })

    it('sends on Enter', () => {
      const onSend = vi.fn()
      render(<ChatInput {...defaultProps} mode="collapsed" draftInput="hi" onSend={onSend} />)
      const input = screen.getByPlaceholderText('Ask me anything...')
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(onSend).toHaveBeenCalledWith('hi')
    })

    it('calls onInputFocus when focused', () => {
      const onInputFocus = vi.fn()
      render(<ChatInput {...defaultProps} mode="collapsed" onInputFocus={onInputFocus} />)
      fireEvent.focus(screen.getByPlaceholderText('Ask me anything...'))
      expect(onInputFocus).toHaveBeenCalled()
    })

    it('does not call onInputFocus in expanded mode', () => {
      const onInputFocus = vi.fn()
      render(<ChatInput {...defaultProps} mode="expanded" onInputFocus={onInputFocus} />)
      fireEvent.focus(screen.getByPlaceholderText('Ask me anything...'))
      expect(onInputFocus).not.toHaveBeenCalled()
    })
  })
})
