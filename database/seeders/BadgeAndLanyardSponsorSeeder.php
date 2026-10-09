<?php

namespace Database\Seeders;

use App\Models\Sponsor;
use Illuminate\Database\Seeder;

class BadgeAndLanyardSponsorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sponsor = Sponsor::updateOrCreate(
            ['name' => 'Algihaz Marine Contractors'],
            [
                'type' => 'Badge and Lanyard Sponsor',
                'description' => 'Badge and Lanyard Sponsor',
                'logo' => '/new/images/sponsors/algihaz-logo.png',
                'website_url' => 'https://algihazmarine.com/',
                'sort_order' => 2,
                'is_active' => true,
            ]
        );

        $this->command?->info("Sponsor '{$sponsor->name}' (ID: {$sponsor->id}) seeded successfully with sort_order {$sponsor->sort_order}.");
    }
}
