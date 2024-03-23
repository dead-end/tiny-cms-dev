import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

/**
 * The function creates a html string from a markdown string.
 */
export const mdToHtml = (md: string) => {
    const raw = marked.parse(md)

    if (typeof raw === 'string') {
        return sanitizeHtml(raw)
    }
    throw new Error('Markdown parser does not return a "string"!')
}
