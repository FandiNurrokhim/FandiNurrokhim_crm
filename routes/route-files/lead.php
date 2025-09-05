<?php

use App\Http\Controllers\Admin\LeadController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware('check.permission:lead')->group(function () {
    Route::post('/bulk-delete', [LeadController::class, 'bulkDelete'])->name('lead.bulk-delete');
    Route::get('/lead/data', [LeadController::class, 'data'])->name('lead.data');
    Route::resource('lead', LeadController::class)->names('lead');
});