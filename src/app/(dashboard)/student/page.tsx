import Announcements from '@/components/Announcements'
import BigCalendar from '@/components/BigCalendar'
import EventCalendar from '@/components/EventCalendar'
import React from 'react'

function StudentPage() {
    return (
        <div className="flex h-full w-full flex-col gap-4 overflow-scroll p-4 md:flex-row">
            {/* LEFT */}
            <div className="w-full md:w-2/3">
                <div className="h-full rounded-md bg-white p-4">
                    <h1 className="text-xl font-semibold">Schedule (4A)</h1>
                    <BigCalendar />
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
