import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center px-6 max-w-lg">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-8">
          <span className="text-white text-2xl font-bold">IB</span>
        </div>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Information Board
        </h1>
        
        <p className="text-lg text-slate-500 mb-8 leading-relaxed">
          Agent 信息看板工具包<br />
          一键生成，优雅分享
        </p>
        
        <div className="flex gap-4 justify-center mb-12">
          <Link 
            href="/demo" 
            className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
          >
            查看示例
          </Link>
          <a 
            href="https://github.com/heyhuajun/information-board-toolkit"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors font-medium text-slate-600"
          >
            GitHub
          </a>
        </div>
        
        <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
          <span>23 种组件</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>5 个 API</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>秒级部署</span>
        </div>
      </div>
    </main>
  )
}
