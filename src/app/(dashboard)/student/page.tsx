import Announcements from '@/components/Announcements'
import BigCalendar from '@/components/BigCalendar'
import EventCalendar from '@/components/EventCalendar'
import React from 'react'

function StudentPage() {
    return (
        <div className="p-4 flex gap-4 flex-col md:flex-row h-full w-full overflow-scroll">
            {/* LEFT */}
            <div className="w-full md:w-2/3">
                <div className="h-full bg-white p-4 rounded-md">
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
