// 组件类型定义

export type ComponentType =
  | 'section'
  | 'card'
  | 'content-card'    // 内容卡片
  | 'card-grid'
  | 'table'
  | 'list'
  | 'metric'
  | 'chart'
  | 'markdown'
  | 'image'
  | 'alert'
  | 'divider'
  | 'dataSource'      // Phase 1: 数据溯源
  | 'compareTable'    // Phase 1: 对比表格
  | 'dataBadge'       // Phase 1: 数据标注
  | 'tag'             // Phase 1: 标签
  | 'badge'           // Phase 1: 徽章
  | 'quote'           // Phase 2: 引用块
  | 'timeline'        // Phase 2: 时间轴
  | 'progress'        // Phase 2: 进度条
  | 'collapse'        // Phase 2: 折叠区域
  | 'comments'        // Phase 2: 评论
  | 'versionHistory'  // Phase 2: 版本历史
  | 'template'        // Phase 2: 模板

export type ChangeType = 'positive' | 'negative' | 'neutral'
export type AlertType = 'info' | 'success' | 'warning' | 'error'
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar'
export type TagColor = 'default' | 'primary' | 'success' | 'warning' | 'danger'
export type Size = 'sm' | 'md' | 'lg'
export type ProgressStatus = 'success' | 'warning' | 'error'
export type TimelineDirection = 'horizontal' | 'vertical'
export type TimelineItemStatus = 'completed' | 'current' | 'pending'

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

// ContentCard 组件 - 多行内容卡片
export interface ContentCardComponent extends BaseComponent {
  type: 'content-card'
  title: string
  content: string
  icon?: string
  accent?: boolean
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

// ========== Phase 1 组件 ==========

// DataSource 数据溯源组件
export interface DataSourceComponent extends BaseComponent {
  type: 'dataSource'
  source: string
  url?: string
  timestamp: Date | string
  confidence?: number
  freshness?: number
  content?: string
  children?: Component[]
}

// CompareTable 对比表格组件
export interface CompareColumn {
  key: string
  label: string
}

export interface CompareRow {
  feature: string
  valueA: string | number
  valueB: string | number
  winner?: 'A' | 'B' | 'tie'
  note?: string
}

export interface CompareTableComponent extends BaseComponent {
  type: 'compareTable'
  title?: string
  columns: CompareColumn[]
  rows: CompareRow[]
  highlightDiff?: boolean
  recommend?: 'A' | 'B'
}

// DataBadge 数据标注组件
export interface DataBadgeComponent extends BaseComponent {
  type: 'dataBadge'
  confidence?: number
  freshness?: Date | string | number
  showConfidence?: boolean
  showFreshness?: boolean
  size?: Size
}

// Tag 标签组件
export interface TagComponent extends BaseComponent {
  type: 'tag'
  label: string
  color?: TagColor
  icon?: string
  size?: Size
  closable?: boolean
  onClick?: () => void
}

// Badge 徽章组件
export interface BadgeComponent extends BaseComponent {
  type: 'badge'
  count?: number
  dot?: boolean
  color?: string
  content?: string
  children?: Component[]
}

// ========== Phase 2 组件 ==========

// Quote 引用块组件
export interface QuoteComponent extends BaseComponent {
  type: 'quote'
  content: string
  author: string
  avatar?: string
  source?: string
  role?: string
}

// Timeline 时间轴组件
export interface TimelineItem {
  title: string
  description?: string
  date?: Date | string
  status?: TimelineItemStatus
  icon?: string
}

export interface TimelineComponent extends BaseComponent {
  type: 'timeline'
  items: TimelineItem[]
  direction?: TimelineDirection
}

// Progress 进度条组件
export interface ProgressComponent extends BaseComponent {
  type: 'progress'
  percent: number
  status?: ProgressStatus
  showLabel?: boolean
  size?: Size
}

// Collapse 折叠区域组件
export interface CollapseComponent extends BaseComponent {
  type: 'collapse'
  title: string
  content?: string
  children?: Component[]
  defaultExpanded?: boolean
}

// Comments 评论组件
export interface Comment {
  id: string
  author: string
  avatar?: string
  content: string
  createdAt: Date | string
  replies?: Comment[]
}

export interface CommentsComponent extends BaseComponent {
  type: 'comments'
  comments: Comment[]
  onAdd?: (content: string) => void
  onReply?: (commentId: string, content: string) => void
}

// VersionHistory 版本历史组件
export interface Version {
  version: number
  createdAt: Date | string
  author?: string
  changes?: string[]
}

export interface VersionHistoryComponent extends BaseComponent {
  type: 'versionHistory'
  currentVersion: number
  versions: Version[]
  onRestore?: (version: Version) => void
  onCompare?: (v1: Version, v2: Version) => void
}

// Template 模板组件
export interface TemplateComponent extends BaseComponent {
  type: 'template'
  templateId: string
  name?: string
  category?: string
  variables: Record<string, string | number>
  children?: Component[]
}

// 联合类型
export type Component =
  | SectionComponent
  | CardComponent
  | ContentCardComponent
  | CardGridComponent
  | TableComponent
  | ListComponent
  | MetricComponent
  | ChartComponent
  | MarkdownComponent
  | ImageComponent
  | AlertComponent
  | DividerComponent
  | DataSourceComponent
  | CompareTableComponent
  | DataBadgeComponent
  | TagComponent
  | BadgeComponent
  | QuoteComponent
  | TimelineComponent
  | ProgressComponent
  | CollapseComponent
  | CommentsComponent
  | VersionHistoryComponent
  | TemplateComponent

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