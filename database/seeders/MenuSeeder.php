<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;

class MenuSeeder extends Seeder
{
    public function run()
    {
        Menu::create([
            'type' => 'PARENT',
            'title_id' => 'Dasbor',
            'title_en' => 'Dashboard',
            'icon' => 'fa-solid fa-house',
            'route' => 'admin.dashboard.index'
        ]);

        Menu::create([
            'type' => 'HEADER',
            'title_id' => 'Manajemen Pengguna',
            'title_en' => 'User Management'
        ]);

        Menu::create([
            'type' => 'PARENT',
            'header' => 'User Management',
            'title_id' => 'Pengguna',
            'title_en' => 'Users',
            'icon' => 'fa-solid fa-users',
            'route' => 'admin.user.index'
        ]);

        Menu::create([
            'type' => 'PARENT',
            'header' => 'User Management',
            'title_id' => 'Peran',
            'title_en' => 'Roles',
            'icon' => 'fa-solid fa-user-shield',
            'route' => 'admin.role.index'
        ]);


        Menu::create([
            'type' => 'PARENT',
            'title_id' => 'Leads',
            'title_en' => 'Leads',
            'icon' => 'fa-solid fa-user-plus',
            'route' => 'admin.lead.index'
        ]);

        // Master Produk
        Menu::create([
            'type' => 'PARENT',
            'title_id' => 'Produk',
            'title_en' => 'Products',
            'icon' => 'fa-solid fa-box',
            'route' => 'admin.product.index'
        ]);

        // Project / Deal Pipeline
        Menu::create([
            'type' => 'PARENT',
            'title_id' => 'Proyek / Deal',
            'title_en' => 'Deal Pipeline',
            'icon' => 'fa-solid fa-diagram-project',
            'route' => 'admin.deal.index'
        ]);

        // Customer Aktif
        Menu::create([
            'type' => 'PARENT',
            'title_id' => 'Customer Aktif',
            'title_en' => 'Active Customers',
            'icon' => 'fa-solid fa-users',
            'route' => 'admin.customer.index'
        ]);

        // Reporting
        Menu::create([
            'type' => 'PARENT',
            'title_id' => 'Laporan',
            'title_en' => 'Reporting',
            'icon' => 'fa-solid fa-chart-line',
            'route' => 'admin.report.index'
        ]);
    }
}
