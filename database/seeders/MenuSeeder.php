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
            'title_id' => 'Beranda',
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
            'type' => 'HEADER',
            'title_id' => 'Data Master',
            'title_en' => 'Master Data'
        ]);

        Menu::create([
            'type' => 'PARENT',
            'header' => 'Master Data',
            'title_id' => 'Portofolio',
            'title_en' => 'Portfolio',
            'icon' => 'fa-solid fa-box',
            'route' => 'admin.portfolio.index'
        ]);
        Menu::create([
            'type' => 'PARENT',
            'header' => 'Master Data',
            'title_id' => 'Skills',
            'title_en' => 'Skills',
            'icon' => 'fa-solid fa-store',
            'route' => 'admin.skills.index'
        ]);
        Menu::create([
            'type' => 'PARENT',
            'header' => 'Master Data',
            'title_id' => 'Teknologi Pengembangan',
            'title_en' => 'Tech Used',
            'icon' => 'fa-solid fa-store',
            'route' => 'admin.tech.index'
        ]);
        Menu::create([
            'type' => 'PARENT',
            'header' => 'Master Data',
            'title_id' => 'Pendidikan',
            'title_en' => 'Education',
            'icon' => 'fa-solid fa-graduation-cap',
            'route' => 'admin.education.index'
        ]);
        Menu::create([
            'type' => 'PARENT',
            'header' => 'Master Data',
            'title_id' => 'Karir',
            'title_en' => 'Career',
            'icon' => 'fa-solid fa-carrot',
            'route' => 'admin.career.index'
        ]);
    }
}
