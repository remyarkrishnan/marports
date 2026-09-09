<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminPageController extends Controller
{
    public function index(): Response
    {
        $pages = CmsPage::orderBy('sort_order', 'asc')->get();

        $categories = [
            'Global Header Menu' => $pages->where('category', 'Global Header Menu')->values(),
            'Main Menu' => $pages->where('category', 'Main Menu')->values(),
            'Conference Topics Sub Menu' => $pages->where('category', 'Conference Topics Sub Menu')->values(),
            'Awards Sub Menu' => $pages->where('category', 'Awards Sub Menu')->values(),
        ];

        return Inertia::render('Admin/Pages', [
            'categories' => $categories,
            'totalPages' => $pages->count(),
            'publishedCount' => $pages->where('status', 'published')->count(),
            'draftCount' => $pages->where('status', 'draft')->count(),
        ]);
    }

    public function update(Request $request, CmsPage $page)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'menu_label' => ['required', 'string', 'max:255'],
            'route_path' => ['required', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:published,draft'],
        ]);

        $page->update([
            'title' => $validated['title'],
            'menu_label' => $validated['menu_label'],
            'route_path' => $validated['route_path'],
            'meta_description' => $validated['meta_description'] ?? null,
            'status' => $validated['status'],
            'last_edited_by' => Auth::user()->email ?? 'System Admin',
        ]);

        return back()->with('success', "Page '{$page->title}' updated successfully.");
    }

    public function toggleStatus(CmsPage $page)
    {
        $newStatus = $page->status === 'published' ? 'draft' : 'published';
        $page->update([
            'status' => $newStatus,
            'last_edited_by' => Auth::user()->email ?? 'System Admin',
        ]);

        return back()->with('success', "Page status updated to {$newStatus}.");
    }

    public function studio(string|int $page): Response
    {
        $pageModel = is_numeric($page)
            ? CmsPage::where('id', $page)->firstOrFail()
            : CmsPage::where('slug', $page)->orWhere('id', $page)->firstOrFail();

        $allPages = CmsPage::orderBy('sort_order', 'asc')->get();

        $rawRoute = $pageModel->route_path === '#' ? '/' : $pageModel->route_path;

        // Parse path and hash
        $parts = explode('#', $rawRoute, 2);
        $path = $parts[0] ?: '/';
        $hash = $parts[1] ?? '';

        // Map page slug to DOM section ID
        $slugToHash = [
            'home' => 'hero',
            'about' => 'about',
            'conference-topics' => 'topics',
            'gallery' => 'gallery',
            'events-news' => 'events-news',
            'marports-global-2026' => 'past-edition',
            'advisory-board-2026' => 'advisory-board',
            'awards' => 'awards',
        ];

        if (empty($hash) && isset($slugToHash[$pageModel->slug])) {
            $hash = $slugToHash[$pageModel->slug];
        }

        // Query string must come before anchor hash
        $queryGlue = str_contains($path, '?') ? '&' : '?';
        $queryString = $queryGlue.'live_studio=1&section='.urlencode($pageModel->slug).($hash ? '&target_hash='.urlencode($hash) : '');
        $previewUrl = url($path.$queryString).($hash ? '#'.$hash : '');
        $liveUrl = url($rawRoute);

        return Inertia::render('Admin/Studio', [
            'page' => $pageModel,
            'allPages' => $allPages,
            'previewUrl' => $previewUrl,
            'liveUrl' => $liveUrl,
            'initialContentBlocks' => $pageModel->content_blocks ?? [],
        ]);
    }

    public function saveStudio(Request $request, string|int $page)
    {
        $pageModel = is_numeric($page)
            ? CmsPage::where('id', $page)->firstOrFail()
            : CmsPage::where('slug', $page)->orWhere('id', $page)->firstOrFail();

        $validated = $request->validate([
            'content_blocks' => ['nullable', 'array'],
            'menu_label' => ['nullable', 'string', 'max:255'],
            'navigation_menus' => ['nullable', 'array'],
        ]);

        $updateData = [
            'last_edited_by' => Auth::user()->email ?? 'System Admin',
        ];

        if (isset($validated['content_blocks'])) {
            $updateData['content_blocks'] = $validated['content_blocks'];
        }

        if (! empty($validated['menu_label'])) {
            $updateData['menu_label'] = $validated['menu_label'];
        }

        $pageModel->update($updateData);

        // Update menu names if provided
        if (! empty($validated['navigation_menus'])) {
            foreach ($validated['navigation_menus'] as $slug => $label) {
                if (! empty($label)) {
                    CmsPage::where('slug', $slug)->update(['menu_label' => $label]);
                }
            }
        }

        return back()->with('success', 'Studio changes saved and published successfully.');
    }
}
