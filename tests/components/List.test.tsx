import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import List from '@/components/List'

describe('List', () => {
  it('renders items', () => {
    render(<List type="list" items={[{ text: 'Item 1' }, { text: 'Item 2' }]} />)
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('renders icons', () => {
    render(<List type="list" items={[{ icon: '✅', text: 'Done' }]} />)
    expect(screen.getByText('✅')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(<List type="list" title="Todo List" items={[]} />)
    expect(screen.getByText('Todo List')).toBeInTheDocument()
  })

  it('handles items without icons', () => {
    render(<List type="list" items={[{ text: 'No icon' }]} />)
    expect(screen.getByText('No icon')).toBeInTheDocument()
  })

  it('handles empty items', () => {
    const { container } = render(<List type="list" items={[]} />)
    expect(container.querySelector('ul')).toBeInTheDocument()
  })
})
