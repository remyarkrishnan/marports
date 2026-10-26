<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sponsor;
use App\Models\SponsorCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminSponsorController extends Controller
{
    /**
     * Display a listing of all sponsors, partners, and categories.
     */
    public function index(): Response
    {
        $sponsors = Sponsor::orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        $categories = SponsorCategory::orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($cat) use ($sponsors) {
                $cat->sponsors_count = $sponsors->where('type', $cat->name)->count();

                return $cat;
            });

        $metrics = [
            'total' => $sponsors->count(),
            'active' => $sponsors->where('is_active', true)->count(),
            'inactive' => $sponsors->where('is_active', false)->count(),
            'tiers' => $sponsors->pluck('sort_order')->unique()->count(),
            'categories' => $categories->count(),
        ];

        // Unique sponsor types for quick suggestions in UI
        $existingTypes = $categories->pluck('name')->merge(
            Sponsor::distinct()->pluck('type')->filter()
        )->unique()->values();

        return Inertia::render('Admin/Sponsors', [
            'sponsors' => $sponsors,
            'metrics' => $metrics,
            'existingTypes' => $existingTypes,
            'categories' => $categories,
        ]);
    }

    /**
     * Resolve the sort order for a sponsor so partners of the same category are grouped together.
     */
    public static function resolveSortOrderForType(string $type, ?int $explicitSortOrder = null): int
    {
        $normalizedType = strtolower(trim($type));

        // 1. Check in SponsorCategory table first
        try {
            $categoryOrder = SponsorCategory::whereRaw('LOWER(name) = ?', [$normalizedType])->value('sort_order');
            if ($categoryOrder !== null) {
                return (int) $categoryOrder;
            }
        } catch (\Throwable $e) {
            // Table might not exist yet
        }

        // 2. If other sponsors with this category already exist in the database, match their sort order
        $existingOrder = Sponsor::whereRaw('LOWER(type) = ?', [$normalizedType])
            ->whereNotNull('sort_order')
            ->value('sort_order');

        if ($existingOrder !== null) {
            return (int) $existingOrder;
        }

        // 3. Standard tier patterns
        if (preg_match('/strategic/i', $type)) {
            return 1;
        }
        if (preg_match('/gold|premier/i', $type)) {
            return 2;
        }
        if (preg_match('/registration|badge|lanyard/i', $type)) {
            return 3;
        }
        if (preg_match('/lunch|coffee|conference/i', $type)) {
            return 4;
        }
        if (preg_match('/table\s*top/i', $type)) {
            return 5;
        }
        if (preg_match('/associate/i', $type)) {
            return 6;
        }
        if (preg_match('/promoting|supporting/i', $type)) {
            return 7;
        }

        // 4. If explicit sort order was provided, use it
        if ($explicitSortOrder !== null && $explicitSortOrder > 0) {
            return $explicitSortOrder;
        }

        // 5. Default to next row
        return (int) ((SponsorCategory::max('sort_order') ?? Sponsor::max('sort_order') ?? 0) + 1);
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
            'sort_order' => ['nullable', 'integer', 'min:1', 'max:999'],
            'is_active' => ['boolean'],
            'logo_file' => ['nullable', 'max:5120'], // 5MB max
            'logo_url' => ['nullable', 'string', 'max:1000'],
        ]);

        $logoPath = null;

        if ($request->hasFile('logo_file')) {
            $file = $request->file('logo_file');
            $filename = 'sponsor_'.time().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$file->getClientOriginalExtension();

            $destinationPath = $this->getUploadDestinationPath();

            if (! file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $filename);
            $logoPath = '/new/images/sponsors/'.$filename;
        } elseif (! empty($validated['logo_url'])) {
            $logoPath = $validated['logo_url'];
        }

        $sortOrder = self::resolveSortOrderForType(
            $validated['type'],
            isset($validated['sort_order']) ? (int) $validated['sort_order'] : null
        );

        Sponsor::create([
            'type' => $validated['type'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'website_url' => $validated['website_url'] ?? null,
            'sort_order' => $sortOrder,
            'is_active' => $request->boolean('is_active', true),
            'logo' => $logoPath,
        ]);

        SponsorCategory::firstOrCreate(
            ['name' => $validated['type']],
            ['sort_order' => $sortOrder]
        );

        return back()->with('success', "Sponsor '{$validated['name']}' added successfully to {$validated['type']} (Row #{$sortOrder}).");
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
            'sort_order' => ['nullable', 'integer', 'min:1', 'max:999'],
            'is_active' => ['boolean'],
            'logo_file' => ['nullable', 'max:5120'],
            'logo_url' => ['nullable', 'string', 'max:1000'],
            'remove_logo' => ['nullable', 'boolean'],
        ]);

        // If category changed, align with that category's sort order
        $typeChanged = strtolower(trim($sponsor->type)) !== strtolower(trim($validated['type']));
        $sortOrder = $typeChanged
            ? self::resolveSortOrderForType($validated['type'], isset($validated['sort_order']) ? (int) $validated['sort_order'] : null)
            : (isset($validated['sort_order']) ? (int) $validated['sort_order'] : (int) $sponsor->sort_order);

        $updateData = [
            'type' => $validated['type'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'website_url' => $validated['website_url'] ?? null,
            'sort_order' => $sortOrder,
            'is_active' => $request->boolean('is_active', true),
        ];

        if ($request->boolean('remove_logo')) {
            $updateData['logo'] = null;
        } elseif ($request->hasFile('logo_file')) {
            $file = $request->file('logo_file');
            $filename = 'sponsor_'.time().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$file->getClientOriginalExtension();

            $destinationPath = $this->getUploadDestinationPath();

            if (! file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $filename);
            $updateData['logo'] = '/new/images/sponsors/'.$filename;
        } elseif (! empty($validated['logo_url'])) {
            $updateData['logo'] = $validated['logo_url'];
        }

        $sponsor->update($updateData);

        return back()->with('success', "Sponsor '{$sponsor->name}' updated successfully.");
    }

    /**
     * Get the destination path for uploading sponsor images.
     */
    private function getUploadDestinationPath(): string
    {
        return public_path('new/images/sponsors');
    }

    /**
     * Toggle active state of a sponsor.
     */
    public function toggleActive(Sponsor $sponsor): RedirectResponse
    {
        $sponsor->update([
            'is_active' => ! $sponsor->is_active,
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

    /**
     * Store a new sponsor category with flexible row placement.
     */
    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:sponsor_categories,name'],
            'placement_mode' => ['required', 'in:new_row,existing_row,end_row'],
            'target_row' => ['nullable', 'integer', 'min:1'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $name = trim($validated['name']);
        $mode = $validated['placement_mode'];
        $targetRow = (int) ($validated['target_row'] ?? 1);

        DB::transaction(function () use ($name, $mode, &$targetRow, $validated) {
            if ($mode === 'new_row') {
                // Shift all categories and sponsors at or after target_row down by 1
                SponsorCategory::where('sort_order', '>=', $targetRow)->increment('sort_order');
                Sponsor::where('sort_order', '>=', $targetRow)->increment('sort_order');
            } elseif ($mode === 'end_row') {
                $maxCat = (int) SponsorCategory::max('sort_order');
                $maxSpon = (int) Sponsor::max('sort_order');
                $targetRow = max($maxCat, $maxSpon, 0) + 1;
            }
            // For 'existing_row', $targetRow is used as-is (shared row, no shifting)

            SponsorCategory::create([
                'name' => $name,
                'sort_order' => $targetRow,
                'description' => $validated['description'] ?? null,
            ]);
        });

        $message = match ($mode) {
            'new_row' => "Category '{$name}' created at Row #{$targetRow}. Existing rows were pushed down.",
            'existing_row' => "Category '{$name}' created in existing Row #{$targetRow} alongside other categories.",
            'end_row' => "Category '{$name}' created at new final Row #{$targetRow}.",
        };

        return back()->with('success', $message);
    }

    /**
     * Update an existing sponsor category (rename or change row placement).
     */
    public function updateCategory(Request $request, SponsorCategory $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:sponsor_categories,name,'.$category->id],
            'placement_mode' => ['required', 'in:current_row,new_row,existing_row,end_row'],
            'target_row' => ['nullable', 'integer', 'min:1'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $oldName = $category->name;
        $newName = trim($validated['name']);
        $mode = $validated['placement_mode'];
        $targetRow = (int) ($validated['target_row'] ?? $category->sort_order);

        DB::transaction(function () use ($category, $oldName, $newName, $mode, &$targetRow, $validated) {
            if ($mode === 'new_row' && $targetRow !== $category->sort_order) {
                // Shift down rows at or above target_row
                SponsorCategory::where('id', '!=', $category->id)
                    ->where('sort_order', '>=', $targetRow)
                    ->increment('sort_order');
                Sponsor::where('type', '!=', $oldName)
                    ->where('sort_order', '>=', $targetRow)
                    ->increment('sort_order');
            } elseif ($mode === 'end_row') {
                $maxCat = (int) SponsorCategory::max('sort_order');
                $maxSpon = (int) Sponsor::max('sort_order');
                $targetRow = max($maxCat, $maxSpon, 0) + 1;
            } elseif ($mode === 'current_row') {
                $targetRow = $category->sort_order;
            }

            $category->update([
                'name' => $newName,
                'sort_order' => $targetRow,
                'description' => $validated['description'] ?? null,
            ]);

            // Sync all existing sponsors that use this category
            Sponsor::where('type', $oldName)->update([
                'type' => $newName,
                'sort_order' => $targetRow,
            ]);
        });

        return back()->with('success', "Category '{$newName}' updated successfully.");
    }

    /**
     * Delete a sponsor category.
     */
    public function destroyCategory(SponsorCategory $category): RedirectResponse
    {
        $sponsorCount = Sponsor::where('type', $category->name)->count();
        if ($sponsorCount > 0) {
            return back()->with('error', "Cannot delete category '{$category->name}' because it currently contains {$sponsorCount} sponsor(s). Please reassign or delete these sponsors first.");
        }

        $name = $category->name;
        $category->delete();

        return back()->with('success', "Category '{$name}' deleted successfully.");
    }
}
