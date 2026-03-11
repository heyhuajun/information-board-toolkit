import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Image from '@/components/Image'

describe('Image', () => {
  it('renders image with valid URL', () => {
    render(<Image type="image" src="https://example.com/image.jpg" />)
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
  })

  it('renders caption', () => {
    render(<Image type="image" src="https://example.com/image.jpg" caption="Image caption" />)
    expect(screen.getByText('Image caption')).toBeInTheDocument()
  })

  it('applies full width', () => {
    const { container } = render(<Image type="image" src="https://example.com/image.jpg" width="full" />)
    expect(container.querySelector('.w-full')).toBeInTheDocument()
  })

  it('applies half width', () => {
    const { container } = render(<Image type="image" src="https://example.com/image.jpg" width="half" />)
    expect(container.querySelector('.w-full')).toBeInTheDocument()
  })

  it('shows error for invalid URL', () => {
    render(<Image type="image" src="javascript:alert(1)" />)
    expect(screen.getByText('图片地址无效')).toBeInTheDocument()
  })

  it('handles missing caption', () => {
    render(<Image type="image" src="https://example.com/image.jpg" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
