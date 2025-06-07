import Image from 'next/image'
import CountChart from './CountChart'
import { prisma } from '@/lib/prisma'

const CountChartContainer = async () => {
    const data = await prisma.student.groupBy({
        by: ['sex'],
        _count: true,
    })

    const boys = data.find((d) => d.sex === 'MALE')?._count || 0
    const girls = data.find((d) => d.sex === 'FEMALE')?._count || 0

    return (
        <div className="h-full w-full gap-8 rounded-xl bg-white p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Students</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <CountChart boys={boys} girls={girls} />
            <div className="flex justify-center gap-16">
                <div className="flex flex-col gap-1">
                    <div className="h-5 w-5 rounded-full bg-sky"></div>
                    <h1 className="font-bold">{boys}</h1>
                    <h2 className="text-xs text-gray-300">
                        Boys ({((boys / (boys + girls)) * 100).toFixed(2)}%)
                    </h2>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="h-5 w-5 rounded-full bg-yellow"></div>
                    <h1 className="font-bold">{girls}</h1>
                    <h2 className="text-xs text-gray-300">
                        Girls ({((girls / (boys + girls)) * 100).toFixed(2)}%)
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default CountChartContainer
