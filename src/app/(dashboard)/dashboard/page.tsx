
'use client';
import { DollarSign, Package, Users, CreditCard } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { RecentSales } from '@/components/dashboard/recent-sales'
import { InventoryAlerts } from '@/components/dashboard/inventory-alerts'
import { useLanguage, strings } from '@/context/language-context';
import React from 'react';
import { getSales, getCustomers, getInventory } from '@/lib/sheets';
import { SalesRecord, Customer, InventoryItem } from '@/types';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { language } = useLanguage();
  const t = strings[language];
  const [loading, setLoading] = React.useState(true);
  const [sales, setSales] = React.useState<SalesRecord[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
        try {
            setLoading(true);
            const [salesData, customerData, inventoryData] = await Promise.all([
                getSales(),
                getCustomers(),
                getInventory(),
            ]);
            setSales(salesData);
            setCustomers(customerData);
            setInventory(inventoryData);
        } catch (err: any) {
            setError(err.message || 'Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);

  const totalRevenue = React.useMemo(() => sales.reduce((acc, sale) => acc + sale.totalAmount, 0), [sales]);
  const stockValue = React.useMemo(() => inventory.reduce((acc, item) => acc + (item.currentStock * item.costPrice), 0), [inventory]);
  const pendingPayments = React.useMemo(() => sales.filter(s => s.paymentStatus === 'pending').reduce((acc, sale) => acc + sale.totalAmount, 0), [sales]);


  if (loading) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-160px)]">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  if (error) {
    return <div className="text-destructive-foreground bg-destructive p-4 rounded-md">{error}</div>
  }


  return (
    <div className="flex flex-col gap-4 md:gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title={t.totalRevenue}
                value={`৳${totalRevenue.toLocaleString()}`}
                description={t.totalRevenueDescription}
                Icon={DollarSign}
            />
            <StatCard 
                title={t.activeCustomers}
                value={`+${customers.length}`}
                description={t.activeCustomersDescription}
                Icon={Users}
            />
            <StatCard 
                title={t.stockValue}
                value={`৳${stockValue.toLocaleString()}`}
                description={t.stockValueDescription}
                Icon={Package}
            />
            <StatCard 
                title={t.pendingPayments}
                value={`৳${pendingPayments.toLocaleString()}`}
                description={t.pendingPaymentsDescription}
                Icon={CreditCard}
            />
        </div>
        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            <RecentSales sales={sales.slice(0,5)} />
            <InventoryAlerts inventory={inventory} />
        </div>
    </div>
  )
}
