import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export interface Law { name: string, info: string, link?: string, articles: Article[] }
export interface Article { chapter: string, article: string, index: number, content: string }
