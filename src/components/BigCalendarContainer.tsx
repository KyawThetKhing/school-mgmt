import React from 'react'
import BigCalendar from './BigCalendar'
import { prisma } from '@/lib/prisma'

const BigCalendarContainer = async ({
    type,
    id,
}: {
    type: string
    id: string | number
}) => {
    const resData = await prisma.lesson.findMany({
        where: {
            ...(type === 'teacherId'
                ? { teacherId: id as string }
                : { classId: id as number }),
        },
    })

    function isFullWorkingDay(startTime: Date, endTime: Date) {
        const start = new Date(startTime)
        const end = new Date(endTime)

        const startOfDay = new Date(start)
        startOfDay.setUTCHours(9, 0, 0, 0) // 9:00 AM UTC

        const endOfDay = new Date(end)
        endOfDay.setUTCHours(17, 0, 0, 0) // 5:00 PM UTC

        return (
            start.getTime() <= startOfDay.getTime() &&
            end.getTime() >= endOfDay.getTime()
        )
    }

    const data = resData.map((item) => {
        const isAllDay = isFullWorkingDay(item.startTime, item.endTime)
        return {
            allDay: isAllDay,
            title: item.name,
            start: item.startTime,
            end: item.endTime,
        }
    })
    return (
        <div className="h-full w-full">
            <BigCalendar data={data} />
        </div>
    )
}

export default BigCalendarContainer
