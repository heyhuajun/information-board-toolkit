import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Progress from '@/components/Progress'

describe('Progress', () => {
  it('renders progress bar', () => {
    const { container } = render(<Progress type="progress" percent={50} />)
    expect(container.querySelector('[class*="bg-"]')).toBeInTheDocument()
  })

  it('shows correct width for percent', () => {
    const { container } = render(<Progress type="progress" percent={75} />)
    const bar = container.querySelector('[style*="width"]')
    expect(bar).toHaveStyle({ width: '75%' })
  })

  it('shows label when showLabel=true', () => {
    render(<Progress type="progress" percent={60} showLabel={true} />)
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('hides label when showLabel=false', () => {
    render(<Progress type="progress" percent={60} showLabel={false} />)
    expect(screen.queryByText('60%')).not.toBeInTheDocument()
  })

  it('applies success status color', () => {
    const { container } = render(<Progress type="progress" percent={100} status="success" />)
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument()
  })

  it('applies warning status color', () => {
    const { container } = render(<Progress type="progress" percent={70} status="warning" />)
    expect(container.querySelector('.bg-yellow-500')).toBeInTheDocument()
  })

  it('applies error status color', () => {
    const { container } = render(<Progress type="progress" percent={30} status="error" />)
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument()
  })

  it('shows completion indicator at 100%', () => {
    render(<Progress type="progress" percent={100} />)
    expect(screen.getByText('已完成')).toBeInTheDocument()
  })

  it('handles 0 percent', () => {
    const { container } = render(<Progress type="progress" percent={0} />)
    const bar = container.querySelector('[style*="width"]')
    expect(bar).toHaveStyle({ width: '0%' })
  })
})
