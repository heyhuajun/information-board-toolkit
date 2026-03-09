# 竞品分析示例

完整的竞品分析报告示例，展示如何使用多种组件组合。

## 使用场景

给客户展示市场竞品情况，包括：
- 市场概览（卡片网格）
- 竞品对比（对比表格）
- 价格趋势（图表）
- 用户评价（引用块）
- 数据来源（数据溯源）

## 完整代码

```typescript
import { Board } from '@openclaw/information-board-toolkit'

const board = new Board({
  baseUrl: 'http://192.168.88.247:3030'
})

const result = await board.submit({
  title: "亚马逊宠物饮水机竞品分析",
  description: "针对 Top 5 竞品的深度分析",
  expiresIn: "7d",
  layout: {
    type: "section",
    children: [
      // 1. 市场概览
      {
        type: "section",
        title: "📊 市场概览",
        children: [
          {
            type: "card-grid",
            columns: 4,
            cards: [
              {
                title: "市场规模",
                value: "$1.2B",
                change: "+15%",
                changeType: "positive",
                footer: "2025 年预测"
              },
              {
                title: "竞品数量",
                value: "23",
                change: "+3",
                changeType: "positive",
                footer: "活跃卖家"
              },
              {
                title: "平均价格",
                value: "$32.50",
                change: "-5%",
                changeType: "negative",
                footer: "同比下降"
              },
              {
                title: "平均评分",
                value: "4.2",
                footer: "基于 15K+ 评价"
              }
            ]
          },
          {
            type: "dataSource",
            source: "Amazon Best Sellers",
            url: "https://amazon.com/best-sellers/pet-supplies",
            timestamp: "2026-03-08T10:00:00Z",
            confidence: 95,
            freshness: 2
          }
        ]
      },

      {
        type: "divider"
      },

      // 2. 竞品对比
      {
        type: "section",
        title: "🔍 Top 5 竞品对比",
        children: [
          {
            type: "compareTable",
            columns: [
              { key: "feature", label: "特性" },
              { key: "a", label: "产品 A (推荐)" },
              { key: "b", label: "产品 B" },
              { key: "c", label: "产品 C" },
              { key: "d", label: "产品 D" },
              { key: "e", label: "产品 E" }
            ],
            rows: [
              {
                feature: "价格",
                valueA: "$29.99",
                valueB: "$35.00",
                valueC: "$28.50",
                valueD: "$42.00",
                valueE: "$31.99",
                winner: "C",
                note: "产品 C 价格最低"
              },
              {
                feature: "评分",
                valueA: "4.5 ⭐",
                valueB: "4.3 ⭐",
                valueC: "4.1 ⭐",
                valueD: "4.6 ⭐",
                valueE: "4.2 ⭐",
                winner: "D"
              },
              {
                feature: "评价数",
                valueA: "3,245",
                valueB: "1,892",
                valueC: "856",
                valueD: "5,123",
                valueE: "2,341",
                winner: "D"
              },
              {
                feature: "容量",
                valueA: "2L",
                valueB: "1.5L",
                valueC: "2L",
                valueD: "3L",
                valueE: "2L",
                winner: "D"
              },
              {
                feature: "材质",
                valueA: "不锈钢",
                valueB: "塑料",
                valueC: "不锈钢",
                valueD: "不锈钢",
                valueE: "塑料",
                winner: "tie"
              },
              {
                feature: "静音",
                valueA: "是",
                valueB: "否",
                valueC: "是",
                valueD: "是",
                valueE: "否",
                winner: "tie"
              }
            ],
            highlightDiff: true,
            recommend: "A"
          },
          {
            type: "alert",
            alertType: "info",
            title: "推荐理由",
            message: "产品 A 综合性价比最高：价格适中、评分高、功能完善"
          }
        ]
      },

      {
        type: "divider"
      },

      // 3. 价格趋势
      {
        type: "section",
        title: "📈 价格趋势（近 6 个月）",
        children: [
          {
            type: "chart",
            chartType: "line",
            data: {
              labels: ["10月", "11月", "12月", "1月", "2月", "3月"],
              datasets: [
                {
                  label: "产品 A",
                  data: [32.99, 31.50, 30.99, 29.99, 29.99, 29.99]
                },
                {
                  label: "产品 B",
                  data: [38.00, 37.00, 36.50, 35.50, 35.00, 35.00]
                },
                {
                  label: "市场平均",
                  data: [34.50, 33.80, 33.20, 32.80, 32.50, 32.50]
                }
              ]
            }
          }
        ]
      },

      {
        type: "divider"
      },

      // 4. 用户评价
      {
        type: "section",
        title: "💬 用户真实评价",
        children: [
          {
            type: "quote",
            content: "我家猫咪非常喜欢！水流很安静，清洗也方便。用了 3 个月没有任何问题。",
            author: "Sarah M.",
            role: "已验证购买",
            source: "Amazon Review"
          },
          {
            type: "quote",
            content: "性价比很高，比宠物店便宜一半。唯一缺点是滤芯需要经常更换。",
            author: "John D.",
            role: "已验证购买",
            source: "Amazon Review"
          },
          {
            type: "quote",
            content: "静音效果一般，晚上还是能听到水流声。但整体质量不错。",
            author: "Lisa K.",
            role: "已验证购买",
            source: "Amazon Review"
          }
        ]
      },

      {
        type: "divider"
      },

      // 5. 关键发现
      {
        type: "section",
        title: "🎯 关键发现",
        children: [
          {
            type: "list",
            items: [
              { icon: "✅", text: "市场需求持续增长，年增长率 15%" },
              { icon: "✅", text: "不锈钢材质更受欢迎，占比 65%" },
              { icon: "✅", text: "静音功能是核心卖点" },
              { icon: "⚠️", text: "价格竞争激烈，利润空间收窄" },
              { icon: "⚠️", text: "用户对滤芯成本敏感" },
              { icon: "💡", text: "建议：主打静音 + 易清洗 + 低耗材成本" }
            ]
          }
        ]
      },

      {
        type: "divider"
      },

      // 6. 数据说明
      {
        type: "section",
        title: "📋 数据说明",
        children: [
          {
            type: "markdown",
            content: `
