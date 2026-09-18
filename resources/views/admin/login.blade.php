<!doctype html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin — Suddenly Creative Studio</title>
    <link rel="icon" type="image/png" href="{{ asset('assets/img/logo-icon.png') }}">
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}?v={{ @filemtime(public_path('assets/css/style.css')) ?: time() }}">
    <link rel="stylesheet" href="{{ asset('assets/css/admin.css') }}?v={{ @filemtime(public_path('assets/css/admin.css')) ?: time() }}">
</head>
<body class="admin-body">
    <div class="admin-login-wrap">
        <div class="admin-login-card">
            <div class="admin-card">
                <div class="window-bar">
                    <div class="traffic-lights">
                        <span class="red"></span><span class="yellow"></span><span class="green"></span>
                    </div>
                    <span class="title">login.exe</span>
                </div>
                <div class="admin-card-body">
                    <div class="section-tag" style="margin-bottom:16px;">Admin</div>

                    @if ($errors->any())
                        <div class="admin-errors">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form method="POST" action="{{ route('admin.login.attempt') }}">
                        @csrf
                        <div class="field">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus>
                        </div>
                        <div class="field">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">
                            <i class="ph ph-lock-key"></i> Masuk
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
