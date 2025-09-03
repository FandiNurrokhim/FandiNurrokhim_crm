<?php

namespace App\Http\Controllers\MasterData;

use App\Models\Food;
use Inertia\Inertia;
use App\Models\Stand;
use App\Models\Review;
use App\Models\Category;
use App\Models\Ingredient;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\ManualRecommendation;
use App\Models\Portfolio;

class PortfolioController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Master-Data/Portfolio/Index');
    }

    public function data(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('pageIndex');
        $sortBy = $request->input('sortBy', []);
        $search = $request->input('search');
        $filters = $request->input('filter', []);

        $query = Portfolio::with(['techUsed:name']);

        if (!empty($filters)) {
            foreach ($filters as $key => $value) {
                if ($value === 'true') {
                    $value = true;
                } elseif ($value === 'false') {
                    $value = false;
                }
                $query->where($key, $value);
            }
        }
        // Apply filters
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('description_en', 'LIKE', "%{$search}%")
                    ->orWhere('description_id', 'LIKE', "%{$search}%")
                    ->orWhereHas('techUsed', function ($q3) use ($search) {
                        $q3->where('name', 'LIKE', "%{$search}%");
                    });
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
        $users = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($users);
    }


    public function store(Request $request)
    {
        $validator = $request->validate([
            'name' => 'required|string|max:255',
            'description_id' => 'required|string',
            'description_en' => 'required|string',
            'tech_used' => 'array',
            'tech_used.*' => 'exists:tech_used,id',
            'images' => 'array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
        ]);
    
        try {
            DB::beginTransaction();
    
            $folder = 'portfolios/' . $validator['name'];
            $imagePaths = [];
    
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imagePaths[] = $this->uploadFile("uploads", $image, $folder);
                }
            }
    
            $portfolio = Portfolio::create([
                'name' => $validator['name'],
                'description_id' => $validator['description_id'],
                'description_en' => $validator['description_en'],
                'is_active' => $validator['is_active'] ?? true,
            ]);
    
            // Relasi techUsed (many to many)
            if ($request->has('tech_used')) {
                $portfolio->techUsed()->sync($request->input('tech_used'));
            }
    
            // Relasi images (asumsikan ada relasi images di model Portfolio)
            if (!empty($imagePaths)) {
                foreach ($imagePaths as $path) {
                    $portfolio->images()->create(['path' => $path]);
                }
            }
    
            DB::commit();
    
            return to_route('admin.portfolio.index')->with('success', 'Portfolio created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create portfolio: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function edit($id)
    {
        try {
            $portfolio = Portfolio::with(['techUsed:id,name', 'images:id,path,portfolio_id'])->findOrFail($id);
            return ApiResponse::success($portfolio, 'Successfully retrieved portfolio data.');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve portfolio data.', 404);
        }
    }
    
    public function update($id, Request $request)
    {
        $portfolio = Portfolio::findOrFail($id);
        $validator = $request->validate([
            'name' => 'required|string|max:255',
            'description_id' => 'required|string',
            'description_en' => 'required|string',
            'tech_used' => 'array',
            'tech_used.*' => 'exists:tech_used,id',
            'images' => 'array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
        ]);
    
        DB::beginTransaction();
        try {
            $folder = 'portfolios/' . $validator['name'];
            $imagePaths = [];
    
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imagePaths[] = $this->uploadFile("uploads", $image, $folder);
                }
            }
    
            $portfolio->update([
                'name' => $validator['name'],
                'description_id' => $validator['description_id'],
                'description_en' => $validator['description_en'],
                'is_active' => $validator['is_active'] ?? true,
            ]);
    
            // Sync techUsed relation
            if ($request->has('tech_used')) {
                $portfolio->techUsed()->sync($request->input('tech_used'));
            }
    
            // Add new images if any
            if (!empty($imagePaths)) {
                foreach ($imagePaths as $path) {
                    $portfolio->images()->create(['path' => $path]);
                }
            }
    
            DB::commit();
            return to_route('admin.portfolio.index')->with('success', 'Portfolio updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update portfolio: ' . $e->getMessage()]);
        }
    }
    
    /**
     * Bulk delete Portfolios.
     */
    public function bulkDelete(Request $request)
    {
        DB::beginTransaction();
        $ids = $request->input('ids');
    
        if (!$ids || !is_array($ids)) {
            return ApiResponse::error('Data yang diberikan tidak valid.', 400);
        }
    
        try {
            $portfolios = Portfolio::whereIn('id', $ids)->get();
    
            foreach ($portfolios as $portfolio) {
                $portfolio->techUsed()->detach();
                $portfolio->images()->delete();
                $portfolio->delete();
            }
    
            DB::commit();
            return ApiResponse::success(null, 'Bulk delete processed.');
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Gagal menghapus portfolio: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * Remove the specified Portfolio from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            DB::beginTransaction();
    
            $portfolio = Portfolio::findOrFail($id);
    
            $portfolio->techUsed()->detach();
            $portfolio->images()->delete();
            $portfolio->delete();
    
            DB::commit();
            return ApiResponse::success(null, 'Portfolio dihapus dari sistem.');
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Failed to delete portfolio: ' . $e->getMessage());
        }
    }
}
