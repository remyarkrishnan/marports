<?php

namespace Database\Seeders;

use App\Models\Sponsor;
use Illuminate\Database\Seeder;

class SponsorsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sponsors = [
            // Tier 1: Registration Area Sponsor (sort_order: 1)
            [
                'name' => 'Mazagon Dock Shipbuilders Limited',
                'type' => 'Registration Area Sponsor',
                'description' => 'Lead Maritime Partner & Registration Area Sponsor',
                'logo' => null,
                'website_url' => 'https://mazagondock.in',
                'sort_order' => 1,
                'is_active' => true,
            ],

            // Tier 2: Lunch & Coffee Sponsors (sort_order: 2 -> both appear in the same row)
            [
                'name' => 'ABS Marine Services Ltd',
                'type' => 'Lunch & Coffee Sponsor',
                'description' => 'Ship Management, Coastal Operations & Marine Services',
                'logo' => null,
                'website_url' => 'https://absmarine.com',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'GRSE (Garden Reach Shipbuilders & Engineers)',
                'type' => 'Lunch & Coffee Sponsor',
                'description' => 'Premier Defence Shipyard of India',
                'logo' => null,
                'website_url' => 'https://grse.in',
                'sort_order' => 2,
                'is_active' => true,
            ],

            // Tier 3: Table Top & Associate Sponsors (sort_order: 3 -> appear together in the same row)
            [
                'name' => 'Nirmon Marine & Offshore Design Pvt Ltd',
                'type' => 'Table Top Sponsor',
                'description' => 'Specialized Naval Architecture & Offshore Design',
                'logo' => null,
                'website_url' => null,
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'KNK Ship Management',
                'type' => 'Associate Sponsor',
                'description' => 'Global Fleet Manning, Ship Technical & Crew Management',
                'logo' => null,
                'website_url' => null,
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Core Axis Maritime Solutions L.L.C',
                'type' => 'Associate Sponsor',
                'description' => 'Commercial Advisory & Marine Engineering Solutions',
                'logo' => null,
                'website_url' => null,
                'sort_order' => 3,
                'is_active' => true,
            ],

            // Tier 4: Promoting Organisation (sort_order: 4)
            [
                'name' => 'Port of Rotterdam',
                'type' => 'Promoting Organisation',
                'description' => 'Global Maritime Hub & Clean Energy Pioneer',
                'logo' => null,
                'website_url' => 'https://portofrotterdam.com',
                'sort_order' => 4,
                'is_active' => true,
            ],

            // Tier 5: Supporting Organisations (sort_order: 5 -> all appear together in the same row)
            [
                'name' => 'Institute of Chartered Shipbrokers (Madras Branch)',
                'type' => 'Supporting Organisation',
                'description' => 'Professional Commercial Shipping Education & Fellowship',
                'logo' => null,
                'website_url' => null,
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => "INSA (Indian National Shipowners' Association - ESTD. 1929)",
                'type' => 'Supporting Organisation',
                'description' => 'Apex Association of Indian Shipping Lines',
                'logo' => null,
                'website_url' => null,
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'SAI (Shipyards Association of India)',
                'type' => 'Supporting Organisation',
                'description' => 'National Shipyard Representation & Industrial Council',
                'logo' => null,
                'website_url' => null,
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => "ASA (Asian Shipowners' Association)",
                'type' => 'Supporting Organisation',
                'description' => 'Representing Shipowners across the Asian Region',
                'logo' => null,
                'website_url' => null,
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Institution of Naval Architects',
                'type' => 'Supporting Organisation',
                'description' => 'Advancement of Naval Architecture and Marine Engineering',
                'logo' => null,
                'website_url' => null,
                'sort_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($sponsors as $data) {
            Sponsor::updateOrCreate(
                ['name' => $data['name']],
                $data
            );
        }
    }
}
