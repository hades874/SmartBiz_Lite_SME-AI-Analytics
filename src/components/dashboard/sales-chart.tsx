"use client"
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const generateMockSalesData = () => [
    { month: "January", total: Math.floor(Math.random() * 5000) + 1000 },
    { month: "February", total: Math.floor(Math.random() * 5000) + 1000 },
    { month: "March", total: Math.floor(Math.random() * 5000) + 1000 },
    { month: "April", total: Math.floor(Math.random() * 5000) + 1000 },
    { month: "May", total: Math.floor(Math.random() * 5000) + 1000 },
    { month: "June", total: Math.floor(Math.random() * 5000) + 1000 },
    { month: "July", total: Math.floor(Math.random() * 5000) + 1000 },
    { month: "August", total: Math.floor(Math.random() * 5000) + 1000 },
    { month: "September", total: Math.floor(Math.random() * 5000) + 1000 },
    { month: "October", total: Math.floor(Math.random() * 5000) + 1000 },
    { month: "November", total: Math.floor(Math.random() * 5000) + 1000 },
    { month: "December", total: Math.floor(Math.random() * 5000) + 1000 },
];


const chartConfig = {
    total: {
      label: "Sales",
      color: "hsl(var(--primary))",
    },
  }

export function SalesChart() {
  const mockSalesDataForChart = React.useMemo(() => generateMockSalesData(), []);
  return (
    <Card>
        <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>An overview of your sales for the last year.</CardDescription>
        </CardHeader>
        <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockSalesDataForChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <YAxis tickFormatter={(value) => `৳${value / 1000}k`} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent 
                                formatter={(value) => `৳${value.toLocaleString()}`}
                                indicator="dot"
                            />}
                        />
                        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
             </ChartContainer>
        </CardContent>
    </Card>
  )
}
