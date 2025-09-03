<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Ingredient;
use App\Models\UserPreference;
use Illuminate\Database\Seeder;

class UserPreferenceSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();
        $categories = Category::all()->pluck('id')->toArray();
        $ingredients = Ingredient::all()->pluck('id')->toArray();

        foreach ($users as $user) {
            $selectedCategories = array_rand(array_flip($categories), rand(2, 4));

            foreach ((array) $selectedCategories as $category) {
                $selectedIngredients = array_rand(array_flip($ingredients), rand(5, 8));

                foreach ((array) $selectedIngredients as $ingredient) {
                    UserPreference::create([
                        'user_id'       => $user->id,
                        'category_id'   => $category,
                        'ingredient_id' => $ingredient,
                    ]);
                }
            }
        }
    }
}
