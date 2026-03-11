import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Markdown from '@/components/Markdown'

describe('Markdown', () => {
  it('renders plain text', () => {
    render(<Markdown type="markdown" content="Hello World" />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders headings', () => {
    render(<Markdown type="markdown" content="# Heading 1" />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders bold text', () => {
    render(<Markdown type="markdown" content="**bold text**" />)
    expect(screen.getByText('bold text')).toBeInTheDocument()
  })

  it('renders italic text', () => {
    render(<Markdown type="markdown" content="*italic text*" />)
    expect(screen.getByText('italic text')).toBeInTheDocument()
  })

  it('renders links', () => {
    render(<Markdown type="markdown" content="[Link](https://example.com)" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('renders inline code', () => {
    const { container } = render(<Markdown type="markdown" content="`inline code`" />)
    expect(container.querySelector('code')).toBeInTheDocument()
  })

  it('handles empty content', () => {
    const { container } = render(<Markdown type="markdown" content="" />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
