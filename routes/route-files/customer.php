<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CustomerController;

Route::prefix('admin')->name('admin.')->middleware('check.permission:customer')->group(function () {
    Route::get('/customer', [CustomerController::class, 'index'])->name('customer.index');
    Route::get('customer/data', [CustomerController::class, 'data'])->name('customer.data');
});

