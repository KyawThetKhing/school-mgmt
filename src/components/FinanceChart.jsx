'use client'
import Image from 'next/image'
import React from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

const FinanceChart = () => {
    const data = [
        {
            name: 'Jan',
            income: 4000,
            expense: 2400,
        },
        {
            name: 'Feb',
            income: 3000,
            expense: 1398,
        },
        {
            name: 'Mar',
            income: 2000,
            expense: 9800,
        },
        {
            name: 'Apr',
            income: 2780,
            expense: 3908,
        },
        {
            name: 'May',
            income: 1890,
            expense: 4800,
        },
        {
            name: 'Jun',
            income: 2390,
            expense: 3800,
        },
        {
            name: 'Jul',
            income: 3490,
            expense: 4300,
        },
        {
            name: 'Aug',
            income: 3490,
            expense: 4300,
        },
        {
            name: 'Sep',
            income: 3490,
            expense: 4300,
        },
        {
            name: 'Oct',
            income: 3490,
            expense: 4300,
        },
        {
            name: 'Nov',
            income: 3490,
            expense: 4300,
        },
        {
            name: 'Dec',
            income: 3490,
            expense: 4300,
        },
    ]

    return (
        <div className="h-full w-full gap-8 rounded-xl bg-white p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Finance</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#d1d5db' }}
                    />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend
                        align="center"
                        verticalAlign="top"
                        wrapperStyle={{
                            paddingTop: '20px',
                            paddingBottom: '40px',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#C3EBFA"
                        strokeWidth={5}
                    />
                    <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#CFCEFF"
                        strokeWidth={5}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default FinanceChart
