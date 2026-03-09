import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from '@/components/Card'
import Alert from '@/components/Alert'
import Metric from '@/components/Metric'
import Divider from '@/components/Divider'

describe('Card Component', () => {
  it('should render title and value', () => {
    render(<Card title="Test Card" value={100} />)
    
    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('should render change indicator', () => {
    render(<Card title="Revenue" value="$1,000" change="+10%" changeType="positive" />)
    
    expect(screen.getByText('+10%')).toBeInTheDocument()
  })

  it('should apply correct change color for positive', () => {
    const { container } = render(<Card title="Test" value={0} change="+10%" changeType="positive" />)
    const changeElement = container.querySelector('.text-green-600')
    expect(changeElement).toBeInTheDocument()
  })

  it('should apply correct change color for negative', () => {
    const { container } = render(<Card title="Test" value={0} change="-10%" changeType="negative" />)
    const changeElement = container.querySelector('.text-red-600')
    expect(changeElement).toBeInTheDocument()
  })
})

describe('Alert Component', () => {
  it('should render alert message', () => {
    render(<Alert alertType="info" message="This is an info alert" />)
    
    expect(screen.getByText('This is an info alert')).toBeInTheDocument()
  })

  it('should render title when provided', () => {
    render(<Alert alertType="success" title="Success!" message="Operation completed" />)
    
    expect(screen.getByText('Success!')).toBeInTheDocument()
  })
})

describe('Metric Component', () => {
  it('should render label and value', () => {
    render(<Metric label="Total Users" value={1500} />)
    
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('1500')).toBeInTheDocument()
  })

  it('should render change indicator', () => {
    render(<Metric label="Users" value={100} change="+5%" changeType="positive" />)
    
    expect(screen.getByText('+5%')).toBeInTheDocument()
  })
})

describe('Divider Component', () => {
  it('should render divider element', () => {
    const { container } = render(<Divider />)
    
    const divider = container.querySelector('hr')
    expect(divider).toBeInTheDocument()
  })
})
