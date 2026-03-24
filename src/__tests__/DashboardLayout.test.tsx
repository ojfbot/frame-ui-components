import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardLayout } from '../components/DashboardLayout'

describe('DashboardLayout', () => {
  it('renders children', () => {
    render(
      <DashboardLayout>
        <div>Dashboard content</div>
      </DashboardLayout>,
    )
    expect(screen.getByText('Dashboard content')).toBeInTheDocument()
  })

  it('applies shell-mode class', () => {
    const { container } = render(
      <DashboardLayout shellMode>
        <div />
      </DashboardLayout>,
    )
    expect(container.querySelector('.frame-dashboard--shell')).toBeTruthy()
  })

  it('applies sidebar class', () => {
    const { container } = render(
      <DashboardLayout sidebarExpanded>
        <div />
      </DashboardLayout>,
    )
    expect(container.querySelector('.frame-dashboard--sidebar')).toBeTruthy()
  })

  it('applies chat-expanded class', () => {
    const { container } = render(
      <DashboardLayout chatExpanded>
        <div />
      </DashboardLayout>,
    )
    expect(container.querySelector('.frame-dashboard--chat-expanded')).toBeTruthy()
  })

  it('combines multiple modifier classes', () => {
    const { container } = render(
      <DashboardLayout shellMode sidebarExpanded chatExpanded>
        <div />
      </DashboardLayout>,
    )
    const el = container.querySelector('.frame-dashboard')!
    expect(el.classList.contains('frame-dashboard--shell')).toBe(true)
    expect(el.classList.contains('frame-dashboard--sidebar')).toBe(true)
    expect(el.classList.contains('frame-dashboard--chat-expanded')).toBe(true)
  })

  it('sets data-element attribute', () => {
    const { container } = render(
      <DashboardLayout>
        <div />
      </DashboardLayout>,
    )
    expect(container.querySelector('[data-element="app-container"]')).toBeTruthy()
  })

  it('renders Header sub-component', () => {
    render(
      <DashboardLayout>
        <DashboardLayout.Header>
          <h1>Title</h1>
        </DashboardLayout.Header>
      </DashboardLayout>,
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <DashboardLayout className="my-custom">
        <div />
      </DashboardLayout>,
    )
    expect(container.querySelector('.my-custom')).toBeTruthy()
  })
})
