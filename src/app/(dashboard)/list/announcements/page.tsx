import { auth } from '@clerk/nextjs/server'
import { Announcement, Prisma, Class } from '@prisma/client'
import Image from 'next/image'

import FormContainer from '@/components/FormContainer'
import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { prisma } from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'

type AnnouncementList = Announcement & {
    class: Class
}

const AnnouncementListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined }
}) => {
    const { userId, sessionClaims } = auth()
    const role = (sessionClaims?.metadata as { role?: string })?.role
    const currentUserId = userId

    const { page, ...otherParams } = searchParams
    const p = page ? parseInt(page) : 1

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
        ...(role === 'admin'
            ? [
                  {
                      header: 'Actions',
                      accessor: 'action',
                  },
              ]
            : []),
    ]

    const query: Prisma.AnnouncementWhereInput = {}

    if (otherParams) {
        for (const [key, value] of Object.entries(otherParams)) {
            if (value !== undefined) {
                switch (key) {
                    case 'search':
                        query.title = {
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

    const roleConditions = {
        teacher: { lessons: { some: { teacherId: currentUserId! } } },
        student: { students: { some: { id: currentUserId! } } },
        parent: { students: { some: { parentId: currentUserId! } } },
    }

    query.OR = [
        { classId: null },
        { class: roleConditions[role as keyof typeof roleConditions] || {} },
    ]

    const [data, count] = await prisma.$transaction([
        prisma.announcement.findMany({
            where: query,
            include: {
                class: { select: { name: true } },
            },
            take: ITEM_PER_PAGE,
            skip: (p - 1) * ITEM_PER_PAGE,
        }),
        prisma.announcement.count({
            where: query,
        }),
    ])

    const renderRow = async (row: AnnouncementList) => {
        return (
            <tr
                key={row.id}
                className="broder-b border-gray-200 text-sm even:bg-slate-50 hover:bg-purpleLight"
            >
                <td className="p-4">{row.title}</td>
                <td>{row.class?.name || '-'}</td>
                <td className="hidden md:table-cell">
                    {' '}
                    {new Intl.DateTimeFormat('en-US').format(row.date)}
                </td>
                <td>
                    <div className="flex items-center gap-2">
                        {role === 'admin' && (
                            <>
                                <FormContainer
                                    table="announcement"
                                    type="update"
                                    data={row}
                                />
                                <FormModal
                                    table="announcement"
                                    type="delete"
                                    id={row.id}
                                />
                            </>
                        )}
                        {/*                         
                    <Link href={`/list/announcements/${row.id}`}>
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
                    All Announcements
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
                            <FormContainer table="announcement" type="create" />
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

export default AnnouncementListPage
