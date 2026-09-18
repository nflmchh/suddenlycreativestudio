<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Seeds a single admin account with a temporary password. Change it
     * immediately after first login via /admin/password.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'naufalmochhh@gmail.com'],
            [
                'name' => 'Suddenly Creative Studio',
                'password' => Hash::make('d3cf502c595423de56'),
                'email_verified_at' => now(),
            ]
        );
    }
}
