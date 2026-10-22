<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ExtractsBioContent;
use App\Models\Speaker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminSpeakerController extends Controller
{
    use ExtractsBioContent;

    /**
     * Display a listing of all speakers and panel members.
     */
    public function index(): Response
    {
        $speakers = Speaker::orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        $metrics = [
            'total' => $speakers->count(),
            'active' => $speakers->where('is_active', true)->count(),
            'inactive' => $speakers->where('is_active', false)->count(),
            'roles' => $speakers->pluck('role')->unique()->filter()->count(),
        ];

        // Preset and existing roles for suggestions in the UI
        $existingRoles = Speaker::distinct()->pluck('role')->filter()->values();

        // Scan public/pdf directory for existing bio documents
        $existingPdfFiles = [];
        $pdfDirectory = public_path('pdf');
        if (file_exists($pdfDirectory)) {
            $files = scandir($pdfDirectory);
            foreach ($files as $file) {
                if (! in_array($file, ['.', '..']) && strtolower(pathinfo($file, PATHINFO_EXTENSION)) === 'pdf') {
                    $existingPdfFiles[] = [
                        'filename' => $file,
                        'path' => '/pdf/'.$file,
                    ];
                }
            }
        }

        return Inertia::render('Admin/Speakers', [
            'speakers' => $speakers,
            'metrics' => $metrics,
            'existingRoles' => $existingRoles,
            'existingPdfFiles' => $existingPdfFiles,
        ]);
    }

    /**
     * Store a newly created panel member / speaker in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'designation' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'bio_file_upload' => ['nullable', 'file', 'mimes:pdf,doc,docx,txt', 'max:25600'], // 25MB max
            'bio_file' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string', 'max:2000'],
            'linkedin' => ['nullable', 'string', 'max:500'],
            'topic' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['required', 'integer', 'min:1', 'max:999'],
            'is_active' => ['boolean'],
            'image_file' => ['nullable', 'file', 'image', 'max:10240'], // 10MB max
            'image_url' => ['nullable', 'string', 'max:1000'],
        ]);

        $imagePath = null;

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = 'speaker_'.time().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$file->getClientOriginalExtension();

            $destinationPath = public_path('images/speakers');
            if (! file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);

            // Also mirror to new/images/speakers if that directory is present in build/sub-path deployments
            $altDestination = public_path('new/images/speakers');
            if (file_exists(public_path('new/images'))) {
                if (! file_exists($altDestination)) {
                    mkdir($altDestination, 0755, true);
                }
                @copy($destinationPath.'/'.$filename, $altDestination.'/'.$filename);
            }

            $imagePath = '/images/speakers/'.$filename;
        } elseif (! empty($validated['image_url'])) {
            $imagePath = $validated['image_url'];
        }

        // Bio file handling: Uploaded PDF is directly downloaded/viewed as bio
        $bioFilePath = null;
        if ($request->hasFile('bio_file_upload')) {
            $file = $request->file('bio_file_upload');
            $filename = 'bio_'.time().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$file->getClientOriginalExtension();

            $destinationPath = public_path('pdf');
            if (! file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);
            $bioFilePath = '/pdf/'.$filename;
        } elseif (! empty($validated['bio_file'])) {
            $bioFilePath = $validated['bio_file'];
        }

        $bioContent = ! empty($bioFilePath) ? null : ($validated['bio'] ?? null);

        Speaker::create([
            'name' => $validated['name'],
            'designation' => $validated['designation'] ?? null,
            'company' => $validated['company'] ?? null,
            'role' => ! empty($validated['role']) ? $validated['role'] : 'Panelist',
            'bio' => $bioContent,
            'bio_file' => $bioFilePath,
            'description' => $validated['description'] ?? null,
            'linkedin' => $validated['linkedin'] ?? null,
            'topic' => $validated['topic'] ?? null,
            'sort_order' => (int) $validated['sort_order'],
            'is_active' => $request->boolean('is_active', true),
            'image' => $imagePath,
        ]);

        return back()->with('success', "Panel member '{$validated['name']}' added successfully.");
    }

    /**
     * Update the specified panel member / speaker in storage.
     */
    public function update(Request $request, Speaker $speaker): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'designation' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'bio_file_upload' => ['nullable', 'file', 'mimes:pdf,doc,docx,txt', 'max:25600'],
            'bio_file' => ['nullable', 'string', 'max:1000'],
            'remove_bio_file' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string', 'max:2000'],
            'linkedin' => ['nullable', 'string', 'max:500'],
            'topic' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['required', 'integer', 'min:1', 'max:999'],
            'is_active' => ['boolean'],
            'image_file' => ['nullable', 'file', 'image', 'max:10240'],
            'image_url' => ['nullable', 'string', 'max:1000'],
            'remove_image' => ['nullable', 'boolean'],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'designation' => $validated['designation'] ?? null,
            'company' => $validated['company'] ?? null,
            'role' => ! empty($validated['role']) ? $validated['role'] : 'Panelist',
            'description' => $validated['description'] ?? null,
            'linkedin' => $validated['linkedin'] ?? null,
            'topic' => $validated['topic'] ?? null,
            'sort_order' => (int) $validated['sort_order'],
            'is_active' => $request->boolean('is_active', true),
        ];

        if ($request->filled('bio')) {
            $updateData['bio'] = $validated['bio'];
        }

        // Image handling
        if ($request->boolean('remove_image')) {
            $updateData['image'] = null;
        } elseif ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = 'speaker_'.time().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$file->getClientOriginalExtension();

            $destinationPath = public_path('images/speakers');
            if (! file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);

            $altDestination = public_path('new/images/speakers');
            if (file_exists(public_path('new/images'))) {
                if (! file_exists($altDestination)) {
                    mkdir($altDestination, 0755, true);
                }
                @copy($destinationPath.'/'.$filename, $altDestination.'/'.$filename);
            }

            $updateData['image'] = '/images/speakers/'.$filename;
        } elseif (! empty($validated['image_url'])) {
            $updateData['image'] = $validated['image_url'];
        }

        // Bio file handling: If new PDF is uploaded, clear old bio text so PDF itself is downloaded
        if ($request->boolean('remove_bio_file')) {
            $updateData['bio_file'] = null;
        } elseif ($request->hasFile('bio_file_upload')) {
            $file = $request->file('bio_file_upload');
            $filename = 'bio_'.time().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$file->getClientOriginalExtension();

            $destinationPath = public_path('pdf');
            if (! file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);
            $updateData['bio_file'] = '/pdf/'.$filename;
            $updateData['bio'] = null; // Remove previous text content so PDF is downloaded as bio
        } elseif ($request->has('bio_file')) {
            $updateData['bio_file'] = $request->input('bio_file');
        }

        $speaker->update($updateData);

        return back()->with('success', "Panel member '{$speaker->name}' updated successfully.");
    }

    /**
     * Toggle active state of a panel member.
     */
    public function toggleActive(Speaker $speaker): RedirectResponse
    {
        $speaker->update([
            'is_active' => ! $speaker->is_active,
        ]);

        $statusLabel = $speaker->is_active ? 'Visible on website' : 'Hidden from website';

        return back()->with('success', "Panel member '{$speaker->name}' is now {$statusLabel}.");
    }

    /**
     * Remove the specified panel member from storage.
     */
    public function destroy(Speaker $speaker): RedirectResponse
    {
        $name = $speaker->name;
        $speaker->delete();

        return back()->with('success', "Panel member '{$name}' deleted successfully.");
    }
}
