
'use client';
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useLanguage, strings } from "@/context/language-context";
import { SalesRecord } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { User } from "lucide-react";

interface RecentSalesProps {
    sales: SalesRecord[];
}

export function RecentSales({ sales }: RecentSalesProps) {
    const { language } = useLanguage();
    const t = strings[language];
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.recentSales}</CardTitle>
                <CardDescription>{t.recentSalesDescription(sales.length)}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {sales.map((sale) => (
                        <div className="flex items-center" key={sale.id}>
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{sale.customerName}</p>
                                <p className="text-sm text-muted-foreground">{sale.productName}</p>
                            </div>
                            <div className="ml-auto font-medium">+{formatCurrency(sale.totalAmount, language)}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
