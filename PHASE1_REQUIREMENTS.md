# Information Board Toolkit v2.0 - Phase 1 需求文档

## 背景

基于 5 个 Agent 团队调研，新增以下 P0 功能：

## 第一期功能（预计 7 天）

### 1. 数据溯源组件 (DataSource)

**用途**: 点击数据查看来源/时间/置信度

**接口设计**:
```typescript
interface DataSourceProps {
  source: string;        // 来源名称
  url?: string;          // 来源链接
  timestamp: Date;       // 数据时间
  confidence?: number;   // 置信度 0-100
  freshness?: number;    // 新鲜度（天数）
  children: React.ReactNode;  // 数据内容
}
```

**交互**:
- 默认显示数据内容
- 点击/悬停显示溯源信息
- 自动计算新鲜度标签（🟢 新鲜 / 🟡 一般 / 🔴 过期）

**样式**:
```
┌─────────────────────────────┐
│ 数据内容                     │
│ ─────────────────────────── │
│ 📊 来源: Amazon              │
│ 🕐 时间: 2026-03-08 15:30   │
│ ⭐ 置信度: 95%               │
│ 🟢 新鲜度: 2天              │
└─────────────────────────────┘
```

---

### 2. 对比表格 (CompareTable)

**用途**: 方案A vs B，高亮差异和推荐

**接口设计**:
```typescript
interface CompareTableProps {
  title?: string;
  columns: CompareColumn[];
  rows: CompareRow[];
  highlightDiff?: boolean;  // 高亮差异
  recommend?: 'A' | 'B';     // 推荐方案
}

interface CompareColumn {
  key: string;
  label: string;
}

interface CompareRow {
  feature: string;          // 功能/特性
  valueA: string | number;  // 方案A的值
  valueB: string | number;  // 方案B的值
  winner?: 'A' | 'B' | 'tie'; // 胜出方
  note?: string;            // 备注
}
```

**样式**:
```
┌────────────┬─────────┬─────────┬────────┐
│ 特性        │ 方案 A   │ 方案 B   │ 推荐   │
├────────────┼─────────┼─────────┼────────┤
│ 价格        │ ¥999    │ ¥1299   │ A ✓   │
│ 性能        │ ★★★☆☆  │ ★★★★★ │ B ✓   │
│ 电池        │ 8小时   │ 8小时   │ -     │
│ 重量        │ 1.2kg   │ 0.9kg   │ B ✓   │
└────────────┴─────────┴─────────┴────────┘
```

---

### 3. 数据标注 (DataBadge)

**用途**: 自动添加⭐置信度、🟢新鲜度

**接口设计**:
```typescript
interface DataBadgeProps {
  confidence?: number;   // 置信度 0-100
  freshness?: Date;      // 数据时间
  showConfidence?: boolean;
  showFreshness?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

**样式规则**:
- 置信度 >= 90%: ⭐⭐⭐ 绿色
- 置信度 >= 70%: ⭐⭐ 黄色
- 置信度 < 70%: ⭐ 红色

- 新鲜度 <= 7天: 🟢 新鲜
- 新鲜度 <= 30天: 🟡 一般
- 新鲜度 > 30天: 🔴 过期

---

### 4. 标签组件 (Tag/Badge)

**用途**: 状态标签、分类标签

**接口设计**:
```typescript
interface TagProps {
  label: string;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  closable?: boolean;
  onClick?: () => void;
}

interface BadgeProps {
  count?: number;
  dot?: boolean;
  color?: string;
  children: React.ReactNode;
}
```

**样式**:
```
[默认]  [主要]  [成功]  [警告]  [危险]
[灰色]  [蓝色]  [绿色]  [黄色]  [红色]
```

---

## 文件结构

```
src/components/
├── DataSource.tsx     # 数据溯源组件
├── CompareTable.tsx   # 对比表格
├── DataBadge.tsx      # 数据标注
├── Tag.tsx            # 标签组件
├── Badge.tsx          # 徽章组件
└── ComponentRenderer.tsx  # 更新渲染器
```

## 类型定义更新

```typescript
// src/types/index.ts

export type ComponentType = 
  | 'section'
  | 'card'
  | 'cardGrid'
  | 'table'
  | 'list'
  | 'metric'
  | 'chart'
  | 'markdown'
  | 'image'
  | 'alert'
  | 'divider'
  | 'dataSource'     // 新增
  | 'compareTable'   // 新增
  | 'dataBadge'      // 新增
  | 'tag'            // 新增
  | 'badge';         // 新增
```

## 验收标准

1. 所有组件支持 TypeScript 类型
2. 响应式设计（移动端适配）
3. 支持深色模式
4. 单元测试覆盖
5. 文档更新

## 完成后

1. 更新 ComponentRenderer.tsx
2. 更新 src/types/index.ts
3. 更新 README.md
4. npm run build 编译通过
5. git commit 并 push
