'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trackCashFlow, type CashFlowOutput } from "@/ai/flows/cash-flow-tracking";
import React from "react";
import { mockSales } from "@/lib/data";
import type { Payment } from "@/types";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function transformSalesToPayments(sales: any[]): Payment[] {
    const payments: Payment[] = [];
    sales.forEach(sale => {
        payments.push({
            id: `income-${sale.id}`,
            date: sale.date,
            type: 'income',
            amount: sale.totalAmount,
            category: 'Sales',
            description: `Sale of ${sale.productName}`,
            status: sale.paymentStatus === 'paid' ? 'completed' : sale.paymentStatus,
        });
    });

    // Mock some expenses for a more realistic cash flow analysis
    payments.push({
        id: 'expense-1',
        date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
        type: 'expense',
        amount: 50000,
        category: 'Rent',
        status: 'completed'
    });
    payments.push({
        id: 'expense-2',
        date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
        type: 'expense',
        amount: 25000,
        category: 'Utilities',
        status: 'completed'
    });
     payments.push({
        id: 'expense-3',
        date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
        type: 'expense',
        amount: 75000,
        category: 'Salaries',
        status: 'scheduled'
    });


    return payments;
}


export default function CashflowPage() {
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState<CashFlowOutput | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const handleTrackCashFlow = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const payments = transformSalesToPayments(mockSales);
            const res = await trackCashFlow({ payments });
            setResult(res);
        } catch (e: any) {
            setError(e.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Cash Flow Analytics</CardTitle>
                    <CardDescription>Track your income, expenses, and cash flow projections.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleTrackCashFlow} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Analyze Cash Flow
                    </Button>
                </CardContent>
            </Card>

            {loading && (
                 <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {result && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     <Card>
                        <CardHeader>
                            <CardTitle>Current Cash Position</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">৳{result.currentCashPosition.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>30-Day Projection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">৳{result.thirtyDayProjection.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Upcoming Shortfalls</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{result.upcomingShortfalls}</p>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Payment Cycle Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{result.paymentCycleAnalysis}</p>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2 lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Expense Pattern Identification</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{result.expensePatternIdentification}</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
