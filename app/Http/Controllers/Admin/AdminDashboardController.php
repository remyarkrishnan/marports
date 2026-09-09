<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsPage;
use App\Models\CmsSetting;
use App\Models\Registration;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $managedPagesCount = CmsPage::count();
        $updated24hCount = CmsPage::where('updated_at', '>=', Carbon::now()->subHours(24))->count();
        $staffUsersCount = User::count();

        // Calculate days to event from cms_settings or fallback
        $eventDateStr = CmsSetting::get('event_date', '2027-02-05');
        try {
            $eventDate = Carbon::parse($eventDateStr)->startOfDay();
            $now = Carbon::now()->startOfDay();
            $daysToEvent = max(0, (int) $now->diffInDays($eventDate, false));
        } catch (\Exception $e) {
            $daysToEvent = 151; // fallback
        }

        // Registration stats
        $totalRegistrations = Registration::count();
        $pendingRegistrations = Registration::where('status', 'pending')->count();
        $approvedRegistrations = Registration::where('status', 'approved')->count();
        $rejectedRegistrations = Registration::where('status', 'rejected')->count();

        // Recent page updates
        $recentPages = CmsPage::orderBy('updated_at', 'desc')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'category', 'route_path', 'status', 'last_edited_by', 'updated_at']);

        // Recent registrations
        $recentRegistrations = Registration::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $eventInfo = [
            'name' => CmsSetting::get('event_name', 'MARPORTS GLOBAL 2027'),
            'edition' => CmsSetting::get('event_edition', 'Conference & Excellence Awards'),
            'date_display' => CmsSetting::get('event_date_display', '5th February 2027'),
            'venue' => CmsSetting::get('event_venue', 'Taj Coromandel'),
            'city' => CmsSetting::get('event_city', 'Chennai'),
        ];

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'managed_pages' => $managedPagesCount,
                'updated_24h' => $updated24hCount,
                'staff_users' => $staffUsersCount,
                'days_to_event' => $daysToEvent,
            ],
            'registrationMetrics' => [
                'total' => $totalRegistrations,
                'pending' => $pendingRegistrations,
                'approved' => $approvedRegistrations,
                'rejected' => $rejectedRegistrations,
            ],
            'recentPages' => $recentPages,
            'recentRegistrations' => $recentRegistrations,
            'eventInfo' => $eventInfo,
        ]);
    }
}
