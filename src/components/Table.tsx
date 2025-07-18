import React from 'react'

const Table = ({
    columns,
    renderRow,
    data,
}: {
    columns: { header: string; accessor: string; className?: string }[]
    renderRow: (row: any) => React.ReactNode
    data: any[]
}) => {
    return (
        <table className="mt-4 w-full">
            <thead>
                <tr className="text-left text-sm text-gray-500">
                    {columns.map((col) => (
                        <th key={col.accessor} className={col.className}>
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            {data.length > 0 ? (
                <tbody>{data.map((row) => renderRow(row))}</tbody>
            ) : (
                <tbody>
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="p-4 text-center text-gray-500"
                        >
                            No data available
                        </td>
                    </tr>
                </tbody>
            )}
        </table>
    )
}

export default Table
