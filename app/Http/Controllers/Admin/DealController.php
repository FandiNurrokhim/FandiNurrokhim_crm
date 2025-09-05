<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Customer;
use App\Models\Product;
use App\Models\DealProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DealController extends Controller
{
    public function index(): \Inertia\Response
    {
        $role = $this->getCurrentUserRole();
        $counts = Deal::selectRaw("
        COUNT(*) as total,
        SUM(CASE WHEN status = 'waiting_approval' THEN 1 ELSE 0 END) as waiting_approval,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
    ")->first();

        $dealCount = $counts->total;
        $waitingApprovalCount = $counts->waiting_approval;
        $approvedCount = $counts->approved;
        $rejectedCount = $counts->rejected;

        if ($role === "Manager") {
            return Inertia::render('Admin/Deal/Manager', compact(
                'dealCount',
                'waitingApprovalCount',
                'approvedCount',
                'rejectedCount'
            ));
        } else {
            return Inertia::render('Admin/Deal/Index', compact(
                'dealCount',
                'waitingApprovalCount',
                'approvedCount',
                'rejectedCount'
            ));
        }
    }

    public function approve($id)
    {
        $deal = Deal::findOrFail($id);
        $deal->status = 'approved';
        $deal->save();
        return response()->json(['success' => true, 'message' => 'Deal approved.']);
    }

    public function reject($id)
    {
        $deal = Deal::findOrFail($id);
        $deal->status = 'rejected';
        $deal->save();
        return response()->json(['success' => true, 'message' => 'Deal rejected.']);
    }

    public function data(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('pageIndex');
        $sortBy = $request->input('sortBy', []);
        $search = $request->input('search');

        $query = Deal::with(['lead', 'customer', 'products']);

        // Gunakan helper getCurrentUserRole
        $role = $this->getCurrentUserRole();
        $user = auth()->user();

        // Jika user adalah sales, hanya tampilkan deal miliknya
        if ($role === 'sales') {
            $query->where('owner_id', $user->id);
        }
        // Jika manager, tampilkan semua data

        // Apply search
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%");
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

        $deals = $query->paginate($perPage, ['*'], 'page', $page);

        // Format products for frontend
        $deals->getCollection()->transform(function ($deal) {
            $deal->products = $deal->products->map(function ($dp) {
                return [
                    'id' => $dp->id,
                    'product_id' => $dp->product_id,
                    'product_name' => $dp->product->name ?? '-',
                    'qty' => $dp->qty,
                    'negotiated_price' => $dp->negotiated_price,
                ];
            });
            return $deal;
        });

        return response()->json($deals);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'lead_id' => 'nullable|exists:leads,id',
            'customer_id' => 'nullable|exists:customers,id',
            'title' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|in:waiting_approval,approved,rejected',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.qty' => 'required|integer|min:1',
            'products.*.negotiated_price' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $deal = Deal::create([
                'owner_id' => auth()->id(),
                'lead_id' => $validated['lead_id'],
                'customer_id' => $validated['customer_id'],
                'title' => $validated['title'],
                'notes' => $validated['notes'],
                'status' => $validated['status'],
                'total_amount' => $validated['total_amount'],
            ]);

            foreach ($validated['products'] as $item) {
                DealProduct::create([
                    'deal_id' => $deal->id,
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'negotiated_price' => $item['negotiated_price'],
                    'subtotal' => $item['qty'] * $item['negotiated_price'],
                ]);
            }

            DB::commit();

            return to_route('admin.deal.index')->with('success', 'Deal created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create deal: ' . $e->getMessage()]);
        }
    }

    public function show($id)
    {
        try {
            $deal = Deal::with(['lead', 'customer', 'products'])->findOrFail($id);
            $deal->products = $deal->products->map(function ($dp) {
                return [
                    'id' => $dp->id,
                    'product_id' => $dp->product_id,
                    'product_name' => $dp->product->name ?? '-',
                    'qty' => $dp->qty,
                    'negotiated_price' => $dp->negotiated_price,
                ];
            });

            return response()->json(['deal' => $deal]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve deal data.'], 404);
        }
    }

    public function update($id, Request $request)
    {
        $deal = Deal::findOrFail($id);

        $validated = $request->validate([
            'lead_id' => 'nullable|exists:leads,id',
            'customer_id' => 'nullable|exists:customers,id',
            'title' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|in:waiting_approval,approved,rejected',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.qty' => 'required|integer|min:1',
            'products.*.negotiated_price' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $deal->update([
                'lead_id' => $validated['lead_id'],
                'customer_id' => $validated['customer_id'],
                'title' => $validated['title'],
                'notes' => $validated['notes'],
                'status' => $validated['status'],
                'total_amount' => $validated['total_amount'],
            ]);

            // Hapus produk lama, insert ulang
            DealProduct::where('deal_id', $deal->id)->delete();
            foreach ($validated['products'] as $item) {
                DealProduct::create([
                    'deal_id' => $deal->id,
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'negotiated_price' => $item['negotiated_price'],
                    'subtotal' => $item['qty'] * $item['negotiated_price'],
                ]);
            }

            DB::commit();

            return to_route('admin.deal.index')->with('success', 'Deal updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update deal: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $deal = Deal::findOrFail($id);
        $deal->delete();

        return response()->json(['success' => true, 'message' => 'Deal deleted successfully.']);
    }

    public function bulkDelete(Request $request)
    {
        DB::beginTransaction();
        $ids = $request->input('ids');

        if (!$ids || !is_array($ids)) {
            return response()->json(['error' => 'Data yang diberikan tidak valid.'], 400);
        }

        try {
            Deal::whereIn('id', $ids)->delete();
            DB::commit();

            return response()->json(['success' => true, 'message' => 'Deals deleted successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menghapus deals: ' . $e->getMessage()], 500);
        }
    }

    // API untuk dropdown: lead, customer, product
    public function dropdownData()
    {
        $role = $this->getCurrentUserRole();
        $user = auth()->user();

        // Leads & customers: filter jika sales, tampilkan semua jika manager
        if ($role === 'sales') {
            $leads = Lead::where('owner_id', $user->id)->select('id', 'name')->get();
            $customers = Customer::where('owner_id', $user->id)->select('id', 'name')->get();
        } else {
            $leads = Lead::select('id', 'name')->get();
            $customers = Customer::select('id', 'name')->get();
        }
        $products = Product::select('id', 'name', 'sell_price')->get();

        return response()->json([
            'leads' => $leads,
            'customers' => $customers,
            'products' => $products,
        ]);
    }
}
