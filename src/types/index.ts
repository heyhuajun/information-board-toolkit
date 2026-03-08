// 组件类型定义

export type ComponentType =
  | 'section'
  | 'card'
  | 'card-grid'
  | 'table'
  | 'list'
  | 'metric'
  | 'chart'
  | 'markdown'
  | 'image'
  | 'alert'
  | 'divider'

export type ChangeType = 'positive' | 'negative' | 'neutral'
export type AlertType = 'info' | 'success' | 'warning' | 'error'
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut'

// 基础组件接口
export interface BaseComponent {
  type: ComponentType
}

// Section 组件
export interface SectionComponent extends BaseComponent {
  type: 'section'
  title?: string
  description?: string
  children: Component[]
}

// Card 组件
export interface CardComponent extends BaseComponent {
  type: 'card'
  title: string
  value: string | number
  change?: string
  changeType?: ChangeType
  image?: string
  footer?: string
}

// CardGrid 组件
export interface CardGridComponent extends BaseComponent {
  type: 'card-grid'
  columns?: 1 | 2 | 3 | 4
  cards: Omit<CardComponent, 'type'>[]
}

// Table 组件
export interface TableComponent extends BaseComponent {
  type: 'table'
  title?: string
  headers: string[]
  rows: (string | number)[][]
  highlightRow?: number
}

// List 组件
export interface ListComponent extends BaseComponent {
  type: 'list'
  title?: string
  items: {
    icon?: string
    text: string
  }[]
}

// Metric 组件
export interface MetricComponent extends BaseComponent {
  type: 'metric'
  label: string
  value: string | number
  change?: string
  changeType?: ChangeType
}

// Chart 组件
export interface ChartComponent extends BaseComponent {
  type: 'chart'
  chartType: ChartType
  title?: string
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
    }[]
  }
}

// Markdown 组件
export interface MarkdownComponent extends BaseComponent {
  type: 'markdown'
  content: string
}

// Image 组件
export interface ImageComponent extends BaseComponent {
  type: 'image'
  src: string
  caption?: string
  width?: 'full' | 'half' | 'third'
}

// Alert 组件
export interface AlertComponent extends BaseComponent {
  type: 'alert'
  alertType: AlertType
  title?: string
  message: string
}

// Divider 组件
export interface DividerComponent extends BaseComponent {
  type: 'divider'
}

// 联合类型
export type Component =
  | SectionComponent
  | CardComponent
  | CardGridComponent
  | TableComponent
  | ListComponent
  | MetricComponent
  | ChartComponent
  | MarkdownComponent
  | ImageComponent
  | AlertComponent
  | DividerComponent

// Board 数据结构
export interface BoardData {
  id: string
  title: string
  description?: string
  layout: Component
  meta?: {
    author?: string
    tags?: string[]
  }
  shareToken: string
  expiresAt?: string
  views: number
  createdAt: string
  updatedAt: string
}

// API 请求/响应类型
export interface SubmitBoardRequest {
  title: string
  description?: string
  expiresIn?: '1h' | '24h' | '7d' | '30d' | 'never'
  layout: Component
  meta?: {
    author?: string
    tags?: string[]
  }
}

export interface SubmitBoardResponse {
  id: string
  shareUrl: string
  expiresAt?: string
  createdAt: string
}

export interface ViewBoardResponse extends BoardData {
  stats: {
    views: number
    lastViewed?: string
  }
}

export interface ListBoardsResponse {
  items: {
    id: string
    title: string
    views: number
    createdAt: string
  }[]
  total: number
}
