'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

const EventCalendar = () => {
    const [value, onChange] = useState<Value>(new Date())

    const events = [
        {
            id: 1,
            title: 'Event 1',
            time: '10:00 AM - 11:00 AMd',
            description:
                'lorem ipsum dolor sit amet consectetur adipisicing elit',
        },
        {
            id: 2,
            title: 'Event 2',
            time: '10:00 AM - 11:00 AMd',
            description:
                'lorem ipsum dolor sit amet consectetur adipisicing elit',
        },
        {
            id: 3,
            title: 'Event 3',
            time: '10:00 AM - 11:00 AMd',
            description:
                'lorem ipsum dolor sit amet consectetur adipisicing elit',
        },
    ]

    return (
        <div className="rounded-md bg-white p-4">
            <Calendar onChange={onChange} value={value} />
            <div className="mt-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold">Events</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <div className="mt-4 flex flex-col gap-4">
                {events.map((event) => (
                    <div
                        className="rounded-md border-2 border-t-4 border-gray-100 p-5 odd:border-t-sky even:border-t-yellow"
                        key={event.id}
                    >
                        <div className="flex items-center justify-between">
                            <h1 className="font-semibold text-gray-600">
                                {event.title}
                            </h1>
                            <span className="text-xs text-gray-300">
                                {event.time}
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                            {event.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EventCalendar
