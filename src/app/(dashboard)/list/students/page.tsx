import { Prisma, Student, Class } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import FormContainer from '@/components/FormContainer'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { prisma } from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { role } from '@/lib/utils'


type StudentList = Student & { class: Class }

const columns = [
    {
        header: 'Info',
        accessor: 'info',
    },
    {
        header: 'Student ID',
        accessor: 'studentId',
        className: 'hidden md:table-cell',
    },
    {
        header: 'Grade',
        accessor: 'grade',
        className: 'hidden md:table-cell',
    },
    {
        header: 'Phone',
        accessor: 'phone',
        className: 'hidden md:table-cell',
    },
    {
        header: 'Address',
        accessor: 'address',
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

const renderRow = (row: StudentList) => {
    return (
        <tr
            key={row.id}
            className="broder-b border-gray-200 text-sm even:bg-slate-50 hover:bg-purpleLight"
        >
            <td className="flex items-center gap-4 p-4">
                <Image
                    src={row.img || '/noAvatar.png'}
                    alt={row.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover md:hidden xl:block"
                />
                <div className="flex flex-col">
                    <h3 className="font-semibold">
                        {row.name + ' ' + row.surname}
                    </h3>
                    <p className="text-sm text-gray-500">{row?.class.name}</p>
                </div>
            </td>
            <td className="hidden md:table-cell">{row.id}</td>
            <td className="hidden md:table-cell">{row.class.name[0]}</td>
            <td className="hidden md:table-cell">{row.phone}</td>
            <td className="hidden md:table-cell">{row.address}</td>
            <td>
                <div className="flex items-center gap-2">
                    {role === 'admin' && (
                        <>
                            <Link href={`/list/students/${row.id}`}>
                                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-sky">
                                    <Image
                                        src="/view.png"
                                        alt="edit"
                                        width={16}
                                        height={16}
                                    />
                                </button>
                            </Link>
                            <FormContainer
                                table="student"
                                type="delete"
                                id={row.id}
                            />
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
}

const StudentListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const { page, ...otherParams } = searchParams

    let query: Prisma.StudentWhereInput = {}

    if (otherParams) {
        for (const [key, value] of Object.entries(otherParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'teacherId':
                        query.class = {
                            lessons: {
                                some: {
                                    teacherId: value,
                                },
                            },
                        }
                        break
                    case 'search':
                        query.name = {
                            contains: value,
                            mode: 'insensitive',
                        }
                        break
                    default:
                        break
                }
            }
        }
    }

    const p = page ? parseInt(page) : 1
    const [data, count] = await prisma.$transaction([
        prisma.student.findMany({
            where: query,
            include: {
                class: true,
            },
            take: ITEM_PER_PAGE,
            skip: (p - 1) * ITEM_PER_PAGE,
        }),
        prisma.student.count({
            where: query,
        }),
    ])

    return (
        <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden text-lg font-semibold md:block">
                    All Students
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
                            <FormContainer type="create" table="student" />
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

export default StudentListPage
