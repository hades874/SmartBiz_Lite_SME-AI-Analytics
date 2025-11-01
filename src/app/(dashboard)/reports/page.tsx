'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateReport, type GenerateReportOutput } from "@/ai/flows/automated-reports";
import React from "react";
import { mockSales, mockInventory } from "@/lib/data";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCustomers } from "@/lib/data";

export default function ReportsPage() {
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState<GenerateReportOutput | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [reportPeriod, setReportPeriod] = React.useState<'weekly' | 'monthly'>('monthly');

    const handleGenerateReport = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await generateReport({
                salesData: JSON.stringify(mockSales),
                inventoryData: JSON.stringify(mockInventory),
                paymentData: JSON.stringify([]), // Assuming no separate payment data for now
                customerData: JSON.stringify(mockCustomers),
                reportPeriod,
            });
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
                    <CardTitle>Automated Reports</CardTitle>
                    <CardDescription>Generate and download weekly or monthly business performance reports.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                     <Select value={reportPeriod} onValueChange={(value: 'weekly' | 'monthly') => setReportPeriod(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="weekly">Weekly Report</SelectItem>
                            <SelectItem value="monthly">Monthly Report</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleGenerateReport} disabled={loading} type="button">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Generate Report
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
                <Card>
                    <CardHeader>
                         <CardTitle>Generated {reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap font-sans">{result.report}</pre>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
