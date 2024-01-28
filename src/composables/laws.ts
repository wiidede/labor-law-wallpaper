import type { Article, Law } from '~/types'

const lawsRaw = import.meta.glob('/assets/laws/*.txt', { as: 'raw', eager: true })
const laws = Object.entries(lawsRaw).map<Law>(([name, raw]) => {
  let content = raw
  let link = ''
  if (raw.startsWith('http')) {
    const match = raw.match(/^(http.*)\n/)
    if (match) {
      link = match[1]
      content = raw.substring(match[0].length)
    }
  }

  const regex = /\s+(第[零一二三四五六七八九十百千万亿]+[条章])\s+/gm
  let prevIndex = 0
  let chapter = ''
  let article = ''
  let skip = false
  const articles: Article[] = []

  while (true) {
    const match = regex.exec(content)

    if (!match) {
      articles.push({ chapter, article, content: content.substring(prevIndex) })
      break
    }

    if (skip)
      skip = false
    else
      articles.push({ chapter, article, content: content.substring(prevIndex, match.index).replaceAll(/\n+/gm, '\n').replaceAll(/\u3000/g, '') })

    prevIndex = regex.lastIndex

    if (match[1].endsWith('章')) {
      chapter = match[1]
      skip = true
    }
    else {
      article = match[1]
    }
  }

  return {
    info: articles.shift()?.content || '',
    name: name.replace(/^\/assets\/laws\/\d\d\./g, '').replace('.txt', ''),
    articles,
    link,
  }
})

export function useLaws() {
  return laws
}
