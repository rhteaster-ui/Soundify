var Home = {
    activeCategory: null,
    loadingCategory: false,
    categories: [
        { name: 'Semua', icon: 'layout-grid' },
        { name: 'Chill', icon: 'coffee' },
        { name: 'Focus', icon: 'brain' },
        { name: 'Commute', icon: 'car' },
        { name: 'Gaming', icon: 'gamepad-2' },
        { name: 'Energize', icon: 'zap' },
        { name: 'Party', icon: 'party-popper' },
        { name: 'Feel good', icon: 'smile' },
        { name: 'Romance', icon: 'heart' },
        { name: 'Workout', icon: 'dumbbell' },
        { name: 'Sleep', icon: 'moon' },
        { name: 'Sad', icon: 'cloud-rain' },
        { name: 'Happy', icon: 'sun' },
        { name: 'Nostalgia', icon: 'disc' }
    ],

    getGreeting() {
        var hour = new Date().getHours();
        if (hour >= 4 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 17) return 'Good Afternoon';
        if (hour >= 17 && hour < 21) return 'Good Evening';
        return 'Good Night';
    },

    onHeaderLogoClick() {
        if (window.location.pathname !== '/' || window.location.search !== '') {
            try {
                window.history.pushState({}, '', '/');
            } catch(e) {
                window.history.replaceState({}, '', '/');
            }
        }
        App.switch('home');
        var mainArea = gid('main-area');
        if (mainArea) mainArea.scrollTop = 0;
        if (typeof showToast === 'function') showToast('🏠 Beranda Soundify');
    },

    playRandomSong() {
        var songs = (S.ht && S.ht.length > 0) ? S.ht : (S.hd || []);
        if (songs.length > 0) {
            var idx = Math.floor(Math.random() * songs.length);
            PK('home1', idx);
            if (typeof showToast === 'function') showToast('🎵 Memutar acak musik pilihan untukmu');
        } else {
            if (typeof showToast === 'function') showToast('Sedang memuat data musik...');
        }
    },

    render() {
        var greetingText = Home.getGreeting();
        var chipsHtml = Home.categories.map(function(c) {
            var isActive = (Home.activeCategory === c.name) || (!Home.activeCategory && c.name === 'Semua');
            var btnStyle = isActive
                ? 'bg-blue-600 text-white font-extrabold shadow-md border border-blue-600 scale-[1.02]'
                : 'bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-2)] border border-[var(--border-color)] font-semibold';
            return '<button onclick="Home.selectCategory(\'' + c.name + '\')" class="home-chip-btn px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ' + btnStyle + '">' +
                (c.icon ? '<i data-lucide="' + c.icon + '" class="w-3.5 h-3.5"></i>' : '') +
                '<span>' + es(c.name) + '</span>' +
            '</button>';
        }).join('');

        gid('view-home').innerHTML = `
        <!-- Top Navigation Header -->
        <div class="bg-[var(--surface)] border-b border-[var(--border-color)] pt-3.5 pb-3 px-4 sticky top-0 z-20">
            <div class="flex justify-between items-center">
                <!-- Brand Badge -->
                <div class="flex items-center gap-2.5 cursor-pointer group" onclick="Home.onHeaderLogoClick()" title="Soundify • Beranda">
                    <div class="w-10 h-10 rounded-full bg-[var(--surface-2)] p-[1.5px] border border-[var(--border-color-strong)] shrink-0 group-hover:scale-105 transition-all shadow-sm">
                        <img src="/logo.png" class="w-full h-full object-cover rounded-full bg-black" loading="lazy" decoding="async" onerror="this.src='${FI}'" />
                    </div>
                    <div>
                        <div class="flex items-center gap-1.5">
                            <h1 class="text-lg md:text-xl font-black text-[var(--text-primary)] tracking-tight leading-none">Soundify</h1>
                            <i data-lucide="check-circle-2" class="w-4 h-4 text-blue-500 fill-blue-500 text-white"></i>
                        </div>
                        <p class="text-[var(--text-secondary)] text-[10px] mt-0.5 font-semibold">rhmt sound ecosystem</p>
                    </div>
                </div>
                <!-- Action Icons -->
                <div class="flex items-center gap-2">
                    <button onclick="App.toggleTheme()" class="glass rounded-full p-2 text-[var(--text-primary)] active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-[var(--border-color)]" title="Ganti Tema">
                        <i id="header-theme-icon" data-lucide="moon" class="w-4 h-4 text-amber-500"></i>
                    </button>
                    <button onclick="App.switch('search')" class="glass rounded-full p-2 text-[var(--text-primary)] active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-[var(--border-color)]" title="Cari Lagu">
                        <i data-lucide="search" class="w-4 h-4"></i>
                    </button>
                    <button onclick="App.openDrawer()" class="glass rounded-full p-2 text-[var(--text-primary)] active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-[var(--border-color)]" title="Menu & Pengaturan">
                        <i data-lucide="menu" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Greeting & Headline -->
        <div class="px-4 pt-4 pb-1">
            <p class="text-xs font-bold text-blue-600 tracking-wide flex items-center gap-1.5 mb-1">
                <span>${greetingText}, Rohmat</span> 👋
            </p>
            <h2 id="hero-animated-headline" class="text-2xl sm:text-3xl font-black text-[var(--text-primary)] leading-tight tracking-tight">
                Discover new<br><span class="text-sky-500">trending tracks</span>
            </h2>
        </div>

        <!-- PWA INSTALL CARD ON HOME -->
        <div id="pwa-home-install-card" class="${isStandaloneApp ? 'hidden ' : ''}mx-4 my-2.5 p-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg border border-blue-400/30 flex items-center justify-between gap-3 relative overflow-hidden">
            <div class="flex items-center gap-2.5 relative z-10 min-w-0">
                <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                    <img src="/logo.png" class="w-6 h-6 object-contain" alt="Soundify" />
                </div>
                <div class="min-w-0">
                    <h4 class="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                        Install Soundify App
                        <span class="px-1.5 py-0.2 rounded-full text-[8px] font-extrabold bg-amber-400 text-black uppercase">PWA</span>
                    </h4>
                    <p class="text-[11px] text-blue-100/90 truncate font-medium">Tambah ke Beranda HP untuk pengalaman penuh</p>
                </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0 relative z-10">
                <button onclick="installPWA()" class="pwa-install-trigger px-3 py-1.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-extrabold text-xs shadow active:scale-95 transition-all cursor-pointer">
                    Install
                </button>
                <button onclick="var el=document.getElementById('pwa-home-install-card');if(el)el.remove()" class="w-6 h-6 rounded-full flex items-center justify-center bg-black/20 text-white/70 hover:text-white transition-all cursor-pointer" aria-label="Tutup">
                    <i data-lucide="x" class="w-3.5 h-3.5"></i>
                </button>
            </div>
        </div>

        <!-- DEMO HERO BANNER CAROUSEL SECTION -->
        <div class="px-4 mt-3 mb-3" id="home-demo-banner-wrapper">
            <div class="w-full aspect-[1.8/1] max-h-[275px] min-h-[185px] rounded-2xl overflow-hidden shadow-md border border-[var(--border-color)] bg-black relative group">
                <div id="home-banner-slider" class="flex transition-transform duration-700 ease-in-out w-full h-full">
                    <div class="w-full h-full shrink-0 overflow-hidden relative">
                        <img src="/banner.webp" class="w-full h-full object-cover block" alt="Banner 1" loading="lazy" decoding="async" onerror="this.src='/banner1.jpeg'" />
                    </div>
                    <div class="w-full h-full shrink-0 overflow-hidden relative">
                        <img src="/banner1.jpeg" class="w-full h-full object-cover block" alt="Banner 2" loading="lazy" decoding="async" onerror="this.src='/banner.webp'" />
                    </div>
                    <div class="w-full h-full shrink-0 overflow-hidden relative">
                        <img src="/banner2.jpeg" class="w-full h-full object-cover block" alt="Banner 3" loading="lazy" decoding="async" onerror="this.src='/banner.webp'" />
                    </div>
                </div>
                <!-- Bottom subtle gradient overlay for dots readability -->
                <div class="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                <!-- Carousel Dots Indicator -->
                <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
                    <button onclick="Home.goToBanner(0)" class="home-banner-dot w-2 h-2 rounded-full bg-white transition-all cursor-pointer" aria-label="Slide 1"></button>
                    <button onclick="Home.goToBanner(1)" class="home-banner-dot w-2 h-2 rounded-full bg-white/40 hover:bg-white/70 transition-all cursor-pointer" aria-label="Slide 2"></button>
                    <button onclick="Home.goToBanner(2)" class="home-banner-dot w-2 h-2 rounded-full bg-white/40 hover:bg-white/70 transition-all cursor-pointer" aria-label="Slide 3"></button>
                </div>
            </div>
        </div>

        <!-- Category Slider (Kategori Geser) -->
        <div id="home-category-bar" class="flex gap-2 overflow-x-auto hide-scrollbar px-4 py-2 scroll-smooth bg-[var(--surface)] sticky top-[60px] z-10 border-y border-[var(--border-color)]">
            ${chipsHtml}
        </div>

        <div class="px-4 mt-4" id="home-main-content">
            <div id="home-default-view">
                <div class="space-y-6">
                    <!-- Section Lanjutkan Mendengarkan (Continue Listening) -->
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <h2 class="text-base sm:text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                                <span class="w-1.5 h-4 bg-blue-600 rounded-full inline-block"></span>
                                <span>Lanjutkan Mendengarkan</span>
                            </h2>
                            <span class="text-xs text-blue-600 hover:underline cursor-pointer font-bold flex items-center gap-0.5" onclick="Home.selectCategory('Chill')">
                                Lihat Semua <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                            </span>
                        </div>
                        <div id="home-continue-listening" class="flex gap-3 overflow-x-auto hide-scrollbar pb-2"></div>
                    </div>

                    <!-- Quick Pick / Mood Grids -->
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <h2 class="text-base sm:text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                                <span class="w-1.5 h-4 bg-zinc-900 dark:bg-zinc-100 rounded-full inline-block"></span>
                                <span>Quick Pick</span>
                            </h2>
                            <span class="text-xs text-[var(--text-secondary)] font-semibold">Berdasarkan Mood</span>
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            <div onclick="Home.selectCategory('Chill')" class="mood-tile p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] hover:border-zinc-400 cursor-pointer active:scale-95 transition-all flex items-center gap-2.5 shadow-sm">
                                <div class="w-8 h-8 rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] flex items-center justify-center shrink-0">
                                    <i data-lucide="coffee" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-xs sm:text-sm text-[var(--text-primary)]">Chill</h4>
                                    <p class="text-[10px] text-[var(--text-secondary)]">Bersantai</p>
                                </div>
                            </div>
                            <div onclick="Home.selectCategory('Focus')" class="mood-tile p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] hover:border-zinc-400 cursor-pointer active:scale-95 transition-all flex items-center gap-2.5 shadow-sm">
                                <div class="w-8 h-8 rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] flex items-center justify-center shrink-0">
                                    <i data-lucide="brain" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-xs sm:text-sm text-[var(--text-primary)]">Focus</h4>
                                    <p class="text-[10px] text-[var(--text-secondary)]">Tetap Fokus</p>
                                </div>
                            </div>
                            <div onclick="Home.selectCategory('Commute')" class="mood-tile p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] hover:border-zinc-400 cursor-pointer active:scale-95 transition-all flex items-center gap-2.5 shadow-sm">
                                <div class="w-8 h-8 rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] flex items-center justify-center shrink-0">
                                    <i data-lucide="car" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-xs sm:text-sm text-[var(--text-primary)]">Commute</h4>
                                    <p class="text-[10px] text-[var(--text-secondary)]">Perjalanan</p>
                                </div>
                            </div>
                            <div onclick="Home.selectCategory('Gaming')" class="mood-tile p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] hover:border-zinc-400 cursor-pointer active:scale-95 transition-all flex items-center gap-2.5 shadow-sm">
                                <div class="w-8 h-8 rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] flex items-center justify-center shrink-0">
                                    <i data-lucide="gamepad-2" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-xs sm:text-sm text-[var(--text-primary)]">Gaming</h4>
                                    <p class="text-[10px] text-[var(--text-secondary)]">Main Game</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Section Sound Viral Sekarang (Card Carousel Utama) -->
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <h2 class="text-base sm:text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                                <span class="w-2 h-4 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full inline-block"></span>
                                <span>🔥 Sound Viral Sekarang</span>
                            </h2>
                            <span class="text-xs text-blue-600 hover:underline cursor-pointer font-bold" onclick="Home.selectCategory('Pop')">Lihat Semua</span>
                        </div>
                        <div id="home-viral" class="flex gap-3.5 overflow-x-auto hide-scrollbar pb-2 pt-1"></div>
                    </div>

                    <!-- Section New Release (Grid) -->
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <h2 class="text-base sm:text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                                <span class="w-2 h-4 bg-gradient-to-b from-indigo-500 to-sky-500 rounded-full inline-block"></span>
                                <span>Rilis Terbaru</span>
                            </h2>
                            <span class="text-xs text-[var(--text-secondary)] font-semibold">Paling Hits</span>
                        </div>
                        <div id="home-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5"></div>
                    </div>

                    <!-- Section Playlists & Albums -->
                    <div>
                        <h2 class="text-base sm:text-lg font-extrabold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                            <span class="w-2 h-4 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full inline-block"></span>
                            <span>Rekomendasi Playlist & Album</span>
                        </h2>
                        <div id="home-scroll" class="flex gap-3.5 overflow-x-auto hide-scrollbar pb-3"></div>
                    </div>

                    <!-- Section Artis Top -->
                    <div>
                        <h2 class="text-base sm:text-lg font-extrabold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                            <span class="w-2 h-4 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full inline-block"></span>
                            <span>Artis Populer</span>
                        </h2>
                        <div id="home-artists" class="flex gap-3.5 overflow-x-auto hide-scrollbar pb-3"></div>
                    </div>

                    <!-- Section Trending Global & Hits Populer (Moved to bottom) -->
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <h2 class="text-base sm:text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                                <span class="w-2 h-4 bg-gradient-to-b from-sky-400 to-blue-600 rounded-full inline-block"></span>
                                <span>⚡ Trending Global & Hits Populer</span>
                            </h2>
                            <span class="text-xs text-[var(--text-secondary)] font-semibold">Koleksi Tambahan</span>
                        </div>
                        <div id="home-discover" class="flex gap-3.5 overflow-x-auto hide-scrollbar pb-2 pt-1"></div>
                    </div>
                </div>
            </div>
            <div id="home-category-view" style="display:none;"></div>
        </div>`;

        lucide.createIcons();
        Home.initHeadlineAnimation();
        Home.initBannerCarousel();

        if (Home.activeCategory && Home.activeCategory !== 'Semua') {
            if (Home.activeCategory === 'Developer Profile') {
                Home.renderDeveloperProfileView();
            } else {
                Home.displayCategoryView();
            }
        } else {
            var defView = gid('home-default-view'), catView = gid('home-category-view');
            if (defView) defView.style.display = 'block';
            if (catView) catView.style.display = 'none';
            if (S.ht && S.ht.length > 0) {
                Home.show();
            } else {
                Home.showSkeleton();
                Home.fetch();
            }
        }
    },

    selectCategory(catName) {
        if (Home.activeCategory === catName && catName !== 'Semua') {
            catName = 'Semua';
        }

        var devBtn = gid('dev-profile-header-btn');
        if (devBtn) {
            if (catName === 'Developer Profile') {
                devBtn.className = 'bg-cyan-500/20 text-cyan-200 border-cyan-400 font-bold shadow-lg shadow-cyan-500/10 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 border active:scale-95 transition-all cursor-pointer';
            } else {
                devBtn.className = 'glass glass-hover text-cyan-300 hover:text-white border-cyan-500/20 font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 border active:scale-95 transition-all cursor-pointer';
            }
        }

        if (!catName || catName === 'Semua') {
            Home.activeCategory = null;
            var bar = gid('home-category-bar');
            if (bar) {
                bar.querySelectorAll('.home-chip-btn').forEach(function(btn, i) {
                    var c = Home.categories[i];
                    var isAct = (c && c.name === 'Semua');
                    btn.className = 'home-chip-btn px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ' + (isAct
                        ? 'bg-blue-600 text-white font-extrabold shadow-md border border-blue-600 scale-[1.02]'
                        : 'bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-2)] border border-[var(--border-color)] font-semibold');
                });
            }
            var defView = gid('home-default-view'), catView = gid('home-category-view');
            if (defView) defView.style.display = 'block';
            if (catView) catView.style.display = 'none';
            if (!S.ht || S.ht.length === 0) Home.fetch();
            else Home.show();
            return;
        }

        Home.activeCategory = catName;

        var bar = gid('home-category-bar');
        if (bar) {
            bar.querySelectorAll('.home-chip-btn').forEach(function(btn, i) {
                var c = Home.categories[i];
                var isAct = (c && c.name === catName);
                btn.className = 'home-chip-btn px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ' + (isAct
                    ? 'bg-blue-600 text-white font-extrabold shadow-md border border-blue-600 scale-[1.02]'
                    : 'bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-2)] border border-[var(--border-color)] font-semibold');
            });
        }

        Home.fetchCategoryData(catName);
    },

    async fetchCategoryData(catName) {
        var defView = gid('home-default-view'), catView = gid('home-category-view');
        if (defView) defView.style.display = 'none';
        if (catView) {
            catView.style.display = 'block';
            catView.innerHTML = `
            <div class="mb-4 flex justify-between items-center bg-white/5 p-3.5 rounded-2xl border border-white/10 animate-pulse">
                <div class="flex items-center gap-2">
                    <span class="text-xs text-muted">Kategori:</span>
                    <span class="font-bold text-sm text-white">${es(catName)}</span>
                </div>
                <button onclick="Home.selectCategory('Semua')" class="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-muted hover:text-white transition-all flex items-center gap-1">
                    <i data-lucide="x" class="w-3.5 h-3.5"></i> Reset
                </button>
            </div>
            <div class="text-center py-12">
                <div class="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p class="text-xs text-muted animate-pulse">Memuat musik ${es(catName)}...</p>
            </div>`;
            lucide.createIcons();
        }

        if (catName === 'Developer Profile') {
            try {
                var r = await fetch(API.search + '?query=' + encodeURIComponent('XXXTENTACION') + '&type=all');
                var d = await r.json();
                if (d.status && d.result) {
                    S.hc = d.result.songs ? d.result.songs.map(function(s) {
                        return {
                            id: s.videoId,
                            videoId: s.videoId,
                            title: cn(s.title),
                            artist: cn(s.artist),
                            artistId: s.artistId || '',
                            cover: toHDCover(s.thumbnail, s.videoId),
                            ytUrl: s.url
                        };
                    }) : [];
                    S.hcp = [].concat(d.result.albums || []).concat(d.result.playlists || []);
                } else { S.hc = []; S.hcp = []; }
            } catch(e) { S.hc = []; S.hcp = []; }

            S.favArtistsDev = [
                { name: 'XXXTENTACION', id: 'UC8E6Rlb6pPspk1KkLInmPBA', cover: 'https://i.scdn.co/image/ab6761610000e5eb806a16d223847e335e2e8e3c' },
                { name: 'Juice WRLD', id: 'UC0BletW9py84h0beCD26WHQ', cover: 'https://i.scdn.co/image/ab6761610000e5eb1e345853b015b6d510006767' },
                { name: '2Pac', id: 'UC24x07EwV_KkGf-k9o-94qg', cover: 'https://i.scdn.co/image/ab6761610000e5eb1a051d9539d09c2a78f3068e' },
                { name: 'Lil Peep', id: 'UCsR6_b319eYpE8J40tI7G3g', cover: 'https://i.scdn.co/image/ab6761610000e5eb14081c3b5fa78f0f35ef1d55' },
                { name: 'Lil Loaded', id: 'UCz_0qN0d1p8J80K6r49q8BA', cover: 'https://i.scdn.co/image/ab6761610000e5eb871b65e902b66236b568326e' },
                { name: 'NLE Choppa', id: 'UCv_Gq8T1R2W1dY7I7G9G9qg', cover: 'https://i.scdn.co/image/ab6761610000e5ebfa0ee4d9a244434db03405f6' },
                { name: 'Ice Cube', id: 'UCa5K8O9W4A5G6k-7Y8I8G9g', cover: 'https://i.scdn.co/image/ab6761610000e5ebd7f7bbffdf4e45ebef823158' },
                { name: 'Eazy-E', id: 'UCa0G7K8I8W1dY7I7G9G9qg1', cover: 'https://i.scdn.co/image/ab6761610000e5ebf537b0185966bbcd238d227b' },
                { name: 'Eminem', id: 'UCn_128A3X8K2wF7F5Y7O_8g', cover: 'https://i.scdn.co/image/ab6761610000e5eba00b11c129b27a88fc72f36b' }
            ];

            try {
                var ra = await fetch(API.search + '?query=' + encodeURIComponent('XXXTENTACION Juice WRLD 2Pac Lil Peep Lil Loaded NLE Choppa Ice Cube Eazy-E Eminem') + '&type=artists');
                var da = await ra.json();
                if (da.status && da.result && da.result.artists && da.result.artists.length > 0) {
                    da.result.artists.forEach(function(art) {
                        var artName = art.title || art.name || '';
                        var matched = S.favArtistsDev.find(function(f) { return f.name.toLowerCase() === artName.toLowerCase(); });
                        if (matched) {
                            if (art.cover) matched.cover = art.cover;
                            if (art.id) matched.id = art.id;
                        }
                    });
                }
            } catch(ea){}

            Home.renderDeveloperProfileView();
            return;
        }

        var query = catName + ' Music';
        if (catName === 'Acoustic') query = 'Acoustic Songs Hits';
        else if (catName === 'Chill') query = 'Chill Vibes Lofi Songs';
        else if (catName === 'Focus') query = 'Focus Deep Work Music';
        else if (catName === 'Commute') query = 'Driving Roadtrip Music';
        else if (catName === 'Gaming') query = 'Gaming EDM Hype Songs';
        else if (catName === 'Energize') query = 'Energetic Workout Beats';
        else if (catName === 'Party') query = 'Party Dance Hits';
        else if (catName === 'Feel good') query = 'Feel Good Happy Songs';
        else if (catName === 'Romance') query = 'Romantic Love Songs';
        else if (catName === 'Workout') query = 'Gym Workout Motivation Music';
        else if (catName === 'Sleep') query = 'Sleeping Calming Relaxation Music';
        else if (catName === 'Sad') query = 'Sad Melancholic Songs';
        else if (catName === 'Happy') query = 'Upbeat Happy Songs';
        else if (catName === 'Nostalgia') query = '2000s Hits Nostalgia Songs';

        try {
            var r = await fetch(API.search + '?query=' + encodeURIComponent(query) + '&type=all');
            var d = await r.json();
            if (d.status) {
                S.hc = d.result.songs ? d.result.songs.map(function(s) {
                    return {
                        id: s.videoId,
                        videoId: s.videoId,
                        title: cn(s.title),
                        artist: cn(s.artist),
                        artistId: s.artistId || '',
                        cover: toHDCover(s.thumbnail, s.videoId),
                        ytUrl: s.url
                    };
                }) : [];
                S.hcp = [].concat(d.result.playlists || []).concat(d.result.albums || []);
                S.hca = d.result.artists || [];
            }
        } catch(e) { S.hc = []; S.hcp = []; S.hca = []; }

        Home.displayCategoryView();
    },

    renderDeveloperProfileView() {
        var defView = gid('home-default-view'), catView = gid('home-category-view');
        if (defView) defView.style.display = 'none';
        if (catView) catView.style.display = 'block';
        if (!catView) return;

        var songsHtml = '';
        if (S.hc && S.hc.length > 0) {
            songsHtml = S.hc.map(function(t, i) {
                var isCur = S.ct && (
                    S.ct.id === t.id ||
                    S.ct.videoId === t.id ||
                    (S.ct.id && t.videoId && S.ct.id === t.videoId) ||
                    (S.ct.videoId && t.id && S.ct.videoId === t.id) ||
                    (S.ct.title === t.title && S.ct.artist === t.artist)
                );
                var isPlay = isCur && S.ip;
                var isLoad = isCur && S.il;

                var playIconHtml = '';
                if (isLoad) {
                    playIconHtml = '<div class="w-6 h-6 rounded-full btn-chrome flex items-center justify-center shrink-0 ml-auto"><div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>';
                } else if (isPlay) {
                    playIconHtml = '<div class="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0 ml-auto shadow-md shadow-white/30 ring-1 ring-white scale-105"><div class="flex items-end justify-center gap-[2px] w-3 h-3 pb-0.5"><span class="w-[2px] bg-black rounded-full animate-eq-1"></span><span class="w-[2px] bg-black rounded-full animate-eq-2"></span><span class="w-[2px] bg-black rounded-full animate-eq-3"></span></div></div>';
                } else if (isCur) {
                    playIconHtml = '<div class="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0 ml-auto border border-white"><i data-lucide="pause" class="w-3 h-3 fill-current"></i></div>';
                } else {
                    playIconHtml = '<div class="w-6 h-6 rounded-full bg-white/5 group-hover:bg-white/20 flex items-center justify-center shrink-0 ml-auto text-white transition-all"><i data-lucide="play" class="w-3 h-3 fill-current ml-0.5"></i></div>';
                }

                var cardBg = isPlay ? 'bg-white/15 border border-white/40  shadow-white/5' : (isCur ? 'bg-white/10 border border-white/30' : 'glass glass-hover');

                return '<div onclick="PK(\'homecat\','+i+')" class="snap-start home-cat-card group '+cardBg+' rounded-xl flex items-center gap-2.5 p-2 cursor-pointer active:scale-95 transition-all w-full">'+
                    '<img src="'+t.cover+'" class="w-11 h-11 rounded-lg object-cover shadow-md shrink-0 bg-[var(--surface)]" referrerPolicy="no-referrer" onerror="this.src=\''+FI+'\'" />'+
                    '<div class="truncate flex-1 min-w-0"><h3 class="font-bold text-xs sm:text-sm truncate '+(isCur?'text-white font-black':'text-white/90')+'">'+es(t.title)+'</h3><p class="text-muted text-[11px] truncate mt-0.5">'+es(t.artist)+'</p></div>'+
                    '<div class="ml-auto shrink-0">'+playIconHtml+'</div>'+
                '</div>';
            }).join('');
        } else {
            songsHtml = '<p class="text-white/60 text-sm py-4 col-span-2">Memuat lagu XXXTENTACION...</p>';
        }

        var plistHtml = '';
        if (S.hcp && S.hcp.length > 0) {
            plistHtml = S.hcp.map(function(p, i) {
                return '<div onclick="Album.open(\''+p.id+'\', \''+(p.cover||FI)+'\')" class="flex-shrink-0 w-36 cursor-pointer active:scale-95"><div class="w-36 h-36 mb-2 relative rounded-xl overflow-hidden glass-edge "><img src="'+(p.cover||FI)+'" class="w-full h-full object-cover" referrerPolicy="no-referrer" onerror="this.src=\''+FI+'\'" /></div><h3 class="font-semibold text-xs truncate">'+es(p.title)+'</h3><p class="text-white/70 text-[10px] truncate mt-0.5">'+es(p.artist)+'</p></div>';
            }).join('');
        }

        catView.innerHTML = `
        <div class="space-y-6 pb-6">
            <div class="glass-strong rounded-3xl p-5 border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-transparent relative overflow-hidden">
                <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left relative z-10">
                    <div class="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shrink-0 glass shadow-xl">
                        <img src="https://www.rhmt.biz.id/gambar/pp-dev.png" class="w-full h-full object-cover" onerror="this.src='${FI}'" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                            <i data-lucide="code-2" class="w-3 h-3 text-blue-500"></i> Developer Profile
                        </div>
                        <h2 class="text-xl sm:text-2xl font-black text-[var(--text-primary)] leading-tight">✧･ﾟ: [𝙍]𝙝𝙢𝙏 | 𝘾𝙤𝙙𝙚⚙️𝘼𝙄 𝙡 :･ﾟ✧</h2>
                        <p class="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">Pengembang & Pembuat Soundify • rhmt sound ecosystem</p>
                        <div class="flex flex-wrap items-center gap-2 mt-3.5 justify-center sm:justify-start">
                            <button onclick="App.switch('dev')" class="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer">
                                <i data-lucide="info" class="w-3.5 h-3.5"></i> Detail Info & Kontak
                            </button>
                            <button onclick="Home.selectCategory('Semua')" class="glass hover:bg-white/10 px-3 py-2 rounded-full text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 border border-[var(--border-color)] cursor-pointer">
                                <i data-lucide="x" class="w-3.5 h-3.5"></i> Reset
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Minimal Small Social Icon Links Row -->
                <div class="flex items-center justify-around gap-2 mt-4 pt-3.5 border-t border-[var(--border-color)]">
                    <!-- Website -->
                    <a href="https://www.rhmt.biz.id" target="_blank" title="Website Official (rhmt.biz.id)" class="p-2.5 rounded-xl hover:bg-white/10 text-[var(--text-secondary)] hover:text-blue-400 transition-all active:scale-90 flex items-center justify-center border border-transparent hover:border-white/10">
                        <i data-lucide="globe" class="w-5 h-5"></i>
                    </a>
                    <!-- WhatsApp Channel -->
                    <a href="https://whatsapp.com/channel/0029VbBjyjlJ93wa6hwSWa0p" target="_blank" title="WhatsApp Channel" class="p-2.5 rounded-xl hover:bg-white/10 text-[var(--text-secondary)] hover:text-emerald-400 transition-all active:scale-90 flex items-center justify-center border border-transparent hover:border-white/10">
                        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.221h.005c5.505 0 9.988-4.478 9.989-9.985A9.96 9.96 0 0012.012 2zm5.834 14.164c-.244.688-1.428 1.314-1.97 1.37-.502.052-1.151.082-3.321-.818-2.775-1.151-4.56-3.966-4.698-4.152-.138-.186-1.127-1.5-1.127-2.86 0-1.36.713-2.028.966-2.302.253-.274.552-.343.736-.343.184 0 .368.002.529.01.173.008.404-.066.632.482.238.574.805 1.96.874 2.1.069.138.115.3.023.483-.092.184-.138.3-.276.46-.138.161-.29.359-.414.482-.138.138-.282.289-.121.565.161.276.715 1.18 1.536 1.91 1.056.938 1.947 1.229 2.223 1.367.276.138.437.115.6-.069.161-.184.69-0.805.874-1.08.184-.276.368-.23.621-.138.253.092 1.609.759 1.885.897.276.138.46.207.529.322.069.115.069.667-.175 1.355z"/></svg>
                    </a>
                    <!-- Instagram -->
                    <a href="https://www.instagram.com/rahmt_nhw?igsh=MWQwcnB3bTA2ZnVidg==" target="_blank" title="Instagram (@rahmt_nhw)" class="p-2.5 rounded-xl hover:bg-white/10 text-[var(--text-secondary)] hover:text-pink-400 transition-all active:scale-90 flex items-center justify-center border border-transparent hover:border-white/10">
                        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <!-- TikTok -->
                    <a href="https://www.tiktok.com/@r_hmtofc?_r=1&_t=ZS-94KRfWQjeUu" target="_blank" title="TikTok (@r_hmtofc)" class="p-2.5 rounded-xl hover:bg-white/10 text-[var(--text-secondary)] hover:text-sky-400 transition-all active:scale-90 flex items-center justify-center border border-transparent hover:border-white/10">
                        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.67 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.36 1.48-1.41 2.48-.08 1.25.53 2.5 1.58 3.14.9.55 2.05.62 3.01.21 1.01-.42 1.73-1.36 1.88-2.43.11-1.85.06-3.72.06-5.58V.02z"/></svg>
                    </a>
                    <!-- Telegram -->
                    <a href="https://t.me/rAi_engine" target="_blank" title="Telegram (rAi_engine)" class="p-2.5 rounded-xl hover:bg-white/10 text-[var(--text-secondary)] hover:text-blue-400 transition-all active:scale-90 flex items-center justify-center border border-transparent hover:border-white/10">
                        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    </a>
                </div>
            </div>

            <div>
                <div class="mb-3">
                    <h2 class="text-base font-bold flex items-center gap-2 text-white">
                        <i data-lucide="heart" class="w-4 h-4 text-red-500 fill-current"></i>
                        <span>Lagu Yang Disukai</span>
                    </h2>
                    <p class="text-xs text-white/60 ml-6 mt-0.5">(Semua lagu XXXTENTACION)</p>
                </div>
                <div class="grid grid-rows-4 grid-flow-col auto-cols-[calc(50vw-24px)] sm:auto-cols-[300px] gap-2.5 overflow-x-auto hide-scrollbar pb-3 snap-x">
                    ${songsHtml}
                </div>
            </div>

            ${plistHtml ? `<div>
                <div class="mb-3">
                    <h2 class="text-base font-bold flex items-center gap-2 text-white">
                        <i data-lucide="disc" class="w-4 h-4 text-purple-400"></i>
                        <span>Playlist Yang Disukai</span>
                    </h2>
                    <p class="text-xs text-white/60 ml-6 mt-0.5">Semua album xxxtentacion</p>
                </div>
                <div class="flex gap-3 overflow-x-auto hide-scrollbar pb-3">${plistHtml}</div>
            </div>` : ''}
        </div>`;

        lucide.createIcons();
    },

    displayCategoryView() {
        var defView = gid('home-default-view'), catView = gid('home-category-view');
        if (defView) defView.style.display = 'none';
        if (catView) catView.style.display = 'block';
        if (!catView) return;

        var catName = Home.activeCategory || 'Kategori';

        var songsHtml = '';
        if (S.hc && S.hc.length > 0) {
            songsHtml = S.hc.map(function(t, i) {
                var isCur = S.ct && (
                    S.ct.id === t.id ||
                    S.ct.videoId === t.id ||
                    (S.ct.id && t.videoId && S.ct.id === t.videoId) ||
                    (S.ct.videoId && t.id && S.ct.videoId === t.id) ||
                    (S.ct.title === t.title && S.ct.artist === t.artist)
                );
                var isPlay = isCur && S.ip;
                var isLoad = isCur && S.il;

                var playIconHtml = '';
                if (isLoad) {
                    playIconHtml = '<div class="w-7 h-7 rounded-full btn-chrome flex items-center justify-center shrink-0 ml-auto"><div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>';
                } else if (isPlay) {
                    playIconHtml = '<div class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0 ml-auto  shadow-white/30 ring-2 ring-white scale-105"><div class="flex items-end justify-center gap-[2px] w-3.5 h-3.5 pb-0.5"><span class="w-[2px] bg-black rounded-full animate-eq-1"></span><span class="w-[2px] bg-black rounded-full animate-eq-2"></span><span class="w-[2px] bg-black rounded-full animate-eq-3"></span></div></div>';
                } else if (isCur) {
                    playIconHtml = '<div class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0 ml-auto border border-white"><i data-lucide="pause" class="w-3.5 h-3.5 fill-current"></i></div>';
                } else {
                    playIconHtml = '<div class="w-7 h-7 rounded-full bg-white/5 group-hover:bg-white/20 flex items-center justify-center shrink-0 ml-auto text-white transition-all"><i data-lucide="play" class="w-3.5 h-3.5 fill-current ml-0.5"></i></div>';
                }

                var cardBg = isPlay ? 'bg-white/15 border border-white/40  shadow-white/5' : (isCur ? 'bg-white/10 border border-white/30' : 'glass glass-hover');

                return '<div onclick="PK(\'homecat\','+i+')" class="home-cat-card group '+cardBg+' rounded-xl flex items-center gap-3 p-2.5 cursor-pointer active:scale-95 transition-all animate-card-up" style="animation-delay:'+Math.min(i*30, 450)+'ms">'+
                    '<img src="'+t.cover+'" class="w-12 h-12 rounded-lg object-cover shadow-md shrink-0" onerror="this.src=\''+FI+'\'" />'+
                    '<div class="truncate flex-1 min-w-0"><h3 class="font-bold text-sm truncate '+(isCur?'text-white font-black':'text-white/90')+'">'+es(t.title)+'</h3><p class="text-muted text-xs truncate mt-0.5">'+es(t.artist)+'</p></div>'+
                    '<div class="ml-auto">'+playIconHtml+'</div>'+
                '</div>';
            }).join('');
        } else {
            songsHtml = '<p class="text-center text-white/70 text-sm py-8 col-span-2">Tidak ada lagu ditemukan untuk kategori ini</p>';
        }

        var plistHtml = '';
        if (S.hcp && S.hcp.length > 0) {
            plistHtml = S.hcp.slice(0, 10).map(function(p, i) {
                return '<div onclick="Album.open(\''+p.id+'\', \''+(p.cover||FI)+'\')" class="flex-shrink-0 w-36 cursor-pointer active:scale-95 animate-card-left" style="animation-delay:'+Math.min(i*40, 400)+'ms"><div class="w-36 h-36 mb-2 relative rounded-xl overflow-hidden glass-edge "><img src="'+(p.cover||FI)+'" class="w-full h-full object-cover" onerror="this.src=\''+FI+'\'" /></div><h3 class="font-semibold text-xs truncate">'+es(p.title)+'</h3><p class="text-white/70 text-[10px] truncate mt-0.5">'+es(p.artist)+'</p></div>';
            }).join('');
        }

        var artistsHtml = '';
        if (S.hca && S.hca.length > 0) {
            artistsHtml = S.hca.slice(0, 8).map(function(p, i) {
                return '<div onclick="Artist.open(\''+p.id+'\', \''+esJs(p.name||p.title)+'\')" class="flex-shrink-0 w-28 cursor-pointer active:scale-95 animate-card-left" style="animation-delay:'+Math.min(i*40, 400)+'ms"><div class="w-28 h-28 mb-2 relative rounded-full overflow-hidden glass-edge "><img src="'+(p.cover||FI)+'" class="w-full h-full object-cover" onerror="this.src=\''+FI+'\'" /></div><h3 class="font-semibold text-center text-xs truncate">'+es(p.name||p.title)+'</h3></div>';
            }).join('');
        }

        catView.innerHTML = `
        <div class="space-y-6 pb-28 animate-card-up">
            <div class="flex justify-between items-center bg-[var(--surface-2)] p-3.5 rounded-2xl border border-[var(--border-color)]">
                <div class="flex items-center gap-2">
                    <span class="text-xs text-[var(--text-secondary)] font-medium">Kategori:</span>
                    <span class="font-bold text-sm text-[var(--text-primary)] bg-[var(--surface)] px-3 py-1 rounded-full border border-[var(--border-color)] shadow-sm">${es(catName)}</span>
                </div>
                <button onclick="Home.selectCategory('Semua')" class="text-xs px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center gap-1 active:scale-95 shadow-sm cursor-pointer">
                    <i data-lucide="x" class="w-3.5 h-3.5"></i> Reset / Semua
                </button>
            </div>

            <div>
                <h2 class="text-base font-bold mb-3 flex items-center gap-2">
                    <span class="w-1.5 h-4 bg-white/90 rounded-full inline-block"></span>
                    <span class="chrome-text">Lagu Populer - ${es(catName)}</span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${songsHtml}</div>
            </div>

            ${plistHtml ? `<div>
                <h2 class="text-base font-bold mb-3 flex items-center gap-2">
                    <span class="w-1.5 h-4 bg-white/90 rounded-full inline-block"></span>
                    <span class="chrome-text">Playlist & Album ${es(catName)}</span>
                </h2>
                <div class="flex gap-3 overflow-x-auto hide-scrollbar pb-3">${plistHtml}</div>
            </div>` : ''}

            ${artistsHtml ? `<div>
                <h2 class="text-base font-bold mb-3 flex items-center gap-2">
                    <span class="w-1.5 h-4 bg-white/90 rounded-full inline-block"></span>
                    <span class="chrome-text">Artis Related</span>
                </h2>
                <div class="flex gap-3 overflow-x-auto hide-scrollbar pb-3">${artistsHtml}</div>
            </div>` : ''}
        </div>`;

        lucide.createIcons();
    },

    showSkeleton() {
        var g = gid('home-grid'), s = gid('home-scroll'), a = gid('home-artists');
        if (g) {
            g.innerHTML = Array(6).fill(0).map(function() {
                return '<div class="glass rounded-xl flex items-center gap-3 p-2 animate-pulse"><div class="w-14 h-14 rounded-lg bg-white/5"></div><div class="flex-grow space-y-2"><div class="h-3.5 bg-white/10 rounded w-3/4"></div><div class="h-2.5 bg-white/5 rounded w-1/2"></div></div></div>';
            }).join('');
        }
        if (s) {
            s.innerHTML = Array(4).fill(0).map(function() {
                return '<div class="flex-shrink-0 w-40 animate-pulse"><div class="w-40 h-40 mb-2 rounded-xl bg-white/5"></div><div class="h-3.5 bg-white/10 rounded w-3/4 mb-1"></div><div class="h-2.5 bg-white/5 rounded w-1/2"></div></div>';
            }).join('');
        }
        if (a) {
            a.innerHTML = Array(4).fill(0).map(function() {
                return '<div class="flex-shrink-0 w-32 animate-pulse"><div class="w-32 h-32 mb-2 rounded-full bg-white/5"></div><div class="h-3.5 bg-white/10 rounded w-3/4 mx-auto mb-1"></div></div>';
            }).join('');
        }
    },

    async fetch() {
        Home.showSkeleton();
        try {
            var [resViral, resDiscover, resNew, resArtist] = await Promise.all([
                fetch(API.search + '?query=' + encodeURIComponent('sound viral sekarang') + '&type=songs').then(function(r){return r.json();}).catch(function(){return null;}),
                fetch(API.search + '?query=' + encodeURIComponent('Hits Choice Indonesia Popular') + '&type=songs').then(function(r){return r.json();}).catch(function(){return null;}),
                fetch(API.search + '?query=' + encodeURIComponent('Lagu Baru Indonesia 2026 Hits') + '&type=songs').then(function(r){return r.json();}).catch(function(){return null;}),
                fetch(API.search + '?query=' + encodeURIComponent('Artis Populer Indonesia') + '&type=artists').then(function(r){return r.json();}).catch(function(){return null;})
            ]);

            if (resViral && resViral.status && resViral.result.songs && resViral.result.songs.length > 0) {
                S.hv = resViral.result.songs.map(function(s) {
                    return {
                        id: s.videoId,
                        videoId: s.videoId,
                        title: cn(s.title),
                        artist: cn(s.artist),
                        artistId: s.artistId || '',
                        cover: toHDCover(s.thumbnail, s.videoId),
                        ytUrl: s.url
                    };
                });
            } else {
                S.hv = [];
            }

            if (resDiscover && resDiscover.status && resDiscover.result.songs && resDiscover.result.songs.length > 0) {
                S.hd = resDiscover.result.songs.map(function(s) {
                    return {
                        id: s.videoId,
                        videoId: s.videoId,
                        title: cn(s.title),
                        artist: cn(s.artist),
                        artistId: s.artistId || '',
                        cover: toHDCover(s.thumbnail, s.videoId),
                        ytUrl: s.url
                    };
                });
            } else {
                S.hd = [];
            }

            if (resNew && resNew.status && resNew.result.songs && resNew.result.songs.length > 0) {
                S.ht = resNew.result.songs.map(function(s) {
                    return {
                        id: s.videoId,
                        videoId: s.videoId,
                        title: cn(s.title),
                        artist: cn(s.artist),
                        artistId: s.artistId || '',
                        cover: toHDCover(s.thumbnail, s.videoId),
                        ytUrl: s.url
                    };
                });
            } else {
                S.ht = (S.hd || []).slice();
            }

            var plist = [];
            if (resViral && resViral.result) {
                plist = [].concat(resViral.result.playlists || []).concat(resViral.result.albums || []);
            }
            if (plist.length < 4 && resDiscover && resDiscover.result) {
                plist = plist.concat(resDiscover.result.playlists || []).concat(resDiscover.result.albums || []);
            }
            if (plist.length > 0) {
                S.hp = plist.sort(function() { return 0.5 - Math.random(); });
            }

            if (resArtist && resArtist.status && resArtist.result.artists && resArtist.result.artists.length > 0) {
                S.ha = resArtist.result.artists.sort(function() { return 0.5 - Math.random(); });
            } else {
                S.ha = [];
            }
        } catch(e){}

        Home.show();
    },

    show() {
        if (Home.activeCategory && Home.activeCategory !== 'Semua') {
            if (Home.activeCategory === 'Developer Profile') {
                Home.renderDeveloperProfileView();
            } else {
                Home.displayCategoryView();
            }
            if (typeof dismissSplashScreen === 'function') dismissSplashScreen();
            return;
        }

        var defView = gid('home-default-view'), catView = gid('home-category-view');
        if (defView) defView.style.display = 'block';
        if (catView) catView.style.display = 'none';

        var g = gid('home-grid'), s = gid('home-scroll'), dCover = gid('home-discover'), vCover = gid('home-viral'), clEl = gid('home-continue-listening'); 
        if (!g || !s) return;

        // Render Continue Listening section strictly from listening history
        Home.renderListeningHistory();

        // Render Sound Viral Sekarang section (Top viral hits query)
        if (vCover) {
            var viralSongs = (S.hv && S.hv.length > 0 ? S.hv : S.ht).slice(0, 10);
            var viralTags = ['🔥 VIRAL NOW', '⚡ FYP HITS', '🎵 TRENDING INDO', '✨ POPULAR', '🎧 TOP STREAM', '🌟 HITS HARI INI'];
            if (viralSongs.length > 0) {
                vCover.innerHTML = viralSongs.map(function(t, i) {
                    var isCur = S.ct && (
                        S.ct.id === t.id ||
                        S.ct.videoId === t.id ||
                        (S.ct.id && t.videoId && S.ct.id === t.videoId) ||
                        (S.ct.videoId && t.id && S.ct.videoId === t.id) ||
                        (S.ct.title === t.title && S.ct.artist === t.artist)
                    );
                    var isPlay = isCur && S.ip;
                    var tagText = viralTags[i % viralTags.length];

                    return '<div onclick="PK(\'homeviral\','+i+')" class="discover-card snap-start shrink-0 w-44 sm:w-52 h-56 rounded-3xl relative overflow-hidden group cursor-pointer border border-white/15 shadow-xl active:scale-95 transition-all animate-stagger" style="animation-delay:'+(i*60)+'ms">'+
                        '<img src="'+t.cover+'" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" onerror="this.src=\''+FI+'\'" />'+
                        '<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>'+
                        '<div class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-600 border border-white/20 text-[9px] font-black text-white tracking-widest uppercase shadow-md">'+tagText+'</div>'+
                        '<div class="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">'+
                            '<div class="min-w-0 flex-1">'+
                                '<h3 class="font-bold text-xs sm:text-sm text-white truncate leading-tight">'+es(t.title)+'</h3>'+
                                '<p class="text-[10px] text-white/70 truncate mt-0.5">'+es(t.artist)+'</p>'+
                            '</div>'+
                            '<button class="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow-lg active:scale-90 transition-all">'+
                                (isPlay ? '<i data-lucide="pause" class="w-4 h-4 fill-current"></i>' : '<i data-lucide="play" class="w-4 h-4 fill-current ml-0.5"></i>')+
                            '</button>'+
                        '</div>'+
                    '</div>';
                }).join('');
                vCover.parentElement.style.display = 'block';
            } else {
                vCover.parentElement.style.display = 'none';
            }
        }

        // Render Discover section (Trending Global / Popular Hits at bottom)
        if (dCover) {
            var discoverSongs = (S.hd && S.hd.length > 0 ? S.hd : S.ht).slice(0, 10);
            var tags = ['POPULAR', 'TRENDING', 'HOT', 'RECOMMENDED', 'VIBES', 'ESSENTIAL'];
            if (discoverSongs.length > 0) {
                dCover.innerHTML = discoverSongs.map(function(t, i) {
                    var isCur = S.ct && (
                        S.ct.id === t.id ||
                        S.ct.videoId === t.id ||
                        (S.ct.id && t.videoId && S.ct.id === t.videoId) ||
                        (S.ct.videoId && t.id && S.ct.videoId === t.id) ||
                        (S.ct.title === t.title && S.ct.artist === t.artist)
                    );
                    var isPlay = isCur && S.ip;
                    var tagText = tags[i % tags.length];

                    return '<div onclick="PK(\'discover\','+i+')" class="discover-card snap-start shrink-0 w-44 sm:w-52 h-56 rounded-3xl relative overflow-hidden group cursor-pointer border border-white/15 shadow-xl active:scale-95 transition-all animate-stagger" style="animation-delay:'+(i*60)+'ms">'+
                        '<img src="'+t.cover+'" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" onerror="this.src=\''+FI+'\'" />'+
                        '<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>'+
                        '<div class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 border border-white/20 text-[9px] font-black text-white tracking-widest uppercase">'+tagText+'</div>'+
                        '<div class="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">'+
                            '<div class="min-w-0 flex-1">'+
                                '<h3 class="font-bold text-xs sm:text-sm text-white truncate leading-tight">'+es(t.title)+'</h3>'+
                                '<p class="text-[10px] text-white/70 truncate mt-0.5">'+es(t.artist)+'</p>'+
                            '</div>'+
                            '<button class="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow-lg active:scale-90 transition-all">'+
                                (isPlay ? '<i data-lucide="pause" class="w-4 h-4 fill-current"></i>' : '<i data-lucide="play" class="w-4 h-4 fill-current ml-0.5"></i>')+
                            '</button>'+
                        '</div>'+
                    '</div>';
                }).join('');
                dCover.parentElement.style.display = 'block';
            } else {
                dCover.parentElement.style.display = 'none';
            }
        }

        // Render New Release section (distinct S.ht source)
        g.innerHTML = (S.ht || []).slice(0, 6).map(function(t, i) {
            var isCur = S.ct && (
                S.ct.id === t.id ||
                S.ct.videoId === t.id ||
                (S.ct.id && t.videoId && S.ct.id === t.videoId) ||
                (S.ct.videoId && t.id && S.ct.videoId === t.id) ||
                (S.ct.title === t.title && S.ct.artist === t.artist)
            );
            var isPlay = isCur && S.ip;
            var isLoad = isCur && S.il;

            var playIconHtml = '';
            if (isLoad) {
                playIconHtml = '<div class="w-7 h-7 rounded-full btn-chrome flex items-center justify-center shrink-0 ml-auto"><div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>';
            } else if (isPlay) {
                playIconHtml = '<div class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0 ml-auto shadow-white/30 ring-2 ring-white scale-105"><div class="flex items-end justify-center gap-[2px] w-3.5 h-3.5 pb-0.5"><span class="w-[2px] bg-black rounded-full animate-eq-1"></span><span class="w-[2px] bg-black rounded-full animate-eq-2"></span><span class="w-[2px] bg-black rounded-full animate-eq-3"></span></div></div>';
            } else if (isCur) {
                playIconHtml = '<div class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0 ml-auto border border-white"><i data-lucide="pause" class="w-3.5 h-3.5 fill-current"></i></div>';
            }

            var cardBg = isPlay ? 'bg-white/15 border border-white/40 shadow-white/5' : (isCur ? 'bg-white/10 border border-white/30' : 'glass glass-hover');
            var textStyle = isCur ? 'text-white font-black' : '';

            return '<div onclick="PK(\'home1\','+i+')" class="home-grid-card '+cardBg+' rounded-xl flex items-center gap-3 p-2 cursor-pointer active:scale-95 transition-all animate-stagger" style="animation-delay:'+(i*50)+'ms">'+
                '<img src="'+t.cover+'" class="w-14 h-14 rounded-lg object-cover shrink-0" loading="lazy" decoding="async" onerror="this.src=\''+FI+'\'" />'+
                '<span class="home-grid-title font-bold text-sm line-clamp-2 min-w-0 flex-1 '+textStyle+'">'+es(t.title)+'</span>'+
                '<div class="home-grid-icon ml-auto">'+playIconHtml+'</div>'+
            '</div>';
        }).join('');

        var pls = typeof getUserPlaylists === 'function' ? getUserPlaylists() : [];
        var plHtml = '';

        pls.forEach(function(p, i) {
            plHtml += '<div onclick="Library.open(\''+p.id+'\')" class="flex-shrink-0 w-40 cursor-pointer active:scale-95 animate-stagger" style="animation-delay:'+(i*50)+'ms"><div class="w-40 h-40 mb-2 relative rounded-xl overflow-hidden glass-edge"><img src="'+(p.image||(p.songs.length>0?p.songs[0].cover:FI))+'" class="w-full h-full object-cover" loading="lazy" decoding="async" onerror="this.src=\''+FI+'\'" /><div class="absolute bottom-2 right-2 btn-chrome rounded-full p-3 opacity-0 hover:opacity-100 transition-all shadow-black/40"><i data-lucide="play" class="w-5 h-5 fill-current ml-0.5"></i></div></div><h3 class="font-semibold text-sm truncate">'+es(p.name)+'</h3><p class="text-white/70 text-xs truncate mt-1">'+p.songs.length+' lagu</p></div>';
        });

        plHtml += '<div onclick="if(typeof Library !== \'undefined\') Library.createNew()" class="flex-shrink-0 w-40 cursor-pointer active:scale-95 flex flex-col"><div class="w-40 h-40 mb-2 relative rounded-xl overflow-hidden glass flex flex-col items-center justify-center border border-dashed border-white/20 hover:border-white/40"><i data-lucide="plus" class="w-8 h-8 text-white/70"></i><span class="text-xs text-white/70 mt-2">Buat Playlist</span></div><h3 class="font-semibold text-sm truncate text-white/70">Buat Baru</h3></div>';

        if (S.hp && S.hp.length > 0) {
            S.hp.slice(0, 8).forEach(function(p, i) {
                plHtml += '<div onclick="Album.open(\''+p.id+'\', \''+(p.cover||FI)+'\')" class="flex-shrink-0 w-40 cursor-pointer active:scale-95 animate-stagger" style="animation-delay:'+((i+pls.length+1)*50)+'ms"><div class="w-40 h-40 mb-2 relative rounded-xl overflow-hidden glass-edge"><img src="'+(p.cover||FI)+'" class="w-full h-full object-cover" loading="lazy" decoding="async" onerror="this.src=\''+FI+'\'" /></div><h3 class="font-semibold text-sm truncate">'+es(p.title)+'</h3><p class="text-white/70 text-xs truncate mt-1">'+es(p.artist)+'</p></div>';
            });
        }

        s.innerHTML = plHtml;

        var a = gid('home-artists');
        if (a) {
            if (S.ha && S.ha.length > 0) {
                var artHtml = S.ha.slice(0, 10).map(function(p, i) {
                    return '<div onclick="Artist.open(\''+p.id+'\', \''+esJs(p.name||p.title)+'\')" class="flex-shrink-0 w-32 cursor-pointer active:scale-95 animate-stagger" style="animation-delay:'+(i*50)+'ms"><div class="w-32 h-32 mb-2 relative rounded-full overflow-hidden glass-edge"><img src="'+(p.cover||FI)+'" class="w-full h-full object-cover" loading="lazy" decoding="async" onerror="this.src=\''+FI+'\'" /></div><h3 class="font-semibold text-center text-sm truncate">'+es(p.name||p.title)+'</h3></div>';
                }).join('');
                a.innerHTML = artHtml;
                a.parentElement.style.display = 'block';
            } else {
                a.parentElement.style.display = 'none';
            }
        }
        lucide.createIcons();
        if (typeof dismissSplashScreen === 'function') dismissSplashScreen();
    },

    renderActive() {
        if (Home.activeCategory && Home.activeCategory !== 'Semua') {
            Home.renderActiveCategory();
            return;
        }

        var dCover = gid('home-discover');
        if (dCover && dCover.children) {
            var discoverSongs = (S.hd && S.hd.length > 0 ? S.hd : S.ht).slice(0, 8);
            var dCards = dCover.querySelectorAll('.discover-card');
            dCards.forEach(function(el, i) {
                var t = discoverSongs[i];
                if (!t) return;
                var isCur = S.ct && (
                    S.ct.id === t.id ||
                    S.ct.videoId === t.id ||
                    (S.ct.id && t.videoId && S.ct.id === t.videoId) ||
                    (S.ct.videoId && t.id && S.ct.videoId === t.id) ||
                    (S.ct.title === t.title && S.ct.artist === t.artist)
                );
                var isPlay = isCur && S.ip;
                var btn = el.querySelector('button');
                if (btn) {
                    btn.innerHTML = isPlay ? '<i data-lucide="pause" class="w-4 h-4 fill-current"></i>' : '<i data-lucide="play" class="w-4 h-4 fill-current ml-0.5"></i>';
                }
            });
        }

        var g = gid('home-grid');
        if (g && g.children && S.ht) {
            var items = S.ht.slice(0, 6);
            var cards = g.querySelectorAll('.home-grid-card');
            cards.forEach(function(el, i) {
                var t = items[i];
                if (!t) return;
                var isCur = S.ct && (
                    S.ct.id === t.id ||
                    S.ct.videoId === t.id ||
                    (S.ct.id && t.videoId && S.ct.id === t.videoId) ||
                    (S.ct.videoId && t.id && S.ct.videoId === t.id) ||
                    (S.ct.title === t.title && S.ct.artist === t.artist)
                );
                var isPlay = isCur && S.ip;
                var isLoad = isCur && S.il;

                var playIconHtml = '';
                if (isLoad) {
                    playIconHtml = '<div class="w-7 h-7 rounded-full btn-chrome flex items-center justify-center shrink-0 ml-auto"><div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>';
                } else if (isPlay) {
                    playIconHtml = '<div class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0 ml-auto  shadow-white/30 ring-2 ring-white scale-105"><div class="flex items-end justify-center gap-[2px] w-3.5 h-3.5 pb-0.5"><span class="w-[2px] bg-black rounded-full animate-eq-1"></span><span class="w-[2px] bg-black rounded-full animate-eq-2"></span><span class="w-[2px] bg-black rounded-full animate-eq-3"></span></div></div>';
                } else if (isCur) {
                    playIconHtml = '<div class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0 ml-auto border border-white"><i data-lucide="pause" class="w-3.5 h-3.5 fill-current"></i></div>';
                }

                var cardBg = isPlay ? 'bg-white/15 border border-white/40  shadow-white/5' : (isCur ? 'bg-white/10 border border-white/30' : 'glass glass-hover');
                el.className = 'home-grid-card ' + cardBg + ' rounded-xl flex items-center gap-3 p-2 cursor-pointer active:scale-95 transition-all';

                var titleEl = el.querySelector('.home-grid-title');
                if (titleEl) {
                    titleEl.className = 'home-grid-title font-bold text-sm line-clamp-2 min-w-0 flex-1 ' + (isCur ? 'text-white font-black' : '');
                }
                var iconWrap = el.querySelector('.home-grid-icon');
                if (iconWrap) {
                    iconWrap.innerHTML = playIconHtml;
                }
            });
        }
        lucide.createIcons();
    },

    renderActiveCategory() {
        var catView = gid('home-category-view');
        if (!catView || !S.hc) return;

        var cards = catView.querySelectorAll('.home-cat-card');
        cards.forEach(function(el, i) {
            var t = S.hc[i];
            if (!t) return;

            var isCur = S.ct && (
                S.ct.id === t.id ||
                S.ct.videoId === t.id ||
                (S.ct.id && t.videoId && S.ct.id === t.videoId) ||
                (S.ct.videoId && t.id && S.ct.videoId === t.id) ||
                (S.ct.title === t.title && S.ct.artist === t.artist)
            );
            var isPlay = isCur && S.ip;
            var isLoad = isCur && S.il;

            var playIconHtml = '';
            if (isLoad) {
                playIconHtml = '<div class="w-7 h-7 rounded-full btn-chrome flex items-center justify-center shrink-0 ml-auto"><div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>';
            } else if (isPlay) {
                playIconHtml = '<div class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0 ml-auto  shadow-white/30 ring-2 ring-white scale-105"><div class="flex items-end justify-center gap-[2px] w-3.5 h-3.5 pb-0.5"><span class="w-[2px] bg-black rounded-full animate-eq-1"></span><span class="w-[2px] bg-black rounded-full animate-eq-2"></span><span class="w-[2px] bg-black rounded-full animate-eq-3"></span></div></div>';
            } else if (isCur) {
                playIconHtml = '<div class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0 ml-auto border border-white"><i data-lucide="pause" class="w-3.5 h-3.5 fill-current"></i></div>';
            } else {
                playIconHtml = '<div class="w-7 h-7 rounded-full bg-white/5 group-hover:bg-white/20 flex items-center justify-center shrink-0 ml-auto text-white transition-all"><i data-lucide="play" class="w-3.5 h-3.5 fill-current ml-0.5"></i></div>';
            }

            var cardBg = isPlay ? 'bg-white/15 border border-white/40  shadow-white/5' : (isCur ? 'bg-white/10 border border-white/30' : 'glass glass-hover');
            el.className = 'home-cat-card group ' + cardBg + ' rounded-xl flex items-center gap-3 p-2.5 cursor-pointer active:scale-95 transition-all';

            var titleEl = el.querySelector('h3');
            if (titleEl) {
                titleEl.className = 'font-bold text-sm truncate ' + (isCur ? 'text-white font-black' : 'text-white/90');
            }
            var iconWrap = el.children[el.children.length - 1];
            if (iconWrap) {
                iconWrap.innerHTML = playIconHtml;
            }
        });
        lucide.createIcons();
    },

    refresh() {
        if (Home.activeCategory && Home.activeCategory !== 'Semua') {
            Home.fetchCategoryData(Home.activeCategory);
        } else {
            Home.fetch();
        }
        var m = gid('main-area');
        if (m) m.scrollTop = 0;
    },

    initHeadlineAnimation() {
        if (window._heroTextInterval) clearInterval(window._heroTextInterval);

        var heroPhrases = [
            'Find the best<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-indigo-500">music for you</span>',
            'Discover new<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500">trending tracks</span>',
            'Listen & feel<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">your daily mood</span>',
            'Stream HQ audio<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-300">without limits</span>'
        ];
        var heroIdx = 0;

        window._heroTextInterval = setInterval(function() {
            var el = document.getElementById('hero-animated-headline');
            if (!el) return;
            el.style.opacity = '0';
            el.style.transform = 'translateY(-6px)';
            setTimeout(function() {
                heroIdx = (heroIdx + 1) % heroPhrases.length;
                if (el) {
                    el.innerHTML = heroPhrases[heroIdx];
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            }, 350);
        }, 3600);
    },

    currentBannerIdx: 0,

    goToBanner(idx) {
        Home.currentBannerIdx = idx;
        var slider = document.getElementById('home-banner-slider');
        if (slider) {
            slider.style.transform = 'translateX(-' + (idx * 100) + '%)';
        }
        var dots = document.querySelectorAll('.home-banner-dot');
        dots.forEach(function(dot, i) {
            if (i === idx) {
                dot.className = 'home-banner-dot w-2 h-2 rounded-full bg-white transition-all cursor-pointer';
            } else {
                dot.className = 'home-banner-dot w-2 h-2 rounded-full bg-white/40 hover:bg-white/70 transition-all cursor-pointer';
            }
        });
    },

    initBannerCarousel() {
        if (window._homeBannerInterval) clearInterval(window._homeBannerInterval);
        Home.currentBannerIdx = 0;
        Home.goToBanner(0);

        window._homeBannerInterval = setInterval(function() {
            var slider = document.getElementById('home-banner-slider');
            if (!slider) return;
            Home.currentBannerIdx = (Home.currentBannerIdx + 1) % 3;
            Home.goToBanner(Home.currentBannerIdx);
        }, 4000);
    }
};

Home.renderListeningHistory = function() {
    var clEl = gid('home-continue-listening');
    if (!clEl) return;
    var historyTracks = typeof getListeningHistory === 'function' ? getListeningHistory() : [];
    if (historyTracks.length > 0) {
        clEl.innerHTML = historyTracks.slice(0, 10).map(function(t, i) {
            var isCur = S.ct && (
                S.ct.id === t.id ||
                S.ct.videoId === t.videoId ||
                (S.ct.title === t.title && S.ct.artist === t.artist)
            );
            var isPlay = isCur && S.ip;
            var trackObj = JSON.stringify(t).replace(/"/g, '&quot;');
            var progressWidth = isCur ? (S.pd > 0 ? Math.min(100, Math.max(0, (S.pt / S.pd) * 100)) + '%' : '85%') : '100%';
            var progressBarHtml = '<div class="relative w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-3 flex items-center">' +
                '<div class="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 rounded-full transition-all duration-300" style="width:' + progressWidth + '"></div>' +
            '</div>';

            return '<div onclick="Home.playHistorySong(' + trackObj + ')" class="snap-start shrink-0 w-60 p-3 rounded-2xl border border-white/10 hover:border-blue-500/40 relative overflow-hidden group cursor-pointer active:scale-95 transition-all shadow-lg flex flex-col justify-between home-card">'+
                '<div class="flex items-center gap-3">'+
                    '<div class="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md border border-white/10">'+
                        '<img src="'+(t.cover || FI)+'" class="w-full h-full object-cover" onerror="this.src=\''+FI+'\'" />'+
                        (isPlay ? '<div class="absolute inset-0 bg-black/40 flex items-center justify-center"><i data-lucide="pause" class="w-5 h-5 text-blue-400 fill-current"></i></div>' : '')+
                    '</div>'+
                    '<div class="min-w-0 flex-1">'+
                        '<h3 class="font-extrabold text-xs sm:text-sm text-white truncate leading-tight">'+es(t.title)+'</h3>'+
                        '<p class="text-[11px] text-muted truncate mt-0.5">'+es(t.artist)+'</p>'+
                    '</div>'+
                    '<button class="w-8 h-8 rounded-full bg-white/10 group-hover:bg-blue-600 group-hover:text-white text-white flex items-center justify-center shrink-0 transition-all shadow-sm">'+
                        (isPlay ? '<i data-lucide="pause" class="w-3.5 h-3.5 fill-current"></i>' : '<i data-lucide="play" class="w-3.5 h-3.5 fill-current ml-0.5"></i>')+
                    '</button>'+
                '</div>'+
                progressBarHtml+
            '</div>';
        }).join('');
        if (clEl.parentElement) clEl.parentElement.style.display = 'block';
    } else {
        clEl.innerHTML = '<div class="w-full py-6 px-4 rounded-2xl bg-white/5 border border-white/10 text-center text-muted text-xs font-semibold flex items-center justify-center gap-2">' +
            '<i data-lucide="history" class="w-4 h-4 text-emerald-400"></i>' +
            '<span>Belum ada riwayat musik. Putar lagu untuk memulai!</span>' +
        '</div>';
        if (clEl.parentElement) clEl.parentElement.style.display = 'block';
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
};

Home.playHistorySong = function(t) {
    if (!t) return;
    if (S.ct && (S.ct.id === t.id || S.ct.videoId === t.videoId) && AU.src) {
        if (typeof MP !== 'undefined' && MP.togglePlay) { MP.togglePlay(); return; }
    }
    S.ct = t;
    S.pl = [t];
    S.pi = 0;
    UU();
    if (typeof MP !== 'undefined') MP.show();
    loadTrack(t);
};
