'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { salesForecasting, type SalesForecastingOutput } from "@/ai/flows/sales-forecasting";
import React from "react";
import { mockSales } from "@/lib/data";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ForecastPage() {
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState<SalesForecastingOutput | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const handleGenerateForecast = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await salesForecasting({ salesData: mockSales });
            setResult(res);
        } catch (e: any) {
            setError(e.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const getConfidenceVariant = (confidence: string) => {
        switch (confidence) {
            case 'high':
                return 'default';
            case 'medium':
                return 'secondary';
            case 'low':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'increasing':
                return <TrendingUp className="h-4 w-4 text-green-500" />;
            case 'decreasing':
                return <TrendingDown className="h-4 w-4 text-red-500" />;
            case 'stable':
                return <Minus className="h-4 w-4 text-gray-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Sales Forecasting</CardTitle>
                    <CardDescription>Use AI to predict future sales and identify trends based on your historical data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleGenerateForecast} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Generate 30-Day Forecast
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
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Forecast</CardTitle>
                                <CardDescription>Predicted sales for the next 30 days.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Predicted Sales</TableHead>
                                            <TableHead>Confidence</TableHead>
                                            <TableHead>Trend</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {result.forecast.map((item) => (
                                            <TableRow key={item.productName}>
                                                <TableCell className="font-medium">{item.productName}</TableCell>
                                                <TableCell>৳{item.predictedSales.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getConfidenceVariant(item.confidence)} className="capitalize">{item.confidence}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getTrendIcon(item.trend)}
                                                        <span className="capitalize">{item.trend}</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6 lg:col-span-1">
                         <Card>
                            <CardHeader>
                                <CardTitle>AI Insights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 list-disc list-inside text-sm">
                                    {result.insights.map((insight, index) => (
                                        <li key={index}>{insight}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>AI Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 list-disc list-inside text-sm">
                                    {result.recommendations.map((rec, index) => (
                                        <li key={index}>{rec}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
