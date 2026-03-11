import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Quote from '@/components/Quote'

describe('Quote', () => {
  it('renders content', () => {
    render(<Quote type="quote" content="This is a quote" author="John Doe" />)
    expect(screen.getByText('This is a quote')).toBeInTheDocument()
  })

  it('renders author', () => {
    render(<Quote type="quote" content="Quote text" author="Jane Doe" />)
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })

  it('renders role when provided', () => {
    render(<Quote type="quote" content="Quote" author="John" role="CEO" />)
    expect(screen.getByText('CEO')).toBeInTheDocument()
  })

  it('renders source when provided', () => {
    render(<Quote type="quote" content="Quote" author="John" source="Interview" />)
    expect(screen.getByText('Interview')).toBeInTheDocument()
  })

  it('renders avatar when provided', () => {
    render(<Quote type="quote" content="Quote" author="John" avatar="https://example.com/avatar.jpg" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('shows author initials when no avatar', () => {
    render(<Quote type="quote" content="Quote" author="John Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('handles single word author', () => {
    render(<Quote type="quote" content="Quote" author="John" />)
    expect(screen.getByText('J')).toBeInTheDocument()
  })
})
