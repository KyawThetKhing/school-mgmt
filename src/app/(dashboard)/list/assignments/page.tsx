import React from 'react'

import TableSearch from '@/components/TableSearch'
import Image from 'next/image'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import { role } from '@/lib/data'
import FormModal from '@/components/FormModal'
import { Assignment, Class, Prisma, Subject, Teacher } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'

type AssignmentList = Assignment & {
    lesson: {
        subject: Subject
        class: Class
        teacher: Teacher
    }
}

const columns = [
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
    {
        header: 'Due Date',
        accessor: 'dueDate',
        className: 'hidden md:table-cell',
    },
    {
        header: 'Actions',
        accessor: 'action',
    },
]

const renderRow = (row: AssignmentList) => {
    return (
        <tr
            key={row.id}
            className="broder-b border-gray-200 text-sm even:bg-slate-50 hover:bg-purpleLight"
        >
            <td className="p-4">{row.lesson.subject.name}</td>
            <td>{row.lesson.class.name}</td>
            <td className="hidden md:table-cell">{row.lesson.teacher.name}</td>
            <td className="hidden md:table-cell">
                {new Intl.DateTimeFormat('en-US').format(row.dueDate)}
            </td>
            <td>
                <div className="flex items-center gap-2">
                    {role === 'admin' && (
                        <>
                            <FormModal
                                table="assignment"
                                type="update"
                                data={row}
                            />
                            <FormModal
                                table="assignment"
                                type="delete"
                                id={row.id}
                            />
                        </>
                    )}
                    {/*                         
                    <Link href={`/list/assignments/${row.id}`}>
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

const AssignmentListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const { page, ...otherParams } = searchParams
    const p = page ? parseInt(page) : 1

    const query: Prisma.AssignmentWhereInput = {}

    if (otherParams) {
        for (const [key, value] of Object.entries(otherParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'classId':
                        query.lesson = { classId: parseInt(value) }
                        break
                    case 'teacherId':
                        query.lesson = { teacherId: value }
                        break
                    case 'search':
                        query.lesson = {
                            subject: {
                                name: { contains: value, mode: 'insensitive' },
                            },
                        }
                        break
                    default:
                        break
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.assignment.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            include: {
                lesson: {
                    select: {
                        subject: { select: { name: true } },
                        class: { select: { name: true } },
                        teacher: { select: { name: true } },
                    },
                },
            },
            skip: (p - 1) * ITEM_PER_PAGE,
        }),
        prisma.assignment.count({
            where: query,
        }),
    ])

    return (
        <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden text-lg font-semibold md:block">
                    All Assignments
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
                            <FormModal table="assignment" type="create" />
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

export default AssignmentListPage
