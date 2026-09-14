@php
    // Placeholder data — will be replaced by an Eloquent query once the
    // superadmin CRUD panel for portfolio is built.
    $services = [
        ['icon' => 'ph-video-camera', 'label' => 'Visual Production'],
        ['icon' => 'ph-palette', 'label' => 'Digital Art'],
        ['icon' => 'ph-cube', 'label' => '3D Animator'],
        ['icon' => 'ph-speaker-high', 'label' => 'Multimedia Event System'],
        ['icon' => 'ph-waveform', 'label' => 'Motion Design'],
        ['icon' => 'ph-image', 'label' => 'Creative Content'],
        ['icon' => 'ph-film-strip', 'label' => 'After Movie'],
        ['icon' => 'ph-browser', 'label' => 'Website'],
        ['icon' => 'ph-device-mobile', 'label' => 'Apps'],
        ['icon' => 'ph-disc', 'label' => 'Visual DJockey'],
        ['icon' => 'ph-confetti', 'label' => 'Event Production'],
        ['icon' => 'ph-clipboard-text', 'label' => 'Show Management'],
    ];

    $portfolio = [
        ['title' => 'Corporate After Movie', 'tag' => 'After Movie', 'grad' => 'grad-1', 'icon' => 'ph-play'],
        ['title' => 'Brand Motion Reel', 'tag' => 'Motion Design', 'grad' => 'grad-2', 'icon' => 'ph-waveform'],
        ['title' => 'Festival Stage Show', 'tag' => 'Event Production', 'grad' => 'grad-3', 'icon' => 'ph-confetti'],
        ['title' => '3D Product Animation', 'tag' => '3D Animator', 'grad' => 'grad-4', 'icon' => 'ph-cube'],
        ['title' => 'Company Website', 'tag' => 'Website', 'grad' => 'grad-5', 'icon' => 'ph-browser'],
        ['title' => 'Digital Art Series', 'tag' => 'Digital Art', 'grad' => 'grad-6', 'icon' => 'ph-palette'],
    ];

    // Real client/sponsor logos, carried over from the previously hosted site.
    $brands = [
        ['file' => 'kemendikbud.jpg', 'name' => 'Kementerian Pendidikan dan Kebudayaan'],
        ['file' => 'ibox.jpg', 'name' => 'iBox'],
        ['file' => 'redbox.png', 'name' => 'RedBox Event'],
        ['file' => 'pln.png', 'name' => 'PLN'],
        ['file' => 'telkomsel.webp', 'name' => 'Telkomsel'],
        ['file' => 'coklat-kita.jpg', 'name' => 'Coklat Kita'],
        ['file' => 'xlsmart.png', 'name' => 'XLSMART'],
    ];

    $waNumber = '6285172110725';
    $waLink = 'https://wa.me/' . $waNumber . '?text=' . urlencode('Halo Suddenly Creative Studio, saya ingin bertanya tentang layanan Anda.');
    $igLink = 'https://instagram.com/suddenlycreative.id';
@endphp
<!doctype html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Suddenly Creative Studio — Visual Production, Event & Digital Creative</title>
    <link rel="icon" type="image/png" href="{{ asset('assets/img/logo-icon.png') }}">
    <meta name="description" content="Suddenly Creative Studio menyediakan jasa visual production, 3D animation, motion design, event production, hingga website & apps di Bandung.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>

    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}?v={{ @filemtime(public_path('assets/css/style.css')) ?: time() }}">
