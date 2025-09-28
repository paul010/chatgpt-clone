'use client'

import { useEffect, useRef } from 'react'
import { useChat } from 'ai/react'
import { Loader2, SendHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({ api: '/api/chat' })

  const lastMessageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-6 py-6 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            chatgpt clone
          </p>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Conversational Playground</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Powered by Next.js, Tailwind CSS, shadcn/ui, and the Vercel AI SDK.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl grow flex-col px-4 pb-24 pt-6 sm:px-8">
        <ScrollArea className="h-full rounded-lg border bg-card shadow-sm">
          <div className="flex min-h-full flex-col gap-4 px-4 py-6">
            {messages.length === 0 ? (
              <div className="flex grow flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <p className="text-base font-medium">Start a conversation</p>
                <p className="max-w-xs text-sm">
                  Ask a question or describe a task to see the assistant respond in real time.
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isLast = index === messages.length - 1
                return (
                  <div
                    key={message.id}
                    ref={isLast ? lastMessageRef : null}
                    className={cn(
                      'flex w-full flex-col gap-1 rounded-lg px-4 py-3 text-sm shadow-sm transition-colors',
                      message.role === 'user'
                        ? 'ml-auto max-w-[85%] bg-primary text-primary-foreground'
                        : 'mr-auto max-w-[90%] bg-muted text-foreground'
                    )}
                  >
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </span>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  </div>
                )
              })
            )}
            {error ? (
              <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error.message ?? 'Something went wrong. Please try again.'}
              </p>
            ) : null}
          </div>
        </ScrollArea>
      </main>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-6 sm:px-8">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="min-h-[120px] resize-none text-base"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Your messages are processed using the OpenAI API. Remember to set the OPENAI_API_KEY.
            </p>
            <Button
              type="submit"
              disabled={isLoading || input.trim().length === 0}
              className="self-end sm:self-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  <SendHorizontal className="size-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
