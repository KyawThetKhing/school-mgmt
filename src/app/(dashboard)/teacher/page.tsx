import { auth } from '@clerk/nextjs/server'
import React from 'react'

import Announcements from '@/components/Announcements'
import BigCalendarContainer from '@/components/BigCalendarContainer'

async function TeacherPage() {
    const { userId } = auth()
    const currentUserId = userId

    return (
        <div className="flex h-full w-full flex-1 flex-col gap-4 overflow-scroll p-4 md:flex-row">
            {/* LEFT */}
            <div className="w-full md:w-2/3">
                <div className="h-full rounded-md bg-white p-4">
                    <h1 className="text-xl font-semibold">Schedule (4A)</h1>
                    <BigCalendarContainer
                        type="teacherId"
                        id={currentUserId! as string}
                    />
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full md:w-1/3">
                <Announcements />
            </div>
        </div>
    )
}

export default TeacherPage
