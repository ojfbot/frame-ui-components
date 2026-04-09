import { useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import { Button, TextInput, TextArea } from '@carbon/react'
import { SendFilled } from '@carbon/icons-react'
import type { ReactNode } from 'react'

export interface ChatInputProps {
  mode: 'expanded' | 'collapsed'
  draftInput: string
  onDraftChange: (value: string) => void
  onSend: (message: string) => void
  onInputFocus?: () => void
  placeholder?: string
  inputDisabled?: boolean
  disabledMessage?: string
  isLoading?: boolean
  inputExtra?: ReactNode
}

export function ChatInput({
  mode,
  draftInput,
  onDraftChange,
  onSend,
  onInputFocus,
  placeholder = 'Ask me anything...',
  inputDisabled = false,
  disabledMessage,
  isLoading = false,
  inputExtra,
}: ChatInputProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus textarea when switching to expanded
  useEffect(() => {
    if (mode === 'expanded') {
      setTimeout(() => textAreaRef.current?.focus(), 100)
    }
  }, [mode])

  const handleSend = () => {
    const trimmed = draftInput.trim()
    if (!trimmed || inputDisabled || isLoading) return
    onSend(trimmed)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputFocus = () => {
    if (mode !== 'expanded' && onInputFocus) {
      onInputFocus()
    }
  }

  if (mode === 'expanded') {
    return (
      <div className="chat-shell__input" data-element="condensed-chat-input-wrapper">
        {inputDisabled && disabledMessage ? (
          <p className="chat-shell__disabled-msg">{disabledMessage}</p>
        ) : (
          <div className="chat-shell__input-row">
            <div className="chat-shell__textarea">
              <TextArea
                ref={textAreaRef}
                id="chat-shell-input"
                labelText="Message"
                hideLabel
                placeholder={placeholder}
                value={draftInput}
                onChange={(e: any) => onDraftChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                rows={3}
                disabled={inputDisabled}
                data-element="chat-input"
              />
            </div>
            <div className="chat-shell__input-actions">
              {inputExtra}
              <Button
                kind="primary"
                size="sm"
                hasIconOnly
                iconDescription="Send"
                renderIcon={SendFilled}
                onClick={handleSend}
                disabled={!draftInput.trim() || inputDisabled || isLoading}
                className="chat-shell__send"
                data-element="chat-send-button"
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Collapsed: single-line input
  return (
    <div className="chat-shell__input" data-element="condensed-chat-input-wrapper">
      <div className="chat-shell__input-row">
        <TextInput
          ref={inputRef}
          id="chat-shell-collapsed-input"
          labelText=""
          hideLabel
          placeholder={placeholder}
          value={draftInput}
          onChange={(e: any) => onDraftChange(e.target.value)}
          onKeyDown={(e: any) => {
            if (e.key === 'Enter' && !isLoading) {
              e.preventDefault()
              handleSend()
            }
          }}
          onFocus={handleInputFocus}
          disabled={inputDisabled}
          size="md"
          data-element="chat-input"
        />
        <Button
          kind="primary"
          size="sm"
          hasIconOnly
          iconDescription="Send"
          renderIcon={SendFilled}
          onClick={handleSend}
          disabled={!draftInput.trim() || inputDisabled || isLoading}
          className="chat-shell__send"
          data-element="chat-send-button"
        />
      </div>
    </div>
  )
}
