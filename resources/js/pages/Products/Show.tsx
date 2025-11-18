import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
    low_stock_threshold: number;
    image_path?: string | null;
}

interface Props {
    product: Product;
}

const getImageSrc = (path?: string | null) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `/storage/${path}`;
};

export default function Show({ product }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Products', href: '/products' },
        { title: product.name, href: `/products/${product.id}` },
    ];

    const src = getImageSrc(product.image_path);
    const isOut = product.stock === 0;
    const isLow =
        product.stock > 0 && product.stock <= product.low_stock_threshold;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />

            <div className="m-4 flex flex-col gap-4 lg:m-8">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {product.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Detailed information about this product.
                        </p>
                    </div>

                    <Button asChild variant="outline" size="sm">
                        <Link href="/products">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Products
                        </Link>
                    </Button>
                </div>

                <Card className="grid gap-6 p-6 md:grid-cols-[220px,1fr]">
                    {/* Image */}
                    <div className="flex flex-col items-center gap-3">
                        {src ? (
                            <img
                                src={src}
                                alt={product.name}
                                className="h-40 w-40 rounded-lg border object-cover"
                            />
                        ) : (
                            <div className="flex h-40 w-40 items-center justify-center rounded-lg border text-xs text-muted-foreground">
                                No image
                            </div>
                        )}

                        <Badge variant="outline" className="text-xs">
                            ID: {product.id}
                        </Badge>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xl font-semibold">
                                ₱ {product.price.toFixed(2)}
                            </span>

                            {isOut ? (
                                <Badge className="flex items-center gap-1 bg-red-500 text-xs font-medium text-white hover:bg-red-600">
                                    <AlertTriangle className="h-3 w-3" />
                                    Out of stock
                                </Badge>
                            ) : isLow ? (
                                <Badge className="flex items-center gap-1 bg-orange-500 text-xs font-medium text-white hover:bg-orange-600">
                                    <AlertTriangle className="h-3 w-3" />
                                    Low stock
                                </Badge>
                            ) : (
                                <Badge className="flex items-center gap-1 bg-emerald-500 text-xs font-medium text-white hover:bg-emerald-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    In stock
                                </Badge>
                            )}
                        </div>

                        <div className="grid gap-3 text-sm md:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Current Stock
                                </p>
                                <p className="text-base font-semibold">
                                    {product.stock}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Low Stock Threshold
                                </p>
                                <p className="text-base font-semibold">
                                    {product.low_stock_threshold}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                Description
                            </p>
                            <p className="text-sm leading-relaxed">
                                {product.description ||
                                    'No description provided.'}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
