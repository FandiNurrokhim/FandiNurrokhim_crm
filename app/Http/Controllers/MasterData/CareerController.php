<?php

namespace App\Http\Controllers\MasterData;

use Inertia\Inertia;
use App\Models\Career;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class CareerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Master-Data/Careers/Index');
    }

    public function data(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('pageIndex', 1);
        $sortBy = $request->input('sortBy', []);
        $search = $request->input('search');

        $query = Career::query();

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('position', 'LIKE', "%{$search}%")
                  ->orWhere('company', 'LIKE', "%{$search}%")
                  ->orWhere('description_id', 'LIKE', "%{$search}%")
                  ->orWhere('description_en', 'LIKE', "%{$search}%");
            });
        }

        if (!empty($sortBy)) {
            foreach ($sortBy as $sort) {
                $query->orderBy($sort['id'], $sort['desc'] ? 'desc' : 'asc');
            }
        } else {
            $query->orderBy('updated_at', 'desc');
        }

        $careers = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($careers);
    }

    public function store(Request $request)
    {
        $validator = $request->validate([
            'position' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'company_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'description_id' => 'required|string',
            'description_en' => 'required|string',
            'is_active' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            if ($request->hasFile('company_logo')) {
                $logoPath = $this->uploadFile("uploads", $request->file('company_logo'), 'careers/' . $validator['company']);
            }

            Career::create([
                'position' => $validator['position'],
                'company' => $validator['company'],
                'company_logo' => $logoPath ?? null,
                'start_date' => $validator['start_date'],
                'end_date' => $validator['end_date'] ?? null,
                'description_id' => $validator['description_id'],
                'description_en' => $validator['description_en'],
                'is_active' => $validator['is_active'] ?? true,
            ]);

            DB::commit();

            return back()->with('success', 'Career created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create career: ' . $e->getMessage()]);
        }
    }

    public function edit($id)
    {
        try {
            $career = Career::findOrFail($id);
            return ApiResponse::success($career, 'Successfully retrieved career data.');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve career data.', 404);
        }
    }

    public function update($id, Request $request)
    {
        $career = Career::findOrFail($id);
        $validator = $request->validate([
            'position' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'company_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'description_id' => 'required|string',
            'description_en' => 'required|string',
            'is_active' => 'boolean',
        ]);

        DB::beginTransaction();
        try {
            if ($request->hasFile('company_logo')) {
                $logoPath = $this->updateFile(
                    "uploads",
                    $request->file('company_logo'),
                    $career->company_logo,
                    'careers/' . $validator['company']
                );
            }

            $career->update([
                'position' => $validator['position'],
                'company' => $validator['company'],
                'company_logo' => $logoPath ?? $career->company_logo,
                'start_date' => $validator['start_date'],
                'end_date' => $validator['end_date'] ?? null,
                'description_id' => $validator['description_id'],
                'description_en' => $validator['description_en'],
                'is_active' => $validator['is_active'] ?? true,
            ]);

            DB::commit();

            return redirect()->route('admin.career.index')->with('success', 'Career updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update career: ' . $e->getMessage()]);
        }
    }

    public function bulkDelete(Request $request)
    {
        DB::beginTransaction();
        $ids = $request->input('ids');

        if (!$ids || !is_array($ids)) {
            return ApiResponse::error('Data yang diberikan tidak valid.', 400);
        }

        try {
            $careers = Career::whereIn('id', $ids)->get();

            foreach ($careers as $career) {
                if ($career->company_logo) {
                    $this->deleteFile($career->company_logo);
                }
                $career->delete();
            }

            DB::commit();
            return ApiResponse::success(null, 'Career berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Gagal menghapus career: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, string $id)
    {
        try {
            DB::beginTransaction();

            $career = Career::findOrFail($id);

            if ($career->company_logo) {
                $this->deleteFile($career->company_logo);
            }
            $career->delete();

            DB::commit();

            return ApiResponse::success(null, 'Career deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Failed to delete career: ' . $e->getMessage());
        }
    }
}