import Announcements from '@/components/Announcements'
import BigCalendar from '@/components/BigCalendar'
import FormModal from '@/components/FormModal'
import Performance from '@/components/Performance'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const TeacherDetailPage = () => {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full md:w-2/3">
                {/* TOP */}
                <div className="flex flex-col gap-4 lg:flex-row">
                    {/* User Card */}
                    <div className="flex flex-1 gap-4 rounded-md bg-sky px-4 py-6">
                        <div className="w-1/3">
                            <Image
                                src="https://images.pexels.com/photos/301952/pexels-photo-301952.jpeg?cs=srgb&dl=pexels-pixabay-301952.jpg&fm=jpg"
                                alt="avatar"
                                width={144}
                                height={144}
                                className="h-36 w-36 rounded-full object-cover"
                            />
                        </div>
                        <div className="flex w-2/3 flex-col justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">
                                    Leonard Shyam
                                </h1>
                                <FormModal
                                    table="teacher"
                                    type="update"
                                    data={{
                                        id: 1,
                                        username: 'leonard',
                                        email: 'leonard@gmail.com',
                                        password: '12345678',
                                        firstName: 'Leonard',
                                        lastName: 'Shyam',
                                        phone: '12345678',
                                        address: '123 Main St',
                                        bloodType: 'A+',
                                        birthday: '2000-01-01',
                                        sex: 'male',
                                        img: 'https://images.pexels.com/photos/301952/pexels-photo-301952.jpeg?cs=srgb&dl=pexels-pixabay-301952.jpg&fm=jpg',
                                    }}
                                />
                            </div>
                            <p className="text-sm text-gray-500">
                                Lorem ipsum, dolor sit amet consec
                            </p>
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                                <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                                    <Image
                                        src="/blood.png"
                                        alt="blood"
                                        width={14}
                                        height={14}
                                    />
                                    <p>A+</p>
                                </div>
                                <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                                    <Image
                                        src="/date.png"
                                        alt="blood"
                                        width={14}
                                        height={14}
                                    />
                                    <p>January 2025</p>
                                </div>
                                <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                                    <Image
                                        src="/mail.png"
                                        alt="blood"
                                        width={14}
                                        height={14}
                                    />
                                    <p>user@gmail.com</p>
                                </div>
                                <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                                    <Image
                                        src="/phone.png"
                                        alt="blood"
                                        width={14}
                                        height={14}
                                    />
                                    <p>+95977777777</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Small Cards */}
                    <div className="flex flex-1 flex-wrap justify-between gap-4">
                        {/* Card */}
                        <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[48%] 2xl:w-[48%]">
                            <Image
                                src="/singleAttendance.png"
                                alt="singleAttendance"
                                width={24}
                                height={24}
                                className="h-6 w-6"
                            />
                            <div>
                                <h1 className="text-xl font-semibold">90%</h1>
                                <p className="text-sm text-gray-400">
                                    Attendance
                                </p>
                            </div>
                        </div>

                        {/* Card */}
                        <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[48%] 2xl:w-[48%]">
                            <Image
                                src="/singleLesson.png"
                                alt="singleLesson"
                                width={24}
                                height={24}
                                className="h-6 w-6"
                            />
                            <div>
                                <h1 className="text-xl font-semibold">6</h1>
                                <p className="text-sm text-gray-400">Lessons</p>
                            </div>
                        </div>

                        {/* Card */}
                        <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[48%] 2xl:w-[48%]">
                            <Image
                                src="/singleBranch.png"
                                alt="singleBranch"
                                width={24}
                                height={24}
                                className="h-6 w-6"
                            />
                            <div>
                                <h1 className="text-xl font-semibold">2</h1>
                                <p className="text-sm text-gray-400">
                                    Branches
                                </p>
                            </div>
                        </div>

                        {/* Card */}
                        <div className="flex w-full gap-4 rounded-md bg-white p-4 md:w-[48%] xl:w-[48%] 2xl:w-[48%]">
                            <Image
                                src="/singleClass.png"
                                alt="singleClass"
                                width={24}
                                height={24}
                                className="h-6 w-6"
                            />
                            <div>
                                <h1 className="text-xl font-semibold">6</h1>
                                <p className="text-sm text-gray-400">Classes</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BOTTOM */}
                <div className="mt-4 h-[800px] rounded-md bg-white p-4">
                    <h1> Teacher&apos;s Schedule</h1>
                    <BigCalendar />
                </div>
            </div>
            {/* RIGHT */}
            <div className="flex w-full flex-col gap-4 md:w-1/3">
                <div className="rounded-md bg-white p-4">
                    <h1 className="text-xl font-semibold">Shortcuts</h1>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                        <Link className="rounded-md bg-skyLight p-3" href="/">
                            Teacher&apos;s Classes
                        </Link>
                        <Link className="rounded-md bg-skyLight p-3" href="/">
                            Teacher&apos;s Students
                        </Link>
                        <Link className="rounded-md bg-skyLight p-3" href="/">
                            Teacher&apos;s Lessons
                        </Link>
                        <Link className="rounded-md bg-skyLight p-3" href="/">
                            Teacher&apos;s Exams
                        </Link>
                        <Link className="rounded-md bg-skyLight p-3" href="/">
                            Teacher&apos;s Assignments
                        </Link>
                    </div>
                </div>
                <Performance />
                <Announcements />
            </div>
        </div>
    )
}

export default TeacherDetailPage
