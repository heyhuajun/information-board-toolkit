import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Tag from '@/components/Tag'

describe('Tag', () => {
  it('renders label', () => {
    render(<Tag type="tag" label="Important" />)
    expect(screen.getByText('Important')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<Tag type="tag" label="Warning" icon="⚠️" />)
    expect(screen.getByText('⚠️')).toBeInTheDocument()
  })

  it('applies primary color', () => {
    const { container } = render(<Tag type="tag" label="Tag" color="primary" />)
    expect(container.querySelector('.bg-blue-100')).toBeInTheDocument()
  })

  it('applies success color', () => {
    const { container } = render(<Tag type="tag" label="Tag" color="success" />)
    expect(container.querySelector('.bg-green-100')).toBeInTheDocument()
  })

  it('applies warning color', () => {
    const { container } = render(<Tag type="tag" label="Tag" color="warning" />)
    expect(container.querySelector('.bg-yellow-100')).toBeInTheDocument()
  })

  it('applies danger color', () => {
    const { container } = render(<Tag type="tag" label="Tag" color="danger" />)
    expect(container.querySelector('.bg-red-100')).toBeInTheDocument()
  })

  it('shows close button when closable=true', () => {
    render(<Tag type="tag" label="Tag" closable={true} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Tag type="tag" label="Clickable" onClick={onClick} />)
    fireEvent.click(screen.getByText('Clickable'))
    expect(onClick).toHaveBeenCalled()
  })
})
