import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CardGrid from '@/components/CardGrid'

describe('CardGrid', () => {
  const cards = [
    { title: 'Card 1', value: 'Value 1' },
    { title: 'Card 2', value: 'Value 2' }
  ]

  it('renders cards', () => {
    render(<CardGrid type="card-grid" cards={cards} />)
    expect(screen.getByText('Card 1')).toBeInTheDocument()
    expect(screen.getByText('Card 2')).toBeInTheDocument()
  })

  it('renders card values', () => {
    render(<CardGrid type="card-grid" cards={cards} />)
    expect(screen.getAllByText('Value 1').length).toBeGreaterThan(0)
  })

  it('renders change indicators', () => {
    render(<CardGrid type="card-grid" cards={[{ title: 'Revenue', value: '$100', change: '+10%', changeType: 'positive' }]} />)
    expect(screen.getByText('+10%')).toBeInTheDocument()
  })

  it('applies 1 column layout', () => {
    const { container } = render(<CardGrid type="card-grid" cards={cards} columns={1} />)
    expect(container.querySelector('.grid-cols-1')).toBeInTheDocument()
  })

  it('applies 2 column layout', () => {
    const { container } = render(<CardGrid type="card-grid" cards={cards} columns={2} />)
    expect(container.querySelector('.md\\:grid-cols-2')).toBeInTheDocument()
  })

  it('applies 3 column layout (default)', () => {
    const { container } = render(<CardGrid type="card-grid" cards={cards} />)
    expect(container.querySelector('.lg\\:grid-cols-3')).toBeInTheDocument()
  })

  it('applies 4 column layout', () => {
    const { container } = render(<CardGrid type="card-grid" cards={cards} columns={4} />)
    expect(container.querySelector('.lg\\:grid-cols-4')).toBeInTheDocument()
  })

  it('handles empty cards', () => {
    const { container } = render(<CardGrid type="card-grid" cards={[]} />)
    expect(container.querySelector('.grid')).toBeInTheDocument()
  })
})
