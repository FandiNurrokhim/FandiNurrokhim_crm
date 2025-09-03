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
                'owner_id' => $this->faker->randomNumber(),
                'lead_id' => $this->faker->randomNumber(),
                'customer_id' => $this->faker->randomNumber(),
                'title' => $this->faker->sentence(3),
                'status' => $this->faker->randomElement(['waiting_approval', 'approved', 'rejected']),
                'total_amount' => $this->faker->randomFloat(2, 100000, 1000000),
                'notes' => $this->faker->optional()->text(100),
            ];
    }
}
