<?php

namespace Database\Seeders;

use App\Models\CmsPage;
use Illuminate\Database\Seeder;

class CmsPagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            // Global Header Menu
            [
                'title' => 'Global Navigation Bar',
                'slug' => 'global-header-menu',
                'category' => 'Global Header Menu',
                'menu_label' => 'Header Nav',
                'route_path' => '#',
                'meta_description' => 'Main navigation header configuration, logo, and quick CTA buttons.',
                'status' => 'published',
                'sort_order' => 1,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],

            // Main Menu
            [
                'title' => 'Home Page',
                'slug' => 'home',
                'category' => 'Main Menu',
                'menu_label' => 'Home',
                'route_path' => '/',
                'meta_description' => 'MARPORTS GLOBAL 2027 – Conference & Excellence Awards | Chennai, India',
                'status' => 'published',
                'sort_order' => 2,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],
            [
                'title' => 'About Marports Global',
                'slug' => 'about',
                'category' => 'Main Menu',
                'menu_label' => 'About',
                'route_path' => '/#about',
                'meta_description' => 'Premier international platform uniting global ports, shipping operators, and maritime technology visionaries.',
                'status' => 'published',
                'sort_order' => 3,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],
            [
                'title' => 'Conference Topics Overview',
                'slug' => 'conference-topics',
                'category' => 'Main Menu',
                'menu_label' => 'Conference Topics',
                'route_path' => '/#topics',
                'meta_description' => 'Key thematic pillars: Sustainable Green Shipping, Port Infrastructure, Modern Shipyards, and Smart Port Ecosystems.',
                'status' => 'published',
                'sort_order' => 4,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],
            [
                'title' => 'Gallery & Media',
                'slug' => 'gallery',
                'category' => 'Main Menu',
                'menu_label' => 'Gallery',
                'route_path' => '/#gallery',
                'meta_description' => 'High-resolution photo coverage, networking recaps, and video highlights from previous summits.',
                'status' => 'published',
                'sort_order' => 5,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],
            [
                'title' => 'Events & Industry News',
                'slug' => 'events-news',
                'category' => 'Main Menu',
                'menu_label' => 'Events & News',
                'route_path' => '/#news',
                'meta_description' => 'Latest press releases, keynote speaker announcements, and industry updates.',
                'status' => 'published',
                'sort_order' => 6,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],
            [
                'title' => 'Marports Global 2026 Edition',
                'slug' => 'marports-global-2026',
                'category' => 'Main Menu',
                'menu_label' => '2026 Edition',
                'route_path' => '/#past-edition',
                'meta_description' => 'Recap of MARPORTS GLOBAL 2026 at Lemon Tree Hotel, Trivandrum, India.',
                'status' => 'published',
                'sort_order' => 7,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],
            [
                'title' => 'Advisory Board 2026',
                'slug' => 'advisory-board-2026',
                'category' => 'Main Menu',
                'menu_label' => '2026 Advisory Board',
                'route_path' => '/#board-2026',
                'meta_description' => 'Distinguished leaders and patrons guiding the 2026 inaugural edition.',
                'status' => 'published',
                'sort_order' => 8,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],

            // Conference Topics Sub Menu
            [
                'title' => 'Confirmed Speakers & Panelists',
                'slug' => 'speakers-panelists',
                'category' => 'Conference Topics Sub Menu',
                'menu_label' => 'Speakers & Panelists',
                'route_path' => '/#speakers',
                'meta_description' => 'Distinguished maritime leaders, ministry dignitaries, and keynote visionaries.',
                'status' => 'published',
                'sort_order' => 9,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],
            [
                'title' => 'Conference Agenda & Schedule',
                'slug' => 'conference-agenda',
                'category' => 'Conference Topics Sub Menu',
                'menu_label' => 'Agenda',
                'route_path' => '/#agenda',
                'meta_description' => 'Full summit timetable, panel sessions, networking luncheons, and gala awards schedule.',
                'status' => 'published',
                'sort_order' => 10,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],
            [
                'title' => 'Advisory Board 2027',
                'slug' => 'advisory-board-2027',
                'category' => 'Conference Topics Sub Menu',
                'menu_label' => 'Advisory Board',
                'route_path' => '/#advisory-board',
                'meta_description' => 'Eminent executive board directing the MARPORTS GLOBAL 2027 summit strategy.',
                'status' => 'published',
                'sort_order' => 11,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],

            // Awards Sub Menu
            [
                'title' => 'Awards Categories (30 Categories)',
                'slug' => 'awards-categories',
                'category' => 'Awards Sub Menu',
                'menu_label' => 'Categories',
                'route_path' => '/#awards',
                'meta_description' => '30 Official Maritime Excellence Award categories recognizing industry pioneers.',
                'status' => 'published',
                'sort_order' => 12,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],
            [
                'title' => 'Maritime Excellence Awards Overview',
                'slug' => 'awards-overview',
                'category' => 'Awards Sub Menu',
                'menu_label' => 'Awards',
                'route_path' => '/#awards-overview',
                'meta_description' => 'The premier benchmark of prestige in global shipping, logistics, and port engineering.',
                'status' => 'published',
                'sort_order' => 13,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],
            [
                'title' => 'Award Nomination Rules & Guidelines',
                'slug' => 'awards-rules',
                'category' => 'Awards Sub Menu',
                'menu_label' => 'Rules',
                'route_path' => '/#awards-rules',
                'meta_description' => 'Criteria, jury assessment protocol, and submission guidelines for awards.',
                'status' => 'published',
                'sort_order' => 14,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],
            [
                'title' => 'Past Award Winners Showcase',
                'slug' => 'awards-winners',
                'category' => 'Awards Sub Menu',
                'menu_label' => 'Winners',
                'route_path' => '/#awards-winners',
                'meta_description' => 'Honoring the decorated laureates and organizations celebrated at MARPORTS GLOBAL.',
                'status' => 'published',
                'sort_order' => 15,
                'last_edited_by' => 'admin@marportsglobal.com',
            ],
        ];

        foreach ($pages as $page) {
            CmsPage::updateOrCreate(
                ['slug' => $page['slug']],
                $page
            );
        }
    }
}
