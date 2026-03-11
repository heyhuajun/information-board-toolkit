import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ImageGallery from '@/components/ImageGallery'

describe('ImageGallery', () => {
  const images = [
    { src: 'https://example.com/1.jpg', caption: 'Image 1' },
    { src: 'https://example.com/2.jpg', caption: 'Image 2' }
  ]

  it('renders images', () => {
    render(<ImageGallery type="imageGallery" images={images} />)
    const imgs = screen.getAllByRole('img')
    expect(imgs.length).toBe(2)
  })

  it('renders captions', () => {
    render(<ImageGallery type="imageGallery" images={images} />)
    expect(screen.getByText('Image 1')).toBeInTheDocument()
    expect(screen.getByText('Image 2')).toBeInTheDocument()
  })

  it('applies 2 columns', () => {
    const { container } = render(<ImageGallery type="imageGallery" images={images} columns={2} />)
    expect(container.querySelector('.grid-cols-2')).toBeInTheDocument()
  })

  it('applies 3 columns (default)', () => {
    const { container } = render(<ImageGallery type="imageGallery" images={images} />)
    expect(container.querySelector('.grid-cols-3')).toBeInTheDocument()
  })

  it('applies 4 columns', () => {
    const { container } = render(<ImageGallery type="imageGallery" images={images} columns={4} />)
    expect(container.querySelector('.grid-cols-4')).toBeInTheDocument()
  })

  it('handles images without captions', () => {
    render(<ImageGallery type="imageGallery" images={[{ src: 'https://example.com/1.jpg' }]} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('handles empty images', () => {
    const { container } = render(<ImageGallery type="imageGallery" images={[]} />)
    expect(container.querySelector('.grid')).toBeInTheDocument()
  })
})
