<!doctype html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin') — Suddenly Creative Studio</title>
    <link rel="icon" type="image/png" href="{{ asset('assets/img/logo-icon.png') }}">
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}?v={{ @filemtime(public_path('assets/css/style.css')) ?: time() }}">
    <link rel="stylesheet" href="{{ asset('assets/css/admin.css') }}?v={{ @filemtime(public_path('assets/css/admin.css')) ?: time() }}">
</head>
<body class="admin-body">
    <div class="admin-topbar">
        <a href="{{ route('admin.dashboard') }}" class="brand">
            <img src="{{ asset('assets/img/logo-icon.png') }}" alt="">
            Suddenly Admin
        </a>
        <nav class="admin-nav">
            <a href="{{ route('admin.dashboard') }}">Events</a>
            <a href="{{ route('admin.events.create') }}">Tambah Event</a>
            <a href="{{ route('admin.password.edit') }}">Ganti Password</a>
            <a href="{{ url('/') }}" target="_blank">Lihat Situs</a>
            <form method="POST" action="{{ route('admin.logout') }}" style="display:inline;">
                @csrf
                <button type="submit">Logout</button>
            </form>
        </nav>
    </div>

    <div class="admin-wrap">
        @if (session('status'))
            <div class="admin-status">{{ session('status') }}</div>
        @endif

        @if ($errors->any())
            <div class="admin-errors">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        @yield('content')
    </div>

    <script src="{{ asset('assets/js/admin.js') }}?v={{ @filemtime(public_path('assets/js/admin.js')) ?: time() }}"></script>
</body>
</html>
