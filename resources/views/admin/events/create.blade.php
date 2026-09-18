@extends('admin.layout')

@section('title', 'Tambah Event')

@section('content')
    <div class="admin-card">
        <h1>Tambah Event</h1>
        <form method="POST" action="{{ route('admin.events.store') }}" enctype="multipart/form-data" id="eventForm">
            @csrf
            @include('admin.events._form', ['event' => null])

            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="ph ph-check"></i> Simpan Event
                </button>
                <a href="{{ route('admin.dashboard') }}" class="btn btn-glass">Batal</a>
            </div>
        </form>
    </div>
@endsection
