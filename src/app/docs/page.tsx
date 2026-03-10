import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation | Information Board Toolkit',
  description: 'REST API documentation for Information Board Toolkit',
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
          <p className="mt-2 text-gray-600">
            REST API for creating and managing information boards
          </p>
        </header>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Base URL</h2>
          <code className="block bg-gray-100 p-3 rounded text-sm">
            {process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api
          </code>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>
          <p className="text-gray-600 mb-4">
            Most endpoints require an API key. Include it in the request header:
          </p>
          <code className="block bg-gray-100 p-3 rounded text-sm">
            X-API-Key: your-api-key
          </code>
          <p className="mt-4 text-gray-600">
            In development mode, authentication is optional. In production, set the{' '}
            <code className="bg-gray-100 px-1 rounded">API_KEY</code> environment variable.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Endpoints</h2>
          
          <div className="space-y-6">
            <section>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                <code className="text-lg">/board/submit</code>
              </div>
              <p className="text-gray-600 ml-16">
                Create a new board. Returns share URL and owner token.
              </p>
              <p className="text-gray-500 text-sm ml-16 mt-1">
                Rate limit: 10 requests/minute
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
                <code className="text-lg">/board/view/{'{token}'}</code>
              </div>
              <p className="text-gray-600 ml-16">
                View a board by share token. No authentication required.
              </p>
              <p className="text-gray-500 text-sm ml-16 mt-1">
                Rate limit: 100 requests/minute
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">PUT</span>
                <code className="text-lg">/board/{'{id}'}</code>
              </div>
              <p className="text-gray-600 ml-16">
                Update a board. Requires X-Owner-Token header.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">DELETE</span>
                <code className="text-lg">/board/{'{id}'}</code>
              </div>
              <p className="text-gray-600 ml-16">
                Delete a board. Requires X-Owner-Token header.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                <code className="text-lg">/cron/cleanup</code>
              </div>
              <p className="text-gray-600 ml-16">
                Cron job to cleanup expired boards. Optional CRON_SECRET header.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
                <code className="text-lg">/health</code>
              </div>
              <p className="text-gray-600 ml-16">
                Health check endpoint. No authentication required.
              </p>
            </section>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Component Types</h2>
          <p className="text-gray-600 mb-4">
            The layout supports the following component types:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              'section', 'card', 'content-card', 'card-grid',
              'table', 'list', 'metric', 'chart',
              'markdown', 'image', 'alert', 'divider',
              'dataSource', 'compareTable', 'dataBadge', 'tag',
              'badge', 'quote', 'timeline', 'progress',
              'collapse', 'comments', 'versionHistory', 'template',
              'imageGallery'
            ].map(type => (
              <code key={type} className="bg-gray-100 px-2 py-1 rounded text-sm">
                {type}
              </code>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">OpenAPI Specification</h2>
          <p className="text-gray-600 mb-4">
            Download the full OpenAPI 3.0 specification:
          </p>
          <a
            href="/openapi.json"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download openapi.json
          </a>
        </div>
      </div>
    </div>
  )
}
