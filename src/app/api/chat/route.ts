import { createOpenAI } from '@ai-sdk/openai'
import { streamText, type Message } from 'ai'
import type { NextRequest } from 'next/server'

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response('OPENAI_API_KEY is not configured.', { status: 500 })
  }

  let messages: Message[]

  try {
    const body = await req.json()

    if (!Array.isArray(body?.messages)) {
      return new Response('`messages` must be an array.', { status: 400 })
    }

    messages = body.messages
  } catch {
    return new Response('Invalid JSON body.', { status: 400 })
  }

  try {
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages,
    })

    return result.toAIStreamResponse()
  } catch (error) {
    console.error('[chat-route]', error)
    return new Response('Failed to generate a response.', { status: 500 })
  }
}
