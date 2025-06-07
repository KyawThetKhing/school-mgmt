import React from 'react'
import { prisma } from '@/lib/prisma'
import { role, currentUserId } from '@/lib/utils'

const Announcements = async () => {
    const roleCondition = {
        teacher: { lessons: { some: { teacherId: currentUserId! } } },
        student: { students: { some: { id: currentUserId! } } },
        parent: { students: { some: { parentId: currentUserId! } } },
    }

    const data = await prisma.announcement.findMany({
        take: 3,
        orderBy: {
            date: 'desc',
        },
        where: {
            ...(role !== 'admin' && {
                OR: [
                    { classId: null },
                    {
                        class: roleCondition[
                            (role as keyof typeof roleCondition) || {}
                        ],
                    },
                ],
            }),
        },
    })

    return (
        <div className="mt-4 rounded-md bg-white p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Announcements</h1>
                <span className="text-xs text-gray-400">View All</span>
            </div>
            <div className="mt-4 flex flex-col gap-4">
                {data[0] && (
                    <div className="rounded-md bg-skyLight p-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-medium">{data[0].title}</h2>
                            <span className="rounded-md bg-white px-1 py-1 text-xs text-gray-400">
                                {data[0].date.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                })}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">
                            {data[0].description}
                        </p>
                    </div>
                )}
                {data[1] && (
                    <div className="rounded-md bg-yellowLight p-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-medium">{data[1].title}</h2>
                            <span className="rounded-md bg-white px-1 py-1 text-xs text-gray-400">
                                {data[1].date.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                })}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">
                            {data[1].description}
                        </p>
                    </div>
                )}
                {data[2] && (
                    <div className="rounded-md bg-sky p-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-medium">{data[2].title}</h2>
                            <span className="rounded-md bg-white px-1 py-1 text-xs text-gray-400">
                                {data[2].date.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                })}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">
                            {data[2].description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Announcements
