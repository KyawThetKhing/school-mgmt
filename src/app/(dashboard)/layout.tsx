import Link from 'next/link'
import Image from 'next/image'

import Menu from '@/components/Menu'
import Navbar from '@/components/Navbar'

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex h-screen">
            <div className="w-[14%] p-4 md:w-[8%] lg:w-[16%] xl:w-[14%]">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} />
                    <span className="hidden font-bold lg:block">
                        School Management
                    </span>
                </Link>
                <Menu />
            </div>
            <div className="flex w-[86%] flex-col overflow-scroll bg-[#F7F8FA] md:w-[92%] lg:w-[84%] xl:w-[86%]">
                <Navbar />
                {children}
            </div>
        </div>
    )
}
