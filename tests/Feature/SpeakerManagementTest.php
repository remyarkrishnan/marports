<?php

namespace Tests\Feature;

use App\Models\Speaker;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class SpeakerManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_speakers_list(): void
    {
        $user = User::first() ?? User::factory()->create();

        $response = $this->actingAs($user)->get(route('admin.speakers'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Speakers')
            ->has('speakers')
            ->has('metrics')
        );
    }

    public function test_admin_can_create_panel_member(): void
    {
        $user = User::first() ?? User::factory()->create();

        $response = $this->actingAs($user)->post(route('admin.speakers.store'), [
            'name' => 'Captain Rajesh Sharma',
            'role' => 'Keynote Speaker',
            'designation' => 'Managing Director & Fleet Head',
            'company' => 'Oceanic Port Services Ltd',
            'bio' => 'Captain Rajesh has over 30 years of maritime operations experience.',
            'bio_file' => '/pdf/ANTONY PRINCE - Bio.pdf',
            'description' => 'Global fleet leadership specialist.',
            'linkedin' => 'https://www.linkedin.com/in/captain-rajesh',
            'topic' => 'Autonomous Port Navigation Systems',
            'sort_order' => 10,
            'is_active' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('speakers', [
            'name' => 'Captain Rajesh Sharma',
            'role' => 'Keynote Speaker',
            'designation' => 'Managing Director & Fleet Head',
            'company' => 'Oceanic Port Services Ltd',
            'bio_file' => '/pdf/ANTONY PRINCE - Bio.pdf',
            'topic' => 'Autonomous Port Navigation Systems',
            'sort_order' => 10,
            'is_active' => 1,
        ]);
    }

    public function test_admin_can_update_panel_member(): void
    {
        $user = User::first() ?? User::factory()->create();
        $speaker = Speaker::create([
            'name' => 'Initial Speaker Name',
            'role' => 'Panelist',
            'designation' => 'Executive Officer',
            'company' => 'Maritime Corp',
            'sort_order' => 5,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->post(route('admin.speakers.update', $speaker), [
            'name' => 'Updated Speaker Name',
            'role' => 'Moderator',
            'designation' => 'Senior Vice President',
            'company' => 'Port Authority of India',
            'bio' => 'Updated biography test content.',
            'sort_order' => 15,
            'is_active' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('speakers', [
            'id' => $speaker->id,
            'name' => 'Updated Speaker Name',
            'role' => 'Moderator',
            'designation' => 'Senior Vice President',
            'sort_order' => 15,
        ]);
    }

    public function test_admin_can_toggle_panel_member_active_status(): void
    {
        $user = User::first() ?? User::factory()->create();
        $speaker = Speaker::create([
            'name' => 'Status Test Speaker',
            'role' => 'Panelist',
            'sort_order' => 1,
            'is_active' => true,
        ]);
        $initialStatus = $speaker->is_active;

        $response = $this->actingAs($user)->post(route('admin.speakers.toggle_active', $speaker));

        $response->assertRedirect();
        $this->assertDatabaseHas('speakers', [
            'id' => $speaker->id,
            'is_active' => ! $initialStatus,
        ]);
    }

    public function test_admin_can_delete_panel_member(): void
    {
        $user = User::first() ?? User::factory()->create();
        $speaker = Speaker::create([
            'name' => 'To Be Deleted Panelist',
            'role' => 'Panelist',
            'sort_order' => 99,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->delete(route('admin.speakers.destroy', $speaker));

        $response->assertRedirect();
        $this->assertDatabaseMissing('speakers', [
            'id' => $speaker->id,
            'name' => 'To Be Deleted Panelist',
        ]);
    }

    public function test_public_website_loads_dynamic_panel_members(): void
    {
        $response = $this->get(route('home'));
        $response->assertStatus(200);

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('speakers')
        );
    }

    public function test_public_speaker_bio_view_and_download(): void
    {
        $speaker = Speaker::create([
            'name' => 'Dr. Elena Vance',
            'role' => 'Panelist',
            'designation' => 'Director of Ocean Decarbonization',
            'company' => 'Global Maritime Research Institute',
            'bio' => 'Dr. Elena has led groundbreaking studies on green maritime corridors across the Pacific and Indian oceans.',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        // Screen view
        $response = $this->get(route('speaker.bio', ['id' => $speaker->id]));
        $response->assertStatus(200);
        $response->assertSee('Dr. Elena Vance');
        $response->assertSee('Director of Ocean Decarbonization');
        $response->assertSee('Global Maritime Research Institute');
        $response->assertSee('green maritime corridors');
        $response->assertSee('Download Bio (Save as PDF)');

        // Print/Download view
        $printResponse = $this->get(route('speaker.bio', ['id' => $speaker->id, 'print' => 1]));
        $printResponse->assertStatus(200);
        $printResponse->assertSee('window.print()');
    }

    public function test_uploaded_bio_file_is_downloaded_as_bio_and_removes_text_content(): void
    {
        $user = User::first() ?? User::factory()->create();

        // 1. Initial speaker with text content and no uploaded bio file
        $speaker = Speaker::create([
            'name' => 'Capt. Sarah Jenkins',
            'role' => 'Panelist',
            'designation' => 'Senior Marine Superintendent',
            'company' => 'Pacific Energy Logistics',
            'bio' => 'Initial text description for download bio.',
            'bio_file' => null,
            'sort_order' => 10,
            'is_active' => true,
        ]);

        // Prior to file upload, bio page shows their text description
        $initialBioPage = $this->get(route('speaker.bio', ['id' => $speaker->id]));
        $initialBioPage->assertStatus(200);
        $initialBioPage->assertSee('Capt. Sarah Jenkins');
        $initialBioPage->assertSee('Initial text description for download bio.');

        // 2. Upload a new PDF as bio for this speaker
        $tempPdf = UploadedFile::fake()->create('sarah_bio.pdf', 100, 'application/pdf');

        $response = $this->actingAs($user)->post(route('admin.speakers.update', $speaker), [
            'name' => 'Capt. Sarah Jenkins',
            'role' => 'Panelist',
            'designation' => 'Senior Marine Superintendent',
            'company' => 'Pacific Energy Logistics',
            'sort_order' => 10,
            'is_active' => true,
            'bio_file_upload' => $tempPdf,
        ]);

        $response->assertRedirect();
        $speaker->refresh();

        // Previous text content is removed and bio_file is set
        $this->assertNull($speaker->bio);
        $this->assertNotNull($speaker->bio_file);
        $this->assertStringStartsWith('/pdf/bio_', $speaker->bio_file);

        // Downloading/accessing bio returns the uploaded PDF directly
        $pdfResponse = $this->get(route('speaker.bio', ['id' => $speaker->id]));
        $pdfResponse->assertStatus(200);
        $pdfResponse->assertHeader('content-type', 'application/pdf');
    }

    public function test_new_panel_member_with_uploaded_pdf_has_no_text_bio_and_downloads_pdf(): void
    {
        $user = User::first() ?? User::factory()->create();
        $tempPdf = UploadedFile::fake()->create('new_member_bio.pdf', 150, 'application/pdf');

        $response = $this->actingAs($user)->post(route('admin.speakers.store'), [
            'name' => 'New Panel Leader',
            'role' => 'Panelist',
            'designation' => 'Director of Port Strategy',
            'company' => 'International Maritime Council',
            'sort_order' => 20,
            'is_active' => true,
            'bio_file_upload' => $tempPdf,
        ]);

        $response->assertRedirect();
        $newSpeaker = Speaker::where('name', 'New Panel Leader')->first();
        $this->assertNotNull($newSpeaker);
        $this->assertNull($newSpeaker->bio);
        $this->assertNotNull($newSpeaker->bio_file);

        // Bio endpoint directly serves the uploaded PDF
        $bioResponse = $this->get(route('speaker.bio', ['id' => $newSpeaker->id]));
        $bioResponse->assertStatus(200);
        $bioResponse->assertHeader('content-type', 'application/pdf');
    }
}
