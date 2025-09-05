<?php

use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware('check.permission:product')->group(function () {
    Route::post('/bulk-delete', [ProductController::class, 'bulkDelete'])->name('product.bulk-delete');
    Route::get('/product/data', [ProductController::class, 'data'])->name('product.data');
    Route::resource('product', ProductController::class)->names('product');
});