<?php

namespace App\Http\Controllers\MasterData;

use App\Models\TechUsed;
use Inertia\Inertia;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class TechUsedController extends Controller
{
    public function index()
    {
        $techUsedtats = [
            'active' => TechUsed::where('is_active', true)->count(),
            'inactive' => TechUsed::where('is_active', false)->count(),
            'total' => TechUsed::count(),
        ];

        return Inertia::render('Admin/Master-Data/tech/Index', compact('techUsedStats'));
    }

    public function getTechUsed()
    {
        $techUsed = TechUsed::all();
        return response()->json($techUsed);
    }

    public function data(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('pageIndex');
        $sortBy = $request->input('sortBy', []);
        $search = $request->input('search');

        $query = TechUsed::query();

        // Apply filters
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%");
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
        $techUsed = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($techUsed);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'required|boolean',
        ]);

        try {
            DB::beginTransaction();
            if ($request->hasFile('image')) {
                $filePath = $this->uploadFile("uploads", $request->file('image'), 'TechUseds/' . $validator['name_en']);
            }

            TechUsed::create([
                'name' => $validator['name'],
                'image' => $filePath ?? null,
                'is_active' => $validator['is_active'],
            ]);

            DB::commit();

            return to_route('admin.tech.index')->with('success', 'Tech created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Failed to create Tech: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function edit($id)
    {
        try {
            $techUsed = TechUsed::findOrFail($id);
            return ApiResponse::success($techUsed, 'Successfully retrieved Tech data.');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve Tech data.', 404);
        }
    }

    public function update($id, Request $request)
    {
        $techUsed = TechUsed::findOrFail($id);
        $validator = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'required|boolean',
        ]);

        DB::beginTransaction();
        try {
            if ($request->hasFile('image')) {
                $filePath = $this->updateFile(
                    "uploads",
                    $request->file('image'),
                    $techUsed->image,
                    'tech/' . $validator['name']
                );
            }

            $techUsed->update([
                'name' => $validator['name'],
                'image' => $filePath ?? $techUsed->image,
                'is_active' => $validator['is_active'],
            ]);

            DB::commit();

            return redirect()->route('admin.tech.index')->with('success', 'Tech updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update Tech: ' . $e->getMessage()]);
        }
    }

    /**
     * Bulk delete Techs.
     */
    public function bulkDelete(Request $request)
    {
        DB::beginTransaction();
        $ids = $request->input('ids');

        if (!$ids || !is_array($ids)) {
            return ApiResponse::error('Data not valid.', 400);
        }

        try {
            $techUsed = TechUsed::whereIn('id', $ids)->get();

            foreach ($techUsed as $tech) {
                $tech->delete();
            }

            DB::commit();
            return ApiResponse::success(null, 'Tech deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Failed to delete Tech: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            DB::beginTransaction();

            $techUsed = TechUsed::findOrFail($id);

            $techUsed->delete();

            DB::commit();

            return ApiResponse::success(null, 'Tech deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return ApiResponse::error('Failed to delete Tech: ' . $e->getMessage());
        }
    }
}