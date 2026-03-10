# Agent 使用指南

Information Board Toolkit - 让 Agent 创建美观的信息展示页面并生成分享链接。

## 快速开始

### 基础 URL

| 环境 | URL |
|------|-----|
| 内网 | `http://192.168.88.247:3030` |
| 外网 | `https://board.heyhuajun.xyz` |
| Docker 容器内 | `http://information-board:3000` |

### 创建看板

```http
POST /api/board/submit
Content-Type: application/json

{
  "title": "标题",
  "description": "描述（可选）",
  "expiresIn": "7d",
  "layout": { "type": "section", "children": [...] },
  "meta": { "author": "Agent名称", "tags": ["标签"] }
}
```

**expiresIn 可选值**: `1h`, `24h`, `7d`, `30d`, `never`

**返回**:
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "shareUrl": "https://board.heyhuajun.xyz/view/xxx",
    "ownerToken": "用于更新/删除",
    "createdAt": "2024-03-10T00:00:00Z"
  }
}
```

## 组件类型

### Section - 分组容器

```json
{
  "type": "section",
  "title": "标题",
  "description": "描述",
  "children": [...]
}
```

### Card - 卡片

```json
{
  "type": "card",
  "title": "市场规模",
  "value": "$1.2B",
  "change": "+15%",
  "changeType": "positive"
}
```

**changeType**: `positive` (绿色), `negative` (红色), `neutral` (灰色)

### CardGrid - 卡片网格

```json
{
  "type": "card-grid",
  "columns": 3,
  "cards": [
    { "title": "市场规模", "value": "$1.2B" },
    { "title": "增长率", "value": "+15%", "change": "up" },
    { "title": "竞品数", "value": "23" }
  ]
}
```

**columns**: 1-4

### Table - 表格

```json
{
  "type": "table",
  "title": "竞品对比",
  "headers": ["产品", "价格", "评分", "销量"],
  "rows": [
    ["产品 A", "$29.99", "4.5", "1000"],
    ["产品 B", "$35.00", "4.3", "800"],
    ["产品 C", "$25.00", "4.7", "1200"]
  ]
}
```

### List - 列表

```json
{
  "type": "list",
  "title": "关键发现",
  "items": [
    { "icon": "✅", "text": "市场需求持续增长" },
    { "icon": "⚠️", "text": "竞争激烈，需差异化" },
    { "icon": "💡", "text": "高端市场有机会" }
  ]
}
```

### Metric - 指标

```json
{
  "type": "metric",
  "label": "总资产",
  "value": "¥108,674",
  "change": "-2.52%",
  "changeType": "negative"
}
```

### Chart - 图表

```json
{
  "type": "chart",
  "chartType": "line",
  "title": "销量趋势",
  "data": {
    "labels": ["1月", "2月", "3月", "4月"],
    "datasets": [
      { "label": "产品 A", "data": [100, 150, 200, 180] },
      { "label": "产品 B", "data": [80, 120, 160, 200] }
    ]
  }
}
```

**chartType**: `line`, `bar`, `pie`, `doughnut`

### Markdown - 富文本

```json
{
  "type": "markdown",
  "content": "## 分析结论\n\n### 优势\n- 市场需求大\n- 竞争对手少\n\n### 风险\n- 政策不确定性"
}
```

### Image - 图片

```json
{
  "type": "image",
  "src": "https://example.com/image.png",
  "caption": "产品对比图",
  "width": "full"
}
```

**width**: `full`, `half`, `third`

### ImageGallery - 图片画廊

```json
{
  "type": "imageGallery",
  "images": [
    { "src": "https://...", "caption": "图1" },
    { "src": "https://...", "caption": "图2" }
  ]
}
```

### Alert - 提示框

```json
{
  "type": "alert",
  "alertType": "info",
  "title": "提示",
  "message": "数据更新于 2024-03-08"
}
```

**alertType**: `info` (蓝), `success` (绿), `warning` (黄), `error` (红)

### Divider - 分隔线

```json
{
  "type": "divider"
}
```

### Quote - 引用块

```json
{
  "type": "quote",
  "content": "用户原话内容",
  "author": "用户名",
  "role": "产品经理"
}
```

### Timeline - 时间轴

```json
{
  "type": "timeline",
  "direction": "vertical",
  "items": [
    { "title": "需求确认", "date": "2024-03-01", "status": "completed" },
    { "title": "开发中", "date": "2024-03-08", "status": "current" },
    { "title": "上线", "status": "pending" }
  ]
}
```

**status**: `completed`, `current`, `pending`

### Progress - 进度条

```json
{
  "type": "progress",
  "value": 75,
  "label": "完成度"
}
```

### DataSource - 数据溯源

```json
{
  "type": "dataSource",
  "source": "Amazon",
  "url": "https://amazon.com/dp/B0XXXXX",
  "timestamp": "2024-03-08T10:30:00Z",
  "confidence": 95,
  "content": "市场规模 $1.2B"
}
```

### CompareTable - 对比表格

```json
{
  "type": "compareTable",
  "title": "方案对比",
  "columns": [
    { "key": "a", "label": "方案 A" },
    { "key": "b", "label": "方案 B" }
  ],
  "rows": [
    { "feature": "价格", "valueA": "$29", "valueB": "$35", "winner": "A" },
    { "feature": "评分", "valueA": "4.5", "valueB": "4.8", "winner": "B" }
  ],
  "recommend": "A"
}
```

### DataBadge - 数据标注

```json
{
  "type": "dataBadge",
  "confidence": 95,
  "freshness": "2024-03-06"
}
```

### Tag - 标签

```json
{
  "type": "tag",
  "text": "重要",
  "color": "red"
}
```

**color**: `red`, `blue`, `green`, `yellow`, `gray`

### Badge - 徽章

```json
{
  "type": "badge",
  "text": "NEW",
  "color": "blue"
}
```

### Collapse - 折叠区域

```json
{
  "type": "collapse",
  "title": "详细信息",
  "children": [...]
}
```

### Comments - 评论

```json
{
  "type": "comments",
  "comments": [
    {
      "id": "1",
      "author": "用户A",
      "content": "很好的分析",
      "createdAt": "2024-03-08T10:00:00Z",
      "replies": [
        { "id": "1-1", "author": "用户B", "content": "同意", "createdAt": "2024-03-08T11:00:00Z" }
      ]
    }
  ]
}
```

### VersionHistory - 版本历史

```json
{
  "type": "versionHistory",
  "currentVersion": 3,
  "versions": [
    { "version": 1, "createdAt": "2024-03-01", "author": "Agent", "changes": ["初始版本"] },
    { "version": 2, "createdAt": "2024-03-05", "changes": ["添加数据", "修正错误"] }
  ]
}
```

### Template - 模板

```json
{
  "type": "template",
  "templateId": "competitive-analysis"
}
```

## 完整示例

### 市场调研报告

```json
{
  "title": "亚马逊选品调研报告 - 宠物饮水机",
  "description": "针对宠物饮水机市场的深度调研分析",
  "expiresIn": "7d",
  "layout": {
    "type": "section",
    "children": [
      {
        "type": "card-grid",
        "columns": 4,
        "cards": [
          { "title": "市场规模", "value": "$1.2B", "change": "+15%", "changeType": "positive" },
          { "title": "年增长率", "value": "12%", "changeType": "positive" },
          { "title": "竞品数量", "value": "23" },
          { "title": "平均评分", "value": "4.2" }
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "table",
        "title": "TOP 5 竞品分析",
        "headers": ["产品", "价格", "评分", "月销", "卖点"],
        "rows": [
          ["品牌A", "$29.99", "4.5", "5000", "静音设计"],
          ["品牌B", "$35.00", "4.3", "3500", "智能控制"],
          ["品牌C", "$25.00", "4.7", "6000", "高性价比"],
          ["品牌D", "$40.00", "4.1", "2000", "高端品质"],
          ["品牌E", "$22.00", "4.4", "4500", "基础款"]
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "title": "关键发现",
        "children": [
          {
            "type": "list",
            "items": [
              { "icon": "✅", "text": "市场需求持续增长，年增速 12%" },
              { "icon": "✅", "text": "$25-30 价格段竞争最激烈" },
              { "icon": "⚠️", "text": "静音是核心痛点，差异化机会" },
              { "icon": "💡", "text": "智能控制功能溢价明显" }
            ]
          }
        ]
      },
      {
        "type": "alert",
        "alertType": "success",
        "title": "建议",
        "message": "推荐进入 $25-30 价格段，主打静音+智能控制差异化"
      }
    ]
  },
  "meta": {
    "author": "MarketAgent",
    "tags": ["亚马逊", "选品", "宠物用品"]
  }
}
```

### 投资组合报告

```json
{
  "title": "投资组合日报 - 2024.03.10",
  "layout": {
    "type": "section",
    "children": [
      {
        "type": "card-grid",
        "columns": 3,
        "cards": [
          { "title": "总资产", "value": "¥1,234,567", "change": "+2.5%", "changeType": "positive" },
          { "title": "今日收益", "value": "¥30,000", "changeType": "positive" },
          { "title": "持仓数量", "value": "15" }
        ]
      },
      {
        "type": "chart",
        "chartType": "line",
        "title": "近7日收益趋势",
        "data": {
          "labels": ["3/4", "3/5", "3/6", "3/7", "3/8", "3/9", "3/10"],
          "datasets": [
            { "label": "收益", "data": [15000, 22000, 18000, 25000, 20000, 28000, 30000] }
          ]
        }
      },
      {
        "type": "table",
        "title": "持仓明细",
        "headers": ["股票", "持仓", "成本", "现价", "盈亏"],
        "rows": [
          ["AAPL", "100", "$150", "$180", "+20%"],
          ["GOOGL", "50", "$100", "$95", "-5%"],
          ["TSLA", "30", "$200", "$250", "+25%"]
        ]
      }
    ]
  },
  "meta": {
    "author": "InvestAgent",
    "tags": ["投资", "日报"]
  }
}
```

## API 参考

### POST /api/board/submit

创建新看板

### GET /api/board/view/:token

查看看板（无需认证）

### PUT /api/board/:id

更新看板（需要 X-Owner-Token）

### DELETE /api/board/:id

删除看板（需要 X-Owner-Token）

### GET /api/board/list

列出看板（需要 X-API-Key）

### GET /api/health

健康检查（无需认证）

## SDK 使用

```typescript
import { Board } from '@openclaw/information-board-toolkit'

const board = new Board({
  baseUrl: 'http://192.168.88.247:3030'
})

const result = await board.submit({
  title: "报告标题",
  layout: { type: "section", children: [...] }
})

console.log(result.shareUrl)
```

## cURL 示例

```bash
# 创建看板
curl -X POST http://192.168.88.247:3030/api/board/submit \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试报告",
    "layout": {
      "type": "section",
      "children": [
        {"type": "card", "title": "数据", "value": "123"}
      ]
    }
  }'

# 查看看板
curl http://192.168.88.247:3030/api/board/view/xxx

# 健康检查
curl http://192.168.88.247:3030/api/health
```
