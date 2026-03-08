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

export interface BaseComponent {
  type: ComponentType
}

export interface SectionComponent extends BaseComponent {
  type: 'section'
  title?: string
  description?: string
  children: Component[]
}

export interface CardComponent extends BaseComponent {
  type: 'card'
  title: string
  value: string | number
  change?: string
  changeType?: ChangeType
  image?: string
  footer?: string
}

export interface CardGridComponent extends BaseComponent {
  type: 'card-grid'
  columns?: 1 | 2 | 3 | 4
  cards: Omit<CardComponent, 'type'>[]
}

export interface TableComponent extends BaseComponent {
  type: 'table'
  title?: string
  headers: string[]
  rows: (string | number)[][]
  highlightRow?: number
}

export interface ListComponent extends BaseComponent {
  type: 'list'
  title?: string
  items: {
    icon?: string
    text: string
  }[]
}

export interface MetricComponent extends BaseComponent {
  type: 'metric'
  label: string
  value: string | number
  change?: string
  changeType?: ChangeType
}

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

export interface MarkdownComponent extends BaseComponent {
  type: 'markdown'
  content: string
}

export interface ImageComponent extends BaseComponent {
  type: 'image'
  src: string
  caption?: string
  width?: 'full' | 'half' | 'third'
}

export interface AlertComponent extends BaseComponent {
  type: 'alert'
  alertType: AlertType
  title?: string
  message: string
}

export interface DividerComponent extends BaseComponent {
  type: 'divider'
}

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
