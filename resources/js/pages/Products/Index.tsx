import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Eye,
    Megaphone,
    Pencil,
    Trash2,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
    low_stock_threshold: number;
    image_path?: string | null;
}

interface Filters {
    search?: string;
    stock_status?: string;
}

interface SortState {
    by: string;
    dir: 'asc' | 'desc';
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ProductsPagination {
    data: Product[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
}

interface PageProps {
    flash: {
        message?: string;
    };
    products: ProductsPagination;
    filters: Filters;
    sort: SortState;
}

interface ProductFormData {
    name: string;
    price: string | number;
    description: string;
    stock: string | number;
    low_stock_threshold: string | number;
    image: File | null;
    _method?: 'PUT';
}

export default function Index() {
    const { products, flash, filters, sort } = usePage().props as PageProps;

    // Form for create/edit
    const {
        data,
        setData,
        post,
        processing: formProcessing,
        errors,
        reset,
        clearErrors,
    } = useForm<ProductFormData>({
        name: '',
        price: '',
        description: '',
        stock: '',
        low_stock_threshold: '',
        image: null,
    });

    // Simple form for delete
    const { delete: destroy, processing: deleteProcessing } = useForm();

    const [search, setSearch] = useState(filters.search ?? '');
    const [stockStatus, setStockStatus] = useState(filters.stock_status ?? '');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;

        destroy(`/products/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteTarget(null);
            },
        });
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        clearErrors();
        setData({
            name: '',
            price: '',
            description: '',
            stock: '',
            low_stock_threshold: '',
            image: null,
        });
        setIsFormOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        reset();
        clearErrors();
        setData({
            name: product.name,
            price: product.price,
            description: product.description ?? '',
            stock: product.stock,
            low_stock_threshold: product.low_stock_threshold,
            image: null, // we don't preload file; user chooses if they want to replace
            _method: 'PUT',
        });
        setIsFormOpen(true);
    };

    const closeFormModal = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingProduct
            ? `/products/${editingProduct.id}`
            : '/products';

        post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                closeFormModal();
            },
        });
    };

    const applyFilters = (e: React.FormEvent) => {
        e.preventDefault();

        router.get(
            '/products',
            {
                search,
                stock_status: stockStatus,
                sort_by: sort.by,
                sort_dir: sort.dir,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setStockStatus('');

        router.get(
            '/products',
            {
                sort_by: sort.by,
                sort_dir: sort.dir,
            },
            {
                preserveState: false,
                replace: true,
            },
        );
    };

    const handleSort = (field: 'name' | 'price' | 'stock') => {
        const nextDir: 'asc' | 'desc' =
            sort.by === field && sort.dir === 'asc' ? 'desc' : 'asc';

        router.get(
            '/products',
            {
                search,
                stock_status: stockStatus,
                sort_by: field,
                sort_dir: nextDir,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const renderSortIcon = (field: 'name' | 'price' | 'stock') => {
        if (sort.by !== field) {
            return <ArrowUpDown className="h-3 w-3" />;
        }

        if (sort.dir === 'asc') {
            return <ArrowUp className="h-3 w-3" />;
        }

        return <ArrowDown className="h-3 w-3" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="m-4 flex flex-col gap-4">
                {/* Header + Create button */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Products</h1>
                    <Button onClick={openCreateModal}>Create Product</Button>
                </div>

                {/* Flash message */}
                {flash.message && (
                    <Alert variant="default">
                        <Megaphone className="h-4 w-4" />
                        <AlertTitle>Notification</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                {/* Filters */}
                <form
                    onSubmit={applyFilters}
                    className="flex flex-wrap items-end gap-3"
                >
                    <div>
                        <Label
                            className="mb-1 block text-sm font-medium"
                            htmlFor="search"
                        >
                            Search
                        </Label>
                        <Input
                            id="search"
                            className="w-56"
                            placeholder="Search by name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label
                            className="mb-1 block text-sm font-medium"
                            htmlFor="stock_status"
                        >
                            Stock Status
                        </Label>
                        <select
                            id="stock_status"
                            className="block w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={stockStatus}
                            onChange={(e) => setStockStatus(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="in">In stock</option>
                            <option value="out">Out of stock</option>
                            <option value="low">Low stock</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" size="sm">
                            Apply
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={resetFilters}
                        >
                            Reset
                        </Button>
                    </div>
                </form>
            </div>

            {/* Products table */}
            {products.data.length > 0 ? (
                <div className="m-4">
                    <Table>
                        <TableCaption>
                            A list of your products with filters, sorting, and
                            pagination.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase"
                                        onClick={() => handleSort('name')}
                                    >
                                        Name
                                        {renderSortIcon('name')}
                                    </button>
                                </TableHead>
                                <TableHead>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase"
                                        onClick={() => handleSort('price')}
                                    >
                                        Price
                                        {renderSortIcon('price')}
                                    </button>
                                </TableHead>
                                <TableHead>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase"
                                        onClick={() => handleSort('stock')}
                                    >
                                        Stock
                                        {renderSortIcon('stock')}
                                    </button>
                                </TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">
                                        {product.id}
                                    </TableCell>

                                    <TableCell>
                                        {product.image_path ? (
                                            <img
                                                src={`/storage/${product.image_path}`}
                                                alt={product.name}
                                                className="h-12 w-12 rounded-md border object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-md border text-[10px] text-muted-foreground">
                                                No image
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell className="max-w-[180px] text-ellipsis">
                                        {product.name}
                                    </TableCell>

                                    <TableCell>
                                        ₱ {product.price.toFixed(2)}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium">
                                                {product.stock}
                                            </span>

                                            {product.stock === 0 ? (
                                                <span className="inline-flex items-center rounded-full bg-red-200 px-2 py-0.5 text-xs font-medium text-red-800">
                                                    Out of stock
                                                </span>
                                            ) : product.stock <=
                                              product.low_stock_threshold ? (
                                                <span className="inline-flex items-center rounded-full bg-orange-200 px-2 py-0.5 text-xs font-medium text-orange-800">
                                                    Low stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-800">
                                                    In stock
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="max-w-[350px] text-ellipsis">
                                        {product.description}
                                    </TableCell>

                                    <TableCell className="space-x-2 text-center">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="inline-flex items-center gap-1"
                                        >
                                            <Link
                                                href={`/products/${product.id}`}
                                            >
                                                <Eye className="h-4 w-4" />
                                                View
                                            </Link>
                                        </Button>
                                        <Button
                                            className="bg-slate-600 hover:bg-slate-700"
                                            onClick={() =>
                                                openEditModal(product)
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Edit
                                        </Button>

                                        <Button
                                            disabled={deleteProcessing}
                                            onClick={() =>
                                                setDeleteTarget(product)
                                            }
                                            className="bg-red-500 hover:bg-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Simple pagination styled like ShadCN */}
                    <div className="mt-6 flex justify-center">
                        <div className="flex items-center space-x-1">
                            {products.links.map((link, i) => {
                                const isActive = link.active;
                                const isDisabled = !link.url;

                                return (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={[
                                            'flex h-9 min-w-[36px] items-center justify-center rounded-md border px-2 text-sm transition-colors',
                                            isActive
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
                                            isDisabled &&
                                                'pointer-events-none opacity-50',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="m-4 text-sm text-muted-foreground">
                    No products found. Try changing your filters or create a new
                    product.
                </div>
            )}

            {/* Create / Edit Modal */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProduct
                                ? `Edit Product #${editingProduct.id}`
                                : 'Create Product'}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Validation errors */}
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-3">
                            <AlertTitle>There were some problems</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc pl-4 text-sm">
                                    {Object.entries(errors).map(
                                        ([key, message]) => (
                                            <li key={key}>
                                                {message as string}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Product name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={data.price}
                                onChange={(e) =>
                                    setData('price', e.target.value)
                                }
                            />
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1 space-y-1.5">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData('stock', e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <Label htmlFor="low_stock_threshold">
                                    Low Stock Threshold
                                </Label>
                                <Input
                                    id="low_stock_threshold"
                                    type="number"
                                    min={0}
                                    placeholder="5"
                                    value={data.low_stock_threshold}
                                    onChange={(e) =>
                                        setData(
                                            'low_stock_threshold',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="image">Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'image',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                            />
                            {editingProduct?.image_path && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Current image will be kept if you don&apos;t
                                    upload a new one.
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Add your product description here..."
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                        </div>

                        <DialogFooter className="mt-4 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeFormModal}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={formProcessing}>
                                {editingProduct ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete this product?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteTarget
                                ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
                                : 'Are you sure you want to delete this product?'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setDeleteTarget(null)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleteProcessing}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
