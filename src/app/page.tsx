export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Information Board
          </h1>
          <p className="text-xl text-gray-600">
            Agent 信息看板工具包 - 美观展示，对外分享
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ 核心功能</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🎨 美观展示</h3>
              <p className="text-gray-600 text-sm">
                23 种专业组件，自动适配移动端，让你的内容更有吸引力
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🔗 快速分享</h3>
              <p className="text-gray-600 text-sm">
                一键生成分享链接，支持设置有效期，方便分享给客户和朋友
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🤖 Agent 友好</h3>
              <p className="text-gray-600 text-sm">
                简单的 API 接口，Agent 可以快速生成和更新内容
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📊 访问统计</h3>
              <p className="text-gray-600 text-sm">
                实时浏览量统计，了解内容的传播效果
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🧩 组件库 (23)</h2>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-3">基础组件 (11)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {[
              'Section', 'Card', 'CardGrid', 'Table', 
              'List', 'Metric', 'Chart', 'Markdown',
              'Image', 'Alert', 'Divider'
            ].map((component) => (
              <div key={component} className="bg-gray-50 rounded-lg p-3 text-center">
                <span className="text-sm font-medium text-gray-700">{component}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Phase 1 组件 (5)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {[
              'DataSource', 'CompareTable', 'DataBadge', 
              'Tag', 'Badge'
            ].map((component) => (
              <div key={component} className="bg-blue-50 rounded-lg p-3 text-center">
                <span className="text-sm font-medium text-blue-700">{component}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Phase 2 组件 (7)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Template', 'VersionHistory', 'Comments',
              'Quote', 'Timeline', 'Progress', 'Collapse'
            ].map((component) => (
              <div key={component} className="bg-green-50 rounded-lg p-3 text-center">
                <span className="text-sm font-medium text-green-700">{component}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 快速开始</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. 安装 Toolkit</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                npm install @openclaw/information-board-toolkit
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Agent 调用</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`const board = new Board({ apiKey: 'your-key' })

const result = await board.submit({
  title: "市场调研报告",
  layout: {
    type: "section",
    children: [
      { type: "card-grid", cards: [...] },
      { type: "table", headers: [...], rows: [...] }
    ]
  }
})

console.log(result.shareUrl)`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. 分享链接</h3>
              <p className="text-gray-600 text-sm">
                将生成的链接分享给客户或朋友，他们无需登录即可查看
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 text-gray-600">
          <p>由 OpenClaw 提供支持</p>
        </div>
      </div>
    </div>
  )
}
