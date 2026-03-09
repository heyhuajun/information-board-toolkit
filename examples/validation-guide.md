# 验证工具使用指南

在提交布局前验证数据格式，避免常见错误。

## 基础用法

```typescript
import { validateLayout, formatValidationResult } from '@openclaw/information-board-toolkit'

const layout = {
  type: "section",
  children: [
    {
      type: "card",
      title: "总销售额",
      value: "¥1,234,567"
    }
  ]
}

// 验证布局
const result = validateLayout(layout)

if (!result.valid) {
  console.error(formatValidationResult(result))
  // ❌ 错误:
  //   - layout.children[0].type: Invalid component type: card
} else {
  console.log('✅ 验证通过')
}
```

## 完整示例

```typescript
import { Board, validateLayout, formatValidationResult } from '@openclaw/information-board-toolkit'

const board = new Board({
  baseUrl: 'http://192.168.88.247:3030'
})

const layout = {
  type: "section",
  children: [
    {
      type: "card-grid",
      columns: 3,
      cards: [
        {
          title: "用户数",
          value: "10,000",
          change: "+15%",
          changeType: "positive"
        },
        {
          title: "收入",
          value: "¥50万"
          // 缺少 changeType，会有警告
        }
      ]
    },
    {
      type: "chart",
      chartType: "line",
      title: "增长趋势",
      data: {
        labels: ["1月", "2月", "3月"],
        datasets: [
          {
            label: "用户数",
            data: [1000, 2000, 3000]
          }
        ]
      }
    }
  ]
}

// 1. 先验证
const validation = validateLayout(layout)
console.log(formatValidationResult(validation))

// 2. 如果有错误，修复后再提交
if (validation.valid) {
  const result = await board.submit({
    title: "数据看板",
    layout
  })
  console.log('分享链接:', result.shareUrl)
} else {
  console.error('布局验证失败，请修复错误后重试')
}
```

## 常见错误

### 1. 缺少必需字段

❌ **错误**：
```json
{
  "type": "card-grid",
  "columns": 3
  // 缺少 cards 字段
}
```

✅ **正确**：
```json
{
  "type": "card-grid",
  "columns": 3,
  "cards": [
    { "title": "标题", "value": "值" }
  ]
}
```

### 2. 无效的组件类型

❌ **错误**：
```json
{
  "type": "cards",  // 错误：应该是 card-grid
  "cards": [...]
}
```

✅ **正确**：
```json
{
  "type": "card-grid",
  "cards": [...]
}
```

### 3. 图表数据格式错误

❌ **错误**：
```json
{
  "type": "chart",
  "chartType": "line",
  "data": [100, 200, 300]  // 错误格式
}
```

✅ **正确**：
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

### 4. 表格行列不匹配

❌ **错误**：
```json
{
  "type": "table",
  "headers": ["姓名", "年龄", "城市"],
  "rows": [
    ["张三", "25"]  // 缺少城市
  ]
}
```

✅ **正确**：
```json
{
  "type": "table",
  "headers": ["姓名", "年龄", "城市"],
  "rows": [
    ["张三", "25", "北京"]
  ]
}
```

### 5. 无效的 changeType

❌ **错误**：
```json
{
  "type": "card",
  "title": "销售额",
  "value": "¥100万",
  "changeType": "up"  // 错误：应该是 positive
}
```

✅ **正确**：
```json
{
  "type": "card",
  "title": "销售额",
  "value": "¥100万",
  "changeType": "positive"
}
```

## 验证结果说明

### 错误 (Errors)

必须修复才能提交：
- 缺少必需字段
- 无效的组件类型
- 数据格式错误

### 警告 (Warnings)

建议修复，但不影响提交：
- 空的 children 数组
- 表格行列数不匹配
- Card 缺少 title 或 value

## 集成到工作流

```typescript
async function createBoard(layout: Component) {
  // 1. 验证
  const validation = validateLayout(layout)
  
  if (!validation.valid) {
    throw new Error(`布局验证失败:\n${formatValidationResult(validation)}`)
  }
  
  // 2. 显示警告（如果有）
  if (validation.warnings.length > 0) {
    console.warn('⚠️  布局有警告:')
    validation.warnings.forEach(w => {
      console.warn(`  ${w.path}: ${w.message}`)
    })
  }
  
  // 3. 提交
  const board = new Board({ baseUrl: 'http://192.168.88.247:3030' })
  return await board.submit({
    title: "数据看板",
    layout
  })
}
```

## 性能建议

- 验证是同步操作，速度很快
- 建议在提交前总是验证
- 可以在开发时启用详细日志

## 下一步

- [查看完整示例](./01-competitor-analysis.md)
- [了解所有组件](../README.md#组件库)
- [API 文档](../README.md#api-接口)
