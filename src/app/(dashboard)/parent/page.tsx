import Announcements from '@/components/Announcements'
import BigCalendar from '@/components/BigCalendar'
import React from 'react'

function ParentPage() {
    return (
        <div className="flex-1 p-4 flex gap-4 flex-col md:flex-row h-full w-full overflow-scroll">
            {/* LEFT */}
            <div className="w-full md:w-2/3">
                <div className="h-full bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">
                        Schedule (Jane Doe)
                    </h1>
                    <BigCalendar />
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full md:w-1/3">
                <Announcements />
            </div>
        </div>
    )
}

export default ParentPage
