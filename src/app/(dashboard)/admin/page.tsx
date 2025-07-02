import React from 'react'

import Announcements from '@/components/Announcements'
import AttendanceChartContainer from '@/components/AttendanceChartContainer'
import CountChartContainer from '@/components/CountChartContainer'
import EventCalendarContainer from '@/components/EventCalendarContainer'
import FinanceChart from '@/components/FinanceChart'
import UserCard from '@/components/UserCard'

function AdminPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined }
}) {
    return (
        <div className="flex h-full w-full flex-col gap-4 overflow-scroll p-4 md:flex-row">
            {/* LEFT */}
            <div className="w-full md:w-2/3">
                {/* User Cards */}
                <div className="mb-4 flex flex-wrap justify-between gap-4">
                    <UserCard type="admin" />
                    <UserCard type="teacher" />
                    <UserCard type="student" />
                    <UserCard type="parent" />
                </div>
                <div className="mb-4 flex flex-col gap-4 lg:flex-row">
                    <div className="h-[450px] w-full lg:w-1/3">
                        <CountChartContainer />
                    </div>
                    <div className="h-[450px] w-full lg:w-2/3">
                        <AttendanceChartContainer />
                    </div>
                </div>
                <div className="h-[500px] w-full">
                    <FinanceChart />
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full md:w-1/3">
                <EventCalendarContainer searchParams={searchParams} />
                <Announcements />
            </div>
        </div>
    )
}

export default AdminPage
