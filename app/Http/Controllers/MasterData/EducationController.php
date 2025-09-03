<?php

namespace App\Http\Controllers\MasterData;

use Inertia\Inertia;
use App\Models\Education;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class EducationController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Master-Data/Educations/Index');
    }

    public function data(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('pageIndex', 1);
        $sortBy = $request->input('sortBy', []);
        $search = $request->input('search');

        $query = Education::query();

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('degree', 'LIKE', "%{$search}%")
                  ->orWhere('institution', 'LIKE', "%{$search}%")
                  ->orWhere('major', 'LIKE', "%{$search}%")
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

        $educations = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($educations);
    }

    public function store(Request $request)
    {
        $validator = $request->validate([
            'institution' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'major' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'description_id' => 'required|string',
            'description_en' => 'required|string',
            'is_active' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            if ($request->hasFile('image')) {
                $imagePath = $this->uploadFile("uploads", $request->file('image'), 'educations/' . $validator['institution']);
            }

            Education::create([
                'institution' => $validator['institution'],
                'degree' => $validator['degree'],
                'major' => $validator['major'],
                'image' => $imagePath ?? null,
                'start_date' => $validator['start_date'],
                'end_date' => $validator['end_date'] ?? null,
                'description_id' => $validator['description_id'],
                'description_en' => $validator['description_en'],
                'is_active' => $validator['is_active'] ?? true,
            ]);

            DB::commit();

            return back()->with('success', 'Education created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create education: ' . $e->getMessage()]);
        }
    }

    public function edit($id)
    {
        try {
            $education = Education::findOrFail($id);
            return ApiResponse::success($education, 'Successfully retrieved education data.');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve education data.', 404);
        }
    }

    public function update($id, Request $request)
    {
        $education = Education::findOrFail($id);
        $validator = $request->validate([
            'institution' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'major' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'description_id' => 'required|string',
            'description_en' => 'required|string',
            'is_active' => 'boolean',
        ]);

        DB::beginTransaction();
        try {
            if ($request->hasFile('image')) {
                $imagePath = $this->updateFile(
                    "uploads",
                    $request->file('image'),
                    $education->image,
                    'educations/' . $validator['institution']
                );
            }

            $education->update([
                'institution' => $validator['institution'],
                'degree' => $validator['degree'],
                'major' => $validator['major'],
                'image' => $imagePath ?? $education->image,
                'start_date' => $validator['start_date'],
                'end_date' => $validator['end_date'] ?? null,
                'description_id' => $validator['description_id'],
                'description_en' => $validator['description_en'],
                'is_active' => $validator['is_active'] ?? true,
            ]);

            DB::commit();

            return redirect()->route('admin.education.index')->with('success', 'Education updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update education: ' . $e->getMessage()]);
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
            $educations = Education::whereIn('id', $ids)->get();

            foreach ($educations as $education) {
                if ($education->image) {
                    $this->deleteFile($education->image);
                }
                $education->delete();
            }

            DB::commit();
            return ApiResponse::success(null, 'Education berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Gagal menghapus education: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, string $id)
    {
        try {
            DB::beginTransaction();

            $education = Education::findOrFail($id);

            if ($education->image) {
                $this->deleteFile($education->image);
            }
            $education->delete();

            DB::commit();

            return ApiResponse::success(null, 'Education deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Failed to delete education: ' . $e->getMessage());
        }
    }
}