<?php

namespace Database\Factories;

use App\Models\Lead;
use App\Models\User;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Deal>
 */
class DealFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'owner_id' => User::factory(),
            'lead_id' => Lead::factory(),
            'customer_id' => Customer::factory(),
            'title' => $this->faker->catchPhrase(),
            'status' => $this->faker->randomElement(['waiting_approval', 'approved', 'rejected']),
            'total_amount' => 0,
            'notes' => $this->faker->sentence(),
        ];
    }
}
