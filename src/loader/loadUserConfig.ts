import { UserConfig } from '../action/updateUserConfig'
import getCookie from '../components/getCookie'

const loadUserConfig = async (): Promise<UserConfig> => {
    const headers = new Headers()

    headers.append('Content-Type', 'application/json')

    const csrfCookie = getCookie('csrftoken')
    if (csrfCookie) {
        headers.append('X-CSRFToken', csrfCookie)
    }

    const response = await fetch('/api/config/user/', {
        headers,
        credentials: 'include',
    })

    const userConfig = await response.json()
    console.log('userConfig', userConfig)

    return userConfig
}

export default loadUserConfig
