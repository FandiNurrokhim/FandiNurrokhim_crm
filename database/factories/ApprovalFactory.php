<?php

namespace Database\Factories;

use App\Models\Deal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Approval>
 */
class ApprovalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Ambil user manager dari database
        $manager = User::role('Manager')->inRandomOrder()->first();

        return [
            'deal_id' => Deal::factory(),
            'approved_by' => $manager ? $manager->id : User::factory(),
            'status' => 'waiting_approval',
            'reason' => $this->faker->sentence(),
            'decided_at' => now(),
        ];
    }
}
