import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Collapse from '@/components/Collapse'

describe('Collapse', () => {
  it('renders title', () => {
    render(<Collapse type="collapse" title="Click to expand" />)
    expect(screen.getByText('Click to expand')).toBeInTheDocument()
  })

  it('does not show content by default', () => {
    render(<Collapse type="collapse" title="Title" content="Hidden content" />)
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('shows content when defaultExpanded=true', () => {
    render(<Collapse type="collapse" title="Title" content="Visible content" defaultExpanded={true} />)
    expect(screen.getByText('Visible content')).toBeInTheDocument()
  })

  it('shows content after clicking title', () => {
    render(<Collapse type="collapse" title="Title" content="Hidden content" />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByText('Hidden content')).toBeInTheDocument()
  })

  it('renders children when expanded', () => {
    render(
      <Collapse type="collapse" title="Title" defaultExpanded={true}>
        {[{ type: 'card', title: 'Child Card', value: '100' }]}
      </Collapse>
    )
    expect(screen.getByText('Child Card')).toBeInTheDocument()
  })

  it('handles empty children array', () => {
    const { container } = render(<Collapse type="collapse" title="Title" children={[]} />)
    expect(container.querySelector('.rounded-lg')).toBeInTheDocument()
  })
})
