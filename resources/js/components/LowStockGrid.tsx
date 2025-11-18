import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export interface LowStockItem {
    id: number;
    name: string;
    stock: number;
    low_stock_threshold: number;
    image_path?: string | null;
}

interface LowStockGridProps {
    items: LowStockItem[];
}

const getImageSrc = (path?: string | null) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `/storage/${path}`;
};

export function LowStockGrid({ items }: LowStockGridProps) {
    if (items.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No low-stock items found.
            </p>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
                const src = getImageSrc(item.image_path);
                const isOut = item.stock === 0;
                const isLow =
                    item.stock > 0 && item.stock <= item.low_stock_threshold;

                return (
                    <Card
                        key={item.id}
                        className="flex items-center gap-4 border border-border/70 bg-background/60 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        {/* Image */}
                        {src ? (
                            <img
                                src={src}
                                alt={item.name}
                                className="h-50 w-50 flex-shrink-0 rounded-md border object-cover"
                            />
                        ) : (
                            <div className="flex h-50 w-50 flex-shrink-0 items-center justify-center rounded-md border text-[10px] text-muted-foreground">
                                No image
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex flex-1 flex-col gap-1">
                            <div className="flex items-start justify-between gap-2">
                                <p className="line-clamp-2 text-sm font-medium">
                                    {item.name}
                                </p>

                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                        isOut
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                    }`}
                                >
                                    <AlertTriangle className="mr-1 h-3 w-3" />
                                    {isOut ? 'Out of stock' : 'Low stock'}
                                </span>
                            </div>

                            <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                                <span>
                                    Stock:{' '}
                                    <span className="font-semibold text-foreground">
                                        {item.stock}
                                    </span>
                                </span>
                                <span>
                                    Threshold:{' '}
                                    <span className="font-semibold text-foreground">
                                        {item.low_stock_threshold}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
