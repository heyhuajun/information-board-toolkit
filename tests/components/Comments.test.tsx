import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Comments from '@/components/Comments'

describe('Comments', () => {
  const mockComments = [
    { id: '1', author: 'User A', content: 'Great post!', createdAt: '2024-03-10T10:00:00Z' }
  ]

  it('renders comments', () => {
    render(<Comments type="comments" comments={mockComments} />)
    expect(screen.getByText('User A')).toBeInTheDocument()
    expect(screen.getByText('Great post!')).toBeInTheDocument()
  })

  it('renders avatar placeholder when no avatar', () => {
    render(<Comments type="comments" comments={mockComments} />)
    expect(screen.getByText('U')).toBeInTheDocument()
  })

  it('renders avatar when provided', () => {
    render(<Comments type="comments" comments={[{ id: '1', author: 'User', content: 'Hi', avatar: 'https://example.com/avatar.jpg', createdAt: '2024-03-10' }]} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('renders nested replies', () => {
    render(<Comments type="comments" comments={[{ id: '1', author: 'A', content: 'Main', createdAt: '2024-03-10', replies: [{ id: '2', author: 'B', content: 'Reply', createdAt: '2024-03-10' }] }]} />)
    expect(screen.getByText('Reply')).toBeInTheDocument()
  })

  it('handles missing createdAt', () => {
    render(<Comments type="comments" comments={[{ id: '1', author: 'User', content: 'Test' }]} />)
    expect(screen.getByText('User')).toBeInTheDocument()
  })

  it('shows input when onAdd provided', () => {
    render(<Comments type="comments" comments={[]} onAdd={vi.fn()} />)
    expect(screen.getByPlaceholderText('添加评论...')).toBeInTheDocument()
  })

  it('shows reply button when onReply provided', () => {
    render(<Comments type="comments" comments={mockComments} onReply={vi.fn()} />)
    expect(screen.getByText('回复')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<Comments type="comments" comments={[]} />)
    expect(screen.getByText('暂无评论')).toBeInTheDocument()
  })
})
