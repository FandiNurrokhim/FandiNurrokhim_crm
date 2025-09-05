<?php

use App\Http\Controllers\Admin\DealController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware('check.permission:deal')->group(function () {
    Route::post('/bulk-delete', [DealController::class, 'bulkDelete'])->name('deal.bulk-delete');
    Route::get('/deal/dropdown-data-list', [DealController::class, 'dropdownData'])->name('deal.dropdown');
    Route::post('/deal/{id}/approve', [DealController::class, 'approve'])->name('admin.deal.approve');
    Route::post('/deal/{id}/reject', [DealController::class, 'reject'])->name('admin.deal.reject');
    Route::get('/deal/data', [DealController::class, 'data'])->name('deal.data');
    Route::resource('deal', DealController::class)->names('deal');
});
