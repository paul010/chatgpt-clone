'use client'

import type { FormEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import {
  ChevronDown,
  Ellipsis,
  Loader2,
  MessageCircleQuestion,
  Mic,
  Paperclip,
  Plus,
  SendHorizontal,
  Share2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'
import type { UIMessage } from 'ai'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const quickPrompts = [
  '写一个旅游计划',
  '帮我润色一段邮件',
  '总结一下今天的新闻',
]

const STREAMING_STATUSES = new Set(['submitted', 'streaming'])

export default function Home() {
  const { messages, error, stop, sendMessage, status } = useChat()

  const [input, setInput] = useState('')
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const lastMessageRef = useRef<HTMLDivElement | null>(null)

  const hasMessages = messages.length > 0
  const isLoading = STREAMING_STATUSES.has(status)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    } else {
      viewport.scrollTop = viewport.scrollHeight
    }
  }, [messages])

  const helpfulCardShouldShow = useMemo(
    () => messages.some((message) => message.role === 'assistant'),
    [messages]
  )

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return

    try {
      await sendMessage({ text: trimmed })
      setInput('')
    } catch (submitError) {
      console.error('[chat-submit]', submitError)
    }
  }

  const formatWebSearchOutput = (output: unknown) => {
    if (!output || typeof output !== 'object') return ''

    const { query, results, note } = output as {
      query?: string
      results?: Array<{
        title?: string
        link?: string
        snippet?: string
      }>
      note?: string
    }

    const lines: string[] = []

    if (query) {
      lines.push(`🔍 实时搜索：${query}`)
    }

    if (Array.isArray(results) && results.length > 0) {
      results.forEach((item, index) => {
        if (!item) return
        const entryLines: string[] = []
        const order = index + 1
        if (item.title) {
          entryLines.push(`${order}. ${item.title}`)
        }
        if (item.link) {
          entryLines.push(item.link)
        }
        if (item.snippet) {
          entryLines.push(item.snippet)
        }
        if (entryLines.length > 0) {
          lines.push(entryLines.join('\n'))
        }
      })
    }

    if (note) {
      lines.push(`提示：${note}`)
    }

    return lines.join('\n\n')
  }

  const getMessageText = (message: UIMessage) =>
    message.parts
      .map((part) => {
        switch (part.type) {
          case 'text':
          case 'reasoning':
            return part.text
          case 'source-url':
            return `[参考链接] ${part.title ?? part.url}`
          case 'source-document':
            return `[参考文档] ${part.title ?? part.sourceId}`
          case 'dynamic-tool': {
            if (part.state === 'output-error') {
              return `⚠️ 工具 ${part.toolName} 调用失败：${part.errorText}`
            }

            if (part.state === 'output-available') {
              return formatWebSearchOutput(part.output)
            }

            return ''
          }
          default: {
            if (part.type.startsWith('data-')) {
              return '[数据片段]'
            }

            if (part.type === 'step-start') {
              return ''
            }

            if (part.type.startsWith('tool-')) {
              const toolName = part.type.slice('tool-'.length)
              const toolPart = part as unknown as {
                state?: string
                output?: unknown
                errorText?: string
              }

              if (toolPart.state === 'output-error') {
                return `⚠️ 工具 ${toolName} 调用失败：${toolPart.errorText ?? '未知错误'}`
              }

              if (toolPart.state === 'output-available') {
                if (toolName === 'webSearch') {
                  const formatted = formatWebSearchOutput(toolPart.output)
                  if (formatted) return formatted
                }

                return `[${toolName}] 调用完成`
              }

              return ''
            }

            return ''
          }
        }
      })
      .filter(Boolean)
      .join('\n\n')

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="hidden h-full w-64 flex-col gap-6 border-r bg-muted/40 px-4 py-6 md:flex lg:w-72">
        <Button
          variant="outline"
          className="flex h-10 items-center justify-start gap-2 text-sm"
        >
          <Plus className="size-4" />
          新聊天
        </Button>

        <div className="rounded-lg bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4 text-primary" />
            智能提示
          </div>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {quickPrompts.map((prompt) => (
              <li
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="cursor-pointer rounded-md bg-muted/70 px-3 py-2 transition hover:bg-muted"
              >
                {prompt}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-muted-foreground">
          对话将通过 Gemini 模型实时生成。请勿分享敏感信息。
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">ChatGPT 5</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Share2 className="size-4" />
            <MessageCircleQuestion className="size-4" />
            <Ellipsis className="size-4" />
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <div className="mx-auto flex h-full w-full max-w-3xl flex-col px-4 pb-36 pt-8">
            <div
              ref={viewportRef}
              className="flex flex-1 flex-col gap-6 overflow-y-auto pr-1"
            >
              {!hasMessages ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-2xl font-semibold text-foreground">
                      有什么可以帮忙的?
                    </p>
                    <p className="text-sm">询问任何问题，或试试下面的提示</p>
                  </div>

                  <div className="grid w-full gap-3 sm:grid-cols-3">
                    {quickPrompts.map((prompt) => (
                      <div
                        key={prompt}
                        onClick={() => handlePromptClick(prompt)}
                        className="cursor-pointer rounded-xl border bg-card p-4 text-sm shadow-sm transition hover:bg-muted"
                      >
                        {prompt}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {messages.map((message, index) => {
                const isUser = message.role === 'user'
                const isLast = index === messages.length - 1
                const messageText = getMessageText(message)
                const displayText = messageText || (!isUser && isLast && isLoading ? '正在生成…' : '')

                return (
                  <div
                    key={message.id}
                    ref={isLast ? lastMessageRef : null}
                    className={cn(
                      'flex items-start gap-3',
                      isUser ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {!isUser ? (
                      <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                        G
                      </div>
                    ) : null}

                    <div
                      className={cn(
                        'max-w-[85%] rounded-3xl px-5 py-3 text-left text-sm leading-relaxed shadow-sm',
                        isUser
                          ? 'rounded-br-sm bg-primary/90 text-primary-foreground'
                          : 'rounded-bl-sm bg-muted text-foreground'
                      )}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {displayText || (isUser ? '' : '…')}
                      </p>

                      {!isUser ? (
                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                          <ThumbsUp className="size-4 cursor-pointer" />
                          <ThumbsDown className="size-4 cursor-pointer" />
                        </div>
                      ) : null}
                    </div>

                    {isUser ? (
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                        我
                      </div>
                    ) : null}
                  </div>
                )
              })}

              {helpfulCardShouldShow ? (
                <div className="mx-auto flex w-full max-w-sm items-center justify-between gap-2 rounded-2xl border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
                  <span>这段对话目前是否有帮助？</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="size-8 p-0">
                      <ThumbsUp className="size-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="size-8 p-0">
                      <ThumbsDown className="size-4" />
                    </Button>
                  </div>
                </div>
              ) : null}

              {error ? (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error.message ?? '出错了，请稍后再试。'}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-t bg-background/90 px-4 py-6 backdrop-blur">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border bg-card/70 p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3">
                <Textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="输入你的问题或描述任务..."
                  className="min-h-[120px] resize-none border-none bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                />

                <div className="flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isLoading}
                      className="flex size-9 items-center justify-center rounded-full transition hover:bg-muted"
                    >
                      <Plus className="size-4" />
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      className="flex size-9 items-center justify-center rounded-full transition hover:bg-muted"
                    >
                      <Paperclip className="size-4" />
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      className="flex size-9 items-center justify-center rounded-full transition hover:bg-muted"
                    >
                      <Mic className="size-4" />
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={input.trim().length === 0 || isLoading}
                    className="rounded-full px-4"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span className="ml-2">生成中</span>
                      </>
                    ) : (
                      <>
                        <SendHorizontal className="size-4" />
                        <span className="ml-2">发送</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className="self-end text-xs text-muted-foreground underline"
              >
                停止生成
              </button>
            ) : null}
            <p className="text-center text-xs text-muted-foreground">
              Gemini 模型可能会产生不准确的内容，请核实重要信息。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
