@php
    $event = $event ?? null;
@endphp

<div class="field">
    <label for="title">Judul Event</label>
    <input type="text" id="title" name="title" value="{{ old('title', $event->title ?? '') }}" required>
</div>

<div class="field">
    <label for="category">Kategori</label>
    <select id="category" name="category" required>
        @foreach ($categories as $key => $label)
            <option value="{{ $key }}" @selected(old('category', $event->category ?? '') === $key)>{{ $label }}</option>
        @endforeach
    </select>
</div>

<div class="field">
    <label for="client">Client (opsional)</label>
    <input type="text" id="client" name="client" value="{{ old('client', $event->client ?? '') }}">
</div>

<div class="field">
    <label for="description">Deskripsi (opsional)</label>
    <textarea id="description" name="description">{{ old('description', $event->description ?? '') }}</textarea>
</div>

<div class="field">
    <label for="sort_order">Urutan Tampil (angka kecil tampil duluan)</label>
    <input type="number" id="sort_order" name="sort_order" value="{{ old('sort_order', $event->sort_order ?? 0) }}">
</div>

<div class="field field-checkbox">
    <input type="checkbox" id="is_published" name="is_published" value="1" @checked(old('is_published', $event->is_published ?? true))>
    <label for="is_published" style="margin:0;">Published (tampil di website)</label>
</div>

<div class="field">
    <label for="cover_image">Cover Image</label>
    <input type="file" id="cover_image" name="cover_image" accept="image/jpeg,image/png">
    <p class="hint">Format JPG/PNG saja. Otomatis diberi watermark "SUDDENLY CREATIVE" tipis. Maks 8MB.</p>
    @if (($event->cover_image ?? null))
        <img class="thumb" style="margin-top:8px; width:120px; height:80px;" src="{{ asset('storage/'.$event->cover_image) }}" alt="">
    @endif
</div>

<div class="field">
    <label for="images">Tambah Foto (bisa pilih beberapa sekaligus)</label>
    <input type="file" id="images" name="images[]" accept="image/jpeg,image/png" multiple>
    <p class="hint">Format JPG/PNG saja. Foto besar (di atas 2MB) otomatis diperkecil di browser sebelum upload, lalu diberi watermark di server.</p>
</div>

<div class="field">
    <label for="videos">Tambah Video (bisa pilih beberapa sekaligus)</label>
    <input type="file" id="videos" name="videos[]" accept="video/mp4,video/quicktime,video/webm" multiple>
    <p class="hint">
        Boleh langsung upload video mentah/renderan asli — file di atas 15MB akan otomatis dikompres di browser
        sebelum diupload (ada progress bar-nya). Thumbnail video juga dibuat otomatis dari frame pertama.
        File di atas ~700MB tidak dikompres otomatis (terlalu berat untuk browser), disarankan dikompres manual dulu.
    </p>
    <div id="videoPosterInputs"></div>
</div>

@if ($event && $event->media->isNotEmpty())
    <div class="field">
        <label>Media Saat Ini</label>
        <div class="media-grid">
            @foreach ($event->media as $media)
                <figure>
                    @if ($media->isVideo())
                        <img src="{{ $media->poster_path ? asset('storage/'.$media->poster_path) : asset('assets/img/logo-icon.png') }}" alt="">
                    @else
                        <img src="{{ asset('storage/'.$media->file_path) }}" alt="">
                    @endif
                    <figcaption>
                        <span>{{ $media->isVideo() ? 'Video' : 'Foto' }}</span>
                        <form method="POST" action="{{ route('admin.media.destroy', $media) }}" onsubmit="return confirm('Hapus media ini?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit">Hapus</button>
                        </form>
                    </figcaption>
                </figure>
            @endforeach
        </div>
    </div>
@endif
