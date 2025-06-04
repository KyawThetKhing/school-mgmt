import React from 'react'

import TableSearch from '@/components/TableSearch'
import Image from 'next/image'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import Link from 'next/link'
import { role, teachersData } from '@/lib/data'

type Teacher = {
    id: number
    teacherId: string
    name: string
    email?: string
    photo: string
    phone: string
    subjects: string[]
    classes: string[]
    address: string
}

const columns = [
    {
        header: 'Info',
        accessor: 'info',
    },
    {
        header: 'Teacher ID',
        accessor: 'teacherId',
        className: 'hidden md:table-cell',
    },
    {
        header: 'Subjects',
        accessor: 'subjects',
        className: 'hidden md:table-cell',
    },
    {
        header: 'Classes',
        accessor: 'classes',
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
    {
        header: 'Actions',
        accessor: 'action',
    },
]

const TeacherListPage = () => {
    const renderRow = (row: Teacher) => {
        return (
            <tr
                key={row.id}
                className="broder-b border-gray-200 text-sm even:bg-slate-50 hover:bg-purpleLight"
            >
                <td className="flex items-center gap-4 p-4">
                    <Image
                        src={row.photo}
                        alt={row.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover md:hidden xl:block"
                    />
                    <div className="flex flex-col">
                        <h3 className="font-semibold">{row.name}</h3>
                        <p className="text-sm text-gray-500">{row?.email}</p>
                    </div>
                </td>
                <td className="hidden md:table-cell">{row.teacherId}</td>
                <td className="hidden md:table-cell">
                    {row.subjects.join(',')}
                </td>
                <td className="hidden md:table-cell">
                    {row.classes.join(',')}
                </td>
                <td className="hidden md:table-cell">{row.phone}</td>
                <td className="hidden md:table-cell">{row.address}</td>
                <td>
                    <div className="flex items-center gap-2">
                        <Link href={`/list/teachers/${row.id}`}>
                            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-sky">
                                <Image
                                    src="/view.png"
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
                        )}
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
                    All Teachers
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
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow">
                                <Image
                                    src="/plus.png"
                                    alt="filter"
                                    width={14}
                                    height={14}
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* LIST */}
            <div className="">
                <Table
                    columns={columns}
                    renderRow={renderRow}
                    data={teachersData}
                />
            </div>

            {/* PAGINATION */}
            <div className="">
                <Pagination />
            </div>
        </div>
    )
}

export default TeacherListPage
