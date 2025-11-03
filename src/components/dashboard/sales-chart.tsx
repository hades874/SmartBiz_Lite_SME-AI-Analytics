
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
import { useLanguage, strings } from '@/context/language-context';
import { SalesRecord } from '@/types';
import { format, subMonths, parseISO } from 'date-fns';

interface SalesChartProps {
    salesData: SalesRecord[];
}

const chartConfig = {
    total: {
      label: "Sales",
      color: "hsl(var(--primary))",
    },
  }

export function SalesChart({ salesData }: SalesChartProps) {
  const { language } = useLanguage();
  const t = strings[language];

  const getMonthIndex = (monthName: string) => {
    return new Date(`${monthName} 1, 2000`).getMonth();
  }

  const monthlySalesData = React.useMemo(() => {
    const monthlyTotals: { [key: string]: number } = {};
    const twelveMonthsAgo = subMonths(new Date(), 11);

    // Initialize last 12 months with 0 sales
    for (let i = 0; i < 12; i++) {
        const month = format(subMonths(new Date(), i), 'MMM yyyy');
        monthlyTotals[month] = 0;
    }

    salesData.forEach(sale => {
        const saleDate = parseISO(sale.date);
        if (saleDate >= twelveMonthsAgo) {
            const month = format(saleDate, 'MMM yyyy');
            monthlyTotals[month] = (monthlyTotals[month] || 0) + sale.totalAmount;
        }
    });

    return Object.keys(monthlyTotals).map(monthStr => {
        const [monthName, year] = monthStr.split(' ');
        return {
            month: monthName,
            year: parseInt(year),
            total: monthlyTotals[monthStr]
        }
    }).sort((a,b) => new Date(a.year, getMonthIndex(a.month)).getTime() - new Date(b.year, getMonthIndex(b.month)).getTime());
  }, [salesData]);
  
  return (
    <Card>
        <CardHeader>
            <CardTitle>{t.salesOverview}</CardTitle>
            <CardDescription>{t.salesOverviewDescription}</CardDescription>
        </CardHeader>
        <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
