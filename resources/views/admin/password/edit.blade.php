@extends('admin.layout')

@section('title', 'Ganti Password')

@section('content')
    <div class="admin-card">
        <div class="window-bar">
            <div class="traffic-lights">
                <span class="red"></span><span class="yellow"></span><span class="green"></span>
            </div>
            <span class="title">Ganti Password</span>
        </div>
        <div class="admin-card-body">
            <form method="POST" action="{{ route('admin.password.update') }}" style="max-width:420px;">
                @csrf
                @method('PUT')

                <div class="field">
                    <label for="current_password">Password Saat Ini</label>
                    <input type="password" id="current_password" name="current_password" required>
                </div>

                <div class="field">
                    <label for="password">Password Baru</label>
                    <input type="password" id="password" name="password" required minlength="8">
                </div>

                <div class="field">
                    <label for="password_confirmation">Konfirmasi Password Baru</label>
                    <input type="password" id="password_confirmation" name="password_confirmation" required minlength="8">
                </div>

                <button type="submit" class="btn btn-primary">
                    <i class="ph ph-key"></i> Ganti Password
                </button>
            </form>
        </div>
    </div>
@endsection
