<?php

namespace Database\Seeders;

use App\Models\CmsSetting;
use Illuminate\Database\Seeder;

class EventSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'event_name', 'value' => 'MARPORTS GLOBAL 2027', 'group' => 'event'],
            ['key' => 'event_edition', 'value' => 'Conference & Excellence Awards', 'group' => 'event'],
            ['key' => 'event_date', 'value' => '2027-02-05', 'group' => 'event'],
            ['key' => 'event_date_display', 'value' => '5th February 2027', 'group' => 'event'],
            ['key' => 'event_venue', 'value' => 'Taj Coromandel', 'group' => 'event'],
            ['key' => 'event_city', 'value' => 'Chennai', 'group' => 'event'],
            ['key' => 'event_state', 'value' => 'Tamil Nadu', 'group' => 'event'],
            ['key' => 'event_country', 'value' => 'India', 'group' => 'event'],
            ['key' => 'organizer_name', 'value' => 'E HUB EVENTS PRIVATE LIMITED', 'group' => 'contact'],
            ['key' => 'organizer_url', 'value' => 'https://www.ehub.events', 'group' => 'contact'],
            ['key' => 'contact_email', 'value' => 'jayadev@marportsglobal.com', 'group' => 'contact'],
            ['key' => 'awards_email', 'value' => 'awards@marportsglobal.com', 'group' => 'contact'],
            ['key' => 'contact_phone', 'value' => '+91 9633958465', 'group' => 'contact'],
            ['key' => 'registration_url', 'value' => 'https://ehub.events/events?register=marports', 'group' => 'event'],
        ];

        foreach ($settings as $item) {
            CmsSetting::updateOrCreate(
                ['key' => $item['key']],
                ['value' => $item['value'], 'group' => $item['group']]
            );
        }
    }
}
