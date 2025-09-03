<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $users = json_decode(File::get(database_path('seeders/data/Users.json')), true);
        $index = 1;

        foreach ($users as $user) {
            $user = User::create([
                'id' => $index++,
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make($user['password']),
            ]);

            $user->assignRole('User');
        }
    }
}
