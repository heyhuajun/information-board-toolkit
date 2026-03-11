import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import VersionHistory from '@/components/VersionHistory'

describe('VersionHistory', () => {
  const mockVersions = [
    { version: 1, createdAt: '2024-03-01', author: 'User A', changes: ['Initial'] },
    { version: 2, createdAt: '2024-03-05', changes: ['Update 1', 'Update 2'] }
  ]

  it('renders version list', () => {
    render(<VersionHistory type="versionHistory" currentVersion={2} versions={mockVersions} />)
    expect(screen.getByText('v1')).toBeInTheDocument()
    expect(screen.getByText('v2')).toBeInTheDocument()
  })

  it('shows current version badge', () => {
    render(<VersionHistory type="versionHistory" currentVersion={2} versions={mockVersions} />)
    expect(screen.getByText('当前版本')).toBeInTheDocument()
  })

  it('renders author when provided', () => {
    render(<VersionHistory type="versionHistory" currentVersion={2} versions={mockVersions} />)
    expect(screen.getByText('User A')).toBeInTheDocument()
  })

  it('renders changes list', () => {
    render(<VersionHistory type="versionHistory" currentVersion={2} versions={mockVersions} />)
    expect(screen.getByText('Update 1')).toBeInTheDocument()
    expect(screen.getByText('Update 2')).toBeInTheDocument()
  })

  it('handles missing createdAt', () => {
    render(<VersionHistory type="versionHistory" currentVersion={1} versions={[{ version: 1 }]} />)
    expect(screen.getByText('v1')).toBeInTheDocument()
  })

  it('handles missing author', () => {
    render(<VersionHistory type="versionHistory" currentVersion={1} versions={[{ version: 1, createdAt: '2024-03-01' }]} />)
    expect(screen.getByText('v1')).toBeInTheDocument()
  })

  it('shows restore button for non-current versions', () => {
    render(<VersionHistory type="versionHistory" currentVersion={2} versions={mockVersions} onRestore={vi.fn()} />)
    expect(screen.getByText('恢复')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<VersionHistory type="versionHistory" currentVersion={1} versions={[]} />)
    expect(screen.getByText('暂无历史版本')).toBeInTheDocument()
  })
})
