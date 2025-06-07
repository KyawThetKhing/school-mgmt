import Image from 'next/image'
import AttendanceChart from './AttendanceChart'
import { prisma } from '@/lib/prisma'

const AttendanceChartContainer = async () => {
    const today = new Date()
    const dayOfWeek = today.getDay()

    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const lastMonday = new Date(today)
    lastMonday.setDate(today.getDate() - daysSinceMonday)
    const resData = await prisma.attendance.findMany({
        where: {
            date: {
                gte: lastMonday,
            },
        },
        select: {
            date: true,
            present: true,
        },
    })

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

    const attendanceMap: {
        [key: string]: { present: number; absent: number }
    } = {
        Mon: { present: 0, absent: 0 },
        Tue: { present: 0, absent: 0 },
        Wed: { present: 0, absent: 0 },
        Thu: { present: 0, absent: 0 },
        Fri: { present: 0, absent: 0 },
    }

    resData.forEach((item) => {
        const itemDate = new Date(item.date)
        if (itemDate >= lastMonday && itemDate <= today) {
            const dayName = daysOfWeek[itemDate.getDay() - 1]

            if (item.present) {
                attendanceMap[dayName].present += 1
            } else {
                attendanceMap[dayName].absent += 1
            }
        }
    })

    const data = daysOfWeek.map((day) => ({
        name: day,
        present: attendanceMap[day].present,
        absent: attendanceMap[day].absent,
    }))

    return (
        <div className="h-full rounded-lg bg-white p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Attendance</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <AttendanceChart data={data} />
        </div>
    )
}

export default AttendanceChartContainer
