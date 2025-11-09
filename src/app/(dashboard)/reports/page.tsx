
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateReport, type GenerateReportOutput } from "@/ai/flows/automated-reports";
import React from "react";
import { getSales, getInventory, getCustomers } from "@/lib/sheets";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, strings } from "@/context/language-context";

export default function ReportsPage() {
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState<GenerateReportOutput | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [reportPeriod, setReportPeriod] = React.useState<'weekly' | 'monthly'>('monthly');
    const { language } = useLanguage();
    const t = strings[language];

    const handleGenerateReport = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const [sales, inventory, customers] = await Promise.all([
                getSales(),
                getInventory(),
                getCustomers(),
            ]);
            const res = await generateReport({
                salesData: JSON.stringify(sales),
                inventoryData: JSON.stringify(inventory),
                paymentData: JSON.stringify([]), // Assuming no separate payment data for now
                customerData: JSON.stringify(customers),
                reportPeriod,
            });
            setResult(res);
        } catch (e: any) {
            setError(e.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };
    
    const getChangeIcon = (change?: string) => {
        if (!change) return <Minus className="h-4 w-4 text-gray-500" />;
        if (change.startsWith('+')) return <TrendingUp className="h-4 w-4 text-green-500" />;
        if (change.startsWith('-')) return <TrendingDown className="h-4 w-4 text-red-500" />;
        return <Minus className="h-4 w-4 text-gray-500" />;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t.reportsTitle}</CardTitle>
                    <CardDescription>{t.reportsDescription}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                     <Select value={reportPeriod} onValueChange={(value: 'weekly' | 'monthly') => setReportPeriod(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="weekly">{t.weeklyReport}</SelectItem>
                            <SelectItem value="monthly">{t.monthlyReport}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleGenerateReport} disabled={loading} type="button">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {t.generateReport}
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
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.generatedReportTitle(reportPeriod)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="text-muted-foreground">{result.summary}</p>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                         {result.keyMetrics.map(metric => (
                            <Card key={metric.metric}>
                                <CardHeader className="pb-2">
                                    <CardDescription>{metric.metric}</CardDescription>
                                    <CardTitle className="text-3xl">{metric.value}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {metric.change && (
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            {getChangeIcon(metric.change)}
                                            {metric.change} from last period
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                             <CardHeader>
                                <CardTitle>{t.aiRecommendations}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 list-disc list-inside text-sm">
                                    {result.recommendations.map((item, index) => <li key={`rec-${index}`}>{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader>
                                <CardTitle>{t.actionItems}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 list-disc list-inside text-sm">
                                    {result.actionItems.map((item, index) => <li key={`action-${index}`}>{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
