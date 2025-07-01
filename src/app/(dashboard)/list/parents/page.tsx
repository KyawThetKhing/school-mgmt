import React from 'react'

import TableSearch from '@/components/TableSearch'
import Image from 'next/image'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import { role } from '@/lib/utils'
import FormModal from '@/components/FormModal'
import { prisma } from '@/lib/prisma'
import { Parent, Prisma, Student } from '@prisma/client'
import { ITEM_PER_PAGE } from '@/lib/settings'

type ParentList = Parent & { students: Student[] }

const columns = [
    {
        header: 'Info',
        accessor: 'info',
    },
    {
        header: 'Student Name',
        accessor: 'students',
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

const renderRow = (row: ParentList) => {
    return (
        <tr
            key={row.id}
            className="broder-b border-gray-200 text-sm even:bg-slate-50 hover:bg-purpleLight"
        >
            <td className="flex items-center gap-4 p-4">
                <div className="flex flex-col">
                    <h3 className="font-semibold">{row.name}</h3>
                    <p className="text-sm text-gray-500">{row?.email}</p>
                </div>
            </td>
            <td className="hidden md:table-cell">
                {row.students.map((student: Student) => student.name).join(',')}
            </td>
            <td className="hidden md:table-cell">{row.phone}</td>
            <td className="hidden md:table-cell">{row.address}</td>
            <td>
                <div className="flex items-center gap-2">
                    {role === 'admin' && (
                        <>
                            <FormModal
                                table="parent"
                                type="update"
                                data={row}
                            />
                            <FormModal
                                table="parent"
                                type="delete"
                                id={row.id}
                            />
                        </>
                    )}
                    {/* <Link href={`/list/students/${row.id}`}>
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
                        // <button className="flex h-7 w-7 items-center justify-center rounded-full bg-purple">
                        //     <Image
                        //         src="/delete.png"
                        //         alt="edit"
                        //         width={16}
                        //         height={16}
                        //     />
                        // </button>
                        <FormModal
                            table="parent"
                            type="delete"
                            id={row.id}
                        />
                    )} */}
                </div>
            </td>
        </tr>
    )
}

const ParentListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const { page, ...otherParams } = searchParams

    let query: Prisma.ParentWhereInput = {}

    if (otherParams) {
        for (const [key, value] of Object.entries(otherParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        {
                            query.name = {
                                contains: value,
                                mode: 'insensitive',
                            }
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
        prisma.parent.findMany({
            where: query,
            include: {
                students: true,
            },
            take: ITEM_PER_PAGE,
            skip: (p - 1) * ITEM_PER_PAGE,
        }),
        prisma.parent.count({
            where: query,
        }),
    ])

    return (
        <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden text-lg font-semibold md:block">
                    All Parents
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
                            // <button className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow">
                            //     <Image
                            //         src="/plus.png"
                            //         alt="filter"
                            //         width={14}
                            //         height={14}
                            //     />
                            // </button>
                            <FormModal type="create" table="parent" />
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

export default ParentListPage