</head>
<body>

    <nav class="navbar">
        <div class="navbar-inner">
            <a href="#home" class="brand">
                <span class="brand-dot"><img src="{{ asset('assets/img/logo-icon.png') }}" alt="Suddenly Creative Studio"></span>
                <span class="brand-text">Suddenly Creative Studio</span>
            </a>

            <div class="nav-links">
                <a href="#home">Home</a>
                <a href="#services">Services</a>
                <a href="#portfolio">Portfolio</a>
                <a href="#shop">Shop</a>
                <a href="#contact">Contact</a>
            </div>

            <div class="nav-cta">
                <a href="{{ $waLink }}" target="_blank" rel="noopener" class="btn btn-primary btn-sm nav-cta-btn">
                    <i class="ph ph-whatsapp-logo"></i> <span>Hubungi Kami</span>
                </a>
                <button class="nav-toggle" aria-label="Toggle menu">
                    <i class="ph ph-list"></i>
                </button>
            </div>
        </div>

        <div class="mobile-menu">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#shop">Shop</a>
            <a href="#contact">Contact</a>
        </div>
    </nav>

    <!-- Hero -->
    <header class="hero" id="home">
        <i class="ph-fill ph-star-four sticker" style="top:16%; left:6%; font-size:26px; color:var(--y2k-lemon); animation-delay:0s, 0s;" aria-hidden="true"></i>
        <i class="ph-fill ph-heart sticker" style="top:68%; left:11%; font-size:16px; color:var(--y2k-pink); animation-delay:0.6s, 0.9s;" aria-hidden="true"></i>
        <i class="ph-fill ph-star-four sticker" style="top:10%; right:9%; font-size:18px; color:var(--y2k-blue); animation-delay:1.1s, 0.3s;" aria-hidden="true"></i>
        <i class="ph-fill ph-flower sticker" style="bottom:12%; right:6%; font-size:26px; color:var(--y2k-mint); animation-delay:0.4s, 1.2s;" aria-hidden="true"></i>
        <div class="container hero-inner">
            <div class="hero-copy reveal">
                <div class="window-bar">
                    <div class="traffic-lights">
                        <span class="red"></span><span class="yellow"></span><span class="green"></span>
                    </div>
                    <span class="title">about-me.txt</span>
                </div>
                <div class="hero-copy-body">
                    <div class="section-tag">Visual &middot; Event &middot; Digital</div>
                    <h1>Mewujudkan ide jadi <span class="gradient-text">karya visual</span> yang berkesan</h1>
                    <p>Suddenly Creative Studio membantu brand dan event Anda tampil maksimal lewat visual production, 3D animation, motion design, hingga manajemen show — dari Bandung untuk klien di mana saja.</p>
                    <div class="hero-actions">
                        <a href="#portfolio" class="btn btn-primary">
                            <i class="ph ph-play"></i> Lihat Karya
                        </a>
                        <a href="{{ $waLink }}" target="_blank" rel="noopener" class="btn btn-glass">
                            <i class="ph ph-whatsapp-logo"></i> Diskusikan Proyek
                        </a>
                    </div>
                </div>
            </div>

            <div class="hero-window reveal">
                <div class="hero-window-bar">
                    <div class="traffic-lights">
                        <span class="red"></span><span class="yellow"></span><span class="green"></span>
                    </div>
                    <span class="title">showcase.mov</span>
                </div>
                <div class="hero-window-body">
                    <img src="{{ asset('assets/img/logo-icon.png') }}" alt="Suddenly Creative Studio">
                    <div class="play-btn"><i class="ph-fill ph-play"></i></div>
                </div>
            </div>
        </div>
    </header>

    <!-- Clients / brand marquee -->
    <section class="clients-section reveal">
        <div class="container">
            <div class="section-tag center" style="display:table;">Dipercaya Oleh</div>
        </div>

        <div class="marquee-window">
            <div class="window-bar">
                <div class="traffic-lights">
                    <span class="red"></span><span class="yellow"></span><span class="green"></span>
                </div>
                <span class="title">clients.exe</span>
            </div>

            <div class="marquee-body">
                <div class="marquee-track">
                    @foreach ($brands as $brand)
                        <div class="marquee-item">
                            <img src="{{ asset('assets/img/brands/' . $brand['file']) }}" alt="{{ $brand['name'] }}" loading="lazy">
                        </div>
                    @endforeach
                    @foreach ($brands as $brand)
                        <div class="marquee-item" aria-hidden="true">
                            <img src="{{ asset('assets/img/brands/' . $brand['file']) }}" alt="" loading="lazy">
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </section>

    <!-- About -->
    <section class="section" id="about">
        <div class="container about-grid">
            <div class="about-text reveal">
                <div class="section-tag">Tentang Kami</div>
                <h2 style="font-size: clamp(28px, 3.5vw, 38px); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 18px;">
                    Studio kreatif yang menangani ide dari konsep sampai eksekusi panggung
                </h2>
                <p>Suddenly Creative Studio adalah studio kreatif berbasis di Bandung yang bergerak di bidang visual production, digital art, hingga manajemen event dan show. Kami membantu brand, perusahaan, dan penyelenggara acara mewujudkan visi kreatif mereka secara menyeluruh — mulai dari konten visual, animasi, sampai produksi acara di lapangan.</p>
                <p>Pendekatan kami menggabungkan sisi kreatif dan teknis, sehingga setiap proyek — baik itu after movie, motion design, website, maupun show production — dikerjakan dengan standar yang konsisten dan detail yang matang.</p>
            </div>

            <div class="about-card reveal">
                <ul>
                    <li><i class="ph ph-map-pin"></i> Berbasis di Bandung, Jawa Barat</li>
                    <li><i class="ph ph-squares-four"></i> 12 layanan kreatif dalam satu studio</li>
                    <li><i class="ph ph-users-three"></i> Melayani brand, perusahaan & event organizer</li>
                    <li><i class="ph ph-instagram-logo"></i> @suddenlycreative.id</li>
                </ul>
            </div>
        </div>
    </section>

    <div class="section-boundary-decor" aria-hidden="true">
        <img src="{{ asset('assets/img/sandal-spin.gif') }}" alt="">
    </div>

    <!-- Services -->
    <section class="section" id="services">
        <div class="container">
            <div class="section-heading center reveal">
                <div class="section-tag">Layanan</div>
                <h2>Semua kebutuhan kreatif, dalam satu studio</h2>
                <p>Dari visual sampai panggung — kami menangani prosesnya secara end-to-end.</p>
            </div>

        </div>

        <div class="services-slider reveal">
            <button class="slider-arrow prev" type="button" aria-label="Layanan sebelumnya">
                <i class="ph ph-caret-left"></i>
            </button>

            <div class="slider-track" id="servicesTrack">
                @foreach ($services as $service)
                    <div class="slide service-slide">
                        <div class="service-icon-lg"><i class="ph {{ $service['icon'] }}"></i></div>
                        <h3>{{ $service['label'] }}</h3>
                    </div>
                @endforeach
            </div>

            <button class="slider-arrow next" type="button" aria-label="Layanan berikutnya">
                <i class="ph ph-caret-right"></i>
            </button>
        </div>

        <div class="slider-dots" id="servicesDots">
            @foreach ($services as $i => $service)
                <button class="dot" type="button" aria-label="Ke layanan {{ $i + 1 }}"></button>
            @endforeach
        </div>
    </section>

    <!-- Portfolio -->
    <section class="section" id="portfolio">
        <div class="container">
            <div class="section-heading center reveal">
                <div class="section-tag">Portfolio</div>
                <h2>Contoh format showcase karya</h2>
                <p>Tampilan di bawah ini adalah contoh format penyajian karya — koleksi karya asli akan diperbarui melalui panel admin studio.</p>
            </div>

            <div class="portfolio-grid">
                @foreach ($portfolio as $item)
                    <div class="portfolio-card reveal">
                        <div class="window-bar">
                            <div class="traffic-lights">
                                <span class="red"></span><span class="yellow"></span><span class="green"></span>
                            </div>
                            <span class="title">{{ $item['title'] }}</span>
                        </div>
                        <div class="portfolio-thumb {{ $item['grad'] }}">
                            <i class="ph {{ $item['icon'] }}"></i>
                        </div>
                        <div class="portfolio-info">
                            <h3>{{ $item['title'] }}</h3>
                            <span class="portfolio-tag">{{ $item['tag'] }}</span>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- Shop teaser -->
    <section class="section" id="shop">
        <div class="container">
            <div class="shop-banner reveal">
                <i class="ph-fill ph-star-four sticker" style="top:12%; left:8%; font-size:20px; color:var(--y2k-blue); animation-delay:0.2s, 0.5s;" aria-hidden="true"></i>
                <i class="ph-fill ph-heart sticker" style="bottom:14%; right:10%; font-size:18px; color:var(--y2k-lilac); animation-delay:0.9s, 0.1s;" aria-hidden="true"></i>
                <div class="service-icon" style="margin-inline:auto;">
                    <i class="ph ph-shopping-bag-open"></i>
                </div>
                <h2>Segera Hadir: Digital Assets &amp; Games</h2>
                <p>Kami sedang menyiapkan produk digital assets, spin wheel, dan mini games ringan. Ikuti Instagram kami agar tidak ketinggalan update peluncurannya.</p>
                <a href="{{ $igLink }}" target="_blank" rel="noopener" class="btn btn-primary">
                    <i class="ph ph-instagram-logo"></i> Follow @suddenlycreative.id
                </a>
            </div>
        </div>
    </section>

    <!-- Contact -->
    <section class="section" id="contact">
        <div class="container">
            <div class="section-heading center reveal">
                <div class="section-tag">Kontak</div>
                <h2>Mari diskusikan proyek Anda</h2>
                <p>Hubungi kami lewat WhatsApp, Instagram, atau datang langsung ke studio.</p>
            </div>

            <div class="contact-grid">
                <div class="contact-card reveal">
                    <div class="icon-box"><i class="ph ph-map-pin"></i></div>
                    <div>
                        <h3>Alamat Studio</h3>
                        <p>Jalan Antakarya No. 01, 40286, Bandung, Jawa Barat</p>
                    </div>
                </div>

                <div class="contact-card reveal">
                    <div class="icon-box"><i class="ph ph-whatsapp-logo"></i></div>
                    <div>
                        <h3>WhatsApp</h3>
                        <a class="link" href="{{ $waLink }}" target="_blank" rel="noopener">0851-7211-0725</a>
                    </div>
                </div>

                <div class="contact-card reveal">
                    <div class="icon-box"><i class="ph ph-instagram-logo"></i></div>
                    <div>
                        <h3>Instagram</h3>
                        <a class="link" href="{{ $igLink }}" target="_blank" rel="noopener">@suddenlycreative.id</a>
                    </div>
                </div>
            </div>

            <div class="contact-cta reveal">
                <a href="{{ $waLink }}" target="_blank" rel="noopener" class="btn btn-primary">
                    <i class="ph ph-chat-circle-dots"></i> Chat via WhatsApp
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="footer-stripe" aria-hidden="true"></div>
        <i class="ph-fill ph-star-four sticker" style="top:14%; left:5%; font-size:20px; color:var(--y2k-lemon); animation-delay:0.3s, 0.7s;" aria-hidden="true"></i>
        <i class="ph-fill ph-heart sticker" style="bottom:16%; right:6%; font-size:18px; color:var(--y2k-pink); animation-delay:1s, 0.2s;" aria-hidden="true"></i>

        <div class="footer-window">
            <div class="window-bar">
                <div class="traffic-lights">
                    <span class="red"></span><span class="yellow"></span><span class="green"></span>
                </div>
                <span class="title">suddenlycreative.exe</span>
            </div>

            <div class="footer-window-body">
                <div class="container">
                    <div class="footer-grid">
                        <div class="footer-brand">
                            <a href="#home" class="footer-logo">
                                <img src="{{ asset('assets/img/logo-full-white.png') }}" alt="Suddenly Creative Studio">
                            </a>
                            <p>Studio kreatif untuk visual production, event, dan digital.</p>
                        </div>

                        <div class="footer-meta">
                            <span><i class="ph ph-map-pin"></i> Jalan Antakarya No. 01, 40286, Bandung, Jawa Barat</span>
                            <span><i class="ph ph-whatsapp-logo"></i> 0851-7211-0725</span>
                        </div>

                        <div class="footer-social">
                            <a href="{{ $igLink }}" target="_blank" rel="noopener" aria-label="Instagram"><i class="ph ph-instagram-logo"></i></a>
                            <a href="{{ $waLink }}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="ph ph-whatsapp-logo"></i></a>
                        </div>
                    </div>

                    <div class="footer-bottom">
                        &copy; {{ date('Y') }} Suddenly Creative Studio. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
        </div>
    </footer>

    <script src="{{ asset('assets/js/main.js') }}?v={{ @filemtime(public_path('assets/js/main.js')) ?: time() }}"></script>
</body>
</html>
