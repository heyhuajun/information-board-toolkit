# 投资组合示例

完整的投资组合展示示例，适合分享给朋友或客户。

## 使用场景

展示个人投资组合情况，包括：
- 总资产概览
- 持仓分布（饼图）
- 收益排行（表格）
- 风险提示（告警）

## 完整代码

```typescript
import { Board } from '@openclaw/information-board-toolkit'

const board = new Board({
  baseUrl: 'http://192.168.88.247:3030'
})

const result = await board.submit({
  title: "我的投资组合 - 2026年3月",
  description: "A股 + 港股持仓情况",
  expiresIn: "24h",  // 24小时后过期
  layout: {
    type: "section",
    children: [
      // 1. 总资产概览
      {
        type: "section",
        title: "💰 总资产概览",
        children: [
          {
            type: "card-grid",
            columns: 4,
            cards: [
              {
                title: "总资产",
                value: "¥108,674",
                change: "-2.52%",
                changeType: "negative",
                footer: "今日"
              },
              {
                title: "持仓市值",
                value: "¥95,230",
                footer: "87.6% 仓位"
              },
              {
                title: "可用资金",
                value: "¥13,444",
                footer: "12.4%"
              },
              {
                title: "总收益",
                value: "+8.67%",
                change: "+¥8,674",
                changeType: "positive",
                footer: "累计"
              }
            ]
          }
        ]
      },

      {
        type: "divider"
      },

      // 2. 持仓分布
      {
        type: "section",
        title: "📊 持仓分布",
        children: [
          {
            type: "chart",
            chartType: "doughnut",
            data: {
              labels: ["科技", "消费", "医药", "金融", "新能源"],
              datasets: [
                {
                  label: "持仓占比",
                  data: [35, 25, 20, 12, 8]
                }
              ]
            }
          },
          {
            type: "markdown",
            content: "**配置策略**：科技为主（35%），消费和医药为辅，适度配置金融和新能源"
          }
        ]
      },

      {
        type: "divider"
      },

      // 3. 持仓明细
      {
        type: "section",
        title: "📈 持仓明细（Top 10）",
        children: [
          {
            type: "table",
            headers: ["股票", "代码", "持仓", "成本", "现价", "收益率"],
            rows: [
              ["腾讯控股", "00700.HK", "200股", "¥368.50", "¥385.20", "+4.53%"],
              ["贵州茅台", "600519", "10股", "¥1,680", "¥1,755", "+4.46%"],
              ["宁德时代", "300750", "50股", "¥185.30", "¥192.80", "+4.05%"],
              ["比亚迪", "002594", "100股", "¥245.60", "¥238.90", "-2.73%"],
              ["美团", "03690.HK", "150股", "¥128.40", "¥135.60", "+5.61%"],
              ["药明康德", "603259", "80股", "¥52.30", "¥48.90", "-6.50%"],
              ["招商银行", "600036", "300股", "¥38.20", "¥39.50", "+3.40%"],
              ["隆基绿能", "601012", "200股", "¥18.50", "¥17.20", "-7.03%"],
              ["海天味业", "603288", "100股", "¥42.80", "¥45.30", "+5.84%"],
              ["恒瑞医药", "600276", "150股", "¥48.60", "¥46.80", "-3.70%"]
            ],
            highlightRow: 0
          }
        ]
      },

      {
        type: "divider"
      },

      // 4. 收益排行
      {
        type: "section",
        title: "🏆 收益排行",
        description: "本月表现最好和最差的股票",
        children: [
          {
            type: "card-grid",
            columns: 2,
            cards: [
              {
                title: "📈 涨幅榜",
                value: "美团",
                change: "+5.61%",
                changeType: "positive",
                footer: "本月最佳"
              },
              {
                title: "📉 跌幅榜",
                value: "隆基绿能",
                change: "-7.03%",
                changeType: "negative",
                footer: "本月最差"
              }
            ]
          }
        ]
      },

      {
        type: "divider"
      },

      // 5. 风险提示
      {
        type: "section",
        title: "⚠️ 风险提示",
        children: [
          {
            type: "alert",
            alertType: "warning",
            title: "高仓位警告",
            message: "当前仓位 87.6%，建议保持 10-15% 现金应对市场波动"
          },
          {
            type: "alert",
            alertType: "info",
            title: "行业集中度",
            message: "科技板块占比 35%，注意分散风险"
          },
          {
            type: "list",
            title: "近期关注",
            items: [
              { icon: "👀", text: "药明康德：跌幅较大，关注是否有反弹机会" },
              { icon: "👀", text: "隆基绿能：新能源板块调整，等待企稳信号" },
              { icon: "✅", text: "美团：表现强势，可考虑部分止盈" }
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
### 更新时间
2026-03-08 14:00 (收盘后)

### 数据来源
- A股：东方财富
- 港股：富途牛牛

### 计算方式
- 收益率 = (现价 - 成本价) / 成本价 × 100%
- 持仓市值 = 持股数 × 现价
- 总收益 = 持仓市值 - 总成本

### 免责声明
本数据仅供参考，不构成投资建议。投资有风险，入市需谨慎。
            `
          },
          {
            type: "dataBadge",
            freshness: "2026-03-08T14:00:00Z",
            showFreshness: true
          }
        ]
      }
    ]
  },
  meta: {
    author: "lingxi",
    tags: ["投资", "股票", "A股", "港股"]
  }
})

console.log('分享链接:', result.shareUrl)
console.log('24小时后自动过期')
```

## 效果预览

生成的报告包含：
- 4 个核心指标（总资产、持仓、资金、收益）
- 持仓分布饼图
- Top 10 持仓明细表格
- 涨跌幅排行
- 风险提示和关注事项
- 数据说明和免责声明

## 使用提示

1. **隐私保护**：设置 `expiresIn: "24h"` 让链接自动过期
2. **实时更新**：可以定时更新同一个 board ID
3. **风险提示**：使用 `alert` 组件提醒风险
4. **免责声明**：必须添加免责声明
5. **数据新鲜度**：使用 `dataBadge` 显示更新时间

## 变体示例

### 简化版（快速分享）

只保留：
- 总资产卡片
- 持仓分布图
- Top 5 持仓

### 详细版（深度分析）

增加：
- 历史收益曲线（折线图）
- 每日盈亏（柱状图）
- 交易记录（时间轴）
- 策略说明（Markdown）

### 对比版（多账户）

使用 `compareTable` 对比：
- A股账户 vs 港股账户
- 今年 vs 去年同期
