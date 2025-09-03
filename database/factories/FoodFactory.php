<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Food>
 */
class FoodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word() . ' Dish',
            'category' => $this->faker->randomElement(['Chinese', 'Italian', 'Indonesian', 'Japanese', 'Mexican']),
            'ingredients' => implode(', ', $this->faker->randomElements(
                ['chicken', 'beef', 'rice', 'noodle', 'tomato', 'cheese', 'lettuce', 'onion', 'pepper', 'garlic'],
                rand(3, 5)
            )),
            'image' => $this->faker->imageUrl(200, 200, 'food'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
