import { createGoogleGenerativeAI } from '@ai-sdk/google'
import {
  convertToCoreMessages,
  streamText,
  type CoreMessage,
  type Tool,
  type UIMessage,
} from 'ai'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

const configuredBaseUrl = process.env.GOOGLE_GENERATIVE_AI_BASE_URL?.trim()

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  ...(configuredBaseUrl && configuredBaseUrl.length > 0
    ? { baseURL: configuredBaseUrl }
    : {}),
})

const DEFAULT_MODEL_ID = 'models/gemini-2.5-flash'

const resolveModelId = (): string => {
  const configured = process.env.GOOGLE_GENERATIVE_AI_MODEL?.trim()
  return configured && configured.length > 0 ? configured : DEFAULT_MODEL_ID
}

const webSearchTool: Tool<
  { query: string },
  {
    query: string
    results: Array<{ title: string; link?: string; snippet?: string }>
    note?: string
  }
> = {
  description:
    '使用 SerpAPI 在互联网上检索最新信息，在模型知识库不足时使用，返回标题、链接和摘要。',
  inputSchema: z.object({
    query: z
      .string()
      .min(1, '请输入搜索关键词')
      .describe('需要检索的查询语句'),
  }),
  outputSchema: z.object({
    query: z.string(),
    results: z
      .array(
        z.object({
          title: z.string(),
          link: z.string().url().optional(),
          snippet: z.string().optional(),
        })
      )
      .default([]),
    note: z.string().optional(),
  }),
  execute: async ({ query }) => {
    if (!process.env.SERPAPI_API_KEY) {
      return {
        query,
        results: [],
        note:
          '未检测到 SERPAPI_API_KEY，无法执行实时联网搜索。请在 .env.local 中配置后再尝试。',
      }
    }

    const params = new URLSearchParams({
      api_key: process.env.SERPAPI_API_KEY,
      engine: 'google',
      q: query,
      hl: 'zh-CN',
      gl: 'cn',
      num: '5',
    })

    const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`)

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      console.error('[web-search] request failed', response.status, text)
      throw new Error('联网搜索失败，请稍后再试。')
    }

    const data = (await response.json()) as {
      organic_results?: Array<{
        title?: string
        link?: string
        snippet?: string
      }>
    }

    const organic = Array.isArray(data.organic_results)
      ? data.organic_results
          .filter((item) => Boolean(item?.title))
          .slice(0, 4)
          .map((item) => ({
            title: item?.title ?? '未命名结果',
            link: item?.link,
            snippet: item?.snippet,
          }))
      : []

    return {
      query,
      results: organic,
      note: organic.length === 0 ? '搜索结果为空，请调整查询内容。' : undefined,
    }
  },
}

export async function POST(req: NextRequest) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response('GOOGLE_GENERATIVE_AI_API_KEY is not configured.', {
      status: 500,
    })
  }

  let messages: CoreMessage[]

  try {
    const body = await req.json()

    if (!Array.isArray(body?.messages)) {
      return new Response('`messages` must be an array.', { status: 400 })
    }

    const rawMessages = body.messages as Array<CoreMessage | UIMessage>

    if (rawMessages.some((message) => 'parts' in message)) {
      const uiMessages = rawMessages as UIMessage[]
      messages = convertToCoreMessages(
        uiMessages.map((message) => {
          const { id: _messageId, ...messageWithoutId } = message
          void _messageId
          return messageWithoutId
        })
      )
    } else {
      messages = rawMessages as CoreMessage[]
    }
  } catch {
    return new Response('Invalid JSON body.', { status: 400 })
  }

  try {
    const initialModelId = resolveModelId()

    const result = await streamText({
      model: google(initialModelId),
      messages,
      system:
        '你是一个中文优先的对话助手。遇到需要最新信息、新闻或模型知识库可能过期的内容时，请调用 webSearch 工具，并在回答中结合搜索结果。在回答结尾使用 Markdown 列表引用信息来源。',
      tools: {
        webSearch: webSearchTool,
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('[chat-route]', error)

    if (error instanceof Error) {
      const message = error.message ?? ''

      if (message.includes('is not found') || message.includes('Unsupported method')) {
        return new Response(
          'Gemini 模型不可用，请检查 GOOGLE_GENERATIVE_AI_MODEL 配置或在环境中切换为受支持的模型。',
          { status: 502 }
        )
      }
    }

    return new Response('Failed to generate a response.', { status: 500 })
  }
}
