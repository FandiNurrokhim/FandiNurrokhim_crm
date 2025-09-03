<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $hpp = $this->faker->numberBetween(100000, 500000);
        $margin = $this->faker->randomFloat(2, 10, 30);
        $sellPrice = $hpp + ($hpp * $margin / 100);

        return [
            'name' => 'Paket Internet ' . $this->faker->randomElement([20, 50, 100, 200]) . 'Mbps ' . $this->faker->unique()->numerify('##'),
            'hpp' => $hpp,
            'margin_percent' => $margin,
            'sell_price' => $sellPrice,
            'is_active' => true,
        ];
    }
}
