<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Generate 50 fake products using the factory
        Product::factory()->count(10)->create();
    }
}
