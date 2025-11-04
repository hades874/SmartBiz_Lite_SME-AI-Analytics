
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useLanguage, strings } from '@/context/language-context';
import { SalesRecord } from '@/types';
import { getMonth, getYear, parseISO } from 'date-fns';
import { formatCurrency, toBengaliNumber } from '@/lib/utils';

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

  const availableYears = React.useMemo(() => {
    const years = new Set(salesData.map(sale => getYear(parseISO(sale.date))));
    return Array.from(years).sort((a, b) => b - a);
  }, [salesData]);

  const [selectedYear, setSelectedYear] = React.useState<number>(availableYears[0] || new Date().getFullYear());
  
  const getMonthName = (monthIndex: number) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const bnMonthNames = ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];
    
    if (language === 'bn') {
        return bnMonthNames[monthIndex];
    }
    return monthNames[monthIndex];
  }
  
  const monthlySalesData = React.useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
        month: getMonthName(i),
        total: 0,
    }));

    salesData.forEach(sale => {
        try {
            const saleDate = parseISO(sale.date);
            const year = getYear(saleDate);
            if (year === selectedYear) {
                const monthIndex = getMonth(saleDate);
                months[monthIndex].total += sale.totalAmount;
            }
        } catch (e) {
            console.error(`Invalid date format for sale ID ${sale.id}: ${sale.date}`);
        }
    });

    return months;
  }, [salesData, selectedYear, language]);

  const yAxisTicks = React.useMemo(() => {
    const maxSale = Math.max(...monthlySalesData.map(d => d.total));
    const topTick = Math.ceil(maxSale / 5000) * 5000;
    const ticks = [];
    for (let i = 0; i <= topTick; i += 5000) {
        ticks.push(i);
    }
    if (ticks.length === 1 && ticks[0] === 0) return [0, 5000, 10000]; // Provide a default scale if no sales
    return ticks;
  }, [monthlySalesData]);
  
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>{t.salesOverview}</CardTitle>
                <CardDescription>{t.salesOverviewDescription}</CardDescription>
            </div>
             <Select
                value={String(selectedYear)}
                onValueChange={(value) => setSelectedYear(Number(value))}
            >
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                {availableYears.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                        {language === 'bn' ? toBengaliNumber(year) : year}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
        </CardHeader>
        <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <YAxis
                            ticks={yAxisTicks}
                            domain={[0, yAxisTicks[yAxisTicks.length -1]]}
                            tickFormatter={(value) => language === 'bn' ? `৳${toBengaliNumber(value/1000)}k` : `৳${value / 1000}k`} 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8} 
                            fontSize={12} 
                        />
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent 
                                formatter={(value) => formatCurrency(value as number, language)}
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
