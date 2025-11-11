/**
 * Enhanced Scraping AI Engine
 * Intelligent web scraping with AI-powered content extraction
 */

// Simple validation without zod to avoid dependency issues
interface ScrapingConfig {
  url: string
  selector?: string
  maxRetries?: number
  timeout?: number
  javascript?: boolean
  extractMode?: 'text' | 'html' | 'structured'
  aiPrompts?: string[]
}

interface ScrapingResult {
  success: boolean
  url: string
  content: string
  metadata: {
    title?: string
    description?: string
    images?: string[]
    links?: string[]
    timestamp: string
  }
  structuredData?: any
  error?: string
}

export class ScrapingAIEngine {
  private readonly DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  }

  constructor(private enableJavaScript: boolean = true) {}

  /**
   * Validate scraping configuration
   */
  private validateConfig(config: ScrapingConfig): ScrapingConfig {
    return {
      url: config.url,
      selector: config.selector,
      maxRetries: config.maxRetries || 3,
      timeout: config.timeout || 10000,
      javascript: config.javascript !== false,
      extractMode: config.extractMode || 'text',
      aiPrompts: config.aiPrompts || []
    }
  }

  /**
   * Main scraping method with AI enhancement
   */
  async scrape(config: ScrapingConfig): Promise<ScrapingResult> {
    try {
      // Validate configuration
      const validatedConfig = this.validateConfig(config)
      
      // Validate URL
      if (!this.isValidUrl(validatedConfig.url)) {
        throw new Error('Invalid URL format')
      }
      
      // Fetch content
      const content = await this.fetchContent(validatedConfig)
      
      // Extract metadata
      const metadata = await this.extractMetadata(content, validatedConfig.url)
      
      // Apply AI enhancement if prompts provided
      let enhancedContent = content
      if (validatedConfig.aiPrompts && validatedConfig.aiPrompts.length > 0) {
        enhancedContent = await this.enhanceContentWithAI(content, validatedConfig.aiPrompts)
      }
      
      // Extract structured data
      let structuredData: any = null
      if (validatedConfig.extractMode === 'structured') {
        structuredData = await this.extractStructuredData(enhancedContent)
      }
      
      return {
        success: true,
        url: validatedConfig.url,
        content: enhancedContent,
        metadata,
        structuredData
      }
      
    } catch (error) {
      return {
        success: false,
        url: config.url,
        content: '',
        metadata: {
          timestamp: new Date().toISOString()
        },
        error: error instanceof Error ? error.message : 'Unknown scraping error'
      }
    }
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * Fetch content from URL
   */
  private async fetchContent(config: ScrapingConfig): Promise<string> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.timeout)
    
    try {
      const response = await fetch(config.url, {
        headers: this.DEFAULT_HEADERS,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.text()
      
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      
      throw error
    }
  }

  /**
   * Extract metadata from HTML content
   */
  private async extractMetadata(content: string, url: string): Promise<ScrapingResult['metadata']> {
    // Extract title
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i)
    
    // Extract description
    const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    
    // Extract images and links
    const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>/gi
    
    const images: string[] = []
    const links: string[] = []
    
    let match
    while ((match = imgRegex.exec(content)) !== null) {
      images.push(match[1])
    }
    
    while ((match = linkRegex.exec(content)) !== null) {
      links.push(match[1])
    }
    
    return {
      title: titleMatch?.[1]?.trim(),
      description: descMatch?.[1]?.trim(),
      images: images.slice(0, 10), // Limit to 10 images
      links: links.slice(0, 20), // Limit to 20 links
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Enhance content with AI processing
   */
  private async enhanceContentWithAI(content: string, prompts: string[]): Promise<string> {
    // Extract clean text content
    const textContent = this.extractTextContent(content)
    
    // Apply AI prompts to enhance content
    let enhanced = textContent
    for (const prompt of prompts) {
      enhanced = this.applyPrompt(enhanced, prompt)
    }
    
    return enhanced
  }

  /**
   * Extract clean text content from HTML
   */
  private extractTextContent(html: string): string {
    // Remove script and style elements
    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
    
    // Basic HTML entity decoding
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/&/g, '&')
      .replace(/"/g, '"')
      .replace(/'/g, "'")
    
    // Extract text content
    text = text
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    return text
  }

  /**
   * Apply AI prompt to content
   */
  private applyPrompt(content: string, prompt: string): string {
    const promptLower = prompt.toLowerCase()
    
    switch (promptLower) {
      case 'summarize':
        return this.summarizeContent(content)
      case 'extract_key_points':
        return this.extractKeyPoints(content)
      case 'clean_text':
        return content.replace(/\s+/g, ' ').trim()
      case 'extract_numbers':
        return this.extractNumbers(content)
      case 'extract_emails':
        return this.extractEmails(content)
      default:
        return content
    }
  }

  /**
   * Summarize content
   */
  private summarizeContent(content: string): string {
    const sentences = content.split(/[.!?。！？]+/).filter(s => s.trim().length > 0)
    const summaryLength = Math.min(3, sentences.length)
    return sentences.slice(0, summaryLength).join('. ') + '.'
  }

  /**
   * Extract key points
   */
  private extractKeyPoints(content: string): string {
    const lines = content.split('\n').filter(line => line.trim().length > 0)
    const keyLines = lines.filter(line => 
      line.length < 100 && 
      (line.includes(':') || line.includes('。') || line.includes('•') || line.includes('-'))
    )
    return keyLines.join('\n')
  }

  /**
   * Extract numbers from content
   */
  private extractNumbers(content: string): string {
    const numbers = content.match(/\d+(\.\d+)?/g) || []
    return numbers.join(', ')
  }

  /**
   * Extract email addresses
   */
  private extractEmails(content: string): string {
    const emails = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []
    return emails.join(', ')
  }

  /**
   * Extract structured data
   */
  private async extractStructuredData(content: string): Promise<any> {
    // Extract common structured data patterns
    const structured: any = {
      headings: this.extractHeadings(content),
      lists: this.extractLists(content),
      tables: this.extractTables(content),
      forms: this.extractForms(content),
      jsonLd: this.extractJsonLd(content)
    }
    
    return structured
  }

  private extractHeadings(content: string): string[] {
    const headingRegex = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi
    const headings: string[] = []
    let match
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push(match[1].trim())
    }
    
    return headings
  }

  private extractLists(content: string): string[] {
    const listRegex = /<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi
    const lists: string[] = []
    let match
    
    while ((match = listRegex.exec(content)) !== null) {
      lists.push(match[2].trim())
    }
    
    return lists
  }

  private extractTables(content: string): string[] {
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi
    const tables: string[] = []
    let match
    
    while ((match = tableRegex.exec(content)) !== null) {
      tables.push(match[1].trim())
    }
    
    return tables
  }

  private extractForms(content: string): string[] {
    const formRegex = /<form[^>]*>([\s\S]*?)<\/form>/gi
    const forms: string[] = []
    let match
    
    while ((match = formRegex.exec(content)) !== null) {
      forms.push(match[1].trim())
    }
    
    return forms
  }

  private extractJsonLd(content: string): any[] {
    const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    const jsonLdData: any[] = []
    let match
    
    while ((match = jsonLdRegex.exec(content)) !== null) {
      try {
        const data = JSON.parse(match[1].trim())
        jsonLdData.push(data)
      } catch (e) {
        // Invalid JSON, skip
      }
    }
    
    return jsonLdData
  }
}

export default ScrapingAIEngine