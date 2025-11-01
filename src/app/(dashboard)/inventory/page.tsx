'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getInventoryRecommendations, type InventoryRecommendationsOutput } from "@/ai/flows/inventory-recommendations";
import React from "react";
import { mockInventory } from "@/lib/data";
import { Loader2, BellRing, PackageCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InventoryPage() {
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState<InventoryRecommendationsOutput | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const handleGetRecommendations = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await getInventoryRecommendations({ inventoryItems: mockInventory });
            setResult(res);
        } catch (e: any) {
            setError(e.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };
    
    const getProductDetails = (productId: string) => {
        return mockInventory.find(item => item.id === productId);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Management</CardTitle>
                    <CardDescription>Manage your stock levels and get AI-powered reorder recommendations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleGetRecommendations} disabled={loading} type="button">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Get AI Recommendations
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
                                <CardTitle className="flex items-center gap-2">
                                    <PackageCheck /> Reorder Recommendations
                                </CardTitle>
                                <CardDescription>AI suggestions to optimize your stock levels.</CardDescription>
                            </CardHeader>
                             <CardContent>
                                {result.recommendations.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Reorder Quantity</TableHead>
                                                <TableHead>Reason</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {result.recommendations.map((rec) => {
                                                const product = getProductDetails(rec.productId);
                                                return (
                                                    <TableRow key={rec.productId}>
                                                        <TableCell className="font-medium">{product?.productName || rec.productId}</TableCell>
                                                        <TableCell>{rec.reorderQuantity} {product?.unit}</TableCell>
                                                        <TableCell>{rec.reason}</TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-muted-foreground">No reorder recommendations at this time. Stock levels are optimal.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                     <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BellRing /> Low Stock Alerts
                                </CardTitle>
                                <CardDescription>Items that need immediate attention.</CardDescription>
                            </CardHeader>
                            <CardContent>
                               {result.alerts.length > 0 ? (
                                    <ul className="space-y-2 list-disc list-inside text-sm text-destructive font-medium">
                                        {result.alerts.map((alert, index) => (
                                            <li key={index}>{alert}</li>
                                        ))}
                                    </ul>
                               ) : (
                                    <p className="text-muted-foreground">No critical low stock alerts.</p>
                               )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
