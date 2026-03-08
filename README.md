# Information Board Toolkit

> Agent 信息看板工具包 - 美观展示，对外分享

## 🎯 定位

为 AI Agent 提供的信息展示工具包，让 Agent 可以快速生成美观的内容页面，方便用户分享给客户或朋友。

## ✨ 核心功能

- **美观展示** - 11 种专业组件，自动适配移动端
- **快速分享** - 一键生成分享链接，支持设置有效期
- **Agent 友好** - 简单的 API 接口，易于集成
- **访问统计** - 实时浏览量统计

## 🧩 组件库

| 组件 | 用途 |
|------|------|
| Section | 分组容器 |
| Card | 卡片展示 |
| CardGrid | 卡片网格 |
| Table | 表格 |
| List | 列表 |
| Metric | 指标 |
| Chart | 图表 |
| Markdown | 富文本 |
| Image | 图片 |
| Alert | 提示框 |
| Divider | 分隔线 |

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=./data/board.db
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📡 API 接口

### 提交内容

```typescript
POST /api/board/submit

{
  "title": "亚马逊选品调研报告",
  "description": "针对宠物饮水机市场的调研",
  "expiresIn": "7d",  // 1h, 24h, 7d, 30d, never
  "layout": {
    "type": "section",
    "children": [...]
  },
  "meta": {
    "author": "lingxi",
    "tags": ["亚马逊", "选品"]
  }
}

Response:
{
  "id": "abc123",
  "shareUrl": "http://localhost:3000/view/abc123",
  "expiresAt": "2026-03-15T11:38:00Z",
  "createdAt": "2026-03-08T11:38:00Z"
}
```

### 查看内容

```typescript
GET /api/board/view/:token

Response:
{
  "id": "abc123",
  "title": "...",
  "layout": {...},
  "stats": {
    "views": 12,
    "lastViewed": "2026-03-08T12:00:00Z"
  }
}
```

### 更新内容

```typescript
PUT /api/board/:id

{
  "title": "更新后的标题",
  "layout": {...}
}
```

### 删除内容

```typescript
DELETE /api/board/:id
```

### 列出内容

```typescript
GET /api/board/list?author=lingxi&limit=10

Response:
{
  "items": [...],
  "total": 25
}
```

## 🎨 组件示例

### Card Grid

```json
{
  "type": "card-grid",
  "columns": 3,
  "cards": [
    {
      "title": "市场规模",
      "value": "$1.2B",
      "change": "+15%",
      "changeType": "positive"
    },
    {
      "title": "竞品数量",
      "value": "23"
    }
  ]
}
```

### Table

```json
{
  "type": "table",
  "title": "竞品对比",
  "headers": ["产品", "价格", "评分"],
  "rows": [
    ["产品 A", "$29.99", "4.5"],
    ["产品 B", "$35.00", "4.3"]
  ]
}
```

### List

```json
{
  "type": "list",
  "title": "关键发现",
  "items": [
    { "icon": "✅", "text": "市场需求持续增长" },
    { "icon": "⚠️", "text": "竞争激烈" }
  ]
}
```

### Markdown

```json
{
  "type": "markdown",
  "content": "## 分析结论\n\n### 优势\n- 市场需求大\n- 竞争相对较小"
}
```

## 🤖 Agent Toolkit (计划中)

```typescript
import { Board } from '@openclaw/information-board-toolkit'

const board = new Board({
  apiKey: 'your-api-key',
  baseUrl: 'https://board.openclaw.ai'
})

// 提交内容
const result = await board.submit({
  title: "市场调研报告",
  expiresIn: "7d",
  layout: {
    type: "section",
    children: [...]
  }
})

console.log(result.shareUrl)
```

## 🐳 Docker 部署

```yaml
services:
  information-board:
    build: .
    ports:
      - "3030:3000"
    volumes:
      - ./data:/app/data
    environment:
      - DATABASE_URL=/app/data/board.db
      - NEXT_PUBLIC_BASE_URL=https://board.openclaw.ai
```

## 📝 使用场景

- **竞品分析** - 给客户展示市场情况
- **投资组合** - 给朋友分享持仓数据
- **产品对比** - 给客户对比产品信息
- **市场调研** - 给团队分享市场洞察

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **数据库**: SQLite (better-sqlite3)
- **图表**: Recharts
- **Markdown**: react-markdown

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

由 [OpenClaw](https://openclaw.ai) 提供支持
