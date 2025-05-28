'use client'
import React from 'react'
import Image from 'next/image'
import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

const AttendanceChart = () => {
    const data = [
        {
            name: 'Monday',
            present: 95,
            absent: 5,
        },
        {
            name: 'Tuesday',
            present: 100,
            absent: 0,
        },
        {
            name: 'Wednesday',
            present: 98,
            absent: 2,
        },
        {
            name: 'Thursday',
            present: 90,
            absent: 10,
        },
        {
            name: 'Friday',
            present: 92,
            absent: 8,
        },
    ]
    return (
        <div className="bg-white rounded-lg p-4 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">Attendance</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#ddd"
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#d1d5db' }}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '10px',
                                borderColor: 'lightgray',
                            }}
                        />
                        <Legend
                            align="left"
                            verticalAlign="top"
                            wrapperStyle={{
                                paddingTop: '20px',
                                paddingBottom: '40px',
                            }}
                        />
                        <Bar
                            dataKey="present"
                            fill="#FAE27C"
                            legendType="circle"
                            radius={[10, 10, 0, 0]}
                        />
                        <Bar
                            dataKey="absent"
                            fill="#C3EBFA"
                            legendType="circle"
                            radius={[10, 10, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default AttendanceChart