### 数据来源
- Amazon Best Sellers (宠物用品类)
- 用户评价抓取（15,000+ 条）
- 价格监控（每日更新）

### 分析方法
- 对比分析：Top 5 产品
- 时间范围：2025.10 - 2026.03
- 置信度：95%

### 更新频率
- 价格：每日
- 评分：每周
- 市场规模：每月
            `
          },
          {
            type: "dataBadge",
            confidence: 95,
            freshness: "2026-03-08T10:00:00Z",
            showConfidence: true,
            showFreshness: true
          }
        ]
      }
    ]
  },
  meta: {
    author: "lingxi",
    tags: ["亚马逊", "选品", "竞品分析", "宠物用品"]
  }
})

console.log('分享链接:', result.shareUrl)
```

## 效果预览

生成的报告包含：
- 4 个关键指标卡片
- 完整的 5 产品对比表格
- 价格趋势图表
- 3 条用户真实评价
- 6 条关键发现
- 数据来源说明

## 使用提示

1. **数据来源**：记得添加 `dataSource` 组件说明数据来源
2. **推荐标记**：使用 `recommend` 字段高亮推荐产品
3. **用户评价**：使用 `quote` 组件增加可信度
4. **关键发现**：使用 `list` 组件总结要点
5. **数据标注**：使用 `dataBadge` 显示置信度和新鲜度

## 变体示例

### 简化版（快速分析）

只保留核心部分：
- 市场概览（卡片）
- 竞品对比（表格）
- 关键发现（列表）

### 详细版（深度报告）

增加：
- 市场细分（饼图）
- 用户画像（表格）
- SWOT 分析（对比表格）
- 时间线（产品发展历程）
