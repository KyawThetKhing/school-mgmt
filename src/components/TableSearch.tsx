'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const TableSearch = () => {
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const params = new URLSearchParams(window.location.search)
        params.set('search', e.currentTarget.search.value)
        router.push(`${window.location.pathname}?${params}`)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-2 rounded-full px-2 text-xs ring-[1.5px] ring-gray-300 md:w-auto"
        >
            <Image src="/search.png" alt="" width={14} height={14} />
            <input
                name="search"
                type="text"
                placeholder="Search..."
                className="w-[200px] bg-transparent p-2 outline-none"
            />
        </form>
    )
}

export default TableSearch
