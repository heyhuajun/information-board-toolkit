'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Board {
  id: string
  title: string
  shareToken: string
  views: number
  createdAt: string
  expiresAt?: string
  author?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [cleaning, setCleaning] = useState(false)

  // 检查是否已登录
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchBoards()
    }
  }, [])

  // 登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (res.ok) {
        sessionStorage.setItem('admin_auth', 'true')
        setIsAuthenticated(true)
        fetchBoards()
      } else {
        setError('密码错误')
      }
    } catch {
      setError('登录失败')
    } finally {
      setLoading(false)
    }
  }

  // 登出
  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
    setBoards([])
    setPassword('')
  }

  // 获取看板列表
  const fetchBoards = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/boards')
      const data = await res.json()
      setBoards(data.boards || [])
    } catch {
      console.error('Failed to fetch boards')
    } finally {
      setLoading(false)
    }
  }

  // 删除看板
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个看板吗？')) return
    
    setDeleteId(id)
    try {
      const res = await fetch(`/api/admin/boards/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setBoards(boards.filter(b => b.id !== id))
      } else {
        alert('删除失败')
      }
    } catch {
      alert('删除失败')
    } finally {
      setDeleteId(null)
    }
  }

  const handleCleanup = async () => {
    if (!confirm('确定要清理所有过期看板吗？')) return
    
    setCleaning(true)
    try {
      const res = await fetch('/api/admin/cleanup', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        fetchBoards()
      } else {
        alert('清理失败')
      }
    } catch {
      alert('清理失败')
    } finally {
      setCleaning(false)
    }
  }

  // 格式化日期
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 检查是否过期
  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  // 计算剩余时间
  const getRemainingTime = (expiresAt?: string) => {
    if (!expiresAt) return '永不过期'
    const diff = new Date(expiresAt).getTime() - Date.now()
    if (diff <= 0) return '已过期'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}天${hours}小时`
    return `${hours}小时`
  }

  // 登录界面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">管理员登录</h1>
            <p className="text-slate-500 mt-2">请输入管理员密码</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:outline-none mb-4"
              autoFocus
            />
            
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}
            
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // 管理界面
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">IB</span>
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">管理后台</h1>
              <p className="text-xs text-slate-500">Information Board Toolkit</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleCleanup}
              disabled={cleaning}
              className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {cleaning ? '清理中...' : '清理过期'}
            </button>
            <button
              onClick={fetchBoards}
              className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">总看板数</div>
            <div className="text-3xl font-bold text-slate-900">{boards.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">活跃看板</div>
            <div className="text-3xl font-bold text-emerald-600">
              {boards.filter(b => !isExpired(b.expiresAt)).length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="text-sm text-slate-500 mb-1">已过期</div>
            <div className="text-3xl font-bold text-red-500">
              {boards.filter(b => isExpired(b.expiresAt)).length}
            </div>
          </div>
        </div>

        {/* Board List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">看板列表</h2>
          </div>
          
          {loading ? (
            <div className="px-6 py-12 text-center text-slate-500">加载中...</div>
          ) : boards.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">暂无看板</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">标题</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">分享链接</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">浏览量</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">状态</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">创建时间</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {boards.map((board) => (
                    <tr key={board.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{board.title || '无标题'}</div>
                        {board.author && (
                          <div className="text-xs text-slate-500">作者: {board.author}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`/view/${board.shareToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          /view/{board.shareToken.slice(0, 8)}...
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{board.views}</td>
                      <td className="px-6 py-4">
                        {isExpired(board.expiresAt) ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                            已过期
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                            {getRemainingTime(board.expiresAt)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{formatDate(board.createdAt)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(board.id)}
                          disabled={deleteId === board.id}
                          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                        >
                          {deleteId === board.id ? '删除中...' : '删除'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
