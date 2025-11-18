<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // 🔎 Search by name
        if ($search = $request->input('search')) {
            $query->where('name', 'like', '%'.$search.'%');
        }

        // 📦 Filter by stock status
        if ($stockStatus = $request->input('stock_status')) {
        // Out of stock = exactly 0
        if ($stockStatus === 'out') {
            $query->where('stock', '=', 0);
        }

        // Low stock = between 1 and threshold
        elseif ($stockStatus === 'low') {
            $query->where('stock', '>', 0) // exclude out of stock
                ->whereColumn('stock', '<=', 'low_stock_threshold');
        }

        // In stock = above threshold
        elseif ($stockStatus === 'in') {
            $query->whereColumn('stock', '>', 'low_stock_threshold');
        }
        }
            $sortBy = $request->input('sort_by', 'name');
            $sortDir = $request->input('sort_dir', 'asc');

            // allow only safe sortable fields
        $allowedSorts = ['name', 'price', 'stock'];

        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'name';
        }

        if (! in_array($sortDir, ['asc', 'desc'])) {
            $sortDir = 'asc';
        }

        $query->orderBy($sortBy, $sortDir);
        
        // $products = $query->orderBy('name')->get();
        $products = $query->paginate(10)->withQueryString();
        
        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters'  => $request->only('search', 'stock_status'),
            'sort'     => [
            'by'  => $sortBy,
            'dir' => $sortDir,
        ],
        ]);
    }
    
    public function create(){
        return Inertia::render('Products/Create');
    }
    public function store(Request $request){
        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'price'               => 'required|numeric',
            'description'         => 'nullable|string',
            'stock'               => 'required|integer|min:0',
            'low_stock_threshold' => 'required|integer|min:0',
            'image'               => 'nullable|image|max:2048', 
        ]);
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            // stored like: storage/app/public/products/xxxx.jpg
        }
        Product::create([
            'name'                => $validated['name'],
            'price'               => $validated['price'],
            'description'         => $validated['description'] ?? null,
            'stock'               => $validated['stock'],
            'low_stock_threshold' => $validated['low_stock_threshold'],
            'image_path'          => $imagePath,
        ]);

        return redirect()
            ->route('products.index')
            ->with('message', 'Product created successfully!');
    }
    public function edit(Product $product){
        return Inertia::render('Products/Edit', compact('product'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'price'               => 'required|numeric',
            'description'         => 'nullable|string',
            'stock'               => 'required|integer|min:0',
            'low_stock_threshold' => 'required|integer|min:0',
            'image'               => 'nullable|image|max:2048',
        ]);
        $imagePath = $product->image_path; // keep existing by default

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            // (later we can delete the old image if you want)
        }
        // $product->update($validated);
        $product->update([
            'name'                => $validated['name'],
            'price'               => $validated['price'],
            'description'         => $validated['description'] ?? null,
            'stock'               => $validated['stock'],
            'low_stock_threshold' => $validated['low_stock_threshold'],
            'image_path'          => $imagePath,
        ]);

        return redirect()
            ->route('products.index')
            ->with('message', 'Product updated successfully!');
    }
    public function destroy(Product $product){
        $product->delete();
        return redirect()->route('products.index')->with('message', 'Product deleted successfully!');
    }
    public function show(Product $product)
    {
        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
