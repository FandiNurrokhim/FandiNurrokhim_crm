<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DealProduct>
 */
class DealProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'deal_id' => \App\Models\Deal::factory(),
            'product_id' => \App\Models\Product::factory(),
            'negotiated_price' => $this->faker->randomFloat(2, 100000, 1000000),
            'qty' => $this->faker->numberBetween(1, 10),
            'subtotal' => function (array $attributes) {
                return $attributes['qty'] * $attributes['negotiated_price'];
            },
        ];
    }
}
