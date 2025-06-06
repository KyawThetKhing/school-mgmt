'use client'
import { useRouter } from 'next/navigation'

import { ITEM_PER_PAGE } from '@/lib/settings'

const Pagination = ({ page, count }: { page: number; count: number }) => {
    const router = useRouter()
    const changePage = (newPage: number) => {
        const params = new URLSearchParams(window.location.search)
        params.set('page', newPage.toString())
        router.push(`${window.location.pathname}?${params}`)
    }

    return (
        <div className="flex items-center justify-between p-4 text-gray-500">
            <button
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
                className="rounded-md bg-slate-200 px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
                Prev
            </button>
            <div className="flex items-center gap-2 text-sm">
                {Array.from(
                    { length: Math.ceil(count / ITEM_PER_PAGE) },
                    (_, index) => {
                        const pageIndex = index + 1
                        return (
                            <button
                                key={pageIndex}
                                className={`rounded-sm px-2 ${pageIndex === page ? 'bg-sky' : ''}`}
                                onClick={() => changePage(pageIndex)}
                            >
                                {pageIndex}
                            </button>
                        )
                    }
                )}
            </div>
            <button
                onClick={() => changePage(page + 1)}
                disabled={page === Math.ceil(count / ITEM_PER_PAGE)}
                className="rounded-md bg-slate-200 px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
                Next
            </button>
        </div>
    )
}

export default Pagination
