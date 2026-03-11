import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DataBadge from '@/components/DataBadge'

describe('DataBadge', () => {
  describe('confidence', () => {
    it('shows 3 stars for high confidence (>=90)', () => {
      render(<DataBadge type="dataBadge" confidence={95} />)
      expect(screen.getByText('⭐⭐⭐')).toBeInTheDocument()
      expect(screen.getByText('95%')).toBeInTheDocument()
    })

    it('shows 2 stars for medium confidence (>=70)', () => {
      render(<DataBadge type="dataBadge" confidence={80} />)
      expect(screen.getByText('⭐⭐')).toBeInTheDocument()
    })

    it('shows 1 star for low confidence (<70)', () => {
      render(<DataBadge type="dataBadge" confidence={50} />)
      expect(screen.getByText('⭐')).toBeInTheDocument()
    })

    it('hides confidence when not provided', () => {
      render(<DataBadge type="dataBadge" />)
      expect(screen.queryByText('%')).not.toBeInTheDocument()
    })
  })

  describe('freshness', () => {
    it('shows green badge for fresh data (<=7 days)', () => {
      render(<DataBadge type="dataBadge" freshness={3} />)
      expect(screen.getByText('🟢')).toBeInTheDocument()
    })

    it('shows yellow badge for moderate freshness (<=30 days)', () => {
      render(<DataBadge type="dataBadge" freshness={15} />)
      expect(screen.getByText('🟡')).toBeInTheDocument()
    })

    it('shows red badge for stale data (>30 days)', () => {
      render(<DataBadge type="dataBadge" freshness={60} />)
      expect(screen.getByText('🔴')).toBeInTheDocument()
    })

    it('hides freshness when showFreshness=false', () => {
      render(<DataBadge type="dataBadge" freshness={5} showFreshness={false} />)
      expect(screen.queryByText('天')).not.toBeInTheDocument()
    })
  })

  describe('sizes', () => {
    it('applies sm size', () => {
      const { container } = render(<DataBadge type="dataBadge" confidence={90} size="sm" />)
      expect(container.querySelector('.text-xs')).toBeInTheDocument()
    })

    it('applies md size (default)', () => {
      const { container } = render(<DataBadge type="dataBadge" confidence={90} />)
      expect(container.querySelector('.text-sm')).toBeInTheDocument()
    })

    it('applies lg size', () => {
      const { container } = render(<DataBadge type="dataBadge" confidence={90} size="lg" />)
      expect(container.querySelector('.text-base')).toBeInTheDocument()
    })
  })

  it('renders with both confidence and freshness', () => {
    render(<DataBadge type="dataBadge" confidence={95} freshness={2} />)
    expect(screen.getByText('⭐⭐⭐')).toBeInTheDocument()
    expect(screen.getByText('🟢')).toBeInTheDocument()
  })

  it('renders with no data', () => {
    const { container } = render(<DataBadge type="dataBadge" />)
    expect(container.querySelector('.inline-flex')).toBeInTheDocument()
  })
})
