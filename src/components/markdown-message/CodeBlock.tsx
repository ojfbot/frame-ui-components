import { CodeSnippet } from '@carbon/react'

export function CodeBlock({ className, children, ...props }: any) {
  const inline = !className
  const codeString = String(children).replace(/\n$/, '')

  if (!inline) {
    return (
      <CodeSnippet
        type="multi"
        feedback="Copied!"
        feedbackTimeout={2000}
        className="code-block"
      >
        {codeString}
      </CodeSnippet>
    )
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}
