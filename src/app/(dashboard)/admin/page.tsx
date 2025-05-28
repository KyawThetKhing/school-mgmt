import React from 'react'
import UserCard from '@/components/UserCard'
import CountChart from '@/components/CountChart'
import AttendanceChart from '@/components/AttendanceChart'
import FinanceChart from '@/components/FinanceChart'
import EventCalendar from '@/components/EventCalendar'
import Announcements from '@/components/Announcements'

function AdminPage() {
    return (
        <div className="p-4 flex gap-4 flex-col md:flex-row h-full w-full overflow-scroll">
            {/* LEFT */}
            <div className="w-full md:w-2/3">
                {/* User Cards */}
                <div className="flex gap-4 justify-between flex-wrap mb-4">
                    <UserCard type="student" />
                    <UserCard type="teacher" />
                    <UserCard type="parent" />
                    <UserCard type="staff" />
                </div>
                <div className="flex gap-4 flex-col lg:flex-row mb-4">
                    <div className="w-full lg:w-1/3 h-[450px]">
                        <CountChart />
                    </div>
                    <div className="w-full lg:w-2/3 h-[450px]">
                        <AttendanceChart />
                    </div>
                </div>
                <div className="w-full h-[500px]">
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
