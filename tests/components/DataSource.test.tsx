import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DataSource from '@/components/DataSource'

describe('DataSource', () => {
  it('renders source indicator', () => {
    render(<DataSource type="dataSource" source="Test Source" timestamp="2024-03-10T10:00:00Z" />)
    expect(screen.getByText('📊')).toBeInTheDocument()
  })

  it('renders content when provided', () => {
    render(
      <DataSource 
        type="dataSource" 
        source="Test Source" 
        content="Test content here"
        timestamp="2024-03-10T10:00:00Z"
      />
    )
    expect(screen.getByText('Test content here')).toBeInTheDocument()
  })

  it('expands to show details on click', () => {
    render(
      <DataSource 
        type="dataSource" 
        source="Test Source" 
        timestamp="2024-03-10T10:00:00Z"
        confidence={90}
      />
    )
    fireEvent.click(screen.getByText('📊').closest('div')!)
    expect(screen.getByText(/时间:/)).toBeInTheDocument()
  })

  it('handles missing timestamp gracefully', () => {
    render(<DataSource type="dataSource" source="Test Source" />)
    fireEvent.click(screen.getByText('📊').closest('div')!)
    expect(screen.getByText('未知时间')).toBeInTheDocument()
  })

  it('handles missing freshness gracefully', () => {
    render(<DataSource type="dataSource" source="Test Source" />)
    fireEvent.click(screen.getByText('📊').closest('div')!)
    expect(screen.getByText('0天')).toBeInTheDocument()
  })

  it('shows confidence when provided', () => {
    render(
      <DataSource 
        type="dataSource" 
        source="Test Source" 
        timestamp="2024-03-10T10:00:00Z"
        confidence={95}
      />
    )
    fireEvent.click(screen.getByText('📊').closest('div')!)
    expect(screen.getByText('95%')).toBeInTheDocument()
  })

  it('is collapsed by default', () => {
    render(
      <DataSource 
        type="dataSource" 
        source="Test Source" 
        timestamp="2024-03-10T10:00:00Z"
        confidence={90}
      />
    )
    expect(screen.queryByText('置信度:')).not.toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <DataSource 
        type="dataSource" 
        source="Test Source" 
        timestamp="2024-03-10T10:00:00Z"
      >
        {[{ type: 'card', title: 'Child Card', value: '100' }]}
      </DataSource>
    )
    expect(screen.getByText('Child Card')).toBeInTheDocument()
  })

  it('handles empty children array', () => {
    render(<DataSource type="dataSource" source="Test Source" children={[]} />)
    expect(screen.getByText('📊')).toBeInTheDocument()
  })
})
