<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        // Real products with matching image URLs
        $products = [
            [
                'name' => 'Fresh Red Apple',
                'image' => 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
                'category_id' => 1,
            ],
            [
                'name' => 'Ripe Bananas',
                'image' => 'https://images.unsplash.com/photo-1574226516831-e1dff420e12e',
                'category_id' => 1,
            ],
            [
                'name' => 'Fresh Broccoli',
                'image' => 'https://images.unsplash.com/photo-1584305574644-4f1d2c51f3c3',
                'category_id' => 2,
            ],
            [
                'name' => 'Coca-Cola 1.5L',
                'image' => 'https://images.unsplash.com/photo-1580913116721-3b1975a7e16e',
                'category_id' => 3,
            ],
            [
                'name' => 'Oreo Cookies',
                'image' => 'https://images.unsplash.com/photo-1580910051070-dc4c1e746b20',
                'category_id' => 4,
            ],
            [
                'name' => 'Dishwashing Liquid',
                'image' => 'https://images.unsplash.com/photo-1615475118193-3b33f984f90b',
                'category_id' => 5,
            ],
            [
                'name' => 'Hydrating Shampoo',
                'image' => 'https://images.unsplash.com/photo-1600180758890-6b94519a0c07',
                'category_id' => 5,
            ],
            [
                'name' => 'Instant Coffee',
                'image' => 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0',
                'category_id' => 6,
            ],
            [
                'name' => 'Classic Bread Loaf',
                'image' => 'https://images.unsplash.com/photo-1511385348-a52de1c948fe',
                'category_id' => 7,
            ],
            [
                'name' => 'Bathroom Tissue Roll',
                'image' => 'https://images.unsplash.com/photo-1584551883459-7d5cbe0f1f8d',
                'category_id' => 8,
            ],
        ];

        // Pick a random product
        $product = $this->faker->randomElement($products);

        return [
            'name' => $product['name'],
            'price' => $this->faker->randomFloat(2, 10, 500),
            'description' => $this->faker->sentence(),
            'stock' => $this->faker->numberBetween(0, 50),
            'low_stock_threshold' => $this->faker->numberBetween(3, 10),
            'image_path' => $product['image'],

            // For now, don't link to categories
            'category_id' => null,
        ];
    }

}
