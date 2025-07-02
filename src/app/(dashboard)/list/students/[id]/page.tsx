import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import Announcements from '@/components/Announcements'
import BigCalendarContainer from '@/components/BigCalendarContainer'
import FormContainer from '@/components/FormContainer'
import Performance from '@/components/Performance'
import StudentAttendanceCard from '@/components/StudentAttendanceCard'
import { prisma } from '@/lib/prisma'

const StudentDetailPage = async ({ params }: { params: { id: string } }) => {
    const { id } = params
    const data = await prisma.student.findUnique({
        where: {
            id: id,
        },
        include: {
            class: {
                include: {
                    lessons: true,
                },
            },
            grade: true,
            attendances: true,
        },
    })

    if (!data) {
        return notFound()
    }
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
                                src={data?.img || '/avatar.png'}
                                alt="avatar"
                                width={144}
                                height={144}
                                className="h-36 w-36 rounded-full object-cover"
                            />
                        </div>
                        <div className="flex w-2/3 flex-col justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-semibold">
                                    {data?.name + ' ' + data?.surname}
                                </h1>
                                <FormContainer
                                    table="student"
                                    type="update"
                                    data={data}
                                />
                            </div>
                            <p className="text-sm text-gray-500">
                                {data?.address}
                            </p>
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                                <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                                    <Image
                                        src="/blood.png"
                                        alt="blood"
                                        width={14}
                                        height={14}
                                    />
                                    <p>{data?.bloodType}</p>
                                </div>
                                <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                                    <Image
                                        src="/date.png"
                                        alt="blood"
                                        width={14}
                                        height={14}
                                    />
                                    <p>
                                        {Intl.DateTimeFormat('en-US').format(
                                            data?.birthday
                                        )}
                                    </p>
                                </div>
                                <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                                    <Image
                                        src="/mail.png"
                                        alt="blood"
                                        width={14}
                                        height={14}
                                    />
                                    <p>{data?.email || '-'}</p>
                                </div>
                                <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3">
                                    <Image
                                        src="/phone.png"
                                        alt="blood"
                                        width={14}
                                        height={14}
                                    />
                                    <p>{data?.phone || '-'}</p>
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
                                <StudentAttendanceCard id={id} />
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
                                <h1 className="text-xl font-semibold">
                                    {data?.class?.lessons?.length || 0}
                                </h1>
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
                                <h1 className="text-xl font-semibold">
                                    {data?.grade?.level || '-'}
                                </h1>
                                <p className="text-sm text-gray-400">Grade</p>
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
                                <h1 className="text-xl font-semibold">
                                    {data?.class?.name || '-'}
                                </h1>
                                <p className="text-sm text-gray-400">Class</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BOTTOM */}
                <div className="mt-4 h-[800px] rounded-md bg-white p-4">
                    <h1> Teacher&apos;s Schedule</h1>
                    <BigCalendarContainer type="classId" id={data?.class?.id} />
                </div>
            </div>
            {/* RIGHT */}
            <div className="flex w-full flex-col gap-4 md:w-1/3">
                <div className="rounded-md bg-white p-4">
                    <h1 className="text-xl font-semibold">Shortcuts</h1>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                        <Link className="rounded-md bg-skyLight p-3" href="/">
                            Student&apos;s Classes
                        </Link>
                        <Link
                            className="rounded-md bg-skyLight p-3"
                            href={`/list/lessons?classId=2`}
                        >
                            Student&apos;s Lessons
                        </Link>
                        <Link
                            className="rounded-md bg-skyLight p-3"
                            href={`/list/teachers?classId=2`}
                        >
                            Student&apos;s Teachers
                        </Link>
                        <Link
                            className="rounded-md bg-skyLight p-3"
                            href={`/list/exams?classId=2`}
                        >
                            Student&apos;s Exams
                        </Link>
                        <Link
                            className="rounded-md bg-skyLight p-3"
                            href={`/list/assignments?classId=2`}
                        >
                            Student&apos;s Assignments
                        </Link>
                        <Link
                            className="rounded-md bg-skyLight p-3"
                            href={`/list/results?studentId=${id}`}
                        >
                            Student&apos;s Results
                        </Link>
                    </div>
                </div>
                <Performance />
                <Announcements />
            </div>
        </div>
    )
}

export default StudentDetailPage
