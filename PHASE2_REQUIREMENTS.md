# Information Board Toolkit v2.0 - Phase 2 需求文档

## 第二期功能

### 1. 模板机制 (Template)

**用途**: 预设模板，填数据即可生成

**接口设计**:
```typescript
interface TemplateProps {
  templateId: string;
  variables: Record<string, string | number>;
}
```

**预设模板**:
- 竞品分析模板
- 市场研究报告模板
- 用户调研报告模板
- 硬件规划模板
- 合规BP模板

---

### 2. 版本管理 (VersionHistory)

**用途**: 更新后保留历史，可对比差异

**接口设计**:
```typescript
interface VersionHistoryProps {
  boardId: string;
  currentVersion: number;
  versions: Version[];
  onRestore?: (version: Version) => void;
  onCompare?: (v1: Version, v2: Version) => void;
}

interface Version {
  version: number;
  createdAt: Date;
  author?: string;
  changes?: string[];
}
```

**交互**:
- 显示版本列表
- 点击恢复历史版本
- 对比两个版本的差异

---

### 3. 评论/反馈 (Comments)

**用途**: 看板内协作，客户直接提问

**接口设计**:
```typescript
interface CommentsProps {
  boardId: string;
  comments: Comment[];
  onAdd?: (content: string) => void;
  onReply?: (commentId: string, content: string) => void;
}

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: Date;
  replies?: Comment[];
}
```

**功能**:
- 添加评论
- 回复评论
- 时间线显示

---

### 4. Quote 引用块

**用途**: 用户原声，带头像/来源

**接口设计**:
```typescript
interface QuoteProps {
  content: string;
  author: string;
  avatar?: string;
  source?: string;
  role?: string;
}
```

---

### 5. Timeline 时间轴

**用途**: 认证流程、用户旅程可视化

**接口设计**:
```typescript
interface TimelineProps {
  items: TimelineItem[];
  direction?: 'horizontal' | 'vertical';
}

interface TimelineItem {
  title: string;
  description?: string;
  date?: Date | string;
  status?: 'completed' | 'current' | 'pending';
  icon?: string;
}
```

---

### 6. Progress 进度条

**用途**: 认证进度百分比

**接口设计**:
```typescript
interface ProgressProps {
  percent: number;
  status?: 'success' | 'warning' | 'error';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

---

### 7. 折叠区域 (Collapse)

**用途**: 详细法规条文折叠

**接口设计**:
```typescript
interface CollapseProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}
```

---

## 文件结构

```
src/components/
├── Template.tsx
├── VersionHistory.tsx
├── Comments.tsx
├── Quote.tsx
├── Timeline.tsx
├── Progress.tsx
├── Collapse.tsx
└── ComponentRenderer.tsx  # 更新
```

## 类型定义

```typescript
export type ComponentType =
  // ... Phase 1
  | 'template'
  | 'versionHistory'
  | 'comments'
  | 'quote'
  | 'timeline'
  | 'progress'
  | 'collapse';
```
