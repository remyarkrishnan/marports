<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sponsor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminSponsorController extends Controller
{
    /**
     * Display a listing of all sponsors and partners.
     */
    public function index(): Response
    {
        $sponsors = Sponsor::orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        $metrics = [
            'total' => $sponsors->count(),
            'active' => $sponsors->where('is_active', true)->count(),
            'inactive' => $sponsors->where('is_active', false)->count(),
            'tiers' => $sponsors->pluck('sort_order')->unique()->count(),
        ];

        // Unique sponsor types for quick suggestions in UI
        $existingTypes = Sponsor::distinct()->pluck('type')->filter()->values();

        return Inertia::render('Admin/Sponsors', [
            'sponsors' => $sponsors,
            'metrics' => $metrics,
            'existingTypes' => $existingTypes,
        ]);
    }

    /**
     * Store a newly created sponsor in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'website_url' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['required', 'integer', 'min:1', 'max:999'],
            'is_active' => ['boolean'],
            'logo_file' => ['nullable', 'max:5120'], // 5MB max
            'logo_url' => ['nullable', 'string', 'max:1000'],
        ]);

        $logoPath = null;

if ($request->hasFile('logo_file')) {
    $file = $request->file('logo_file');
    $filename = 'sponsor_' . time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
    
    // Direct path into public_html/new:
    $destinationPath = '/home/marportsglobal/public_html/new/images/sponsors';

    if (!file_exists($destinationPath)) {
        mkdir($destinationPath, 0755, true);
    }

    $file->move($destinationPath, $filename);
    $logoPath = '/new/images/sponsors/' . $filename;
} elseif (!empty($validated['logo_url'])) {
            $logoPath = $validated['logo_url'];
        }

        Sponsor::create([
            'type' => $validated['type'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'website_url' => $validated['website_url'] ?? null,
            'sort_order' => (int) $validated['sort_order'],
            'is_active' => $request->boolean('is_active', true),
            'logo' => $logoPath,
        ]);

        return back()->with('success', "Sponsor '{$validated['name']}' added successfully.");
    }

    /**
     * Update the specified sponsor in storage.
     */
    public function update(Request $request, Sponsor $sponsor): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'website_url' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['required', 'integer', 'min:1', 'max:999'],
            'is_active' => ['boolean'],
            'logo_file' => ['nullable', 'max:5120'],
            'logo_url' => ['nullable', 'string', 'max:1000'],
            'remove_logo' => ['nullable', 'boolean'],
        ]);

        $updateData = [
            'type' => $validated['type'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'website_url' => $validated['website_url'] ?? null,
            'sort_order' => (int) $validated['sort_order'],
            'is_active' => $request->boolean('is_active', true),
        ];

        if ($request->boolean('remove_logo')) {
            $updateData['logo'] = null;
        } elseif ($request->hasFile('logo_file')) {
            $file = $request->file('logo_file');
    $filename = 'sponsor_' . time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
    
    // Direct path into public_html/new:
    $destinationPath = '/home/marportsglobal/public_html/new/images/sponsors';

    if (!file_exists($destinationPath)) {
        mkdir($destinationPath, 0755, true);
    }

    $file->move($destinationPath, $filename);
    $updateData['logo'] = '/new/images/sponsors/' . $filename;
        } elseif ($request->has('logo_url')) {
            $updateData['logo'] = $validated['logo_url'] ?: null;
        }

        $sponsor->update($updateData);

        return back()->with('success', "Sponsor '{$sponsor->name}' updated successfully.");
    }

    /**
     * Toggle active state of a sponsor.
     */
    public function toggleActive(Sponsor $sponsor): RedirectResponse
    {
        $sponsor->update([
            'is_active' => !$sponsor->is_active,
        ]);

        $statusLabel = $sponsor->is_active ? 'Active' : 'Inactive';

        return back()->with('success', "Sponsor '{$sponsor->name}' is now {$statusLabel}.");
    }

    /**
     * Remove the specified sponsor from storage.
     */
    public function destroy(Sponsor $sponsor): RedirectResponse
    {
        $name = $sponsor->name;
        $sponsor->delete();

        return back()->with('success', "Sponsor '{$name}' deleted successfully.");
    }
}
