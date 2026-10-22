<?php

namespace Database\Seeders;

use App\Models\Sponsor;
use Illuminate\Database\Seeder;

class StrategicPartnerSeeder extends Seeder
{
    /**
     * Run the database seeds for Strategic Partner only.
     */
    public function run(): void
    {
        // Check if existing non-strategic sponsors are currently at sort_order 1
        $hasSortOrderConflict = Sponsor::where('name', '!=', 'Directorate General of Maritime Administration')
            ->where('sort_order', 1)
            ->exists();

        if ($hasSortOrderConflict) {
            // Re-align default tiers to make space for Strategic Partner as Tier 1:
            // Tier 2: Premier Sponsor
            Sponsor::where('name', 'AS Gold Sponsor')->update(['sort_order' => 2]);

            // Tier 3: Registration & Badge
            Sponsor::whereIn('name', [
                'Mazagon Dock Shipbuilders Limited',
                'Algihaz Marine Contractors',
            ])->update(['sort_order' => 3]);

            // Tier 4: Lunch & Coffee
            Sponsor::whereIn('name', [
                'ABS Marine Services Ltd',
                'GRSE (Garden Reach Shipbuilders & Engineers)',
            ])->update(['sort_order' => 4]);

            // Tier 5: Table Top
            Sponsor::where('name', 'Nirmon Marine & Offshore Design Pvt Ltd')->update(['sort_order' => 5]);

            // Tier 6: Associate Sponsors
            Sponsor::whereIn('name', [
                'KNK Ship Management',
                'Core Axis Maritime Solutions L.L.C',
            ])->update(['sort_order' => 6]);

            // Tier 7: Promoting Organisations
            Sponsor::whereIn('name', [
                'Port of Rotterdam',
                'Institute of Chartered Shipbrokers (Madras Branch)',
                "INSA (Indian National Shipowners' Association - ESTD. 1929)",
                'SAI (Shipyards Association of India)',
                "ASA (Asian Shipowners' Association)",
                'Institution of Naval Architects',
            ])->update(['sort_order' => 7]);

            // For any other existing sponsor still at 1, increment to 2
            Sponsor::where('name', '!=', 'Directorate General of Maritime Administration')
                ->where('sort_order', 1)
                ->increment('sort_order');
        }

        // Create or update Directorate General of Maritime Administration as Strategic Partner
        $sponsor = Sponsor::updateOrCreate(
            ['name' => 'Directorate General of Maritime Administration'],
            [
                'type' => 'Strategic Partner',
                'description' => 'Strategic Partner for MARPORTS GLOBAL 2027',
                'logo' => '/new/images/sponsors/directorate-general-of-maritime-administration.jpg',
                'website_url' => 'https://dgshipping.gov.in/',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        $this->command?->info("Strategic Partner '{$sponsor->name}' (ID: {$sponsor->id}) seeded successfully with sort_order 1.");
    }
}
