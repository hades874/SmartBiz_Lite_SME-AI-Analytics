
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { customerSegmentation, type CustomerSegmentationOutput } from "@/ai/flows/customer-segmentation";
import React from "react";
import { getCustomers } from "@/lib/sheets";
import type { Customer } from "@/types";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { useLanguage, strings } from "@/context/language-context";

export default function CustomersPage() {
    const [loading, setLoading] = React.useState(false);
    const [isCustomerLoading, setIsCustomerLoading] = React.useState(true);
    const [customers, setCustomers] = React.useState<Customer[]>([]);
    const [result, setResult] = React.useState<CustomerSegmentationOutput | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const { language } = useLanguage();
    const t = strings[language];

    const fetchCustomers = async () => {
        setIsCustomerLoading(true);
        setError(null);
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load customers.');
        } finally {
            setIsCustomerLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCustomers();
    }, []);

    const handleAnalyzeCustomers = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            // Filter out customers that already have a segment
            const customersToSegment = customers.filter(c => !c.segment).map(c => ({
                ...c,
                firstPurchase: c.firstPurchase || '',
                lastPurchase: c.lastPurchase || '',
            }));

            if (customersToSegment.length > 0) {
                 const res = await customerSegmentation({ customerData: customersToSegment });
                 setResult(res);
            } else {
                setResult([]); // No customers to segment
            }
        } catch (e: any) {
            setError(e.message || "An error occurred during segmentation.");
        } finally {
            setLoading(false);
        }
    };
    
    const getSegmentVariant = (segment?: string) => {
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
        return customers.map(customer => {
            const segmentInfo = result?.find(r => r.id === customer.id);
            // If segmentation has run, use the new segment. Otherwise, use existing segment data.
            const segment = segmentInfo ? segmentInfo.segment : customer.segment;
            return { ...customer, segment };
        });
    }, [result, customers]);


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t.customersTitle}</CardTitle>
                    <CardDescription>{t.customersDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button onClick={handleAnalyzeCustomers} disabled={loading || isCustomerLoading} type="button">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {t.analyzeCustomers}
                    </Button>
                </CardContent>
            </Card>
            
            {(isCustomerLoading) && (
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

            {!isCustomerLoading && !error && (
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
                                        <TableCell>{formatCurrency(customer.totalSpent, language)}</TableCell>
                                        <TableCell>{customer.lastPurchase || 'N/A'}</TableCell>
                                        <TableCell>
                                            {customer.segment ? (
                                                <Badge variant={getSegmentVariant(customer.segment)} className={cn(customer.segment === 'high-value' && 'bg-green-600 text-white', 'capitalize')}>
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
            )}
        </div>
    );
}
