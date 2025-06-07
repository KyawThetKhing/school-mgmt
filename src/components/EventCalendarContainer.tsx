import Image from 'next/image'
import EventList from './EventList'
import EventCalendar from './EventCalendar'
import { useRouter } from 'next/navigation'

const EventCalendarContainer = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const { date } = searchParams
    return (
        <div className="rounded-md bg-white p-4">
            <EventCalendar />
            <div className="mt-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold">Events</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <div className="mt-4 flex flex-col gap-4">
                <EventList dateParam={date} />
            </div>
        </div>
    )
}

export default EventCalendarContainer
