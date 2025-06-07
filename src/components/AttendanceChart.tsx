'use client'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

const AttendanceChart = ({
    data,
}: {
    data: { name: string; present: number; absent: number }[]
}) => {
    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#ddd"
                    />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#d1d5db' }}
                    />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '10px',
                            borderColor: 'lightgray',
                        }}
                    />
                    <Legend
                        align="left"
                        verticalAlign="top"
                        wrapperStyle={{
                            paddingTop: '20px',
                            paddingBottom: '40px',
                        }}
                    />
                    <Bar
                        dataKey="present"
                        fill="#FAE27C"
                        legendType="circle"
                        radius={[10, 10, 0, 0]}
                    />
                    <Bar
                        dataKey="absent"
                        fill="#C3EBFA"
                        legendType="circle"
                        radius={[10, 10, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default AttendanceChart
