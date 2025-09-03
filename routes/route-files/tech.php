<?php

use App\Http\Controllers\MasterData\TechUsedController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware('check.permission:tech_used')->group(function () {
    Route::post('/bulk-delete', [TechUsedController::class, 'bulkDelete'])->name('tech_used.bulk-delete');
    Route::get('tech-used/data', [TechUsedController::class, 'data'])->name('tech_used.data');
    Route::resource('tech-used', TechUsedController::class)->names('tech_used');
});