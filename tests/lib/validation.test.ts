import { describe, it, expect } from 'vitest'
import {
  VALIDATION,
  getObjectDepth,
  countChildren,
  validateLayout,
  validateTitle,
  validateDescription,
  validateExpiresIn,
} from '@/lib/validation'
import type { Component } from '@/types'

describe('Validation Constants', () => {
  it('should have correct title length limits', () => {
    expect(VALIDATION.TITLE_MIN_LENGTH).toBe(1)
    expect(VALIDATION.TITLE_MAX_LENGTH).toBe(200)
  })

  it('should have correct description max length', () => {
    expect(VALIDATION.DESCRIPTION_MAX_LENGTH).toBe(1000)
  })

  it('should have correct layout limits', () => {
    expect(VALIDATION.LAYOUT_MAX_DEPTH).toBe(10)
    expect(VALIDATION.LAYOUT_MAX_CHILDREN).toBe(100)
    expect(VALIDATION.LAYOUT_MAX_SIZE_KB).toBe(500)
  })

  it('should have correct max body size', () => {
    expect(VALIDATION.MAX_BODY_SIZE_BYTES).toBe(1024 * 1024) // 1MB
  })

  it('should have valid expires in options', () => {
    expect(VALIDATION.VALID_EXPIRES_IN).toEqual(['1h', '24h', '7d', '30d', 'never'])
  })
})

describe('getObjectDepth', () => {
  it('should return 0 for primitive values', () => {
    expect(getObjectDepth('string')).toBe(0)
    expect(getObjectDepth(123)).toBe(0)
    expect(getObjectDepth(true)).toBe(0)
    expect(getObjectDepth(null)).toBe(0)
  })

  it('should return 1 for simple object', () => {
    expect(getObjectDepth({ type: 'card' })).toBe(1)
  })

  it('should return correct depth for nested objects', () => {
    const nested = {
      type: 'section',
      children: [
        { type: 'card', title: 'test' }
      ]
    }
    expect(getObjectDepth(nested)).toBe(3)
  })

  it('should return correct depth for arrays', () => {
    expect(getObjectDepth([1, 2, 3])).toBe(1)
    expect(getObjectDepth([[1, 2]])).toBe(2)
  })

  it('should handle deeply nested objects', () => {
    const deep: Record<string, unknown> = { type: 'card' }
    let current = deep
    for (let i = 0; i < 20; i++) {
      current.child = { type: 'card' }
      current = current.child as Record<string, unknown>
    }
    expect(getObjectDepth(deep)).toBeGreaterThan(VALIDATION.LAYOUT_MAX_DEPTH)
  })
})

describe('countChildren', () => {
  it('should return 0 for non-section components', () => {
    const card: Component = { type: 'card', title: 'Test', value: 100 }
    expect(countChildren(card)).toBe(0)
  })

  it('should return 0 for section with no children', () => {
    const section: Component = { type: 'section', children: [] }
    expect(countChildren(section)).toBe(0)
  })

  it('should count direct children', () => {
    const section: Component = {
      type: 'section',
      children: [
        { type: 'card', title: 'Card 1', value: 1 },
        { type: 'card', title: 'Card 2', value: 2 },
      ]
    }
    expect(countChildren(section)).toBe(2)
  })

  it('should count nested children', () => {
    const section: Component = {
      type: 'section',
      children: [
        { type: 'card', title: 'Card 1', value: 1 },
        {
          type: 'section',
          children: [
            { type: 'card', title: 'Card 2', value: 2 },
            { type: 'card', title: 'Card 3', value: 3 },
          ]
        },
      ]
    }
    // 2 direct + 2 nested = 4
    expect(countChildren(section)).toBe(4)
  })
})

describe('validateLayout', () => {
  it('should validate a simple layout', () => {
    const layout: Component = { type: 'card', title: 'Test', value: 100 }
    const result = validateLayout(layout)
    expect(result.valid).toBe(true)
  })

  it('should validate a section with children', () => {
    const layout: Component = {
      type: 'section',
      title: 'Test Section',
      children: [
        { type: 'card', title: 'Card 1', value: 1 },
        { type: 'card', title: 'Card 2', value: 2 },
      ]
    }
    const result = validateLayout(layout)
    expect(result.valid).toBe(true)
  })

  it('should reject layout exceeding max depth', () => {
    let layout: Component = { type: 'card', title: 'Deep', value: 0 }
    for (let i = 0; i < 15; i++) {
      layout = { type: 'section', children: [layout] }
    }
    const result = validateLayout(layout)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('嵌套深度')
  })

  it('should reject layout exceeding max children', () => {
    const children = []
    for (let i = 0; i < 150; i++) {
      children.push({ type: 'card', title: `Card ${i}`, value: i })
    }
    const layout: Component = { type: 'section', children }
    const result = validateLayout(layout)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('组件数量')
  })

  it('should reject layout exceeding max size', () => {
    const layout: Component = {
      type: 'section',
      children: []
    }
    // Create a layout larger than 500KB
    const largeContent = 'x'.repeat(600 * 1024)
    ;(layout as { type: 'section'; children: Component[] }).children.push({
      type: 'markdown',
      content: largeContent
    })
    const result = validateLayout(layout)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('大小')
  })
})

describe('validateTitle', () => {
  it('should validate a normal title', () => {
    const result = validateTitle('Test Board Title')
    expect(result.valid).toBe(true)
  })

  it('should validate title with minimum length', () => {
    const result = validateTitle('A')
    expect(result.valid).toBe(true)
  })

  it('should validate title with maximum length', () => {
    const result = validateTitle('A'.repeat(200))
    expect(result.valid).toBe(true)
  })

  it('should reject empty title', () => {
    const result = validateTitle('')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('不能少于')
  })

  it('should reject title exceeding max length', () => {
    const result = validateTitle('A'.repeat(201))
    expect(result.valid).toBe(false)
    expect(result.error).toContain('不能超过')
  })
})

describe('validateDescription', () => {
  it('should validate a normal description', () => {
    const result = validateDescription('This is a test description')
    expect(result.valid).toBe(true)
  })

  it('should validate undefined description', () => {
    const result = validateDescription(undefined)
    expect(result.valid).toBe(true)
  })

  it('should validate empty description', () => {
    const result = validateDescription('')
    expect(result.valid).toBe(true)
  })

  it('should validate description with maximum length', () => {
    const result = validateDescription('A'.repeat(1000))
    expect(result.valid).toBe(true)
  })

  it('should reject description exceeding max length', () => {
    const result = validateDescription('A'.repeat(1001))
    expect(result.valid).toBe(false)
    expect(result.error).toContain('不能超过')
  })
})

describe('validateExpiresIn', () => {
  it('should validate undefined expiresIn', () => {
    const result = validateExpiresIn(undefined)
    expect(result.valid).toBe(true)
  })

  it('should validate valid expiresIn values', () => {
    expect(validateExpiresIn('1h').valid).toBe(true)
    expect(validateExpiresIn('24h').valid).toBe(true)
    expect(validateExpiresIn('7d').valid).toBe(true)
    expect(validateExpiresIn('30d').valid).toBe(true)
    expect(validateExpiresIn('never').valid).toBe(true)
  })

  it('should reject invalid expiresIn values', () => {
    const result = validateExpiresIn('invalid')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('必须是')
  })

  it('should reject numeric expiresIn', () => {
    const result = validateExpiresIn('60')
    expect(result.valid).toBe(false)
  })
})
