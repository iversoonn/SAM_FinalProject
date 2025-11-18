<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Models\Product;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $totalProducts = Product::count();

        $outOfStock = Product::where('stock', 0)->count();

        $lowStock = Product::where('stock', '>', 0)
            ->whereColumn('stock', '<=', 'low_stock_threshold')
            ->count();

        $inStock = Product::whereColumn('stock', '>', 'low_stock_threshold')->count();

        // 🟡 Recent low-stock items
        $lowStockItems = Product::where('stock', '>', 0)
            ->whereColumn('stock', '<=', 'low_stock_threshold')
            ->orderBy('stock')
            ->limit(6)
            ->get(['id', 'name', 'stock', 'low_stock_threshold', 'image_path']);


        return Inertia::render('dashboard', [
            'stats' => [
                'total_products' => $totalProducts,
                'in_stock'       => $inStock,
                'low_stock'      => $lowStock,
                'out_of_stock'   => $outOfStock,
            ],
            'lowStockItems' => $lowStockItems,
        ]);
    })->name('dashboard');
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/create', [ProductController::class, "create"])->name('products.create');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::get('/products/{product}/edit', [ProductController::class, "edit"])->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, "update"])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, "destroy"])->name('products.destroy');
});

require __DIR__.'/settings.php';
