'use client'
import React from 'react'

const loading = () => {
    return (
        <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden text-lg font-semibold md:block">
                    <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                </h1>

                <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
                    {/* Search skeleton */}
                    <div className="h-9 w-60 animate-pulse rounded-md bg-gray-200" />

                    {/* Action buttons */}
                    <div className="flex items-center gap-4 self-end">
                        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                    </div>
                </div>
            </div>

            {/* LIST / TABLE SKELETON */}
            <div className="mt-6 overflow-x-auto rounded border shadow">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            {[...Array(5)].map((_, i) => (
                                <th
                                    key={i}
                                    className={`px-4 py-8 text-left ${i > 1 ? 'hidden md:table-cell' : ''}`}
                                >
                                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <tr key={i} className="border-t">
                                {[...Array(5)].map((_, j) => (
                                    <td
                                        key={j}
                                        className={`px-4 py-8 ${j > 1 ? 'hidden md:table-cell' : ''}`}
                                    >
                                        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION SKELETON */}
            <div className="mt-4 flex items-center justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-8 w-8 animate-pulse rounded bg-gray-200"
                    />
                ))}
            </div>
        </div>
    )
}

export default loading
