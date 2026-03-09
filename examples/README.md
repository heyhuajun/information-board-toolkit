# Information Board Toolkit - 使用示例

完整的真实场景示例，帮助 Agent 快速上手。

## 📚 示例列表

### 1. [竞品分析报告](./01-competitor-analysis.md)
**场景**：给客户展示市场竞品情况  
**难度**：⭐⭐⭐  
**组件**：Card, CardGrid, CompareTable, Chart, Quote, DataSource  
**适合**：电商选品、产品经理、市场分析

**核心要点**：
- 使用 `compareTable` 对比多个产品
- 用 `quote` 展示用户真实评价
- 添加 `dataSource` 说明数据来源

---

### 2. [投资组合展示](./02-investment-portfolio.md)
**场景**：分享个人投资持仓情况  
**难度**：⭐⭐  
**组件**：Card, Chart, Table, Alert, DataBadge  
**适合**：个人投资者、理财顾问

**核心要点**：
- 设置 `expiresIn: "24h"` 保护隐私
- 使用 `alert` 提示风险
- 添加免责声明

---

### 3. [市场调研报告](./03-market-research.md)
**场景**：展示市场调研结果  
**难度**：⭐⭐⭐⭐  
**组件**：Section, Chart, Table, Quote, Timeline, CompareTable  
**适合**：市场调研、战略分析、投资决策

**核心要点**：
- 用 `timeline` 展示战略规划
- 多种图表组合（折线图、柱状图、饼图）
- 用户访谈用 `quote` 组件

---

## 🎯 快速选择指南

### 按使用场景

| 场景 | 推荐示例 | 核心组件 |
|------|----------|----------|
| 产品对比 | 竞品分析 | CompareTable |
| 数据展示 | 投资组合 | Chart, Table |
| 深度分析 | 市场调研 | 全组件 |
| 快速分享 | 投资组合（简化版） | Card, Chart |

### 按难度等级

| 难度 | 示例 | 预计时间 |
|------|------|----------|
| ⭐⭐ 简单 | 投资组合 | 10分钟 |
| ⭐⭐⭐ 中等 | 竞品分析 | 20分钟 |
| ⭐⭐⭐⭐ 复杂 | 市场调研 | 30分钟 |

### 按组件类型

| 组件 | 示例 | 说明 |
|------|------|------|
| CompareTable | 竞品分析、市场调研 | 多维度对比 |
| Quote | 竞品分析、市场调研 | 用户原声 |
| Timeline | 市场调研 | 时间规划 |
| DataSource | 竞品分析、市场调研 | 数据溯源 |
| Alert | 投资组合、市场调研 | 风险提示 |

---

## 💡 使用技巧

### 1. 组件组合建议

**数据展示型**：
```
Section → CardGrid → Chart → Table
```

**分析报告型**：
```
Section → Alert(摘要) → Chart → CompareTable → Quote → Timeline
```

**快速分享型**：
```
CardGrid → Chart → List
```

### 2. 常见错误

❌ **错误**：所有内容放在一个 Section
```json
{
  "type": "section",
  "children": [所有组件...]
}
```

✅ **正确**：按主题分组
```json
{
  "type": "section",
  "children": [
    { "type": "section", "title": "概览", "children": [...] },
    { "type": "divider" },
    { "type": "section", "title": "详情", "children": [...] }
  ]
}
```

---

❌ **错误**：缺少数据来源
```json
{
  "type": "table",
  "rows": [...]
}
```

✅ **正确**：添加数据溯源
```json
{
  "type": "section",
  "children": [
    { "type": "table", "rows": [...] },
    { "type": "dataSource", "source": "...", "timestamp": "..." }
  ]
}
```

---

❌ **错误**：图表数据格式错误
```json
{
  "type": "chart",
  "data": [100, 200, 300]  // ❌ 错误格式
}
```

✅ **正确**：使用标准格式
```json
{
  "type": "chart",
  "chartType": "line",
  "data": {
    "labels": ["1月", "2月", "3月"],
    "datasets": [
      { "label": "销量", "data": [100, 200, 300] }
    ]
  }
}
```

### 3. 性能优化

- **图片**：使用 CDN 链接，避免 base64
- **表格**：超过 50 行考虑分页或折叠
- **图表**：数据点超过 100 个考虑采样
- **嵌套**：Section 嵌套不超过 3 层

### 4. 隐私保护

- **敏感数据**：设置 `expiresIn` 自动过期
- **个人信息**：脱敏处理（姓名、手机号）
- **财务数据**：添加免责声明
- **内部资料**：考虑密码保护（未来功能）

---

## 🚀 快速开始

### 1. 复制示例代码

选择一个示例，复制完整代码

### 2. 修改数据

替换示例中的数据为你的真实数据

### 3. 调整布局

根据需要增删组件

### 4. 提交生成

调用 API 生成分享链接

---

## 📖 更多资源

- [组件文档](../README.md#组件库)
- [API 文档](../README.md#api-接口)
- [Toolkit 使用](../toolkit/README.md)

---

## 🤝 贡献示例

欢迎提交新的使用场景示例！

要求：
- 真实场景
- 完整代码
- 效果说明
- 使用提示

提交方式：
1. Fork 仓库
2. 添加示例文件 `examples/XX-your-example.md`
3. 更新本文件索引
4. 提交 Pull Request
