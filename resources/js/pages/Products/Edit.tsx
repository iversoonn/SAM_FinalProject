import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { TriangleAlert } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
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
export default function Edit({ product }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name ?? '',
        price: product.price ?? 0,
        description: product.description ?? '',
        stock: product.stock ?? 0,
        low_stock_threshold: product.low_stock_threshold ?? 5,
        image: null as File | null, // new image (optional)
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/products/${product.id}`, {
            forceFormData: true, // important for file uploads
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Edit Product',
                    href: `/products/${product.id}/edit`,
                },
            ]}
        >
            <Head title="Update Product" />
            <div className="w-full max-w-2xl p-4">
                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* Validation errors */}
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <TriangleAlert className="h-4 w-4" />
                            <AlertTitle>Errors</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc pl-5">
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

                    {/* Current image preview */}
                    <div className="space-y-1.5">
                        <Label>Current Image</Label>
                        {product.image_path ? (
                            <img
                                src={getImageSrc(product.image_path)}
                                alt={product.name}
                                className="h-24 w-24 rounded-md border object-cover"
                            />
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                No image uploaded.
                            </p>
                        )}
                    </div>

                    {/* Change image */}
                    <div className="space-y-1.5">
                        <Label htmlFor="image">Change Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData('image', e.target.files?.[0] ?? null)
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            Leave this empty to keep the current image.
                        </p>
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Product Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>

                    {/* Price */}
                    <div className="space-y-1.5">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                        />
                    </div>

                    {/* Stock */}
                    <div className="space-y-1.5">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                            id="stock"
                            type="number"
                            min={0}
                            placeholder="Current stock"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                        />
                    </div>

                    {/* Low stock threshold */}
                    <div className="space-y-1.5">
                        <Label htmlFor="low_stock_threshold">
                            Low Stock Threshold
                        </Label>
                        <Input
                            id="low_stock_threshold"
                            type="number"
                            min={0}
                            placeholder="Alert when stock is at or below..."
                            value={data.low_stock_threshold}
                            onChange={(e) =>
                                setData('low_stock_threshold', e.target.value)
                            }
                        />
                    </div>

                    {/* Description */}
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

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Updating...' : 'Update Product'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
