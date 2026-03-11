import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CompareTable from '@/components/CompareTable'

describe('CompareTable', () => {
  const basicProps = {
    type: 'compareTable' as const,
    columns: [
      { key: 'a', label: 'Option A' },
      { key: 'b', label: 'Option B' }
    ],
    rows: [
      { feature: 'Price', valueA: '$10', valueB: '$20', winner: 'A' as const },
      { feature: 'Quality', valueA: 'Good', valueB: 'Excellent', winner: 'B' as const }
    ]
  }

  it('renders column headers', () => {
    render(<CompareTable {...basicProps} />)
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
  })

  it('renders feature names', () => {
    render(<CompareTable {...basicProps} />)
    expect(screen.getAllByText('Price').length).toBeGreaterThan(0)
  })

  it('renders title', () => {
    render(<CompareTable {...basicProps} title="Comparison Table" />)
    expect(screen.getByText('Comparison Table')).toBeInTheDocument()
  })

  it('handles no winner', () => {
    render(<CompareTable type="compareTable" columns={basicProps.columns} rows={[{ feature: 'Style', valueA: 'Modern', valueB: 'Classic' }]} />)
    expect(screen.getByText('Modern')).toBeInTheDocument()
    expect(screen.getByText('Classic')).toBeInTheDocument()
  })

  it('handles empty rows', () => {
    render(<CompareTable type="compareTable" columns={basicProps.columns} rows={[]} />)
    expect(screen.getByText('Option A')).toBeInTheDocument()
  })
})
