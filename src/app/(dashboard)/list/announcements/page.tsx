import React from 'react'

import TableSearch from '@/components/TableSearch'
import Image from 'next/image'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import Link from 'next/link'
import { role, announcementsData } from '@/lib/data'

type Announcement = {
    id: number
    title: string
    class: string
    date: string
}

const columns = [
    {
        header: 'Title',
        accessor: 'title',
    },
    {
        header: 'Class',
        accessor: 'class',
    },
    {
        header: 'Date',
        accessor: 'date',
        className: 'hidden md:table-cell',
    },
    {
        header: 'Actions',
        accessor: 'action',
    },
]

const AnnouncementListPage = () => {
    const renderRow = (row: Announcement) => {
        return (
            <tr
                key={row.id}
                className="broder-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
            >
                <td className="p-4">{row.title}</td>
                <td>{row.class}</td>
                <td className="hidden md:table-cell">{row.date}</td>
                <td>
                    <div className="flex items-center gap-2">
                        <Link href={`/list/announcements/${row.id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky">
                                <Image
                                    src="/view.png"
                                    alt="edit"
                                    width={16}
                                    height={16}
                                />
                            </button>
                        </Link>
                        {role === 'admin' && (
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-purple">
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
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">
                    All Announcements
                </h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
                            <Image
                                src="/filter.png"
                                alt="filter"
                                width={14}
                                height={14}
                            />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
                            <Image
                                src="/sort.png"
                                alt="filter"
                                width={14}
                                height={14}
                            />
                        </button>
                        {role === 'admin' && (
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow">
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
                    data={announcementsData}
                />
            </div>

            {/* PAGINATION */}
            <div className="">
                <Pagination />
            </div>
        </div>
    )
}

export default AnnouncementListPage
