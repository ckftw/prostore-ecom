'use client';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
const Charts = ({ data: { salesData } }: { data: { salesData: { month: string; totalSales: number }[] } }) => {
    return (
        <ResponsiveContainer height={350} width={'100%'}>
            <BarChart data={salesData}>
                <XAxis dataKey={'month'} axisLine={false} stroke='#888888' fontSize={12} tickLine={false} />
                <YAxis tickFormatter={
                    (value) => `$${value}`
                } axisLine={false} stroke='#888888' fontSize={12} tickLine={false} />
                <Bar className='fill-primary' dataKey='totalSales' fill='currentColor' radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default Charts