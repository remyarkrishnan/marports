<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingController extends Controller
{
    public function index(): Response
    {
        $currentUser = Auth::user();
        $staffUsers = User::orderBy('created_at', 'desc')->get();

        $eventSettings = [
            'event_name' => CmsSetting::get('event_name', 'MARPORTS GLOBAL 2027'),
            'event_edition' => CmsSetting::get('event_edition', 'Conference & Excellence Awards'),
            'event_date' => CmsSetting::get('event_date', '2027-02-05'),
            'event_date_display' => CmsSetting::get('event_date_display', '5th February 2027'),
            'event_venue' => CmsSetting::get('event_venue', 'Taj Coromandel'),
            'event_city' => CmsSetting::get('event_city', 'Chennai'),
            'event_state' => CmsSetting::get('event_state', 'Tamil Nadu'),
            'event_country' => CmsSetting::get('event_country', 'India'),
            'organizer_name' => CmsSetting::get('organizer_name', 'E HUB EVENTS PRIVATE LIMITED'),
            'organizer_url' => CmsSetting::get('organizer_url', 'https://www.ehub.events'),
            'contact_email' => CmsSetting::get('contact_email', 'jayadev@marportsglobal.com'),
            'awards_email' => CmsSetting::get('awards_email', 'awards@marportsglobal.com'),
            'contact_phone' => CmsSetting::get('contact_phone', '+91 9633958465'),
            'registration_url' => CmsSetting::get('registration_url', 'https://ehub.events/events?register=marports'),
        ];

        return Inertia::render('Admin/Settings', [
            'currentUser' => $currentUser,
            'staffUsers' => $staffUsers,
            'eventSettings' => $eventSettings,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        $fullName = trim(($validated['first_name'] ?? '').' '.($validated['last_name'] ?? ''));
        if (empty($fullName)) {
            $fullName = $user->name;
        }

        $user->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'name' => $fullName,
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ]);

        return back()->with('success', 'Admin profile details updated successfully.');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'new_password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    public function storeStaffUser(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', 'in:SYSTEM ADMIN,EDITOR'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        return back()->with('success', 'New staff member added successfully.');
    }

    public function destroyStaffUser(User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->withErrors(['error' => 'You cannot delete your own active administrator account.']);
        }

        $user->delete();

        return back()->with('success', 'Staff account deleted.');
    }

    public function updateEventSettings(Request $request)
    {
        $fields = [
            'event_name',
            'event_edition',
            'event_date',
            'event_date_display',
            'event_venue',
            'event_city',
            'event_state',
            'event_country',
            'organizer_name',
            'organizer_url',
            'contact_email',
            'awards_email',
            'contact_phone',
            'registration_url',
        ];

        foreach ($fields as $field) {
            if ($request->has($field)) {
                CmsSetting::set($field, $request->input($field), 'event');
            }
        }

        return back()->with('success', 'Event and summit configuration updated successfully.');
    }
}
