<?php

use App\Models\Portfolio;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

Route::get('/', function () {
    return Inertia::render('Home/Index', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');


Route::get('/cek-locale', function () {
    return response()->json([
        'locale' => app()->getLocale(),
        'message' => __('validation.required', ['attribute' => 'email']),
    ]);
});

// Route::get('project/{id}', function ($id) {
//     return Inertia::render('Project/Detail', [
//         'project' => Portfolio::findOrFail($id),
//     ]);
// })->name('project.detail');

Route::middleware(['auth'])->group(function () {
    require __DIR__ . '/route-files/dashboard.php';
    require __DIR__ . '/route-files/user.php';
    require __DIR__ . '/route-files/role.php';
    require __DIR__ . '/route-files/skill.php';
    require __DIR__ . '/route-files/tech.php';
    require __DIR__ . '/route-files/career.php';
    require __DIR__ . '/route-files/education.php';
    require __DIR__ . '/route-files/portfolio.php';
});

require __DIR__ . '/auth.php';
