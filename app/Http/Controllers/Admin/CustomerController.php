<?php
namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Customer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CustomerController extends Controller
{
    public function index()
    {
        $totalCustomer = Customer::count();
        return Inertia::render('Admin/Customer/Index', compact('totalCustomer'));
    }

    public function data(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('pageIndex');
        $sortBy = $request->input('sortBy', []);
        $search = $request->input('search');

        $query = Customer::with(['services']);

        // Ambil role user saat ini
        $user = auth()->user();
        $role = $user ? ($user->getRoleNames()->first() ?? null) : null;

        // Jika sales, hanya tampilkan customer miliknya
        if ($role === 'sales') {
            $query->where('owner_id', $user->id);
        }
        // Jika manager, tampilkan semua customer

        // Search
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('contact', 'LIKE', "%{$search}%")
                  ->orWhere('address', 'LIKE', "%{$search}%");
            });
        }

        // Sorting
        if (!empty($sortBy)) {
            foreach ($sortBy as $sort) {
                $query->orderBy($sort['id'], $sort['desc'] ? 'desc' : 'asc');
            }
        } else {
            $query->orderBy('updated_at', 'desc');
        }

        $customers = $query->paginate($perPage, ['*'], 'page', $page);

        // Format: tampilkan layanan (services) yang dimiliki customer
        $customers->getCollection()->transform(function ($customer) {
            $customer->services = $customer->services->map(function ($service) {
                return [
                    'id' => $service->id,
                    'product_id' => $service->product_id,
                    'product_name' => $service->product->name ?? '-',
                    'is_active' => $service->is_active,
                    // tambahkan field lain sesuai kebutuhan
                ];
            });
            return $customer;
        });

        return response()->json($customers);
    }
}