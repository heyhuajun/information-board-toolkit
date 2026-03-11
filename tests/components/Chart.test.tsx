import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-chart">Line</div>,
  Bar: () => <div data-testid="mock-chart">Bar</div>,
  Pie: () => <div data-testid="mock-chart">Pie</div>,
  Doughnut: () => <div data-testid="mock-chart">Doughnut</div>,
}))

import Chart from '@/components/Chart'

describe('Chart', () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{ label: 'Sales', data: [100, 200, 150] }]
  }

  it('renders chart', () => {
    render(<Chart type="chart" chartType="line" data={data} />)
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(<Chart type="chart" chartType="bar" title="Sales Chart" data={data} />)
    expect(screen.getByText('Sales Chart')).toBeInTheDocument()
  })

  it('handles bar chart type', () => {
    render(<Chart type="chart" chartType="bar" data={data} />)
    expect(screen.getByText('Bar')).toBeInTheDocument()
  })

  it('handles line chart type', () => {
    render(<Chart type="chart" chartType="line" data={data} />)
    expect(screen.getByText('Line')).toBeInTheDocument()
  })

  it('handles pie chart type', () => {
    render(<Chart type="chart" chartType="pie" data={data} />)
    expect(screen.getByText('Pie')).toBeInTheDocument()
  })

  it('handles doughnut chart type', () => {
    render(<Chart type="chart" chartType="doughnut" data={data} />)
    expect(screen.getByText('Doughnut')).toBeInTheDocument()
  })

  it('handles multiple datasets', () => {
    const multiData = {
      labels: ['Jan', 'Feb'],
      datasets: [
        { label: 'Sales', data: [100, 200] },
        { label: 'Costs', data: [50, 80] }
      ]
    }
    render(<Chart type="chart" chartType="line" data={multiData} />)
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument()
  })

  it('handles empty datasets', () => {
    const emptyData = { labels: [] as string[], datasets: [] as {label: string, data: number[]}[] }
    render(<Chart type="chart" chartType="bar" data={emptyData} />)
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument()
  })
})
