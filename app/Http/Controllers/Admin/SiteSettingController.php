<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    public function edit()
    {
        $setting = SiteSetting::current();

        return view('admin.settings.edit', compact('setting'));
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'instagram_username' => ['nullable', 'string', 'max:100'],
            'anthropic_api_key' => ['nullable', 'string', 'max:500'],
            'clear_api_key' => ['nullable', 'boolean'],
        ]);

        $setting = SiteSetting::current();

        // The field is never pre-filled with the real key (so it's never
        // shown on screen), so a blank submit must NOT wipe an existing key
        // — only an explicit new value or the "clear" checkbox should.
        if ($request->boolean('clear_api_key')) {
            $data['anthropic_api_key'] = null;
        } elseif (empty($data['anthropic_api_key'])) {
            unset($data['anthropic_api_key']);
        }

        unset($data['clear_api_key']);

        $setting->update($data);

        return redirect()->route('admin.settings.edit')->with('status', 'Informasi kontak berhasil diperbarui.');
    }
}
