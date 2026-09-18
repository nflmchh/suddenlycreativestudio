@extends('admin.layout')

@section('title', 'Events')

@section('content')
    <div class="admin-card">
        <h1>Daftar Event</h1>

        @if ($events->isEmpty())
            <p>Belum ada event. <a href="{{ route('admin.events.create') }}">Tambah event pertama</a>.</p>
        @else
            <div style="overflow-x:auto;">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Judul</th>
                            <th>Kategori</th>
                            <th>Media</th>
                            <th>Urutan</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($events as $event)
                            <tr>
                                <td>
                                    @if ($event->cover_image)
                                        <img class="thumb" src="{{ asset('storage/'.$event->cover_image) }}" alt="">
                                    @else
                                        —
                                    @endif
                                </td>
                                <td>{{ $event->title }}</td>
                                <td>{{ $event->categoryLabel() }}</td>
                                <td>{{ $event->media_count }}</td>
                                <td>{{ $event->sort_order }}</td>
                                <td>
                                    <span class="badge {{ $event->is_published ? 'badge-published' : 'badge-draft' }}">
                                        {{ $event->is_published ? 'Published' : 'Draft' }}
                                    </span>
                                </td>
                                <td>
                                    <div class="row-actions">
                                        <a href="{{ route('admin.events.edit', $event) }}" class="btn btn-glass btn-sm">Edit</a>
                                        <form method="POST" action="{{ route('admin.events.destroy', $event) }}" onsubmit="return confirm('Hapus event ini beserta semua media-nya?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-glass btn-sm">Hapus</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>
@endsection
