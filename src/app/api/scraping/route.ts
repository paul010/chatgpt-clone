/**
 * Scraping AI API Route
 * Enhanced web scraping with AI processing
 */

import ScrapingAIEngine from '@/lib/scraping-engine'

// Since we're in a Node.js environment, we'll create a more compatible version
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url, config } = body

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Initialize scraping engine
    const scraper = new ScrapingAIEngine()

    // Create scraping configuration
    const scrapingConfig = {
      url,
      timeout: config?.timeout || 10000,
      extractMode: config?.extractMode || 'text',
      aiPrompts: config?.aiPrompts || []
    }

    // Perform scraping
    const result = await scraper.scrape(scrapingConfig)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Scraping API error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function GET() {
  return new Response(JSON.stringify({
    message: 'Scraping AI Engine API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/scraping - Perform web scraping with AI enhancement',
      GET: 'This endpoint information'
    },
    features: [
      'Intelligent content extraction',
      'AI-powered text processing',
      'Structured data extraction',
      'Metadata extraction',
      'Multiple content modes'
    ]
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}