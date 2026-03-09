/**
 * 布局验证工具
 * 帮助 Agent 在提交前检查数据格式是否正确
 */

import { Component } from '../types'

export interface ValidationError {
  path: string
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

/**
 * 验证布局数据
 */
export function validateLayout(layout: Component): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  function validate(component: Component, path: string = 'layout') {
    // 1. 检查必需字段
    if (!component.type) {
      errors.push({
        path,
        message: 'Missing required field: type',
        severity: 'error'
      })
      return
    }

    // 2. 检查组件类型是否有效
    const validTypes = [
      'section', 'card', 'card-grid', 'table', 'chart', 'list',
      'quote', 'timeline', 'alert', 'markdown', 'divider',
      'compareTable', 'dataSource', 'dataBadge', 'contentCard'
    ]
    
    if (!validTypes.includes(component.type)) {
      errors.push({
        path,
        message: `Invalid component type: ${component.type}`,
        severity: 'error'
      })
      return
    }

    // 3. 类型特定验证
    switch (component.type) {
      case 'card':
        validateCard(component, path)
        break
      case 'card-grid':
        validateCardGrid(component, path)
        break
      case 'table':
        validateTable(component, path)
        break
      case 'chart':
        validateChart(component, path)
        break
      case 'compareTable':
        validateCompareTable(component, path)
        break
      case 'section':
        validateSection(component, path)
        break
    }
  }

  function validateCard(component: any, path: string) {
    if (!component.title && !component.value) {
      warnings.push({
        path,
        message: 'Card should have at least title or value',
        severity: 'warning'
      })
    }

    if (component.changeType && !['positive', 'negative', 'neutral'].includes(component.changeType)) {
      errors.push({
        path: `${path}.changeType`,
        message: `Invalid changeType: ${component.changeType}. Must be 'positive', 'negative', or 'neutral'`,
        severity: 'error'
      })
    }
  }

  function validateCardGrid(component: any, path: string) {
    if (!component.cards || !Array.isArray(component.cards)) {
      errors.push({
        path: `${path}.cards`,
        message: 'CardGrid requires cards array',
        severity: 'error'
      })
      return
    }

    if (component.cards.length === 0) {
      warnings.push({
        path: `${path}.cards`,
        message: 'CardGrid has no cards',
        severity: 'warning'
      })
    }

    component.cards.forEach((card: any, index: number) => {
      validateCard(card, `${path}.cards[${index}]`)
    })
  }

  function validateTable(component: any, path: string) {
    if (!component.headers || !Array.isArray(component.headers)) {
      errors.push({
        path: `${path}.headers`,
        message: 'Table requires headers array',
        severity: 'error'
      })
    }

    if (!component.rows || !Array.isArray(component.rows)) {
      errors.push({
        path: `${path}.rows`,
        message: 'Table requires rows array',
        severity: 'error'
      })
      return
    }

    if (component.headers && component.rows.length > 0) {
      const headerCount = component.headers.length
      component.rows.forEach((row: any[], rowIndex: number) => {
        if (row.length !== headerCount) {
          warnings.push({
            path: `${path}.rows[${rowIndex}]`,
            message: `Row has ${row.length} columns but table has ${headerCount} headers`,
            severity: 'warning'
          })
        }
      })
    }
  }

  function validateChart(component: any, path: string) {
    if (!component.chartType) {
      errors.push({
        path: `${path}.chartType`,
        message: 'Chart requires chartType',
        severity: 'error'
      })
    }

    const validChartTypes = ['line', 'bar', 'pie', 'doughnut', 'radar']
    if (component.chartType && !validChartTypes.includes(component.chartType)) {
      errors.push({
        path: `${path}.chartType`,
        message: `Invalid chartType: ${component.chartType}. Must be one of: ${validChartTypes.join(', ')}`,
        severity: 'error'
      })
    }

    if (!component.data) {
      errors.push({
        path: `${path}.data`,
        message: 'Chart requires data object',
        severity: 'error'
      })
      return
    }

    if (!component.data.labels || !Array.isArray(component.data.labels)) {
      errors.push({
        path: `${path}.data.labels`,
        message: 'Chart data requires labels array',
        severity: 'error'
      })
    }

    if (!component.data.datasets || !Array.isArray(component.data.datasets)) {
      errors.push({
        path: `${path}.data.datasets`,
        message: 'Chart data requires datasets array',
        severity: 'error'
      })
    }
  }

  function validateCompareTable(component: any, path: string) {
    if (!component.columns || !Array.isArray(component.columns)) {
      errors.push({
        path: `${path}.columns`,
        message: 'CompareTable requires columns array',
        severity: 'error'
      })
    }

    if (!component.rows || !Array.isArray(component.rows)) {
      errors.push({
        path: `${path}.rows`,
        message: 'CompareTable requires rows array',
        severity: 'error'
      })
    }
  }

  function validateSection(component: any, path: string) {
    if (!component.children || !Array.isArray(component.children)) {
      errors.push({
        path: `${path}.children`,
        message: 'Section requires children array',
        severity: 'error'
      })
      return
    }

    if (component.children.length === 0) {
      warnings.push({
        path: `${path}.children`,
        message: 'Section has no children',
        severity: 'warning'
      })
    }

    component.children.forEach((child: Component, index: number) => {
      validate(child, `${path}.children[${index}]`)
    })
  }

  // 开始验证
  validate(layout)

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * 格式化验证结果为可读文本
 */
export function formatValidationResult(result: ValidationResult): string {
  if (result.valid && result.warnings.length === 0) {
    return '✅ 验证通过'
  }

  const lines: string[] = []

  if (result.errors.length > 0) {
    lines.push('❌ 错误:')
    result.errors.forEach(error => {
      lines.push(`  - ${error.path}: ${error.message}`)
    })
  }

  if (result.warnings.length > 0) {
    lines.push('⚠️  警告:')
    result.warnings.forEach(warning => {
      lines.push(`  - ${warning.path}: ${warning.message}`)
    })
  }

  return lines.join('\n')
}
