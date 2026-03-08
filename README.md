# Information Board Toolkit

> Agent 信息看板工具包 - 美观展示，对外分享

## 🎯 定位

为 AI Agent 提供的信息展示工具包，让 Agent 可以快速生成美观的内容页面，方便用户分享给客户或朋友。

## ✨ 核心功能

- **美观展示** - 22 种专业组件，自动适配移动端
- **快速分享** - 一键生成分享链接，支持设置有效期
- **Agent 友好** - 简单的 API 接口，易于集成
- **访问统计** - 实时浏览量统计
- **数据溯源** - 点击查看来源、时间、置信度
- **版本管理** - 保留历史版本，可对比差异

## 🧩 组件库

### 基础组件 (11)

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

### Phase 1 组件 (5)

| 组件 | 用途 |
|------|------|
| DataSource | 数据溯源，点击展开显示来源/时间/置信度/新鲜度 |
| CompareTable | 对比表格，A/B 对比，高亮差异，推荐标记 |
| DataBadge | 数据标注，置信度星级⭐、新鲜度标签🟢🟡🔴 |
| Tag | 标签，5 种颜色，支持图标、关闭按钮 |
| Badge | 徽章，数字徽章、小红点、自定义颜色 |

### Phase 2 组件 (7)

| 组件 | 用途 |
|------|------|
| Template | 模板机制，预设竞品分析、市场研究等模板 |
| VersionHistory | 版本管理，版本列表、恢复历史、对比差异 |
| Comments | 评论/反馈，添加评论、回复、时间线显示 |
| Quote | 引用块，用户原声展示，带头像/来源/角色 |
| Timeline | 时间轴，认证流程/用户旅程可视化，垂直/水平 |
| Progress | 进度条，百分比显示，自动状态判断 |
| Collapse | 折叠区域，展开/收起详细内容 |

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

### DataSource 数据溯源

```json
{
  "type": "dataSource",
  "source": "Amazon",
  "url": "https://amazon.com/dp/B0XXXXX",
  "timestamp": "2026-03-08T10:30:00Z",
  "confidence": 95,
  "freshness": 2,
  "content": "市场规模 $1.2B，年增长率 15%"
}
```

### CompareTable 对比表格

```json
{
  "type": "compareTable",
  "title": "竞品对比",
  "columns": [
    { "key": "a", "label": "方案 A" },
    { "key": "b", "label": "方案 B" }
  ],
  "rows": [
    { "feature": "价格", "valueA": "$29.99", "valueB": "$35.00", "winner": "A" },
    { "feature": "评分", "valueA": "4.5", "valueB": "4.8", "winner": "B" }
  ],
  "recommend": "A"
}
```

### DataBadge 数据标注

```json
{
  "type": "dataBadge",
  "confidence": 95,
  "freshness": "2026-03-06T00:00:00Z",
  "showConfidence": true,
  "showFreshness": true
}
```

### Timeline 时间轴

```json
{
  "type": "timeline",
  "direction": "vertical",
  "items": [
    { "title": "需求确认", "date": "2026-03-01", "status": "completed" },
    { "title": "开发中", "date": "2026-03-08", "status": "current" },
    { "title": "上线", "status": "pending" }
  ]
}
```

### VersionHistory 版本管理

```json
{
  "type": "versionHistory",
  "currentVersion": 3,
  "versions": [
    {
      "version": 1,
      "createdAt": "2026-03-01",
      "author": "lingxi",
      "changes": ["初始版本"]
    },
    {
      "version": 2,
      "createdAt": "2026-03-05",
      "changes": ["添加竞品对比", "更新价格数据"]
    }
  ]
}
```

### Comments 评论

```json
{
  "type": "comments",
  "comments": [
    {
      "id": "1",
      "author": "山海",
      "content": "这个分析很到位",
      "createdAt": "2026-03-08T10:00:00Z",
      "replies": [
        {
          "id": "1-1",
          "author": "灵犀",
          "content": "同意，数据来源可靠",
          "createdAt": "2026-03-08T11:00:00Z"
        }
      ]
    }
  ]
}
```

## 🤖 Agent Toolkit

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

查看 [toolkit/README.md](toolkit/README.md) 了解更多。

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
- **用户研究** - Quote 组件展示用户原声
- **合规报告** - Collapse 组件折叠法规条文
- **项目进度** - Timeline 组件展示里程碑
- **版本管理** - VersionHistory 组件追踪变更

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **样式**: Tailwind CSS 4
- **数据库**: SQLite (better-sqlite3)
- **图表**: Recharts
- **Markdown**: react-markdown

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

由 [OpenClaw](https://openclaw.ai) 提供支持
