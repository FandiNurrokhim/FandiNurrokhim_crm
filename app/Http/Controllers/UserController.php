<?php

namespace App\Http\Controllers;

use App\Models\user;
use Inertia\Inertia;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;


class UserController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::where('name', '!=', 'super admin')
            ->orderBy('name', 'asc')
            ->get(['id', 'name']);
        $userCount = User::count();
        return Inertia::render('Admin/RBAC/User/Index', compact('roles', 'userCount'));
    }

    public function data(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('pageIndex');
        $sortBy = $request->input('sortBy', []);
        $search = $request->input('search');
        $filters = $request->input('filter', []);

        $query = User::with(['roles' => function ($q) {
            $q->select('id', 'name');
        }])
            // Filter: tidak termasuk user dengan role 'super admin'
            ->whereDoesntHave('roles', function ($q) {
                $q->where('name', 'super admin');
            });

        // Apply search
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
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
        $users = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($users);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        $validator = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        try {
            DB::beginTransaction();

            // Upload image jika ada
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $this->uploadFile('users', $request->file('image'), $request->name);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'phone' => $request->phone,
                'address' => $request->address,
                'country' => $request->country,
                'state' => $request->state,
                'city' => $request->city,
                'photo_profile' => $imagePath,
            ]);

            // Jika ada role/permissions, tambahkan di sini
            $user->assignRole($request->input('role'));
            $user->syncPermissions($request->input('permissions'));

            DB::commit();

            return to_route('admin.user.index')->with('success', 'User created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create user: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $user = User::with('roles')->findOrFail($id);
            return response()->json(['user' => $user]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve user data.'], 404);
        }
    }

    public function update($id, Request $request)
    {
        $user = User::findOrFail($id);

        $validator = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
        ]);

        try {
            DB::beginTransaction();

            // Upload image jika ada
            $imagePath = $user->photo_profile;
            if ($request->hasFile('image')) {
                $imagePath = $this->updateFile('users', $request->file('image'), $user->photo_profile, $request->name);
            }

            // Update user
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password ? bcrypt($request->password) : $user->password,
                'phone' => $request->phone,
                'address' => $request->address,
                'country' => $request->country,
                'state' => $request->state,
                'city' => $request->city,
                'photo_profile' => $imagePath,
            ]);

            // Update role & permissions
            if ($request->filled('role')) {
                $user->syncRoles([$request->input('role')]);
            }
            if ($request->filled('permissions')) {
                $user->syncPermissions($request->input('permissions'));
            }

            DB::commit();

            return to_route('admin.user.index')->with('success', 'User updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update user: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        // Cegah hapus diri sendiri
        if (auth()->id() == $id) {
            return ApiResponse::error('Anda tidak dapat menghapus akun Anda sendiri.', 403);
        }

        $user = User::findOrFail($id);
        $user->delete();

        return ApiResponse::success(null, 'User deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        DB::beginTransaction();
        $ids = $request->input('ids');

        if (!$ids || !is_array($ids)) {
            return ApiResponse::error('Data yang diberikan tidak valid.', 400);
        }

        // Cegah hapus diri sendiri
        if (in_array(auth()->id(), $ids)) {
            return ApiResponse::error('Anda tidak dapat menghapus akun Anda sendiri.', 403);
        }

        try {
            User::whereIn('id', $ids)->delete();
            DB::commit();

            return ApiResponse::success(null, 'Pengguna berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('Gagal menghapus pengguna: ' . $e->getMessage(), 500);
        }
    }
}
