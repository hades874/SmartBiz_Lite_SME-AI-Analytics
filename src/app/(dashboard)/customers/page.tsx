
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { customerSegmentation, type CustomerSegmentationOutput } from "@/ai/flows/customer-segmentation";
import React from "react";
import { mockCustomers } from "@/lib/data";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage, strings } from "@/context/language-context";

export default function CustomersPage() {
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState<CustomerSegmentationOutput | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const { language } = useLanguage();
    const t = strings[language];

    const handleAnalyzeCustomers = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await customerSegmentation({ customerData: mockCustomers });
            setResult(res);
        } catch (e: any) {
            setError(e.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };
    
    const getSegmentVariant = (segment: string) => {
        switch (segment) {
            case 'high-value':
                return 'default';
            case 'regular':
                return 'secondary';
            case 'at-risk':
                return 'destructive';
            case 'lost':
                return 'outline';
            default:
                return 'secondary';
        }
    };
    
    const customersWithSegments = React.useMemo(() => {
        if (!result) return mockCustomers;
        return mockCustomers.map(customer => {
            const segmentInfo = result.find(r => r.id === customer.id);
            return { ...customer, segment: segmentInfo?.segment };
        });
    }, [result]);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t.customersTitle}</CardTitle>
                    <CardDescription>{t.customersDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button onClick={handleAnalyzeCustomers} disabled={loading} type="button">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {t.analyzeCustomers}
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

            <Card>
                <CardHeader>
                    <CardTitle>{t.customerList}</CardTitle>
                    <CardDescription>
                        {result ? t.customerListDescriptionWithSegments : t.customerListDescription}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.customerName}</TableHead>
                                <TableHead>{t.totalSpent}</TableHead>
                                <TableHead>{t.lastPurchase}</TableHead>
                                <TableHead>{t.segment}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customersWithSegments.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium">{customer.name}</TableCell>
                                    <TableCell>৳{customer.totalSpent.toLocaleString()}</TableCell>
                                    <TableCell>{new Date(customer.lastPurchase).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {customer.segment ? (
                                            <Badge variant={getSegmentVariant(customer.segment)} className={cn(customer.segment === 'high-value' && 'bg-green-600', 'capitalize')}>
                                                {customer.segment.replace('-', ' ')}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">N/A</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
