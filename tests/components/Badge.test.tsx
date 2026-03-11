import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from '@/components/Badge'

describe('Badge', () => {
  it('renders count', () => {
    render(<Badge type="badge" count={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows dot when dot=true', () => {
    const { container } = render(<Badge type="badge" dot={true} />)
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument()
  })

  it('hides count when count=0', () => {
    render(<Badge type="badge" count={0} />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows 99+ for count > 99', () => {
    render(<Badge type="badge" count={100} />)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('applies custom color', () => {
    const { container } = render(<Badge type="badge" count={3} color="#ff0000" />)
    expect(container.querySelector('[style*="#ff0000"]')).toBeInTheDocument()
  })

  it('renders content string', () => {
    render(<Badge type="badge" content="NEW" />)
    expect(screen.getByText('NEW')).toBeInTheDocument()
  })

  it('renders children components', () => {
    render(<Badge type="badge" count={3} children={[{ type: 'card', title: 'Test', value: '100' }]} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('handles no children', () => {
    const { container } = render(<Badge type="badge" count={3} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
