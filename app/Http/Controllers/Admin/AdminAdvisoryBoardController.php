<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdvisoryBoardMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminAdvisoryBoardController extends Controller
{
    /**
     * Display a listing of Advisory Board 2027 members in CMS.
     */
    public function index(Request $request): Response
    {
        $members = AdvisoryBoardMember::ordered()->get();

        $metrics = [
            'total' => $members->count(),
            'active' => $members->where('is_active', true)->count(),
            'inactive' => $members->where('is_active', false)->count(),
            'with_bio_file' => $members->filter(fn ($m) => ! empty($m->bio_file))->count(),
        ];

        // Scan public/pdf directory for existing files to offer as quick attachment
        $existingPdfFiles = [];
        $pdfDir = public_path('pdf');
        if (file_exists($pdfDir)) {
            $files = scandir($pdfDir);
            foreach ($files as $file) {
                if ($file !== '.' && $file !== '..' && in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), ['pdf', 'doc', 'docx', 'txt'])) {
                    $existingPdfFiles[] = [
                        'filename' => $file,
                        'path' => '/pdf/'.$file,
                    ];
                }
            }
        }

        return Inertia::render('Admin/AdvisoryBoard', [
            'members' => $members,
            'metrics' => $metrics,
            'existingPdfFiles' => $existingPdfFiles,
        ]);
    }

    /**
     * Store a newly created Advisory Board member.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'designation' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'initials' => ['nullable', 'string', 'max:10'],
            'bio_file_upload' => ['nullable', 'file', 'mimes:pdf,doc,docx,txt', 'max:25600'],
            'bio_file' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string', 'max:2000'],
            'linkedin' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['required', 'integer', 'min:1', 'max:999'],
            'is_active' => ['boolean'],
            'image_file' => ['nullable', 'file', 'image', 'max:10240'],
            'image_url' => ['nullable', 'string', 'max:1000'],
        ]);

        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = 'advisory_'.time().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$file->getClientOriginalExtension();

            $destinationPath = public_path('images/advisory');
            if (! file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);

            $altDestination = public_path('new/images/advisory');
            if (file_exists(public_path('new/images'))) {
                if (! file_exists($altDestination)) {
                    mkdir($altDestination, 0755, true);
                }
                @copy($destinationPath.'/'.$filename, $altDestination.'/'.$filename);
            }

            $imagePath = '/images/advisory/'.$filename;
        } elseif (! empty($validated['image_url'])) {
            $imagePath = $validated['image_url'];
        }

        // Bio file handling: Uploaded PDF is directly downloaded as bio
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

        // Compute initials if not supplied
        $initials = ! empty($validated['initials']) ? strtoupper(trim($validated['initials'])) : $this->generateInitials($validated['name']);

        AdvisoryBoardMember::create([
            'name' => $validated['name'],
            'designation' => $validated['designation'] ?? null,
            'company' => $validated['company'] ?? null,
            'role' => ! empty($validated['role']) ? $validated['role'] : 'Advisory Board',
            'initials' => $initials,
            'image' => $imagePath,
            'bio' => null, // New members use uploaded PDF bio
            'bio_file' => $bioFilePath,
            'description' => $validated['description'] ?? null,
            'linkedin' => $validated['linkedin'] ?? null,
            'sort_order' => (int) $validated['sort_order'],
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', "Advisory Board member '{$validated['name']}' added successfully.");
    }

    /**
     * Update the specified Advisory Board member in storage.
     */
    public function update(Request $request, AdvisoryBoardMember $member): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'designation' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'initials' => ['nullable', 'string', 'max:10'],
            'bio_file_upload' => ['nullable', 'file', 'mimes:pdf,doc,docx,txt', 'max:25600'],
            'bio_file' => ['nullable', 'string', 'max:1000'],
            'remove_bio_file' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string', 'max:2000'],
            'linkedin' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['required', 'integer', 'min:1', 'max:999'],
            'is_active' => ['boolean'],
            'image_file' => ['nullable', 'file', 'image', 'max:10240'],
            'image_url' => ['nullable', 'string', 'max:1000'],
            'remove_image' => ['nullable', 'boolean'],
        ]);

        $initials = ! empty($validated['initials']) ? strtoupper(trim($validated['initials'])) : $this->generateInitials($validated['name']);

        $updateData = [
            'name' => $validated['name'],
            'designation' => $validated['designation'] ?? null,
            'company' => $validated['company'] ?? null,
            'role' => ! empty($validated['role']) ? $validated['role'] : 'Advisory Board',
            'initials' => $initials,
            'description' => $validated['description'] ?? null,
            'linkedin' => $validated['linkedin'] ?? null,
            'sort_order' => (int) $validated['sort_order'],
            'is_active' => $request->boolean('is_active', true),
        ];

        if ($request->filled('bio')) {
            $updateData['bio'] = $request->input('bio');
        }

        // Image handling
        if ($request->boolean('remove_image')) {
            $updateData['image'] = null;
        } elseif ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = 'advisory_'.time().'_'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$file->getClientOriginalExtension();

            $destinationPath = public_path('images/advisory');
            if (! file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);

            $altDestination = public_path('new/images/advisory');
            if (file_exists(public_path('new/images'))) {
                if (! file_exists($altDestination)) {
                    mkdir($altDestination, 0755, true);
                }
                @copy($destinationPath.'/'.$filename, $altDestination.'/'.$filename);
            }

            $updateData['image'] = '/images/advisory/'.$filename;
        } elseif (! empty($validated['image_url'])) {
            $updateData['image'] = $validated['image_url'];
        }

        // Bio file handling: If new PDF is uploaded, remove previous text content so PDF is downloaded
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

        $member->update($updateData);

        return back()->with('success', "Advisory Board member '{$member->name}' updated successfully.");
    }

    /**
     * Toggle active state of an Advisory Board member.
     */
    public function toggleActive(AdvisoryBoardMember $member): RedirectResponse
    {
        $member->update([
            'is_active' => ! $member->is_active,
        ]);

        $statusText = $member->is_active ? 'active and live' : 'hidden from public website';

        return back()->with('success', "Member '{$member->name}' is now {$statusText}.");
    }

    /**
     * Remove the specified Advisory Board member from storage.
     */
    public function destroy(AdvisoryBoardMember $member): RedirectResponse
    {
        $name = $member->name;
        $member->delete();

        return back()->with('success', "Advisory Board member '{$name}' deleted successfully.");
    }

    /**
     * Generate initials from member name (e.g. 'Biju George' -> 'BG').
     */
    private function generateInitials(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name));
        $initials = '';
        foreach ($parts as $part) {
            $cleaned = preg_replace('/[^a-zA-Z]/', '', $part);
            if (! empty($cleaned)) {
                $initials .= strtoupper($cleaned[0]);
            }
            if (strlen($initials) >= 3) {
                break;
            }
        }

        return $initials ?: 'AB';
    }
}
