'use client'
import React from 'react'
import {
    RadialBarChart,
    RadialBar,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import Image from 'next/image'

const CountChart = () => {
    const data = [
        {
            name: 'Total',
            count: 100,
            fill: 'white',
        },
        {
            name: 'Girls',
            count: 53,
            fill: '#FAE27C',
        },
        {
            name: 'Boys',
            count: 47,
            fill: '#83a6ed',
        },
    ]

    const style = {
        top: '50%',
        right: 0,
        transform: 'translate(0, -50%)',
        lineHeight: '24px',
    }

    return (
        <div className="h-full w-full gap-8 rounded-xl bg-white p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Students</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <div className="relative h-[75%] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="10%"
                        outerRadius="80%"
                        barSize={10}
                        data={data}
                    >
                        <RadialBar background dataKey="count" />
                        {/* <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} /> */}
                    </RadialBarChart>
                </ResponsiveContainer>
                <Image
                    src="/maleFemale.png"
                    alt=""
                    width={50}
                    height={50}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            </div>
            <div className="flex justify-center gap-16">
                <div className="flex flex-col gap-1">
                    <div className="h-5 w-5 rounded-full bg-sky"></div>
                    <h1 className="font-bold">1,234</h1>
                    <h2 className="text-xs text-gray-300">Boys (55%)</h2>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="h-5 w-5 rounded-full bg-yellow"></div>
                    <h1 className="font-bold">1,234</h1>
                    <h2 className="text-xs text-gray-300">Girls (45%)</h2>
                </div>
            </div>
        </div>
    )
}

export default CountChart
