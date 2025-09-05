<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $productCount = Product::count();
        return Inertia::render('Admin/Product/Index', compact('productCount'));
    }

    public function data(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('pageIndex');
        $sortBy = $request->input('sortBy', []);
        $search = $request->input('search');

        $query = Product::query();

        // Ambil role user saat ini
        $user = auth()->user();
        $role = $user ? ($user->getRoleNames()->first() ?? null) : null;

        // Jika hanya manager yang boleh lihat semua, sales hanya bisa lihat produk aktif
        if ($role === 'sales') {
            $query->where('is_active', true);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%");
            });
        }

        if (!empty($sortBy)) {
            foreach ($sortBy as $sort) {
                $query->orderBy($sort['id'], $sort['desc'] ? 'desc' : 'asc');
            }
        } else {
            $query->orderBy('updated_at', 'desc');
        }

        // Eager load relasi customers dan hitung jumlah customer per produk
        $query->withCount('customers');

        $products = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hpp' => 'required|numeric|min:0',
            'margin_percent' => 'required|numeric|min:0|max:100',
        ]);

        try {
            DB::beginTransaction();

            Product::create($validated);

            DB::commit();

            return to_route('admin.product.index')->with('success', 'Product created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create product: ' . $e->getMessage()]);
        }
    }

    public function show($id)
    {
        try {
            $product = Product::findOrFail($id);
            return response()->json(['product' => $product]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve product data.'], 404);
        }
    }

    public function update($id, Request $request)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hpp' => 'required|numeric|min:0',
            'margin_percent' => 'required|numeric|min:0|max:100',
        ]);

        try {
            DB::beginTransaction();

            $product->update($validated);

            DB::commit();

            return to_route('admin.product.index')->with('success', 'Product updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update product: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);

            if ($product->isUsed()) {
                return $this->responseFormatter(400, null, 'Produk sedang digunakan dan tidak dapat dihapus.');
            }

            $product->delete();

            return $this->responseFormatter(200, null, 'Product deleted successfully.');
        } catch (\Exception $e) {
            return $this->responseFormatter(400, null, 'Gagal menghapus produk: ' . $e->getMessage());
        }
    }

    // Contoh penggunaan di method bulkDelete:
    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids');

        if (!$ids || !is_array($ids)) {
            return $this->responseFormatter(400, null, 'Data yang diberikan tidak valid.');
        }

        DB::beginTransaction();
        try {
            $products = Product::whereIn('id', $ids)->get();
            foreach ($products as $product) {
                if ($product->isUsed()) {
                    DB::rollBack();
                    return $this->responseFormatter(400, null, "Produk {$product->name} sedang digunakan dan tidak dapat dihapus.");
                }
            }

            Product::whereIn('id', $ids)->delete();
            DB::commit();

            return $this->responseFormatter(200, null, 'Products deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->responseFormatter(400, null, 'Gagal menghapus produk: ' . $e->getMessage());
        }
    }
}
