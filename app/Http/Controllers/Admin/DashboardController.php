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
        $partnerCount = Partner::count();
        $userCount = User::count();
        $foodCount = Food::count();
        $categoryCount = Category::count();
        $ingredientCount = Ingredient::count();
        $standCount = Stand::count();
        
        return Inertia::render('Admin/Dashboard/Index', [
            'partnerCount' => $partnerCount,
            'userCount' => $userCount,
            'foodCount' => $foodCount,
            'categoryCount' => $categoryCount,
            'ingredientCount' => $ingredientCount,
            'standCount' => $standCount,
        ]);
    }

    public function data(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('pageIndex');
        $sortBy = $request->input('sortBy', []);
        $search = $request->input('search');

        $query = Partner::query();

        // Apply filters
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name_id', 'LIKE', "%{$search}%")
                    ->orWhere('name', 'LIKE', "%{$search}%");
            });
        }

        // Apply sorting
        if (!empty($sortBy)) {
            foreach ($sortBy as $sort) {
                $query->orderBy($sort['id'], $sort['desc'] ? 'desc' : 'asc');
            }
        } else {
            $query->orderBy('updated_at', 'desc');
        }

        // Paginate with limit
        $categories = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            DB::beginTransaction();
            if ($request->hasFile('image')) {
                $filePath = $this->uploadFile("uploads", $validator['image'], 'partners/' . $validator['name']);
            }

            Partner::create([
                'name' => $validator['name'],
                'image' => $filePath ?? null,
            ]);

            DB::commit();

            return to_route('admin.dashboard.index')->with('success', 'Partner created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Failed to create partner: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function edit($id)
    {
        try {
            $category = Partner::findOrFail($id);
            return ApiResponse::success($category, 'Successfully retrieved category data.');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve category data.', 404);
        }
    }

    public function update($id, Request $request)
    {
        $category = Partner::findOrFail($id);
        $validator = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable:image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();
        try {
            if ($request->hasFile('image')) {
                $filePath = $this->updateFile(
                    "uploads",
                    $validator['image'] ?? null,
                    $category->image,
                    'partners/' . $validator['name']
                );
            }

            // Validasi: jika ingin nonaktifkan, cek relasi
            if (
                $category->is_active &&
                !$validator['is_active'] &&
                ($category->foods()->exists() || $category->userPreferences()->exists())
            ) {
                DB::rollBack();
                // Kirim error multibahasa ke frontend via withErrors
                return back()->withErrors([
                    'message' => json_encode([
                        'id' => 'Kategori sedang digunakan pada makanan atau preferensi pengguna.',
                        'en' => 'Partner is used in food or user preferences.',
                    ])
                ]);
            }

            $category->update([
                'name' => $validator['name'],
                'image' => $filePath ?? $category->image,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Partner updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update category: ' . $e->getMessage()]);
        }
    }

    /**
     * Bulk delete Categories.
     */
    public function bulkDelete(Request $request)
    {
        DB::beginTransaction();
        $ids = $request->input('ids');

        if (!$ids || !is_array($ids)) {
            return ApiResponse::error('Data yang diberikan tidak valid.', 400);
        }

        try {
            Partner::whereIn('id', $ids)->delete();

            DB::commit();
            return ApiResponse::success(null, 'Kategori berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Gagal menghapus kategori: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            DB::beginTransaction();

            Partner::findOrFail($id)->delete();

            DB::commit();

            return ApiResponse::success(null, 'Partner deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return ApiResponse::error('Failed to delete category: ' . $e->getMessage());
        }
    }
}
