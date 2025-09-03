<?php

use App\Http\Controllers\MasterData\EducationController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware('check.permission:education')->group(function () {
    Route::post('/bulk-delete', [EducationController::class, 'bulkDelete'])->name('education.bulk-delete');
    Route::get('education/data', [EducationController::class, 'data'])->name('education.data');
    Route::resource('education', EducationController::class)->names('education');
});