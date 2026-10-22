<?php

namespace Tests\Feature;

use App\Models\AdvisoryBoardMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class AdvisoryBoardManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_advisory_board_list(): void
    {
        $user = User::first() ?? User::factory()->create();

        $response = $this->actingAs($user)->get(route('admin.advisory_board'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/AdvisoryBoard')
            ->has('members')
            ->has('metrics')
        );
    }

    public function test_admin_can_create_advisory_board_member_with_uploaded_pdf(): void
    {
        $user = User::first() ?? User::factory()->create();
        $fakePdf = UploadedFile::fake()->create('council_member_bio.pdf', 120, 'application/pdf');

        $response = $this->actingAs($user)->post(route('admin.advisory_board.store'), [
            'name' => 'Vice Admiral S. K. Nair',
            'role' => 'Advisory Board',
            'designation' => 'Former Chief of Material, Indian Navy',
            'company' => 'National Maritime Foundation',
            'initials' => 'SKN',
            'sort_order' => 10,
            'is_active' => true,
            'bio_file_upload' => $fakePdf,
        ]);

        $response->assertRedirect();
        $member = AdvisoryBoardMember::where('name', 'Vice Admiral S. K. Nair')->first();
        $this->assertNotNull($member);
        $this->assertEquals('SKN', $member->initials);
        $this->assertNull($member->bio);
        $this->assertNotNull($member->bio_file);
        $this->assertStringStartsWith('/pdf/bio_', $member->bio_file);

        // Public panel chair bio endpoint directly serves the uploaded PDF
        $bioResponse = $this->get(route('panel_chair.bio', ['id' => $member->id]));
        $bioResponse->assertStatus(200);
        $bioResponse->assertHeader('content-type', 'application/pdf');
    }

    public function test_existing_advisory_board_member_without_uploaded_pdf_retains_bio_content(): void
    {
        $member = AdvisoryBoardMember::create([
            'name' => 'Cmde PR Hari, IN (Retd.)',
            'role' => 'Advisory Board',
            'designation' => 'Chairman & Managing Director',
            'company' => 'Garden Reach Shipbuilders & Engineers Ltd',
            'initials' => 'PRH',
            'bio' => 'Cmde PR Hari has defined an ambitious Vision for GRSE and Indian shipbuilding.',
            'bio_file' => null,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        // Screen view contains their description
        $response = $this->get(route('panel_chair.bio', ['id' => $member->id]));
        $response->assertStatus(200);
        $response->assertSee('Cmde PR Hari, IN (Retd.)');
        $response->assertSee('Chairman &amp; Managing Director', false);
        $response->assertSee('Cmde PR Hari has defined an ambitious Vision');

        // Print view triggers auto-print
        $printResponse = $this->get(route('panel_chair.bio', ['id' => $member->id, 'print' => 1]));
        $printResponse->assertStatus(200);
        $printResponse->assertSee('window.print()');
    }

    public function test_uploading_new_pdf_for_existing_member_removes_text_content_and_downloads_pdf(): void
    {
        $user = User::first() ?? User::factory()->create();

        $member = AdvisoryBoardMember::create([
            'name' => 'Biju George',
            'role' => 'Advisory Board',
            'designation' => 'Director (Operations)',
            'company' => 'Mazagon Dock Shipbuilders Ltd',
            'initials' => 'BG',
            'bio' => 'Existing biography description before new PDF upload.',
            'bio_file' => null,
            'sort_order' => 2,
            'is_active' => true,
        ]);

        $fakePdf = UploadedFile::fake()->create('biju_george_bio.pdf', 150, 'application/pdf');

        $response = $this->actingAs($user)->post(route('admin.advisory_board.update', $member), [
            'name' => 'Biju George',
            'role' => 'Advisory Board',
            'designation' => 'Director (Operations)',
            'company' => 'Mazagon Dock Shipbuilders Ltd',
            'initials' => 'BG',
            'sort_order' => 2,
            'is_active' => true,
            'bio_file_upload' => $fakePdf,
        ]);

        $response->assertRedirect();
        $member->refresh();

        // Old text bio is cleared and new bio_file is saved
        $this->assertNull($member->bio);
        $this->assertNotNull($member->bio_file);
        $this->assertStringStartsWith('/pdf/bio_', $member->bio_file);

        // Serving bio now returns the uploaded PDF file
        $pdfResponse = $this->get(route('panel_chair.bio', ['id' => $member->id]));
        $pdfResponse->assertStatus(200);
        $pdfResponse->assertHeader('content-type', 'application/pdf');
    }

    public function test_admin_can_toggle_advisory_board_member_active_status(): void
    {
        $user = User::first() ?? User::factory()->create();
        $member = AdvisoryBoardMember::create([
            'name' => 'Toggle Status Member',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->post(route('admin.advisory_board.toggle_active', $member));

        $response->assertRedirect();
        $this->assertDatabaseHas('advisory_board_members', [
            'id' => $member->id,
            'is_active' => 0,
        ]);
    }

    public function test_admin_can_delete_advisory_board_member(): void
    {
        $user = User::first() ?? User::factory()->create();
        $member = AdvisoryBoardMember::create([
            'name' => 'To Be Removed Member',
            'sort_order' => 99,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->delete(route('admin.advisory_board.destroy', $member));

        $response->assertRedirect();
        $this->assertDatabaseMissing('advisory_board_members', [
            'id' => $member->id,
            'name' => 'To Be Removed Member',
        ]);
    }

    public function test_public_website_loads_advisory_board_from_database(): void
    {
        AdvisoryBoardMember::create([
            'name' => 'Captain Ramesh Varma',
            'role' => 'Advisory Board',
            'designation' => 'Advisor to Port Authorities',
            'company' => 'Maritime Strategy Council',
            'initials' => 'CRV',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $response = $this->get(route('home'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('advisoryBoard')
            ->where('advisoryBoard.0.name', 'Captain Ramesh Varma')
        );
    }
}
