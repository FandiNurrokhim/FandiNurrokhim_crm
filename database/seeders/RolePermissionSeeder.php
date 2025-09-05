<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Roles
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $managerRole = Role::firstOrCreate(['name' => 'Manager']);
        $salesRole   = Role::firstOrCreate(['name' => 'Sales']);
        Role::firstOrCreate(['name' => 'User']);

        // Permissions
        $permissions = [
            // GENERAL
            'dashboard',
            'role',
            'user',

            // MASTER DATA
            'lead',
            'deal',
            'customer',
            'product',
            'report',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // Super Admin dapat semua
        $superAdmin->syncPermissions($permissions);

        // Manager permissions
        $managerRole->syncPermissions([
            'dashboard',
            'lead',
            'deal',
            'customer',
            'product',
            'report',
        ]);

        // Sales permissions
        $salesRole->syncPermissions([
            'dashboard',
            'lead',
            'deal',
            'customer',
            'product',
            'report',
        ]);

        // Buat Super Admin user
        $admin = User::factory()->create([
            'id' => 900,
            'name' => 'Super Admin',
            'email' => 'admin@demo.com',
            'password' => bcrypt('password'),
        ]);
        $manager = User::factory()->create([
            'id' => 901,
            'name' => 'Manager',
            'email' => 'manager@demo.com',
            'password' => bcrypt('password'),
        ]);
        $sales = User::factory()->create([
            'id' => 902,
            'name' => 'Sales',
            'email' => 'sales@demo.com',
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole('Super Admin');
        $manager->assignRole('Manager');
        $sales->assignRole('Sales');
    }
}
