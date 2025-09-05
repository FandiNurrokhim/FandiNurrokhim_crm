<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index()
    {
        $leadCount = Lead::count();
        return Inertia::render('Admin/Lead/Index', compact('leadCount'));
    }

    public function data(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('pageIndex');
        $sortBy = $request->input('sortBy', []);
        $search = $request->input('search');
        $filters = $request->input('filter', []);

        $query = Lead::query();

        // Ambil role user saat ini
        $user = auth()->user();
        $role = $user ? ($user->getRoleNames()->first() ?? null) : null;

        // Jika user adalah sales, hanya tampilkan lead miliknya
        if ($role === 'sales') {
            $query->where('owner_id', $user->id);
        }
        // Jika manager, tampilkan semua data

        // Apply search
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('contact', 'LIKE', "%{$search}%")
                    ->orWhere('address', 'LIKE', "%{$search}%")
                    ->orWhere('needs', 'LIKE', "%{$search}%");
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

        // Paginate
        $leads = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($leads);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'needs' => 'nullable|string',
            'status' => 'required|in:new,contacted,qualified,unqualified,converted',
        ]);

        try {
            DB::beginTransaction();

            Lead::create([
                'owner_id' => auth()->id(),
                'name' => $validated['name'],
                'contact' => $validated['contact'],
                'address' => $validated['address'],
                'needs' => $validated['needs'],
                'status' => $validated['status'],
            ]);

            DB::commit();

            return to_route('admin.lead.index')->with('success', 'Lead created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create lead: ' . $e->getMessage()]);
        }
    }

    public function show($id)
    {
        try {
            $lead = Lead::findOrFail($id);
            return response()->json(['lead' => $lead]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve lead data.'], 404);
        }
    }

    public function update($id, Request $request)
    {
        $lead = Lead::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'needs' => 'nullable|string',
            'status' => 'required|in:new,contacted,qualified,unqualified,converted',
        ]);

        try {
            DB::beginTransaction();

            $lead->update($validated);

            DB::commit();

            return to_route('admin.lead.index')->with('success', 'Lead updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update lead: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $lead = Lead::findOrFail($id);
        $lead->delete();

        return response()->json(['success' => true, 'message' => 'Lead deleted successfully.']);
    }

    public function bulkDelete(Request $request)
    {
        DB::beginTransaction();
        $ids = $request->input('ids');

        if (!$ids || !is_array($ids)) {
            return response()->json(['error' => 'Data yang diberikan tidak valid.'], 400);
        }

        try {
            Lead::whereIn('id', $ids)->delete();
            DB::commit();

            return response()->json(['success' => true, 'message' => 'Leads deleted successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menghapus leads: ' . $e->getMessage()], 500);
        }
    }
}
