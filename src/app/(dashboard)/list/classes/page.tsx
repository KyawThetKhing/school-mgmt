import { auth } from '@clerk/nextjs/server'
import { Class, Prisma, Teacher, Grade } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

import FormContainer from '@/components/FormContainer'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { prisma } from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'

type ClassList = Class & { supervisor: Teacher; grade: Grade }

const StudentListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const { sessionClaims } = auth()
    const role = (sessionClaims?.metadata as { role?: string })?.role

    const { page, ...otherParams } = searchParams
    const p = page ? parseInt(page) : 1

    const columns = [
        {
            header: 'Class Name',
            accessor: 'name',
        },
        {
            header: 'Capacity',
            accessor: 'capacity',
            className: 'hidden md:table-cell',
        },
        {
            header: 'Grade',
            accessor: 'grade',
            className: 'hidden md:table-cell',
        },
        {
            header: 'Supervisor',
            accessor: 'supervisor',
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

    const query: Prisma.ClassWhereInput = {}

    if (otherParams) {
        for (const [key, value] of Object.entries(otherParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'supervisorId':
                        query.supervisorId = value
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

    const [data, count] = await prisma.$transaction([
        prisma.class.findMany({
            where: query,
            include: {
                supervisor: true,
                grade: true,
            },
            take: ITEM_PER_PAGE,
            skip: (p - 1) * ITEM_PER_PAGE,
        }),
        prisma.class.count({
            where: query,
        }),
    ])

    const renderRow = (row: ClassList) => {
        return (
            <tr
                key={row.id}
                className="broder-b border-gray-200 text-sm even:bg-slate-50 hover:bg-purpleLight"
            >
                <td className="p-4">{row.name}</td>
                <td className="hidden p-4 md:table-cell">{row.capacity}</td>
                <td className="hidden p-4 md:table-cell">{row.grade.level}</td>
                <td className="hidden p-4 md:table-cell">
                    {row.supervisor.name}
                </td>
                <td>
                    <div className="flex items-center gap-2">
                        {role === 'admin' && (
                            <>
                                <FormContainer
                                    table="class"
                                    type="update"
                                    data={row}
                                />
                                <FormContainer
                                    table="class"
                                    type="delete"
                                    id={row.id}
                                />
                            </>
                        )}
                        {/*                         
                    <Link href={`/list/subjects/${row.id}`}>
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
                    All Classes
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
                            <FormContainer table="class" type="create" />
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

export default StudentListPage
