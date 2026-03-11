import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Section from '@/components/Section'

describe('Section', () => {
  it('renders title', () => {
    render(<Section type="section" title="Section Title" children={[]} />)
    expect(screen.getByText('Section Title')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<Section type="section" title="Title" description="Description text" children={[]} />)
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <Section type="section" children={[
        { type: 'card', title: 'Child Card', value: '100' }
      ]} />
    )
    expect(screen.getByText('Child Card')).toBeInTheDocument()
  })

  it('handles empty children', () => {
    const { container } = render(<Section type="section" children={[]} />)
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('handles no title', () => {
    const { container } = render(<Section type="section" children={[]} />)
    expect(container.querySelector('section')).toBeInTheDocument()
  })
})
