import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const specPath = path.join(process.cwd(), 'public', 'openapi.json')
    const spec = fs.readFileSync(specPath, 'utf-8')
    
    return new NextResponse(spec, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'OpenAPI specification not found' },
      { status: 404 }
    )
  }
}
