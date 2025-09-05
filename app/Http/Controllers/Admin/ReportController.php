<?php

namespace App\Http\Controllers\Admin;

use App\Models\Deal;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Exports\DealsReportExport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Report/Index');
    }

    public function data(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('page', 1);
        $search = $request->input('search');
        $month = $request->input('month');

        $query = Deal::with(['customer', 'products']);

        if ($month) {
            $query->whereMonth('created_at', substr($month, 5, 2))
                ->whereYear('created_at', substr($month, 0, 4));
        }

        if (!empty($search)) {
            $query->whereHas('customer', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%");
            });
        }

        $deals = $query->paginate($perPage, ['*'], 'page', $page);

        // Format data untuk frontend
        $deals->getCollection()->transform(function ($deal) {
            return [
                'date' => $deal->created_at->format('Y-m-d'),
                'customer_name' => $deal->customer->name ?? '-',
                'product_name' => $deal->products->pluck('name')->implode(', '),
                'total' => $deal->total_amount,
            ];
        });

        return response()->json($deals);
    }

    public function export(Request $request)
    {
        $month = $request->input('month');
        $search = $request->input('search');

        $query = Deal::with(['customer', 'products']);

        if ($month) {
            $query->whereMonth('created_at', substr($month, 5, 2))
                ->whereYear('created_at', substr($month, 0, 4));
        }

        if (!empty($search)) {
            $query->whereHas('customer', function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%");
            });
        }

        $deals = $query->get();

        // Format data
        $exportData = $deals->map(function ($deal) {
            return [
                $deal->created_at->format('Y-m-d'),
                $deal->customer->name ?? '-',
                $deal->products->map(function ($p) {
                    return $p->name . ' (' . ($p->pivot->qty ?? 0) . ' x ' . number_format($p->pivot->negotiated_price ?? 0, 0, ',', '.') . ')';
                })->implode(', '),
                $deal->total_amount,
            ];
        })->toArray();

        return Excel::download(new DealsReportExport($exportData), 'report.xlsx');
    }
}
