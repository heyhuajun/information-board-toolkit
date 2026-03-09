import Link from 'next/link'
import Card from '@/components/Card'
import Table from '@/components/Table'
import List from '@/components/List'
import Metric from '@/components/Metric'
import Quote from '@/components/Quote'
import Timeline from '@/components/Timeline'
import Alert from '@/components/Alert'
import Divider from '@/components/Divider'
import CompareTable from '@/components/CompareTable'
import DataSource from '@/components/DataSource'

export default function DemoPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #F8FAFC, #EFF6FF)' }}>
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">IB</span>
            </div>
            <span className="font-semibold text-slate-900">Information Board</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Design Demo</span>
            <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              返回首页
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            新设计系统
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            克制 · 简单 · 美观
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            更少的选择，更好的体验。专注于内容本身。
          </p>
        </section>

        {/* Section: Metrics */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-slate-900 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-900">核心指标</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)' }}>
              <div className="text-sm text-slate-500 mb-2">市场规模</div>
              <div className="text-3xl font-bold text-slate-900 mb-1">$2.4B</div>
              <div className="flex items-center gap-1 text-sm text-emerald-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+12.5%</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)' }}>
              <div className="text-sm text-slate-500 mb-2">年增长率</div>
              <div className="text-3xl font-bold text-slate-900 mb-1">23.8%</div>
              <div className="flex items-center gap-1 text-sm text-emerald-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+5.2%</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)' }}>
              <div className="text-sm text-slate-500 mb-2">竞品数量</div>
              <div className="text-3xl font-bold text-slate-900 mb-1">47</div>
              <div className="flex items-center gap-1 text-sm text-rose-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span>+8</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)' }}>
              <div className="text-sm text-slate-500 mb-2">平均评分</div>
              <div className="text-3xl font-bold text-slate-900 mb-1">4.6</div>
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
                <span>持平</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Cards */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-slate-900 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-900">信息卡片</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">市场</span>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">北美市场分析</h3>
              <p className="text-sm text-slate-500 leading-relaxed">美国和加拿大市场占总销售额的 67%，年增长率达到 18.5%。</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">优势</span>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">核心竞争力</h3>
              <p className="text-sm text-slate-500 leading-relaxed">价格优势明显，产品评分 4.8/5.0，物流时效优于竞品 2-3 天。</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">风险</span>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">潜在风险</h3>
              <p className="text-sm text-slate-500 leading-relaxed">供应链依赖单一供应商，政策变动可能影响 15% 的利润空间。</p>
            </div>
          </div>
        </section>

        {/* Section: Table */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-slate-900 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-900">数据表格</h2>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">产品名称</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">价格</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">评分</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">销量</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">趋势</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">A</div>
                      <span className="font-medium text-slate-900">Product Alpha</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">$29.99</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-900 font-medium">4.8</span>
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">12,450</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      +18%
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">B</div>
                      <span className="font-medium text-slate-900">Product Beta</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">$39.99</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-900 font-medium">4.5</span>
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">8,230</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                      0%
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">C</div>
                      <span className="font-medium text-slate-900">Product Gamma</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">$19.99</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-900 font-medium">4.2</span>
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">15,890</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-rose-500 bg-rose-50 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      -5%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section: Comparison */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-slate-900 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-900">方案对比</h2>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4 w-1/3">特性</th>
                  <th className="text-center text-xs font-medium uppercase tracking-wider px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600">方案 A</span>
                  </th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-4">方案 B</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">价格</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      $29.99
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">$39.99</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">用户评分</td>
                  <td className="px-6 py-4 text-center text-slate-600">4.5</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      4.8
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">功能数量</td>
                  <td className="px-6 py-4 text-center text-slate-600">12</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      18
                    </span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-slate-50/50 border-t border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-900">推荐</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      性价比之选
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-500 text-sm">功能更全</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Section: Quote */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-slate-900 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-900">用户反馈</h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 border border-slate-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-medium text-blue-600">王</span>
              </div>
              <div className="flex-1">
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                  "产品体验非常流畅，客服响应也很及时。使用三个月以来，团队协作效率提升了 40%。"
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-900">王明</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-sm text-slate-500">产品经理 @ 某科技公司</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Timeline */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-slate-900 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-900">执行计划</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { title: '市场调研', status: 'completed', date: '2024-03-01' },
              { title: '产品原型设计', status: 'completed', date: '2024-03-15' },
              { title: '技术开发', status: 'active', date: '2024-04-01' },
              { title: '测试上线', status: 'pending', date: '2024-05-01' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-emerald-500' :
                    item.status === 'active' ? 'bg-blue-500 ring-4 ring-blue-100' :
                    'bg-slate-200'
                  }`}></div>
                  {index < 3 && <div className="w-px h-8 bg-slate-200 mt-2"></div>}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-slate-900">{item.title}</span>
                    {item.status === 'completed' && (
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">已完成</span>
                    )}
                    {item.status === 'active' && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">进行中</span>
                    )}
                  </div>
                  <span className="text-sm text-slate-500">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Alert */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-slate-900 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-900">提示信息</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <div className="font-medium text-blue-900 mb-0.5">信息提示</div>
                <div className="text-sm text-blue-700">这是一条普通的信息提示，用于展示一般性说明。</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <div className="font-medium text-emerald-900 mb-0.5">成功提示</div>
                <div className="text-sm text-emerald-700">操作已成功完成，数据已保存。</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <div className="font-medium text-amber-900 mb-0.5">警告提示</div>
                <div className="text-sm text-amber-700">请注意，此操作可能会影响现有数据。</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Data Source */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-slate-900 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-900">数据来源</h2>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-100 p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900">Amazon 市场调研报告</div>
                <div className="text-sm text-slate-500">amazon.com/dp/B0XXXXX</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">2小时前</div>
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  95%
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>2024-03-10</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>数据新鲜度：2小时</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div>Information Board Toolkit</div>
            <div className="flex items-center gap-4">
              <span>克制 · 简单 · 美观</span>
              <span>·</span>
              <span>v0.2.0</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
