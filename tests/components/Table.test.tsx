import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Table from '@/components/Table'

describe('Table', () => {
  it('renders headers', () => {
    render(<Table type="table" headers={['Name', 'Age', 'City']} rows={[['John', '25', 'NYC']]} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('City')).toBeInTheDocument()
  })

  it('renders rows', () => {
    render(<Table type="table" headers={['Name']} rows={[['Alice'], ['Bob']]} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(<Table type="table" title="Data Table" headers={['A']} rows={[]} />)
    expect(screen.getByText('Data Table')).toBeInTheDocument()
  })

  it('highlights specific row', () => {
    const { container } = render(<Table type="table" headers={['A']} rows={[['1'], ['2'], ['3']]} highlightRow={1} />)
    const rows = container.querySelectorAll('tr')
    expect(rows[2]).toHaveClass('bg-blue-50')
  })

  it('handles empty rows with headers', () => {
    render(<Table type="table" headers={['Name']} rows={[]} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('handles numeric values', () => {
    render(<Table type="table" headers={['Count']} rows={[[100], [200]]} />)
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
  })
})
