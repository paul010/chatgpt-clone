# ChatGPT Clone

A conversational playground built with the latest Next.js 15 App Router, Tailwind CSS v4, shadcn/ui, and the Vercel AI SDK (streaming Gemini responses + optional web search).

## Prerequisites

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and set the following:
   - `GOOGLE_GENERATIVE_AI_API_KEY` — required Gemini API key.
   - `GOOGLE_GENERATIVE_AI_BASE_URL` — optional; defaults to Google's `v1` endpoint.
   - `GOOGLE_GENERATIVE_AI_MODEL` — optional; defaults to `models/gemini-2.5-flash`.
   - `SERPAPI_API_KEY` — optional; enables realtime web search via SerpAPI.

## Development

```bash
npm run dev
```

The app runs on <http://localhost:3000>. Edit files under `src/` and the page updates automatically.

## Available Commands

- `npm run dev` – start the development server with Turbopack.
- `npm run build` – create an optimized production build.
- `npm start` – run the compiled app.
- `npm run lint` – run ESLint with the shared flat config.

## Stack & References

- [Next.js Documentation – App Router](https://nextjs.org/docs)
- [Tailwind CSS v4 Next.js guide](https://tailwindcss.com/docs/guides/nextjs)
- [shadcn/ui installation guide](https://ui.shadcn.com/docs/installation/next)
- [Vercel AI SDK – Google Gemini](https://sdk.vercel.ai/docs/integrations/google)
- [Vercel AI SDK – Tools](https://sdk.vercel.ai/docs/ai-sdk-core/generate-text-tools)

Each integration follows the latest official guidance from the resources above.
