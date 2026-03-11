import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const guide = {
    name: 'Information Board Toolkit',
    version: '1.0.0',
    description: 'Create beautiful visual pages for data presentation. Agent-friendly API.',
    
    quickStart: {
      endpoint: '/api/board/submit',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'your-api-key (required in production)'
      },
      bodyTemplate: {
        title: 'Report title',
        description: 'Optional description',
        expiresIn: '7d', // 1h, 24h, 7d, 30d, never
        layout: { type: 'section', children: [] }
      },
      response: {
        shareUrl: 'https://board.heyhuajun.xyz/view/xxx'
      }
    },

    // Scene mapping - Agent looks up by intent
    sceneMapping: {
      'show metrics': 'card-grid',
      'show kpi': 'metric',
      'compare options': 'compareTable',
      'show table': 'table',
      'show progress': 'timeline + progress',
      'user feedback': 'quote',
      'show alert': 'alert',
      'data source': 'dataSource',
      'show chart': 'chart',
      'group content': 'section'
    },

    // Component reference
    components: {
      'section': {
        description: 'Group related content together',
        props: { title: 'string?', description: 'string?', children: 'Component[]' },
        example: { type: 'section', title: 'Market Overview', children: [] }
      },
      'card-grid': {
        description: 'Display 2-4 key metrics in a grid',
        props: { columns: '2|3|4', cards: 'Card[]' },
        cardProps: { title: 'string', value: 'string|number', change: 'string?', changeType: 'positive|negative|neutral' },
        example: { type: 'card-grid', columns: 4, cards: [{ title: 'Revenue', value: '$10M', change: '+12%', changeType: 'positive' }] }
      },
      'metric': {
        description: 'Single metric with trend indicator',
        props: { label: 'string', value: 'string|number', change: 'string?', changeType: 'positive|negative|neutral' },
        example: { type: 'metric', label: 'Growth Rate', value: '23.5%', change: '+5.2%', changeType: 'positive' }
      },
      'table': {
        description: 'Display tabular data',
        props: { title: 'string?', headers: 'string[]', rows: '(string|number)[][]', highlightRow: 'number?' },
        example: { type: 'table', headers: ['Name', 'Value', 'Trend'], rows: [['Item A', 100, '↑']] }
      },
      'compareTable': {
        description: 'Compare two options with winner highlighting',
        props: { title: 'string?', columns: '[{key, label}, {key, label}]', rows: 'CompareRow[]', recommend: 'A|B?' },
        rowProps: { feature: 'string', valueA: 'string|number', valueB: 'string|number', winner: 'A|B|tie?' },
        example: { type: 'compareTable', columns: [{ key: 'a', label: 'Option A' }, { key: 'b', label: 'Option B' }], rows: [{ feature: 'Price', valueA: '$29', valueB: '$39', winner: 'A' }], recommend: 'A' }
      },
      'timeline': {
        description: 'Show progress through stages',
        props: { items: 'TimelineItem[]', direction: 'horizontal|vertical?' },
        itemProps: { title: 'string', description: 'string?', date: 'string?', status: 'completed|current|pending' },
        example: { type: 'timeline', items: [{ title: 'Phase 1', status: 'completed' }, { title: 'Phase 2', status: 'current' }] }
      },
      'progress': {
        description: 'Show completion percentage',
        props: { percent: 'number (0-100)', showLabel: 'boolean?', status: 'success|warning|error?' },
        example: { type: 'progress', percent: 65, showLabel: true }
      },
      'quote': {
        description: 'Display user testimonial or feedback',
        props: { content: 'string', author: 'string', avatar: 'string?', role: 'string?', source: 'string?' },
        example: { type: 'quote', content: 'Great product!', author: 'John', role: 'Product Manager' }
      },
      'alert': {
        description: 'Highlight important message',
        props: { alertType: 'info|success|warning|error', title: 'string?', message: 'string' },
        example: { type: 'alert', alertType: 'success', title: 'Recommendation', message: 'Choose Option A' }
      },
      'dataSource': {
        description: 'Show data provenance and confidence',
        props: { source: 'string', url: 'string?', timestamp: 'string|Date', confidence: 'number (0-100)?', freshness: 'number (hours)?', content: 'string?' },
        example: { type: 'dataSource', source: 'Amazon API', confidence: 95, freshness: 2 }
      },
      'chart': {
        description: 'Display data visualization',
        props: { chartType: 'line|bar|pie|doughnut|radar', title: 'string?', data: '{labels, datasets}' },
        example: { type: 'chart', chartType: 'line', data: { labels: ['Jan', 'Feb'], datasets: [{ label: 'Sales', data: [100, 150] }] } }
      },
      'card': {
        description: 'Single insight card with tag and arrow',
        props: { title: 'string', value: 'string|number', change: 'string?', changeType: 'positive|negative|neutral?', image: 'string?', footer: 'string?' },
        example: { type: 'card', title: 'Market Analysis', value: 'Growing', footer: 'See details' }
      },
      'list': {
        description: 'Simple bullet list',
        props: { title: 'string?', items: '{icon?: string, text: string}[]' },
        example: { type: 'list', title: 'Key Points', items: [{ text: 'Point 1' }, { text: 'Point 2' }] }
      },
      'divider': {
        description: 'Visual separator between sections',
        props: {},
        example: { type: 'divider' }
      },
      'image': {
        description: 'Display an image',
        props: { src: 'string', caption: 'string?', width: 'full|half|third' },
        example: { type: 'image', src: 'https://example.com/image.jpg', caption: 'Chart' }
      },
      'imageGallery': {
        description: 'Display multiple images in a grid',
        props: { images: '{src, caption?, alt?}[]', columns: '2|3|4?', enableLightbox: 'boolean?' },
        example: { type: 'imageGallery', images: [{ src: 'url1' }, { src: 'url2' }], columns: 3 }
      },
      'markdown': {
        description: 'Render markdown content',
        props: { content: 'string' },
        example: { type: 'markdown', content: '# Title\\n\\nParagraph text' }
      },
      'collapse': {
        description: 'Expandable content section',
        props: { title: 'string', content: 'string?', children: 'Component[]?', defaultExpanded: 'boolean?' },
        example: { type: 'collapse', title: 'Details', content: 'Hidden content here' }
      },
      'tag': {
        description: 'Colored label tag',
        props: { label: 'string', color: 'default|primary|success|warning|danger', icon: 'string?' },
        example: { type: 'tag', label: 'Important', color: 'primary' }
      },
      'badge': {
        description: 'Numeric badge or dot indicator',
        props: { count: 'number?', dot: 'boolean?', color: 'string?' },
        example: { type: 'badge', count: 5 }
      },
      'dataBadge': {
        description: 'Show confidence and freshness indicators',
        props: { confidence: 'number?', freshness: 'string|number?', showConfidence: 'boolean?', showFreshness: 'boolean?' },
        example: { type: 'dataBadge', confidence: 95, freshness: '2 hours ago' }
      },
      'comments': {
        description: 'Display comments with replies',
        props: { comments: 'Comment[]' },
        commentProps: { id: 'string', author: 'string', content: 'string', createdAt: 'string', avatar: 'string?', replies: 'Comment[]?' },
        example: { type: 'comments', comments: [{ id: '1', author: 'User', content: 'Nice!', createdAt: '2024-01-01' }] }
      },
      'versionHistory': {
        description: 'Show version changes over time',
        props: { currentVersion: 'number', versions: 'Version[]' },
        versionProps: { version: 'number', createdAt: 'string', author: 'string?', changes: 'string[]?' },
        example: { type: 'versionHistory', currentVersion: 3, versions: [{ version: 1, createdAt: '2024-01-01', changes: ['Initial'] }] }
      }
    },

    // Ready-to-use templates
    templates: {
      marketAnalysis: {
        description: 'Market/competitive analysis report',
        structure: {
          type: 'section',
          title: 'Market Analysis',
          children: [
            { type: 'card-grid', columns: 4, cards: '[]' },
            { type: 'divider' },
            { type: 'table', headers: ['Metric', 'Value', 'Trend'], rows: '[]' },
            { type: 'dataSource', source: 'Data source', confidence: 95 }
          ]
        }
      },
      comparison: {
        description: 'Compare two options/products',
        structure: {
          type: 'compareTable',
          title: 'Comparison',
          columns: [{ key: 'a', label: 'Option A' }, { key: 'b', label: 'Option B' }],
          rows: '[]',
          recommend: 'A or B'
        }
      },
      progress: {
        description: 'Project progress report',
        structure: {
          type: 'section',
          title: 'Project Progress',
          children: [
            { type: 'timeline', items: '[]' },
            { type: 'progress', percent: 50, showLabel: true },
            { type: 'alert', alertType: 'info', message: 'Status update' }
          ]
        }
      },
      userFeedback: {
        description: 'User research summary',
        structure: {
          type: 'section',
          title: 'User Feedback',
          children: [
            { type: 'quote', content: '...', author: 'User 1' },
            { type: 'quote', content: '...', author: 'User 2' }
          ]
        }
      }
    },

    // Rules to follow
    rules: [
      'Always wrap content in a section with title',
      'Use card-grid for 2-4 metrics, not individual cards',
      'Use compareTable for A/B comparisons, not regular table',
      'Add dataSource after each data block to show provenance',
      'Use alert to highlight conclusions or recommendations',
      'Keep nesting depth under 3 levels',
      'Use divider between different content sections'
    ],

    // Enum values reference
    enums: {
      changeType: ['positive', 'negative', 'neutral'],
      alertType: ['info', 'success', 'warning', 'error'],
      timelineStatus: ['completed', 'current', 'pending'],
      chartType: ['line', 'bar', 'pie', 'doughnut', 'radar'],
      expiresIn: ['1h', '24h', '7d', '30d', 'never'],
      progressStatus: ['success', 'warning', 'error'],
      tagColor: ['default', 'primary', 'success', 'warning', 'danger']
    }
  }

  return NextResponse.json(guide, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
