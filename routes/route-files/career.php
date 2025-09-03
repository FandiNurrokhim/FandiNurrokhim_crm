<?php

use App\Http\Controllers\MasterData\CareerController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware('check.permission:career')->group(function () {
    Route::post('/bulk-delete', [CareerController::class, 'bulkDelete'])->name('career.bulk-delete');
    Route::get('career/data', [CareerController::class, 'data'])->name('career.data');
    Route::resource('career', CareerController::class)->names('career');
});