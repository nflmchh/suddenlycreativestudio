@extends('admin.layout')

@section('title', 'Informasi Kontak')

@section('content')
    <div class="admin-card">
        <h1>Informasi Kontak</h1>
        <p class="hint">Muncul di bagian Kontak, footer, dan tombol WhatsApp/Instagram di halaman utama.</p>

        <form method="POST" action="{{ route('admin.settings.update') }}" style="max-width:480px;">
            @csrf
            @method('PUT')

            <div class="field">
                <label for="address">Alamat Studio</label>
                <input type="text" id="address" name="address" value="{{ old('address', $setting->address) }}">
            </div>

            <div class="field">
                <label for="phone">Nomor WhatsApp</label>
                <input type="text" id="phone" name="phone" value="{{ old('phone', $setting->phone) }}" placeholder="0851-7211-0725">
                <p class="hint">Boleh pakai strip/spasi, otomatis dikonversi ke format link WhatsApp yang benar.</p>
            </div>

            <div class="field">
                <label for="email">Email (opsional)</label>
                <input type="email" id="email" name="email" value="{{ old('email', $setting->email) }}" placeholder="hello@suddenlycreativestudio.com">
            </div>

            <div class="field">
                <label for="instagram_username">Username Instagram</label>
                <input type="text" id="instagram_username" name="instagram_username" value="{{ old('instagram_username', $setting->instagram_username) }}" placeholder="suddenlycreative.id">
                <p class="hint">Tanpa tanda "@".</p>
            </div>

            <button type="submit" class="btn btn-primary">
                <i class="ph ph-check"></i> Simpan Perubahan
            </button>
        </form>
    </div>
@endsection
