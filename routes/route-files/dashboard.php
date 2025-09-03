<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;

Route::prefix('admin')->name('admin.')->middleware('check.permission:dashboard')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::post('/bulk-delete', [DashboardController::class, 'bulkDelete'])->name('partner.bulk-delete');
    Route::get('partner/data', [DashboardController::class, 'data'])->name('partner.data');
    Route::resource('partner', DashboardController::class)->names('partner');
});
