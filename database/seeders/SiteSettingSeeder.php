<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Seeds the values that used to be hardcoded in the landing page, so
     * switching to the admin-editable settings doesn't change anything
     * on the live site until the admin actually edits them.
     */
    public function run(): void
    {
        $setting = SiteSetting::current();

        if (! $setting->address) {
            $setting->address = 'Jalan Antakarya No. 01, 40286, Bandung, Jawa Barat';
        }

        if (! $setting->phone) {
            $setting->phone = '0851-7211-0725';
        }

        if (! $setting->instagram_username) {
            $setting->instagram_username = 'suddenlycreative.id';
        }

        $setting->save();
    }
}
