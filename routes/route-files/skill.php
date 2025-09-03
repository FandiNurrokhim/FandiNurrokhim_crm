<?php

use App\Http\Controllers\MasterData\SkillController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware('check.permission:skill')->group(function () {
    Route::post('/bulk-delete', [SkillController::class, 'bulkDelete'])->name('skill.bulk-delete');
    Route::get('skill/data', [SkillController::class, 'data'])->name('skill.data');
    Route::resource('skill', SkillController::class)->names('skill');
});