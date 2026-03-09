# 市场调研报告示例

完整的市场调研报告示例，适合展示给团队或客户。

## 使用场景

展示市场调研结果，包括：
- 市场规模和趋势
- 用户画像
- 竞争格局
- 机会点分析

## 完整代码

```typescript
import { Board } from '@openclaw/information-board-toolkit'

const board = new Board({
  baseUrl: 'http://192.168.88.247:3030'
})

const result = await board.submit({
  title: "智能家居市场调研报告",
  description: "2026年中国智能家居市场深度分析",
  expiresIn: "30d",
  layout: {
    type: "section",
    children: [
      // 1. 执行摘要
      {
        type: "section",
        title: "📋 执行摘要",
        children: [
          {
            type: "alert",
            alertType: "success",
            title: "核心结论",
            message: "中国智能家居市场处于快速增长期，预计2026年市场规模达到8,000亿元，年增长率25%。年轻用户（25-35岁）是主力消费群体。"
          },
          {
            type: "card-grid",
            columns: 3,
            cards: [
              {
                title: "市场规模",
                value: "¥8,000亿",
                change: "+25%",
                changeType: "positive",
                footer: "2026年预测"
              },
              {
                title: "用户渗透率",
                value: "32%",
                change: "+8%",
                changeType: "positive",
                footer: "同比增长"
              },
              {
                title: "平均客单价",
                value: "¥3,500",
                change: "+12%",
                changeType: "positive",
                footer: "持续上升"
              }
            ]
          }
        ]
      },

      {
        type: "divider"
      },

      // 2. 市场趋势
      {
        type: "section",
        title: "📈 市场规模趋势",
        children: [
          {
            type: "chart",
            chartType: "line",
            title: "2020-2026年市场规模（亿元）",
            data: {
              labels: ["2020", "2021", "2022", "2023", "2024", "2025", "2026E"],
              datasets: [
                {
                  label: "市场规模",
                  data: [2800, 3500, 4200, 5100, 6000, 6800, 8000]
                }
              ]
            }
          },
          {
            type: "markdown",
            content: "**增长驱动因素**：\n- 5G和IoT技术成熟\n- 年轻消费群体崛起\n- 疫情加速智能化需求\n- 政策支持和标准完善"
          }
        ]
      },

      {
        type: "divider"
      },

      // 3. 用户画像
      {
        type: "section",
        title: "👥 用户画像",
        children: [
          {
            type: "card-grid",
            columns: 2,
            cards: [
              {
                title: "年龄分布",
                value: "25-35岁",
                footer: "占比 58%"
              },
              {
                title: "收入水平",
                value: "月入 1-2万",
                footer: "占比 45%"
              }
            ]
          },
          {
            type: "chart",
            chartType: "bar",
            title: "用户年龄分布",
            data: {
              labels: ["18-24岁", "25-35岁", "36-45岁", "46-55岁", "55岁以上"],
              datasets: [
                {
                  label: "用户占比 (%)",
                  data: [15, 58, 20, 5, 2]
                }
              ]
            }
          },
          {
            type: "table",
            title: "用户特征分析",
            headers: ["特征", "描述", "占比"],
            rows: [
              ["居住地", "一二线城市", "72%"],
              ["职业", "互联网/金融/教育", "65%"],
              ["家庭", "新婚/有小孩", "68%"],
              ["关注点", "便利性 > 价格", "80%"],
              ["购买渠道", "线上为主", "85%"]
            ]
          }
        ]
      },

      {
        type: "divider"
      },

      // 4. 竞争格局
      {
        type: "section",
        title: "🏆 竞争格局",
        children: [
          {
            type: "chart",
            chartType: "pie",
            title: "市场份额分布",
            data: {
              labels: ["小米", "华为", "海尔", "美的", "其他"],
              datasets: [
                {
                  label: "市场份额",
                  data: [28, 22, 15, 12, 23]
                }
              ]
            }
          },
          {
            type: "compareTable",
            title: "主要品牌对比",
            columns: [
              { key: "feature", label: "维度" },
              { key: "xiaomi", label: "小米" },
              { key: "huawei", label: "华为" },
              { key: "haier", label: "海尔" }
            ],
            rows: [
              {
                feature: "市场份额",
                valueXiaomi: "28%",
                valueHuawei: "22%",
                valueHaier: "15%",
                winner: "xiaomi"
              },
              {
                feature: "产品线",
                valueXiaomi: "全品类",
                valueHuawei: "全品类",
                valueHaier: "家电为主",
                winner: "tie"
              },
              {
                feature: "价格定位",
                valueXiaomi: "中低端",
                valueHuawei: "中高端",
                valueHaier: "中端",
                winner: "tie"
              },
              {
                feature: "生态系统",
                valueXiaomi: "开放",
                valueHuawei: "封闭",
                valueHaier: "半开放",
                winner: "xiaomi"
              },
              {
                feature: "用户口碑",
                valueXiaomi: "4.3分",
                valueHuawei: "4.5分",
                valueHaier: "4.1分",
                winner: "huawei"
              }
            ],
            highlightDiff: true
          }
        ]
      },

      {
        type: "divider"
      },

      // 5. 用户需求
      {
        type: "section",
        title: "💡 用户需求洞察",
        children: [
          {
            type: "quote",
            content: "我希望回家前就能远程开空调，到家就是舒适的温度。",
            author: "张女士",
            role: "28岁，互联网从业者",
            source: "深度访谈"
          },
          {
            type: "quote",
            content: "家里有小孩，最关心的是安全。希望能实时监控家里情况。",
            author: "李先生",
            role: "32岁，金融从业者",
            source: "深度访谈"
          },
          {
            type: "quote",
            content: "不想每个设备都要单独控制，希望能一键场景化操作。",
            author: "王女士",
            role: "26岁，教师",
            source: "深度访谈"
          },
          {
            type: "list",
            title: "核心需求排序",
            items: [
              { icon: "1️⃣", text: "便利性：远程控制、语音控制、自动化" },
              { icon: "2️⃣", text: "安全性：监控、报警、儿童保护" },
              { icon: "3️⃣", text: "舒适性：温度、湿度、光线自动调节" },
              { icon: "4️⃣", text: "节能性：智能用电、节能提醒" },
              { icon: "5️⃣", text: "娱乐性：智能音箱、投影、游戏" }
            ]
          }
        ]
      },

      {
        type: "divider"
      },

      // 6. 机会点分析
      {
        type: "section",
        title: "🎯 市场机会点",
        children: [
          {
            type: "list",
            title: "蓝海市场",
            items: [
              { icon: "🔵", text: "老年人智能家居：市场空白，需求强烈" },
              { icon: "🔵", text: "租房市场：轻量化、易安装产品" },
              { icon: "🔵", text: "宠物智能设备：喂食、监控、互动" }
            ]
          },
          {
            type: "list",
            title: "技术创新方向",
            items: [
              { icon: "💡", text: "AI学习用户习惯，主动优化" },
              { icon: "💡", text: "跨品牌互联互通" },
              { icon: "💡", text: "隐私保护和数据安全" }
            ]
          },
          {
            type: "alert",
            alertType: "warning",
            title: "风险提示",
            message: "市场竞争激烈，需要差异化定位。价格战可能压缩利润空间。"
          }
        ]
      },

      {
        type: "divider"
      },

      // 7. 建议
      {
        type: "section",
        title: "📝 战略建议",
        children: [
          {
            type: "timeline",
            direction: "vertical",
            items: [
              {
                title: "短期（3-6个月）",
                description: "聚焦核心品类，打造爆款产品",
                status: "current"
              },
              {
                title: "中期（6-12个月）",
                description: "完善产品线，建立生态系统",
                status: "pending"
              },
              {
                title: "长期（1-2年）",
                description: "品牌升级，拓展海外市场",
                status: "pending"
              }
            ]
          },
          {
            type: "list",
            title: "具体行动",
            items: [
              { icon: "✅", text: "定位：25-35岁年轻家庭" },
              { icon: "✅", text: "产品：智能门锁 + 摄像头 + 智能音箱组合" },
              { icon: "✅", text: "价格：中端定位，2000-5000元" },
              { icon: "✅", text: "渠道：线上为主，线下体验店为辅" },
              { icon: "✅", text: "营销：KOL种草 + 场景化内容" }
            ]
          }
        ]
      },

      {
        type: "divider"
      },

      // 8. 数据来源
      {
        type: "section",
        title: "📊 研究方法",
        children: [
          {
            type: "markdown",
            content: `
