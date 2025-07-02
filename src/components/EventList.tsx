import React from 'react'

import { prisma } from '@/lib/prisma'

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
    const date = dateParam ? new Date(dateParam) : new Date()

    const data = await prisma.event.findMany({
        where: {
            startTime: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lte: new Date(date.setHours(23, 59, 59, 999)),
            },
        },
    })

    return (
        <div className="mt-4 flex flex-col gap-4">
            {data.map((event: any) => (
                <div
                    className="rounded-md border-2 border-t-4 border-gray-100 p-5 odd:border-t-sky even:border-t-yellow"
                    key={event.id}
                >
                    <div className="flex items-center justify-between">
                        <h1 className="font-semibold text-gray-600">
                            {event.title}
                        </h1>
                        <span className="text-xs text-gray-300">
                            {event.startTime.toLocaleDateString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            })}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                        {event.description}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default EventList
