'use client'
import React from 'react'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import Image from 'next/image'

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
    const data = [
        {
            name: 'Total',
            count: boys + girls,
            fill: 'white',
        },
        {
            name: 'Girls',
            count: girls,
            fill: '#FAE27C',
        },
        {
            name: 'Boys',
            count: boys,
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
    )
}

export default CountChart
