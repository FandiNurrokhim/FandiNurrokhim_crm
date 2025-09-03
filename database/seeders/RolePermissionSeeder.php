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
            'customer',
            'approval',
            'customer_service',
            'product',
            'deal_product',
            'deal',
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
            'deal_product',
            'customer',
            'customer_service',
            'product',
            'approval',
        ]);

        // Sales permissions
        $salesRole->syncPermissions([
            'dashboard',
            'lead',
            'deal',
            'deal_product',
            'customer',
            'customer_service',
            'product',
        ]);

        // Buat Super Admin user
        $admin = User::factory()->create([
            'id' => 900,
            'name' => 'Super Admin',
            'email' => 'admin@superadmin.com',
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole('Super Admin');
    }
}
