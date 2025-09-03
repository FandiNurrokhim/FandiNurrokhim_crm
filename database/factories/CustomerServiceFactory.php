<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CustomerService>
 */
class CustomerServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = Product::factory()->create();
        return [
            'customer_id' => Customer::factory(),
            'product_id' => $product->id,
            'price_per_period' => $product->sell_price,
            'started_at' => $this->faker->date(),
            'ended_at' => null,
            'is_active' => true,
        ];
    }
}
