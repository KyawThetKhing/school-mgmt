'use client'
import moment from 'moment'
import { useState } from 'react'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'

import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)
const BigCalendar = ({
    data,
}: {
    data: { title: string; start: Date; end: Date; allDay: boolean }[]
}) => {
    const [view, setView] = useState<View>(Views.WORK_WEEK)

    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView)
    }

    return (
        <Calendar
            localizer={localizer}
            events={data}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '98%' }}
            views={[Views.WORK_WEEK, Views.DAY]}
            view={view}
            onView={handleOnChangeView}
            min={new Date(2025, 4, 27, 8, 0, 0)}
            max={new Date(2025, 5, 27, 17, 0, 0)}
        />
    )
}

export default BigCalendar
