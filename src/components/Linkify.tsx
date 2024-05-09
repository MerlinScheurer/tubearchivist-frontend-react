import DOMPurify from 'dompurify'

type LinkifyProps = {
    children: string
}

// source: https://www.js-craft.io/blog/react-detect-url-text-convert-link/
const Linkify = ({ children }: LinkifyProps) => {
    const isUrl = (word: string) => {
        const urlPattern = /(https?:\/\/[^\s]+)/g
        return word.match(urlPattern)
    }

    const addMarkup = (word: string) => {
        return isUrl(word) ? `<a href="${word}">${word}</a>` : word
    }

    const words = children.replaceAll('\n', ' <br/> ').split(' ')
    const formatedWords = words.map((w) => addMarkup(w))

    const html = DOMPurify.sanitize(formatedWords.join(' '))

    return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export default Linkify
