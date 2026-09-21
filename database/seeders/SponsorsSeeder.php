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
            // Tier 1: Premier Sponsor (sort_order: 1)
            [
                'name' => 'AS Gold Sponsor',
                'type' => 'Premier Sponsor',
                'description' => 'Lead Maritime Partner & Premier Sponsor',
                'logo' => '/new/images/sponsors/sponsor_1788931598_whatsapp-image-2026-09-09-at-102744.jpeg',
                'website_url' => 'https://india.globalpsa.com/',
                'sort_order' => 1,
                'is_active' => true,
            ],

            // Tier 2: Registration Area Sponsor (sort_order: 2)
            [
                'name' => 'Mazagon Dock Shipbuilders Limited',
                'type' => 'Registration Area Sponsor',
                'description' => 'Lead Maritime Partner & Registration Area Sponsor',
                'logo' => '/new/images/sponsors/mazagon-dock-logo.jpg',
                'website_url' => 'https://mazagondock.in/',
                'sort_order' => 2,
                'is_active' => true,
            ],

            // Tier 3: Lunch & Coffee Sponsors and Table Top Sponsor (sort_order: 3 -> appear together in the same row)
            [
                'name' => 'ABS Marine Services Ltd',
                'type' => 'Lunch & Coffee Sponsor',
                'description' => 'Ship Management, Coastal Operations & Marine Services',
                'logo' => '/new/images/sponsors/abs-marine-services-logo.jpg',
                'website_url' => 'https://absmarine.com/',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'GRSE (Garden Reach Shipbuilders & Engineers)',
                'type' => 'Lunch & Coffee Sponsor',
                'description' => 'Premier Defence Shipyard of India',
                'logo' => '/new/images/sponsors/grse-logo.jpg',
                'website_url' => 'https://grse.in/',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Nirmon Marine & Offshore Design Pvt Ltd',
                'type' => 'Table Top Sponsor',
                'description' => 'Specialized Naval Architecture & Offshore Design',
                'logo' => '/new/images/sponsors/nirmon-marine-logo.jpg',
                'website_url' => 'https://www.nirmondesign.com/',
                'sort_order' => 3,
                'is_active' => true,
            ],

            // Tier 4: Associate Sponsors (sort_order: 4 -> appear together in the same row)
            [
                'name' => 'KNK Ship Management',
                'type' => 'Associate Sponsor',
                'description' => 'Global Fleet Manning, Ship Technical & Crew Management',
                'logo' => '/new/images/sponsors/knk-ship-management-logo.jpg',
                'website_url' => 'https://knkshipping.co.in/',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Core Axis Maritime Solutions L.L.C',
                'type' => 'Associate Sponsor',
                'description' => 'Commercial Advisory & Marine Engineering Solutions',
                'logo' => '/new/images/sponsors/core-axis-maritime-logo.jpg',
                'website_url' => 'https://coreaxismaritime.com/',
                'sort_order' => 4,
                'is_active' => true,
            ],

            // Tier 5: Promoting Organisations (sort_order: 5 -> all consolidated under PROMOTING ORGANISATIONS)
            [
                'name' => 'Port of Rotterdam',
                'type' => 'Promoting Organisation',
                'description' => 'Global Maritime Hub & Clean Energy Pioneer',
                'logo' => '/new/images/sponsors/port-of-rotterdam-logo.png',
                'website_url' => 'https://www.portofrotterdam.com/en',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Institute of Chartered Shipbrokers (Madras Branch)',
                'type' => 'Promoting Organisation',
                'description' => 'Professional Commercial Shipping Education & Fellowship',
                'logo' => '/new/images/sponsors/ics-madras-logo.jpg',
                'website_url' => 'https://www.ics.org.uk/',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => "INSA (Indian National Shipowners' Association - ESTD. 1929)",
                'type' => 'Promoting Organisation',
                'description' => 'Apex Association of Indian Shipping Lines',
                'logo' => '/new/images/sponsors/insa-logo.jpg',
                'website_url' => 'https://www.insa.org.in/',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'SAI (Shipyards Association of India)',
                'type' => 'Promoting Organisation',
                'description' => 'National Shipyard Representation & Industrial Council',
                'logo' => '/new/images/sponsors/sai-logo.jpg',
                'website_url' => 'https://www.shipyardsassociationofindia.com/',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => "ASA (Asian Shipowners' Association)",
                'type' => 'Promoting Organisation',
                'description' => 'Representing Shipowners across the Asian Region',
                'logo' => '/new/images/sponsors/asa-logo.png',
                'website_url' => 'https://asianshipowners.org/',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Institution of Naval Architects',
                'type' => 'Promoting Organisation',
                'description' => 'Technical Guidance & Naval Architecture Excellence',
                'logo' => '/new/images/sponsors/ina-logo.jpg',
                'website_url' => 'https://inaindia.co.in/',
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
