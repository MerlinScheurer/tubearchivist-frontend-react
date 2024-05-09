import { Link } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import Routes from '../configuration/routes/RouteList'

export type PaginationType = {
    page_size?: number
    page_from?: number
    prev_pages?: boolean | number[]
    current_page: number
    max_hits?: boolean
    params?: string
    last_page?: boolean
    next_pages?: []
    total_hits?: number
}

interface Props {
    pagination?: PaginationType
    setPage: (page: number) => void
}

const Pagination = ({ pagination, setPage }: Props) => {
    const hasParams = pagination?.params?.length > 0

    // console.log("pagination", pagination);

    return (
        <div className="pagination">
            <br />
            {pagination && pagination.total_hits > 1 && (
                <>
                    {pagination.current_page > 1 && (
                        <>
                            <Link
                                to={`${Routes.Home}?${pagination.params}`}
                                className="pagination-item"
                                onClick={(event) => {
                                    event.preventDefault()
                                    setPage(0)
                                }}
                            >
                                First
                            </Link>{' '}
                        </>
                    )}

                    {pagination.prev_pages &&
                        pagination.prev_pages.map((page, index) => {
                            if (hasParams) {
                                return (
                                    <Fragment key={index}>
                                        <Link
                                            to={`${Routes.Home}?page=${page}&${pagination.params}`}
                                            className="pagination-item"
                                            onClick={(event) => {
                                                event.preventDefault()
                                                setPage(page)
                                            }}
                                        >
                                            {page}
                                        </Link>{' '}
                                    </Fragment>
                                )
                            } else {
                                return (
                                    <Fragment key={index}>
                                        <Link
                                            to={`${Routes.Home}?page=${page}`}
                                            className="pagination-item"
                                            onClick={(event) => {
                                                event.preventDefault()
                                                setPage(page)
                                            }}
                                        >
                                            {page}
                                        </Link>{' '}
                                    </Fragment>
                                )
                            }
                        })}

                    {pagination.current_page > 0 && (
                        <span>{`< Page ${pagination.current_page} `}</span>
                    )}

                    {pagination?.next_pages?.length > 0 && (
                        <>
                            <span>{'>'}</span>{' '}
                            {pagination.next_pages.map((page, index) => {
                                if (hasParams) {
                                    return (
                                        <Fragment key={index}>
                                            <a
                                                className="pagination-item"
                                                href={`?page=${page}&${pagination.params}`}
                                                onClick={(event) => {
                                                    event.preventDefault()
                                                    setPage(page)
                                                }}
                                            >
                                                {page}
                                            </a>{' '}
                                        </Fragment>
                                    )
                                } else {
                                    return (
                                        <Fragment key={index}>
                                            <a
                                                className="pagination-item"
                                                href={`?page=${page}`}
                                                onClick={(event) => {
                                                    event.preventDefault()
                                                    setPage(page)
                                                }}
                                            >
                                                {page}
                                            </a>{' '}
                                        </Fragment>
                                    )
                                }
                            })}
                        </>
                    )}

                    {pagination.last_page > 0 && (
                        <>
                            {hasParams && (
                                <a
                                    className="pagination-item"
                                    href={`?page=${pagination.last_page}&${pagination.params}`}
                                    onClick={(event) => {
                                        event.preventDefault()
                                        setPage(pagination.last_page)
                                    }}
                                >
                                    {pagination.max_hits &&
                                        `Max (${pagination.last_page})`}
                                    {!pagination.max_hits &&
                                        `Last (${pagination.last_page})`}
                                </a>
                            )}

                            {!hasParams && (
                                <a
                                    className="pagination-item"
                                    href={`?page=${pagination.last_page}`}
                                    onClick={(event) => {
                                        event.preventDefault()
                                        setPage(pagination.last_page)
                                    }}
                                >
                                    {pagination.max_hits &&
                                        `Max (${pagination.last_page})`}
                                    {!pagination.max_hits &&
                                        `Last (${pagination.last_page})`}
                                </a>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default Pagination
