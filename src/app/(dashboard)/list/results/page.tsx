import React from 'react'

import TableSearch from '@/components/TableSearch'
import Image from 'next/image'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import Link from 'next/link'
import { role, resultsData } from '@/lib/data'
import FormModal from '@/components/FormModal'

type Result = {
    id: number
    subject: string
    class: string
    teacher: string
    student: string
    date: string
    type: 'exam' | 'assignment'
    score: number
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
    {
        header: 'Actions',
        accessor: 'action',
    },
]

const ResultListPage = () => {
    const renderRow = (row: Result) => {
        return (
            <tr
                key={row.id}
                className="broder-b border-gray-200 text-sm even:bg-slate-50 hover:bg-purpleLight"
            >
                <td className="p-4">{row.subject}</td>
                <td>{row.class}</td>
                <td className="hidden md:table-cell">{row.teacher}</td>
                <td className="hidden md:table-cell">{row.student}</td>
                <td className="hidden md:table-cell">{row.date}</td>
                <td className="hidden md:table-cell">{row.type}</td>
                <td className="hidden md:table-cell">{row.score}</td>
                <td>
                    <div className="flex items-center gap-2">
                        {role === 'admin' && (
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
                        {role === 'admin' && (
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
                <Table
                    columns={columns}
                    renderRow={renderRow}
                    data={resultsData}
                />
            </div>

            {/* PAGINATION */}
            <div className="">
                <Pagination />
            </div>
        </div>
    )
}

export default ResultListPage
