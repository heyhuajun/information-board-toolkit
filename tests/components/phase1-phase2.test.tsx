import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import DataSource from '@/components/DataSource'
import CompareTable from '@/components/CompareTable'
import DataBadge from '@/components/DataBadge'
import Tag from '@/components/Tag'
import Badge from '@/components/Badge'
import Timeline from '@/components/Timeline'
import Progress from '@/components/Progress'
import Collapse from '@/components/Collapse'
import Quote from '@/components/Quote'

afterEach(() => {
  cleanup()
})

describe('DataSource Component', () => {
  it('should render content', () => {
    render(
      <DataSource
        source="Amazon"
        timestamp="2026-03-08T10:30:00Z"
        confidence={95}
        freshness={2}
        content="市场规模 $1.2B"
      />
    )
    
    expect(screen.getByText('市场规模 $1.2B')).toBeInTheDocument()
  })

  it('should show freshness emoji indicator', () => {
    const { container } = render(
      <DataSource
        source="Test"
        timestamp="2026-03-08T10:30:00Z"
        confidence={95}
        freshness={2}
        content="Test content"
      />
    )
    
    expect(container.textContent).toContain('🟢')
  })

  it('should show expanded details when clicked', () => {
    render(
      <DataSource
        source="Amazon"
        timestamp="2026-03-08T10:30:00Z"
        confidence={95}
        freshness={2}
        content="Unique test content xyz"
      />
    )
    
    const clickableArea = screen.getByText('Unique test content xyz').closest('.cursor-pointer')
    fireEvent.click(clickableArea!)
    
    expect(screen.getByText('来源:')).toBeInTheDocument()
    expect(screen.getByText('Amazon')).toBeInTheDocument()
  })
})

describe('CompareTable Component', () => {
  const mockColumns = [
    { key: 'a', label: '方案 A' },
    { key: 'b', label: '方案 B' },
  ]

  const mockRows = [
    { feature: '价格', valueA: '$29.99', valueB: '$35.00', winner: 'A' as const },
    { feature: '评分', valueA: '4.5', valueB: '4.8', winner: 'B' as const },
  ]

  it('should render table with title and features', () => {
    render(
      <CompareTable
        type="compareTable"
        title="竞品对比测试"
        columns={mockColumns}
        rows={mockRows}
      />
    )
    
    expect(screen.getByText('竞品对比测试')).toBeInTheDocument()
    expect(screen.getByText('价格')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
  })

  it('should show recommend badge when recommend is provided', () => {
    render(
      <CompareTable
        type="compareTable"
        title="推荐测试"
        columns={mockColumns}
        rows={mockRows}
        recommend="A"
      />
    )
    
    expect(screen.getByText(/推荐方案/)).toBeInTheDocument()
  })
})

describe('DataBadge Component', () => {
  it('should render freshness indicator', () => {
    const { container } = render(
      <DataBadge
        type="dataBadge"
        confidence={95}
        freshness="2026-03-06T00:00:00Z"
        showFreshness
      />
    )
    
    const indicator = container.querySelector('.rounded-full')
    expect(indicator).toBeInTheDocument()
  })

  it('should hide elements based on props', () => {
    render(
      <DataBadge
        type="dataBadge"
        confidence={95}
        showConfidence={false}
      />
    )
    
    expect(screen.queryByText('95')).not.toBeInTheDocument()
  })
})

describe('Tag Component', () => {
  it('should render tag label', () => {
    render(<Tag type="tag" label="测试标签" />)
    
    expect(screen.getByText('测试标签')).toBeInTheDocument()
  })

  it('should apply different colors', () => {
    const { container } = render(<Tag type="tag" label="Success" color="success" />)
    
    expect(container.querySelector('.bg-green-100')).toBeInTheDocument()
  })
})

describe('Badge Component', () => {
  it('should render count badge', () => {
    render(<Badge type="badge" count={5} />)
    
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should show 99+ for counts over 99', () => {
    render(<Badge type="badge" count={150} />)
    
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('should render dot badge', () => {
    const { container } = render(<Badge type="badge" dot />)
    
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument()
  })
})

describe('Timeline Component', () => {
  const mockItems = [
    { title: '需求确认', date: '2026-03-01', status: 'completed' as const },
    { title: '开发中', date: '2026-03-08', status: 'current' as const },
    { title: '上线', status: 'pending' as const },
  ]

  it('should render timeline items', () => {
    render(<Timeline type="timeline" items={mockItems} />)
    
    expect(screen.getByText('需求确认')).toBeInTheDocument()
    expect(screen.getByText('开发中')).toBeInTheDocument()
    expect(screen.getByText('上线')).toBeInTheDocument()
  })

  it('should apply correct status styles for completed items', () => {
    const { container } = render(<Timeline type="timeline" items={mockItems} />)
    
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument()
  })
})

describe('Progress Component', () => {
  it('should render progress bar', () => {
    const { container } = render(<Progress type="progress" percent={75} />)
    
    const progressBar = container.querySelector('[style*="width: 75%"]')
    expect(progressBar).toBeInTheDocument()
  })

  it('should show percentage label', () => {
    const { container } = render(<Progress type="progress" percent={75} showLabel />)
    
    expect(container.textContent).toContain('75%')
  })

  it('should apply success color for high values', () => {
    const { container } = render(<Progress type="progress" percent={85} />)
    
    expect(container.querySelector('.bg-green-500')).toBeInTheDocument()
  })

  it('should apply warning color for medium values', () => {
    const { container } = render(<Progress type="progress" percent={50} />)
    
    expect(container.querySelector('.bg-yellow-500')).toBeInTheDocument()
  })

  it('should apply error color for low values', () => {
    const { container } = render(<Progress type="progress" percent={20} />)
    
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument()
  })
})

describe('Collapse Component', () => {
  it('should render title', () => {
    render(
      <Collapse type="collapse" title="详细信息" content="Hidden content" />
    )
    
    expect(screen.getByText('详细信息')).toBeInTheDocument()
  })

  it('should toggle content on click', () => {
    render(
      <Collapse type="collapse" title="详细信息" content="Hidden content xyz" />
    )
    
    expect(screen.queryByText('Hidden content xyz')).not.toBeInTheDocument()
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByText('Hidden content xyz')).toBeInTheDocument()
  })

  it('should be expanded by default when defaultExpanded is true', () => {
    render(
      <Collapse type="collapse" title="详细信息" content="Visible content abc" defaultExpanded />
    )
    
    expect(screen.getByText('Visible content abc')).toBeInTheDocument()
  })
})

describe('Quote Component', () => {
  it('should render quote content and author', () => {
    render(
      <Quote
        type="quote"
        content="这是一个用户反馈测试"
        author="张三"
      />
    )
    
    expect(screen.getByText(/这是一个用户反馈测试/)).toBeInTheDocument()
    expect(screen.getByText('张三')).toBeInTheDocument()
  })

  it('should render avatar when provided', () => {
    render(
      <Quote
        type="quote"
        content="反馈内容测试"
        author="李四"
        avatar="https://example.com/avatar.jpg"
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('should render role when provided', () => {
    render(
      <Quote
        type="quote"
        content="反馈内容测试2"
        author="王五"
        role="产品经理"
      />
    )
    
    expect(screen.getByText('产品经理')).toBeInTheDocument()
  })
})
