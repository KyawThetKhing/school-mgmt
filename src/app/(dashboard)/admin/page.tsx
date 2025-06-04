import React from 'react'
import UserCard from '@/components/UserCard'
import CountChart from '@/components/CountChart'
import AttendanceChart from '@/components/AttendanceChart'
import FinanceChart from '@/components/FinanceChart'
import EventCalendar from '@/components/EventCalendar'
import Announcements from '@/components/Announcements'

function AdminPage() {
    return (
        <div className="flex h-full w-full flex-col gap-4 overflow-scroll p-4 md:flex-row">
            {/* LEFT */}
            <div className="w-full md:w-2/3">
                {/* User Cards */}
                <div className="mb-4 flex flex-wrap justify-between gap-4">
                    <UserCard type="student" />
                    <UserCard type="teacher" />
                    <UserCard type="parent" />
                    <UserCard type="staff" />
                </div>
                <div className="mb-4 flex flex-col gap-4 lg:flex-row">
                    <div className="h-[450px] w-full lg:w-1/3">
                        <CountChart />
                    </div>
                    <div className="h-[450px] w-full lg:w-2/3">
                        <AttendanceChart />
                    </div>
                </div>
                <div className="h-[500px] w-full">
                    <FinanceChart />
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

export default AdminPage
