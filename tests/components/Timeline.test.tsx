import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Timeline from '@/components/Timeline'

describe('Timeline', () => {
  it('renders items vertically', () => {
    render(<Timeline items={[{ title: 'Step 1' }, { title: 'Step 2' }]} />)
    expect(screen.getByText('Step 1')).toBeInTheDocument()
    expect(screen.getByText('Step 2')).toBeInTheDocument()
  })

  it('renders items horizontally', () => {
    const { container } = render(<Timeline direction="horizontal" items={[{ title: 'A' }, { title: 'B' }]} />)
    expect(container.querySelector('.overflow-x-auto')).toBeInTheDocument()
  })

  it('renders descriptions', () => {
    render(<Timeline items={[{ title: 'Step', description: 'Description text' }]} />)
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })

  it('renders dates', () => {
    render(<Timeline items={[{ title: 'Step', date: '2024-03-10' }]} />)
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('handles missing date', () => {
    render(<Timeline items={[{ title: 'Step', date: undefined }]} />)
    expect(screen.getByText('Step')).toBeInTheDocument()
  })

  it('applies completed status', () => {
    const { container } = render(<Timeline items={[{ title: 'Done', status: 'completed' }]} />)
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument()
  })

  it('applies current status', () => {
    const { container } = render(<Timeline items={[{ title: 'Now', status: 'current' }]} />)
    expect(container.querySelector('.bg-blue-500')).toBeInTheDocument()
  })

  it('applies pending status', () => {
    const { container } = render(<Timeline items={[{ title: 'Later', status: 'pending' }]} />)
    expect(container.querySelector('.bg-gray-200')).toBeInTheDocument()
  })

  it('handles empty items', () => {
    const { container } = render(<Timeline items={[]} />)
    expect(container.querySelector('.relative')).toBeInTheDocument()
  })
})
