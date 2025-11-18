import { LowStockGrid, type LowStockItem } from '@/components/LowStockGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, CircleOff, Package } from 'lucide-react';

interface Stats {
    total_products: number;
    in_stock: number;
    low_stock: number;
    out_of_stock: number;
}

interface PageProps {
    stats: Stats;
}
interface LowStockItem {
    id: number;
    name: string;
    stock: number;
    low_stock_threshold: number;
}

interface PageProps {
    stats: Stats;
    lowStockItems: LowStockItem[];
}

export default function Dashboard() {
    const { stats, lowStockItems } = usePage().props as PageProps;

    const cards = [
        {
            title: 'Total Products',
            value: stats.total_products,
            icon: Package,
            description: 'All products currently in the system.',
            color: 'bg-slate-50',
        },
        {
            title: 'In Stock',
            value: stats.in_stock,
            icon: CheckCircle2,
            description: 'Items with healthy stock levels.',
            color: 'bg-emerald-50',
        },
        {
            title: 'Low Stock',
            value: stats.low_stock,
            icon: AlertTriangle,
            description: 'Items that need restocking soon.',
            color: 'bg-amber-50',
        },
        {
            title: 'Out of Stock',
            value: stats.out_of_stock,
            icon: CircleOff,
            description: 'Items that are fully unavailable.',
            color: 'bg-red-50',
        },
    ];

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Dashboard',
                    href: '/dashboard',
                },
            ]}
        >
            <Head title="Dashboard" />

            <div className="m-4 space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Inventory Overview
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Quick summary of your product inventory status.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Card
                                key={card.title}
                                className="border border-slate-200 shadow-sm"
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {card.title}
                                    </CardTitle>
                                    <span
                                        className={`flex h-9 w-9 items-center justify-center rounded-full ${card.color}`}
                                    >
                                        <Icon className="h-5 w-5 text-slate-700" />
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {card.value}
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {card.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <div className="m-4 mt-8">
                    <h2 className="mb-2 text-lg font-semibold">
                        Low Stock Items
                    </h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        These products are running low and may need restocking.
                    </p>

                    <LowStockGrid items={lowStockItems as LowStockItem[]} />
                </div>
            </div>
        </AppLayout>
    );
}
