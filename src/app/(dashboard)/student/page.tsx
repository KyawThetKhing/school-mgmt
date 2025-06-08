import Announcements from '@/components/Announcements'
import BigCalendarContainer from '@/components/BigCalendarContainer'
import EventCalendar from '@/components/EventCalendar'
import { prisma } from '@/lib/prisma'
import { currentUserId } from '@/lib/utils'
import React from 'react'

async function StudentPage() {
    const student = await prisma.student.findUnique({
        where: { id: currentUserId! as string },
        select: {
            classId: true,
        },
    })

    return (
        <div className="flex h-full w-full flex-col gap-4 overflow-scroll p-4 md:flex-row">
            {/* LEFT */}
            <div className="w-full md:w-2/3">
                <div className="h-full rounded-md bg-white p-4">
                    <h1 className="text-xl font-semibold">Schedule (4A)</h1>
                    <BigCalendarContainer
                        type="classId"
                        id={student?.classId! as number}
                    />
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full md:w-1/3">
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    )
}

export default StudentPage
