import { auth } from '@clerk/nextjs/server'
import { Prisma } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { prisma } from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'

type ResultList = {
    id: number
    title: string
    studentName: string
    studentSurname: string
    teacherName: string
    teacherSurname: string
    score: number
    className: string
    startTime: Date
}

const ResultListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const { userId, sessionClaims } = auth()
    const role = (sessionClaims?.metadata as { role?: string })?.role
    const currentUserId = userId

    const { page, ...queryParams } = searchParams

    const columns = [
        {
            header: 'Title',
            accessor: 'title',
        },
        {
            header: 'Class',
            accessor: 'className',
        },
        {
            header: 'Teacher',
            accessor: 'teacher',
            className: 'hidden md:table-cell',
        },
        {
            header: 'Student',
            accessor: 'student',
            className: 'hidden md:table-cell',
        },
        {
            header: 'Date',
            accessor: 'date',
            className: 'hidden md:table-cell',
        },
        {
            header: 'Type',
            accessor: 'type',
            className: 'hidden md:table-cell',
        },
        {
            header: 'Score',
            accessor: 'score',
            className: 'hidden md:table-cell',
        },
        ...(role === 'admin' || role === 'teacher'
            ? [
                  {
                      header: 'Actions',
                      accessor: 'action',
                  },
              ]
            : []),
    ]

    const p = page ? parseInt(page) : 1

    // URL PARAMS CONDITION

    const query: Prisma.ResultWhereInput = {}

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'studentId':
                        query.studentId = value
                        break
                    case 'search':
                        query.OR = [
                            {
                                exam: {
                                    title: {
                                        contains: value,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                            {
                                student: {
                                    name: {
                                        contains: value,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        ]
                        break
                    default:
                        break
                }
            }
        }
    }

    switch (role) {
        case 'admin':
            break
        case 'teacher':
            query.OR = [
                {
                    exam: {
                        lesson: {
                            teacherId: currentUserId!,
                        },
                    },
                },
                {
                    assignment: {
                        lesson: {
                            teacherId: currentUserId!,
                        },
                    },
                },
            ]
            break
        case 'student':
            query.studentId = currentUserId!
            break
        case 'parent':
            query.student = {
                parentId: currentUserId!,
            }
            break
        default:
            break
    }

    const [dataRes, count] = await prisma.$transaction([
        prisma.result.findMany({
            where: query,
            include: {
                student: { select: { name: true, surname: true } },
                exam: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: {
                                    select: { name: true, surname: true },
                                },
                            },
                        },
                    },
                },
                assignment: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: {
                                    select: { name: true, surname: true },
                                },
                            },
                        },
                    },
                },
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.result.count({ where: query }),
    ])

    const data = dataRes.map((item) => {
        const assessment = item.exam || item.assignment

        if (!assessment) return null

        const isExam = 'startTime' in assessment

        return {
            id: item.id,
            title: assessment.title,
            studentName: item.student.name,
            studentSurname: item.student.surname,
            teacherName: assessment.lesson.teacher.name,
            teacherSurname: assessment.lesson.teacher.surname,
            score: item.score,
            className: assessment.lesson.class.name,
            startTime: isExam ? assessment.startTime : assessment.startDate,
        }
    })

    const renderRow = (row: ResultList) => {
        return (
            <tr
                key={row.id}
                className="broder-b border-gray-200 text-sm even:bg-slate-50 hover:bg-purpleLight"
            >
                <td className="p-4">{row.title}</td>
                <td>{row.className}</td>
                <td className="hidden md:table-cell">
                    {row.teacherName + ' ' + row.teacherSurname}
                </td>
                <td className="hidden md:table-cell">
                    {row.studentName + ' ' + row.studentSurname}
                </td>
                <td className="hidden md:table-cell">
                    {new Intl.DateTimeFormat('en-US').format(row.startTime)}
                </td>
                <td className="hidden md:table-cell">{row.score}</td>
                <td>
                    <div className="flex items-center gap-2">
                        {(role === 'admin' || role === 'teacher') && (
                            <>
                                <FormModal
                                    table="result"
                                    type="update"
                                    data={row}
                                />
                                <FormModal
                                    table="result"
                                    type="delete"
                                    id={row.id}
                                />
                            </>
                        )}

                        {/* <Link href={`/list/assignments/${row.id}`}>
                        <button className="flex h-7 w-7 items-center justify-center rounded-full bg-sky">
                            <Image
                                src="/edit.png"
                                alt="edit"
                                width={16}
                                height={16}
                            />
                        </button>
                    </Link>
                    {role === 'admin' && (
                        <button className="flex h-7 w-7 items-center justify-center rounded-full bg-purple">
                            <Image
                                src="/delete.png"
                                alt="edit"
                                width={16}
                                height={16}
                            />
                        </button>
                    )} */}
                    </div>
                </td>
            </tr>
        )
    }

    return (
        <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden text-lg font-semibold md:block">
                    All Results
                </h1>
                <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow">
                            <Image
                                src="/filter.png"
                                alt="filter"
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow">
                            <Image
                                src="/sort.png"
                                alt="filter"
                                width={14}
                                height={14}
                            />
                        </button>
                        {(role === 'admin' || role === 'teacher') && (
                            <FormModal table="result" type="create" />
                            // <button className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow">
                            //     <Image
                            //         src="/plus.png"
                            //         alt="filter"
                            //         width={14}
                            //         height={14}
                            //     />
                            // </button>
                        )}
                    </div>
                </div>
            </div>

            {/* LIST */}
            <div className="">
                <Table columns={columns} renderRow={renderRow} data={data} />
            </div>

            {/* PAGINATION */}
            <div className="">
                <Pagination page={p} count={count} />
            </div>
        </div>
    )
}

export default ResultListPage
