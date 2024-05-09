import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
    const error = useRouteError()
    console.error('ErrorPage', error)

    return (
        <div id="error-page" style={{ margin: '10%' }}>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText}</i>
                <i>{error.message}</i>
            </p>
        </div>
    )
}
