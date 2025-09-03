    <?php

     use Illuminate\Support\Facades\Route;
     use App\Http\Controllers\UserController;

     Route::prefix('admin')->name('admin.')->middleware('check.permission:user')->group(function () {
          Route::post('/user/bulk-delete', [UserController::class, 'bulkDelete'])->name('user.bulk-delete');
          Route::get('/user/data', [UserController::class, 'data'])->name('user.data');
          Route::resource('user', UserController::class)->names('user');
     });
