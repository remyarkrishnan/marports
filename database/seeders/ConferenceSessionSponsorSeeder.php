<?php

namespace Database\Seeders;

use App\Models\Sponsor;
use Illuminate\Database\Seeder;

class ConferenceSessionSponsorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Sponsor::updateOrCreate(
            ['name' => 'Sankri Maritime Solutions Pvt Ltd'],
            [
                'type' => 'Conference Session Sponsor',
                'description' => 'Conference Session Sponsor for MARPORTS GLOBAL 2027',
                'logo' => '/new/images/sponsors/sankri-maritime-logo.svg',
                'website_url' => null,
                'sort_order' => 4,
                'is_active' => true,
            ]
        );
    }
}
