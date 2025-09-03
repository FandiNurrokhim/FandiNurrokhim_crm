<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Ingredient;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Roles
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        Role::firstOrCreate(['name' => 'User']);

        $permissions = [
            // GENERAL
            'dashboard',
            'role',
            'user',

            // MASTER DATA
            'portfolio',
            'skill',
            'career',
            'education',
            'tech_used',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        $superAdmin->syncPermissions($permissions);

        $admin = User::factory()->create([
            'id' => 900,
            'name' => 'Super Admin',
            'email' => 'admin@superadmin.com',
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole('Super Admin');
    }
}
