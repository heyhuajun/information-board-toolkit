# @openclaw/information-board-toolkit

Agent Toolkit for Information Board - 美观展示，对外分享

## 安装

```bash
npm install @openclaw/information-board-toolkit
```

## 使用

```typescript
import { Board } from '@openclaw/information-board-toolkit'

// 初始化
const board = new Board({
  baseUrl: 'http://192.168.88.247:3030',
  apiKey: 'your-api-key',  // 可选
  timeout: 30000           // 可选，默认 30 秒
})

// 提交内容
const result = await board.submit({
  title: "市场调研报告",
  description: "亚马逊选品分析",
  expiresIn: "7d",
  layout: {
    type: "section",
    children: [
      {
        type: "card-grid",
        columns: 3,
        cards: [
          { title: "市场规模", value: "$1.2B", change: "+15%", changeType: "positive" },
          { title: "竞品数量", value: "23" },
          { title: "平均评分", value: "4.2" }
        ]
      },
      {
        type: "table",
        title: "竞品对比",
        headers: ["产品", "价格", "评分"],
        rows: [
          ["产品 A", "$29.99", "4.5"],
          ["产品 B", "$35.00", "4.3"]
        ]
      }
    ]
  },
  meta: {
    author: "lingxi",
    tags: ["亚马逊", "选品"]
  }
})

console.log(result.shareUrl)  // http://192.168.88.247:3030/view/abc123

// 更新内容
await board.update(result.id, {
  title: "更新后的标题"
})

// 删除内容
await board.delete(result.id)

// 列出内容
const { items, total } = await board.list({
  author: "lingxi",
  limit: 10
})
```

## 组件类型

### Section - 分组容器

```typescript
{
  type: "section",
  title: "市场分析",
  description: "市场规模和竞争情况",
  children: [...]
}
```

### Card - 卡片

```typescript
{
  type: "card",
  title: "市场规模",
  value: "$1.2B",
  change: "+15%",
  changeType: "positive"
}
```

### CardGrid - 卡片网格

```typescript
{
  type: "card-grid",
  columns: 3,
  cards: [...]
}
```

### Table - 表格

```typescript
{
  type: "table",
  title: "竞品对比",
  headers: ["产品", "价格", "评分"],
  rows: [
    ["产品 A", "$29.99", "4.5"],
    ["产品 B", "$35.00", "4.3"]
  ]
}
```

### List - 列表

```typescript
{
  type: "list",
  title: "关键发现",
  items: [
    { icon: "✅", text: "市场需求持续增长" },
    { icon: "⚠️", text: "竞争激烈" }
  ]
}
```

### Metric - 指标

```typescript
{
  type: "metric",
  label: "总资产",
  value: "¥108,674",
  change: "-2.52%",
  changeType: "negative"
}
```

### Chart - 图表

```typescript
{
  type: "chart",
  chartType: "line",  // line, bar, pie, doughnut
  title: "销量趋势",
  data: {
    labels: ["1月", "2月", "3月"],
    datasets: [
      { label: "产品 A", data: [100, 150, 200] }
    ]
  }
}
```

### Markdown - 富文本

```typescript
{
  type: "markdown",
  content: "## 分析结论\n\n### 优势\n- 市场需求大"
}
```

### Image - 图片

```typescript
{
  type: "image",
  src: "https://...",
  caption: "产品对比图",
  width: "full"  // full, half, third
}
```

### Alert - 提示框

```typescript
{
  type: "alert",
  alertType: "info",  // info, success, warning, error
  title: "提示",
  message: "数据更新于 2024-03-08"
}
```

### Divider - 分隔线

```typescript
{
  type: "divider"
}
```

## API 认证

如果服务端配置了 API Key，需要在初始化时提供：

```typescript
const board = new Board({
  baseUrl: 'http://192.168.88.247:3030',
  apiKey: 'your-secret-key'
})
```

## License

MIT
