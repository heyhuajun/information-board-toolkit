import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContentCard from '@/components/ContentCard'

describe('ContentCard', () => {
  it('renders title', () => {
    render(<ContentCard type="content-card" title="Card Title" content="Content here" />)
    expect(screen.getByText('Card Title')).toBeInTheDocument()
  })

  it('renders content', () => {
    render(<ContentCard type="content-card" title="Title" content="This is the content" />)
    expect(screen.getByText('This is the content')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<ContentCard type="content-card" title="Title" content="Content" icon="📊" />)
    expect(screen.getByText('📊')).toBeInTheDocument()
  })

  it('applies accent styling', () => {
    const { container } = render(<ContentCard type="content-card" title="Title" content="Content" accent={true} />)
    expect(container.querySelector('.border-l-4')).toBeInTheDocument()
  })

  it('does not apply accent when false', () => {
    const { container } = render(<ContentCard type="content-card" title="Title" content="Content" accent={false} />)
    expect(container.querySelector('.border-l-4')).not.toBeInTheDocument()
  })
})
