/**
 * 布局验证工具
 * 帮助 Agent 在提交前检查数据格式是否正确
 */

import {
  Component,
  CardComponent,
  ContentCardComponent,
  CardGridComponent,
  TableComponent,
  ChartComponent,
  CompareTableComponent,
  SectionComponent,
  DataSourceComponent,
  TimelineComponent,
  TimelineItem,
  ProgressComponent,
  CollapseComponent,
  QuoteComponent
} from '../types'

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

// 所有有效的组件类型（与 types.ts ComponentType 保持同步）
const VALID_TYPES = [
  // 基础组件
  'section', 'card', 'content-card', 'card-grid', 'table', 'chart', 'list',
  'metric', 'markdown', 'image', 'alert', 'divider',
  // Phase 1 组件
  'dataSource', 'compareTable', 'dataBadge', 'tag', 'badge',
  // Phase 2 组件
  'quote', 'timeline', 'progress', 'collapse', 'comments', 'versionHistory', 'template'
] as const

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
    if (!VALID_TYPES.includes(component.type as typeof VALID_TYPES[number])) {
      errors.push({
        path,
        message: `Invalid component type: ${component.type}. Valid types: ${VALID_TYPES.join(', ')}`,
        severity: 'error'
      })
      return
    }

    // 3. 类型特定验证
    switch (component.type) {
      case 'card':
        validateCard(component, path)
        break
      case 'content-card':
        validateContentCard(component, path)
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
      case 'dataSource':
        validateDataSource(component, path)
        break
      case 'timeline':
        validateTimeline(component, path)
        break
      case 'progress':
        validateProgress(component, path)
        break
      case 'collapse':
        validateCollapse(component, path)
        break
      case 'quote':
        validateQuote(component, path)
        break
    }
  }

  function validateCard(component: CardComponent, path: string) {
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

  function validateContentCard(component: ContentCardComponent, path: string) {
    if (!component.title) {
      errors.push({
        path: `${path}.title`,
        message: 'ContentCard requires title',
        severity: 'error'
      })
    }
    if (!component.content) {
      warnings.push({
        path: `${path}.content`,
        message: 'ContentCard should have content',
        severity: 'warning'
      })
    }
  }

  function validateCardGrid(component: CardGridComponent, path: string) {
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

    if (component.columns && ![1, 2, 3, 4].includes(component.columns)) {
      errors.push({
        path: `${path}.columns`,
        message: 'CardGrid columns must be 1, 2, 3, or 4',
        severity: 'error'
      })
    }

    component.cards.forEach((card, index: number) => {
      validateCard({ type: 'card', ...card }, `${path}.cards[${index}]`)
    })
  }

  function validateTable(component: TableComponent, path: string) {
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
      component.rows.forEach((row, rowIndex: number) => {
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

  function validateChart(component: ChartComponent, path: string) {
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

  function validateCompareTable(component: CompareTableComponent, path: string) {
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

    if (component.recommend && !['A', 'B'].includes(component.recommend)) {
      errors.push({
        path: `${path}.recommend`,
        message: 'CompareTable recommend must be "A" or "B"',
        severity: 'error'
      })
    }
  }

  function validateSection(component: SectionComponent, path: string) {
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

  function validateDataSource(component: DataSourceComponent, path: string) {
    if (!component.source) {
      errors.push({
        path: `${path}.source`,
        message: 'DataSource requires source',
        severity: 'error'
      })
    }
    if (!component.timestamp) {
      errors.push({
        path: `${path}.timestamp`,
        message: 'DataSource requires timestamp',
        severity: 'error'
      })
    }
    if (component.confidence !== undefined && (component.confidence < 0 || component.confidence > 100)) {
      warnings.push({
        path: `${path}.confidence`,
        message: 'DataSource confidence should be between 0 and 100',
        severity: 'warning'
      })
    }
  }

  function validateTimeline(component: TimelineComponent, path: string) {
    if (!component.items || !Array.isArray(component.items)) {
      errors.push({
        path: `${path}.items`,
        message: 'Timeline requires items array',
        severity: 'error'
      })
      return
    }

    if (component.items.length === 0) {
      warnings.push({
        path: `${path}.items`,
        message: 'Timeline has no items',
        severity: 'warning'
      })
    }

    component.items.forEach((item: TimelineItem, index: number) => {
      if (!item.title) {
        errors.push({
          path: `${path}.items[${index}].title`,
          message: 'Timeline item requires title',
          severity: 'error'
        })
      }
    })
  }

  function validateProgress(component: ProgressComponent, path: string) {
    if (component.percent === undefined) {
      errors.push({
        path: `${path}.percent`,
        message: 'Progress requires percent',
        severity: 'error'
      })
    } else if (component.percent < 0 || component.percent > 100) {
      warnings.push({
        path: `${path}.percent`,
        message: 'Progress percent should be between 0 and 100',
        severity: 'warning'
      })
    }
  }

  function validateCollapse(component: CollapseComponent, path: string) {
    if (!component.title) {
      errors.push({
        path: `${path}.title`,
        message: 'Collapse requires title',
        severity: 'error'
      })
    }
  }

  function validateQuote(component: QuoteComponent, path: string) {
    if (!component.content) {
      errors.push({
        path: `${path}.content`,
        message: 'Quote requires content',
        severity: 'error'
      })
    }
    if (!component.author) {
      errors.push({
        path: `${path}.author`,
        message: 'Quote requires author',
        severity: 'error'
      })
    }
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