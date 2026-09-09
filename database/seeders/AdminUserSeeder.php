<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Primary Administrator (matching old site credentials)
        User::updateOrCreate(
            ['email' => 'admin@marportsglobal.com'],
            [
                'name' => 'System Admin',
                'first_name' => 'System',
                'last_name' => 'Admin',
                'email' => 'admin@marportsglobal.com',
                'password' => Hash::make('Admin12345'),
                'phone' => '+91 9633958465',
                'role' => 'SYSTEM ADMIN',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // Secondary Staff User (Editor)
        User::updateOrCreate(
            ['email' => 'editor@marportsglobal.com'],
            [
                'name' => 'Content Editor',
                'first_name' => 'Content',
                'last_name' => 'Editor',
                'email' => 'editor@marportsglobal.com',
                'password' => Hash::make('Editor12345'),
                'phone' => '+91 9876543210',
                'role' => 'EDITOR',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
    }
}
