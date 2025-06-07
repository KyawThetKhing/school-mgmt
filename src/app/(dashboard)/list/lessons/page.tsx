import React from 'react'

import TableSearch from '@/components/TableSearch'
import Image from 'next/image'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import { role } from '@/lib/utils'
import FormModal from '@/components/FormModal'
import { Lesson, Prisma, Class, Subject, Teacher } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'

type LessonList = Lesson & { class: Class; subject: Subject; teacher: Teacher }

const columns = [
    {
        header: 'Lesson',
        accessor: 'lesson',
    },
    {
        header: 'Subject',
        accessor: 'subject',
    },
    {
        header: 'Class',
        accessor: 'class',
    },
    {
        header: 'Teacher',
        accessor: 'teacher',
        className: 'hidden md:table-cell',
    },
    ...(role === 'admin'
        ? [
              {
                  header: 'Actions',
                  accessor: 'action',
              },
          ]
        : []),
]

const renderRow = (row: LessonList) => {
    return (
        <tr
            key={row.id}
            className="broder-b border-gray-200 text-sm even:bg-slate-50 hover:bg-purpleLight"
        >
            <td className="p-4">{row.name}</td>
            <td className="p-4">{row.subject.name}</td>
            <td>{row.class.name}</td>
            <td className="hidden md:table-cell">{row.teacher.name}</td>
            <td>
                <div className="flex items-center gap-2">
                    {role === 'admin' && (
                        <>
                            <FormModal
                                table="lesson"
                                type="update"
                                data={row}
                            />
                            <FormModal
                                table="lesson"
                                type="delete"
                                id={row.id}
                            />
                        </>
                    )}
                    {/*                         
                    <Link href={`/list/lessons/${row.id}`}>
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

const LessonListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const { page, ...otherParams } = searchParams
    const p = page ? parseInt(page) : 1

    const query: Prisma.LessonWhereInput = {}

    if (otherParams) {
        for (const [key, value] of Object.entries(otherParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'classId':
                        query.classId = parseInt(value)
                        break
                    case 'teacherId':
                        query.teacherId = value
                        break
                    case 'search':
                        query.OR = [
                            {
                                subject: {
                                    name: {
                                        contains: value,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                            {
                                teacher: {
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

    const [data, count] = await prisma.$transaction([
        prisma.lesson.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            include: {
                class: { select: { name: true } },
                subject: { select: { name: true } },
                teacher: { select: { name: true } },
            },
            skip: (p - 1) * ITEM_PER_PAGE,
        }),
        prisma.lesson.count({
            where: query,
        }),
    ])

    return (
        <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden text-lg font-semibold md:block">
                    All Lessons
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
                        {role === 'admin' && (
                            <FormModal table="lesson" type="create" />
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

export default LessonListPage
