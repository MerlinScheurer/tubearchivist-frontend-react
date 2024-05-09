import getCookie from '../components/getCookie'

type VideoProgressProp = {
    youtubeId: string
    currentProgress: number
}

const updateVideoProgressById = async ({
    youtubeId,
    currentProgress,
}: VideoProgressProp) => {
    const headers = new Headers()

    headers.append('Content-Type', 'application/json')

    const csrfCookie = getCookie('csrftoken')
    if (csrfCookie) {
        headers.append('X-CSRFToken', csrfCookie)
    }

    const response = await fetch(`/api/video/${youtubeId}/progress/`, {
        method: 'POST',
        headers,
        credentials: 'same-origin',
        body: JSON.stringify({
            position: currentProgress,
        }),
    })

    const userConfig = await response.json()
    console.log('updateVideoProgressById', userConfig)

    return userConfig
}

export default updateVideoProgressById
