import React from 'react'

import Announcements from '@/components/Announcements'
import BigCalendar from '@/components/BigCalendar'

function ParentPage() {
    return (
        <div className="flex h-full w-full flex-1 flex-col gap-4 overflow-scroll p-4 md:flex-row">
            {/* LEFT */}
            <div className="w-full md:w-2/3">
                <div className="h-full rounded-md bg-white p-4">
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
