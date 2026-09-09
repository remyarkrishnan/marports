<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminRegistrationController extends Controller
{
    public function index(Request $request): Response
    {
        $statusFilter = $request->query('status', 'all');
        $search = $request->query('search', '');
        $sort = $request->query('sort', 'newest');

        $query = Registration::query();

        if ($statusFilter && $statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('organization', 'like', "%{$search}%")
                    ->orWhere('designation', 'like', "%{$search}%")
                    ->orWhere('pass_tier', 'like', "%{$search}%");
            });
        }

        if ($sort === 'oldest') {
            $query->orderBy('created_at', 'asc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $registrations = $query->paginate(25)->withQueryString();

        $metrics = [
            'total' => Registration::count(),
            'pending' => Registration::where('status', 'pending')->count(),
            'approved' => Registration::where('status', 'approved')->count(),
            'rejected' => Registration::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Registrations', [
            'registrations' => $registrations,
            'metrics' => $metrics,
            'filters' => [
                'status' => $statusFilter,
                'search' => $search,
                'sort' => $sort,
            ],
        ]);
    }

    public function updateStatus(Request $request, Registration $registration)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,approved,rejected'],
        ]);

        $registration->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', "Registration status updated to {$validated['status']}.");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'organization' => ['required', 'string', 'max:255'],
            'designation' => ['nullable', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'pass_tier' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:pending,approved,rejected'],
            'type' => ['nullable', 'string', 'max:50'],
            'message' => ['nullable', 'string'],
        ]);

        Registration::create([
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'organization' => $validated['organization'],
            'designation' => $validated['designation'] ?? null,
            'industry' => $validated['industry'] ?? null,
            'pass_tier' => $validated['pass_tier'],
            'status' => $validated['status'],
            'type' => $validated['type'] ?? 'delegate',
            'message' => $validated['message'] ?? null,
        ]);

        return back()->with('success', 'New registration created successfully.');
    }

    public function destroy(Registration $registration)
    {
        $registration->delete();

        return back()->with('success', 'Registration record deleted successfully.');
    }

    public function export(Request $request): StreamedResponse
    {
        $statusFilter = $request->query('status', 'all');
        $search = $request->query('search', '');

        $query = Registration::query();

        if ($statusFilter && $statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('organization', 'like', "%{$search}%");
            });
        }

        $registrations = $query->orderBy('created_at', 'desc')->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="marports_registrations_'.date('Y-m-d_His').'.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($registrations) {
            $file = fopen('php://output', 'w');
            // Add UTF-8 BOM for Excel compatibility
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, [
                'ID',
                'Submission Date',
                'Full Name',
                'Email',
                'Phone',
                'Organization',
                'Designation',
                'Industry',
                'Pass Tier',
                'Type',
                'Status',
                'Message / Notes',
            ]);

            foreach ($registrations as $reg) {
                fputcsv($file, [
                    $reg->id,
                    $reg->created_at ? $reg->created_at->format('Y-m-d H:i:s') : '',
                    $reg->full_name,
                    $reg->email,
                    $reg->phone,
                    $reg->organization,
                    $reg->designation,
                    $reg->industry,
                    $reg->pass_tier,
                    $reg->type,
                    ucfirst($reg->status),
                    $reg->message,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
