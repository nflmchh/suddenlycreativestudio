@extends('admin.layout')

@section('title', 'Informasi Kontak')

@section('content')
    <form method="POST" action="{{ route('admin.settings.update') }}" style="max-width:480px;">
        @csrf
        @method('PUT')

        <div class="admin-card">
            <div class="window-bar">
                <div class="traffic-lights">
                    <span class="red"></span><span class="yellow"></span><span class="green"></span>
                </div>
                <span class="title">Informasi Kontak</span>
            </div>
            <div class="admin-card-body">
                <p class="hint">Muncul di bagian Kontak, footer, dan tombol WhatsApp/Instagram di halaman utama.</p>

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
            </div>
        </div>

        <div class="admin-card">
            <div class="window-bar">
                <div class="traffic-lights">
                    <span class="red"></span><span class="yellow"></span><span class="green"></span>
                </div>
                <span class="title">Suci — Asisten Chat AI</span>
            </div>
            <div class="admin-card-body">
                <p class="hint">API key Anthropic (Claude) supaya Suci bisa menjawab pertanyaan pengunjung secara otomatis di website.</p>

                <div class="field">
                    <label for="anthropic_api_key">API Key Anthropic</label>
                    <input type="password" id="anthropic_api_key" name="anthropic_api_key" placeholder="{{ $setting->anthropic_api_key ? 'Sudah diisi — kosongkan kalau tidak mau ganti' : 'sk-ant-...' }}" autocomplete="off">
                    <p class="hint">Ambil di <a href="https://console.anthropic.com" target="_blank" rel="noopener">console.anthropic.com</a> &rarr; API Keys. Demi keamanan, key yang sudah tersimpan tidak pernah ditampilkan lagi di sini — isi field ini hanya kalau mau ganti dengan yang baru.</p>
                </div>

                @if ($setting->anthropic_api_key)
                    <div class="field field-checkbox">
                        <input type="checkbox" id="clear_api_key" name="clear_api_key" value="1">
                        <label for="clear_api_key" style="margin:0;">Hapus API key (nonaktifkan chat Suci)</label>
                    </div>
                @endif
            </div>
        </div>

        <button type="submit" class="btn btn-primary">
            <i class="ph ph-check"></i> Simpan Perubahan
        </button>
    </form>
@endsection
