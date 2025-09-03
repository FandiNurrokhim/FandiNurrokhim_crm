<?php

namespace App\Http\Controllers\Admin;

use App\Models\Food;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Stand;
use App\Models\Partner;
use App\Models\Category;
use App\Models\Ingredient;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard/Index', [
        ]);
    }
}