### 数据来源
- 行业报告：艾瑞咨询、IDC、Gartner
- 用户调研：问卷 1,500 份，深度访谈 30 人
- 竞品分析：Top 10 品牌官网、电商平台
- 专家访谈：行业专家 5 人

### 研究周期
2026年1月 - 2026年3月

### 样本分布
- 一线城市：40%
- 二线城市：35%
- 三线及以下：25%
            `
          },
          {
            type: "dataSource",
            source: "艾瑞咨询 + 自主调研",
            timestamp: "2026-03-08T00:00:00Z",
            confidence: 90,
            freshness: 1
          }
        ]
      }
    ]
  },
  meta: {
    author: "lingxi",
    tags: ["市场调研", "智能家居", "行业分析"]
  }
})

console.log('分享链接:', result.shareUrl)
```

## 效果预览

生成的报告包含：
- 执行摘要和核心指标
- 市场规模趋势图
- 用户画像（年龄、收入、特征）
- 竞争格局（市场份额、品牌对比）
- 用户需求洞察（访谈引用）
- 机会点分析
- 战略建议（时间轴）
- 研究方法说明

## 使用提示

1. **执行摘要**：用 `alert` 组件突出核心结论
2. **数据可视化**：多用图表（折线图、柱状图、饼图）
3. **用户原声**：用 `quote` 组件增加真实感
4. **时间规划**：用 `timeline` 组件展示路线图
5. **数据溯源**：说明数据来源和研究方法

## 变体示例

### 快速版（30分钟）

只保留：
- 市场规模
- 竞争格局
- 核心建议

### 完整版（深度报告）

增加：
- PEST 分析
- 波特五力模型
- SWOT 分析
- 财务预测
