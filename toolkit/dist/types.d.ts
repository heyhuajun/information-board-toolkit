export type ComponentType = 'section' | 'card' | 'content-card' | 'card-grid' | 'table' | 'list' | 'metric' | 'chart' | 'markdown' | 'image' | 'alert' | 'divider' | 'dataSource' | 'compareTable' | 'dataBadge' | 'tag' | 'badge' | 'quote' | 'timeline' | 'progress' | 'collapse' | 'comments' | 'versionHistory' | 'template';
export type ChangeType = 'positive' | 'negative' | 'neutral';
export type AlertType = 'info' | 'success' | 'warning' | 'error';
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar';
export type TagColor = 'default' | 'primary' | 'success' | 'warning' | 'danger';
export type Size = 'sm' | 'md' | 'lg';
export type ProgressStatus = 'success' | 'warning' | 'error';
export type TimelineDirection = 'horizontal' | 'vertical';
export type TimelineItemStatus = 'completed' | 'current' | 'pending';
export interface BaseComponent {
    type: ComponentType;
}
export interface SectionComponent extends BaseComponent {
    type: 'section';
    title?: string;
    description?: string;
    children: Component[];
}
export interface CardComponent extends BaseComponent {
    type: 'card';
    title: string;
    value: string | number;
    change?: string;
    changeType?: ChangeType;
    image?: string;
    footer?: string;
}
export interface ContentCardComponent extends BaseComponent {
    type: 'content-card';
    title: string;
    content: string;
    icon?: string;
    accent?: boolean;
}
export interface CardGridComponent extends BaseComponent {
    type: 'card-grid';
    columns?: 1 | 2 | 3 | 4;
    cards: Omit<CardComponent, 'type'>[];
}
export interface TableComponent extends BaseComponent {
    type: 'table';
    title?: string;
    headers: string[];
    rows: (string | number)[][];
    highlightRow?: number;
}
export interface ListComponent extends BaseComponent {
    type: 'list';
    title?: string;
    items: {
        icon?: string;
        text: string;
    }[];
}
export interface MetricComponent extends BaseComponent {
    type: 'metric';
    label: string;
    value: string | number;
    change?: string;
    changeType?: ChangeType;
}
export interface ChartComponent extends BaseComponent {
    type: 'chart';
    chartType: ChartType;
    title?: string;
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
        }[];
    };
}
export interface MarkdownComponent extends BaseComponent {
    type: 'markdown';
    content: string;
}
export interface ImageComponent extends BaseComponent {
    type: 'image';
    src: string;
    caption?: string;
    width?: 'full' | 'half' | 'third';
}
export interface AlertComponent extends BaseComponent {
    type: 'alert';
    alertType: AlertType;
    title?: string;
    message: string;
}
export interface DividerComponent extends BaseComponent {
    type: 'divider';
}
export interface DataSourceComponent extends BaseComponent {
    type: 'dataSource';
    source: string;
    url?: string;
    timestamp: Date | string;
    confidence?: number;
    freshness?: number;
    content?: string;
    children?: Component[];
}
export interface CompareColumn {
    key: string;
    label: string;
}
export interface CompareRow {
    feature: string;
    valueA: string | number;
    valueB: string | number;
    winner?: 'A' | 'B' | 'tie';
    note?: string;
}
export interface CompareTableComponent extends BaseComponent {
    type: 'compareTable';
    title?: string;
    columns: CompareColumn[];
    rows: CompareRow[];
    highlightDiff?: boolean;
    recommend?: 'A' | 'B';
}
export interface DataBadgeComponent extends BaseComponent {
    type: 'dataBadge';
    confidence?: number;
    freshness?: Date | string | number;
    showConfidence?: boolean;
    showFreshness?: boolean;
    size?: Size;
}
export interface TagComponent extends BaseComponent {
    type: 'tag';
    label: string;
    color?: TagColor;
    icon?: string;
    size?: Size;
    closable?: boolean;
    onClick?: () => void;
}
export interface BadgeComponent extends BaseComponent {
    type: 'badge';
    count?: number;
    dot?: boolean;
    color?: string;
    content?: string;
    children?: Component[];
}
export interface QuoteComponent extends BaseComponent {
    type: 'quote';
    content: string;
    author: string;
    avatar?: string;
    source?: string;
    role?: string;
}
export interface TimelineItem {
    title: string;
    description?: string;
    date?: Date | string;
    status?: TimelineItemStatus;
    icon?: string;
}
export interface TimelineComponent extends BaseComponent {
    type: 'timeline';
    items: TimelineItem[];
    direction?: TimelineDirection;
}
export interface ProgressComponent extends BaseComponent {
    type: 'progress';
    percent: number;
    status?: ProgressStatus;
    showLabel?: boolean;
    size?: Size;
}
export interface CollapseComponent extends BaseComponent {
    type: 'collapse';
    title: string;
    content?: string;
    children?: Component[];
    defaultExpanded?: boolean;
}
export interface Comment {
    id: string;
    author: string;
    avatar?: string;
    content: string;
    createdAt: Date | string;
    replies?: Comment[];
}
export interface CommentsComponent extends BaseComponent {
    type: 'comments';
    comments: Comment[];
    onAdd?: (content: string) => void;
    onReply?: (commentId: string, content: string) => void;
}
export interface Version {
    version: number;
    createdAt: Date | string;
    author?: string;
    changes?: string[];
}
export interface VersionHistoryComponent extends BaseComponent {
    type: 'versionHistory';
    currentVersion: number;
    versions: Version[];
    onRestore?: (version: Version) => void;
    onCompare?: (v1: Version, v2: Version) => void;
}
export interface TemplateComponent extends BaseComponent {
    type: 'template';
    templateId: string;
    name?: string;
    category?: string;
    variables: Record<string, string | number>;
    children?: Component[];
}
export type Component = SectionComponent | CardComponent | ContentCardComponent | CardGridComponent | TableComponent | ListComponent | MetricComponent | ChartComponent | MarkdownComponent | ImageComponent | AlertComponent | DividerComponent | DataSourceComponent | CompareTableComponent | DataBadgeComponent | TagComponent | BadgeComponent | QuoteComponent | TimelineComponent | ProgressComponent | CollapseComponent | CommentsComponent | VersionHistoryComponent | TemplateComponent;
export interface BoardData {
    id: string;
    title: string;
    description?: string;
    layout: Component;
    meta?: {
        author?: string;
        tags?: string[];
    };
    shareToken: string;
    expiresAt?: string;
    views: number;
    createdAt: string;
    updatedAt: string;
}
export interface SubmitBoardRequest {
    title: string;
    description?: string;
    expiresIn?: '1h' | '24h' | '7d' | '30d' | 'never';
    layout: Component;
    meta?: {
        author?: string;
        tags?: string[];
    };
}
export interface SubmitBoardResponse {
    id: string;
    shareUrl: string;
    expiresAt?: string;
    createdAt: string;
}
export interface ViewBoardResponse extends BoardData {
    stats: {
        views: number;
        lastViewed?: string;
    };
}
export interface BoardListItem {
    id: string;
    title: string;
    views: number;
    createdAt: string;
}
export interface ListBoardsResponse {
    items: BoardListItem[];
    total: number;
}
