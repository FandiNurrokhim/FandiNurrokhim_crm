<?php

namespace App\Http\Controllers\MasterData;

use App\Models\Skill;
use Inertia\Inertia;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class SkillController extends Controller
{
    public function index()
    {
        $skillStats = [
            'active' => Skill::where('is_active', true)->count(),
            'inactive' => Skill::where('is_active', false)->count(),
            'total' => Skill::count(),
        ];

        return Inertia::render('Admin/Master-Data/Skills/Index', compact('skillStats'));
    }

    public function getSkills()
    {
        $skills = Skill::all();
        return response()->json($skills);
    }

    public function data(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('pageIndex');
        $sortBy = $request->input('sortBy', []);
        $search = $request->input('search');

        $query = Skill::query();

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
        $skills = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($skills);
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
                $filePath = $this->uploadFile("uploads", $request->file('image'), 'skills/' . $validator['name']);
            }

            Skill::create([
                'name' => $validator['name'],
                'image' => $filePath ?? null,
                'is_active' => $validator['is_active'],
            ]);

            DB::commit();

            return to_route('admin.skill.index')->with('success', 'Skill created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Failed to create skill: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function edit($id)
    {
        try {
            $skill = Skill::findOrFail($id);
            return ApiResponse::success($skill, 'Successfully retrieved skill data.');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve skill data.', 404);
        }
    }

    public function update($id, Request $request)
    {
        $skill = Skill::findOrFail($id);
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
                    $skill->image,
                    'skills/' . $validator['name']
                );
            }

            $skill->update([
                'name' => $validator['name'],
                'image' => $filePath ?? $skill->image,
                'is_active' => $validator['is_active'],
            ]);

            DB::commit();

            return redirect()->route('admin.skill.index')->with('success', 'Skill updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update skill: ' . $e->getMessage()]);
        }
    }

    /**
     * Bulk delete Skills.
     */
    public function bulkDelete(Request $request)
    {
        DB::beginTransaction();
        $ids = $request->input('ids');

        if (!$ids || !is_array($ids)) {
            return ApiResponse::error('Invalid data provided.', 400);
        }

        try {
            $skills = Skill::whereIn('id', $ids)->get();

            foreach ($skills as $skill) {
                $skill->delete();
            }

            DB::commit();
            return ApiResponse::success(null, 'Skill deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Failed to delete skill: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();

            $skill = Skill::findOrFail($id);

            $skill->delete();

            DB::commit();

            return ApiResponse::success(null, 'Skill deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return ApiResponse::error('Failed to delete skill: ' . $e->getMessage());
        }
    }
}