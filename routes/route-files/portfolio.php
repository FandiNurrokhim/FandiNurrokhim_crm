<?php

use App\Http\Controllers\MasterData\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware('check.permission:portfolio')->group(function () {
    Route::post('/bulk-delete', [PortfolioController::class, 'bulkDelete'])->name('portfolio.bulk-delete');
    Route::get('portfolio/data', [PortfolioController::class, 'data'])->name('portfolio.data');
     Route::resource('portfolio', PortfolioController::class)->names('portfolio');
});