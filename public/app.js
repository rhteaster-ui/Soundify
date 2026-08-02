// PWA - INSTALL PROMPT HANDLING
var deferredInstallPrompt = null;
var isStandaloneApp = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
var isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredInstallPrompt = e;
    var triggers = document.querySelectorAll('.pwa-install-trigger, #pwa-install-btn, #pwa-home-install-card');
    triggers.forEach(function(el) {
        if (!isStandaloneApp) el.classList.remove('hidden');
    });
});

window.addEventListener('appinstalled', function() {
    deferredInstallPrompt = null;
    var triggers = document.querySelectorAll('.pwa-install-trigger, #pwa-install-btn, #pwa-home-install-card');
    triggers.forEach(function(el) { el.classList.add('hidden'); });
    if (typeof showToast === 'function') showToast('Soundify berhasil diinstall ke beranda!');
});

function installPWA() {
    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(function(choice) {
            if (choice.outcome === 'accepted' && typeof showToast === 'function') {
                showToast('Menginstall Soundify ke beranda...');
            }
            deferredInstallPrompt = null;
            var triggers = document.querySelectorAll('.pwa-install-trigger, #pwa-install-btn, #pwa-home-install-card');
            triggers.forEach(function(el) { el.classList.add('hidden'); });
        });
    } else if (isIOSDevice) {
        if (typeof showToast === 'function') {
            showToast('Tap ikon Bagikan ⎋ lalu pilih "Tambah ke Layar Utama"');
        }
    } else {
        if (typeof showToast === 'function') {
            showToast('Buka menu Browser (⋮) lalu pilih "Tambahkan ke Layar Utama"');
        }
    }
}

var App={
    initTheme(){
        var saved = localStorage.getItem('soundify_theme');
        var isLight = saved ? (saved === 'light') : true;
        if (isLight) {
            document.documentElement.classList.add('light-theme');
            document.documentElement.classList.remove('dark-theme');
        } else {
            document.documentElement.classList.remove('light-theme');
            document.documentElement.classList.add('dark-theme');
        }
        App.updateThemeUI(isLight);
    },
    toggleTheme(){
        var isCurrentlyLight = document.documentElement.classList.contains('light-theme');
        var isLight = !isCurrentlyLight;
        if (isLight) {
            document.documentElement.classList.add('light-theme');
            document.documentElement.classList.remove('dark-theme');
        } else {
            document.documentElement.classList.remove('light-theme');
            document.documentElement.classList.add('dark-theme');
        }
        localStorage.setItem('soundify_theme', isLight ? 'light' : 'dark');
        var metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.setAttribute('content', isLight ? '#fafafa' : '#09090b');
        App.updateThemeUI(isLight);
        if (typeof showToast === 'function') {
            showToast(isLight ? 'Mode Terang (Light Mode) Aktif' : 'Mode Gelap (Dark Mode) Aktif');
        }
    },
    updateThemeUI(isLight){
        if (typeof isLight === 'undefined') {
            isLight = document.documentElement.classList.contains('light-theme');
        }
        var icon = gid('header-theme-icon');
        if (icon) {
            icon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
            icon.className = isLight ? 'w-4 h-4 text-zinc-700' : 'w-4 h-4 text-amber-400';
        }
        var drawerBadge = gid('drawer-theme-badge');
        if (drawerBadge) {
            drawerBadge.textContent = isLight ? 'LIGHT' : 'DARK';
        }
        var drawerIcon = gid('drawer-theme-icon');
        if (drawerIcon) {
            drawerIcon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },
    init(){
        App.initTheme();

        gid('nav-container').innerHTML=`
        <div class="nav-blur pb-safe h-[56px] sm:h-[60px] flex items-center justify-around fixed bottom-0 w-full z-40 px-3 border-t border-[var(--border-color)]">
            <button onclick="App.switch('home')" id="nav-home" class="nav-item group relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer select-none touch-manipulation active:scale-95 transition-all">
                <div class="nav-icon-wrapper w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200">
                    <i data-lucide="home" class="w-4 h-4"></i>
                </div>
                <span class="nav-label text-[10px] font-bold tracking-tight transition-all duration-200">Beranda</span>
            </button>
            <button onclick="App.switch('search')" id="nav-search" class="nav-item group relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer select-none touch-manipulation active:scale-95 transition-all">
                <div class="nav-icon-wrapper w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200">
                    <i data-lucide="search" class="w-4 h-4"></i>
                </div>
                <span class="nav-label text-[10px] font-bold tracking-tight transition-all duration-200">Cari</span>
            </button>
            <button onclick="App.switch('library')" id="nav-library" class="nav-item group relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer select-none touch-manipulation active:scale-95 transition-all">
                <div class="nav-icon-wrapper w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200">
                    <i data-lucide="library" class="w-4 h-4"></i>
                </div>
                <span class="nav-label text-[10px] font-bold tracking-tight transition-all duration-200">Koleksi</span>
            </button>
            <button onclick="App.switch('dev')" id="nav-dev" class="nav-item group relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer select-none touch-manipulation active:scale-95 transition-all">
                <div class="nav-icon-wrapper w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200">
                    <i data-lucide="info" class="w-4 h-4"></i>
                </div>
                <span class="nav-label text-[10px] font-bold tracking-tight transition-all duration-200">Informasi</span>
            </button>
        </div>`;
        
        gid('view-dev').innerHTML=`
        <div class="pt-6 px-4 max-w-md mx-auto space-y-5 pb-28">
            <!-- 1. Web Profile Header & Information Description -->
            <div class="glass-strong rounded-3xl border border-[var(--border-color)] text-center relative overflow-hidden shadow-lg">
                <!-- Banner Image Background behind Soundify Icon -->
                <div class="relative w-full h-32 overflow-hidden bg-[var(--surface-2)]">
                    <img src="/banner.webp" class="w-full h-full object-cover" alt="Soundify Banner" onerror="this.style.display='none'" />
                    <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[var(--surface)]"></div>
                </div>

                <!-- Header Content Over Banner -->
                <div class="px-5 pb-5 -mt-12 relative z-10 space-y-4">
                    <div class="relative w-24 h-24 rounded-full mx-auto border-4 border-[var(--surface)] p-1 overflow-hidden shadow-xl bg-[var(--surface-2)]">
                        <img src="/logo.png" class="w-full h-full object-cover rounded-full" onerror="this.src='${FI}'" />
                    </div>
                    <div>
                        <h1 class="text-2xl font-black text-[var(--text-primary)] leading-tight">Soundify</h1>
                        <p class="text-xs text-[var(--text-secondary)] font-semibold mt-1">rhmt sound ecosystem • Web Music Experience</p>
                    </div>

                    <!-- Deskripsi & Fitur Informasi -->
                    <div class="pt-3 border-t border-[var(--border-color)] grid grid-cols-2 gap-2 text-left">
                        <div class="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-color)] flex items-center gap-2">
                            <i data-lucide="zap" class="w-4 h-4 text-amber-400 shrink-0"></i>
                            <span class="text-[11px] font-bold text-[var(--text-primary)]">100% Gratis & No Iklan</span>
                        </div>
                        <div class="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-color)] flex items-center gap-2">
                            <i data-lucide="download" class="w-4 h-4 text-emerald-400 shrink-0"></i>
                            <span class="text-[11px] font-bold text-[var(--text-primary)]">Unduh MP3 Langsung</span>
                        </div>
                        <div class="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-color)] flex items-center gap-2">
                            <i data-lucide="music-2" class="w-4 h-4 text-blue-400 shrink-0"></i>
                            <span class="text-[11px] font-bold text-[var(--text-primary)]">Audio HQ 320kbps</span>
                        </div>
                        <div class="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-color)] flex items-center gap-2">
                            <i data-lucide="mic" class="w-4 h-4 text-rose-400 shrink-0"></i>
                            <span class="text-[11px] font-bold text-[var(--text-primary)]">Lirik Terhubung</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. Spesifikasi Aplikasi -->
            <div class="glass rounded-2xl p-4 space-y-2.5 text-left border border-[var(--border-color)]">
                <h3 class="text-[var(--text-primary)] font-bold text-xs uppercase tracking-wider border-b border-[var(--border-color)] pb-2 flex items-center gap-1.5">
                    <i data-lucide="smartphone" class="w-3.5 h-3.5 text-blue-500"></i> Spesifikasi & Keunggulan Web
                </h3>
                <div class="flex justify-between text-xs"><span class="text-[var(--text-secondary)]">Aplikasi</span><span class="text-[var(--text-primary)] font-semibold">Soundify</span></div>
                <div class="flex justify-between text-xs"><span class="text-[var(--text-secondary)]">Versi</span><span class="text-[var(--text-primary)] font-semibold">v3.5.0 Clean</span></div>
                <div class="flex justify-between text-xs"><span class="text-[var(--text-secondary)]">Ekosistem</span><span class="text-[var(--text-primary)] font-semibold">rhmt Sound Ecosystem</span></div>
                <div class="flex justify-between text-xs"><span class="text-[var(--text-secondary)]">Keunggulan</span><span class="text-[var(--text-primary)] font-semibold">Cepat, Ringan & Offline Support</span></div>
            </div>

            <!-- 3. Tombol Install Aplikasi -->
            <button id="pwa-install-btn" onclick="installPWA()" class="${isStandaloneApp?'hidden ':''}w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30">
                <i data-lucide="download" class="w-4 h-4"></i> Install Aplikasi Soundify
            </button>

            <!-- 4. Paling Bawah: Profil Dev & Media Sosial (Fokus Profil Dev, Icon Kecil Minimalis) -->
            <div class="glass rounded-2xl p-4 border border-[var(--border-color)] space-y-3">
                <div class="flex items-center gap-3">
                    <img src="https://www.rhmt.biz.id/gambar/pp-dev.png" class="w-12 h-12 rounded-full border border-blue-500/40 object-cover shrink-0 shadow-md" onerror="this.src='/logo.png'" />
                    <div>
                        <h3 class="text-sm font-black text-[var(--text-primary)] leading-tight">✧･ﾟ: [𝙍]𝙝𝙢𝙏 | 𝘾𝙤𝙙𝙚⚙️𝘼𝙄 𝙡 :･ﾟ✧</h3>
                        <p class="text-[11px] text-[var(--text-secondary)] font-medium mt-0.5">@r_hmtofc • Pengembang Soundify</p>
                    </div>
                </div>

                <!-- Minimal Icon Links (No Heavy Cards) -->
                <div class="pt-3 border-t border-[var(--border-color)] flex items-center justify-around gap-1">
                    <!-- Website -->
                    <a href="https://www.rhmt.biz.id" target="_blank" title="Website Official (rhmt.biz.id)" class="p-2.5 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-blue-500 transition-all active:scale-90 flex items-center justify-center border border-transparent hover:border-[var(--border-color)]">
                        <i data-lucide="globe" class="w-5 h-5"></i>
                    </a>
                    <!-- WhatsApp Channel -->
                    <a href="https://whatsapp.com/channel/0029VbBjyjlJ93wa6hwSWa0p" target="_blank" title="WhatsApp Channel" class="p-2.5 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-emerald-500 transition-all active:scale-90 flex items-center justify-center border border-transparent hover:border-[var(--border-color)]">
                        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.221h.005c5.505 0 9.988-4.478 9.989-9.985A9.96 9.96 0 0012.012 2zm5.834 14.164c-.244.688-1.428 1.314-1.97 1.37-.502.052-1.151.082-3.321-.818-2.775-1.151-4.56-3.966-4.698-4.152-.138-.186-1.127-1.5-1.127-2.86 0-1.36.713-2.028.966-2.302.253-.274.552-.343.736-.343.184 0 .368.002.529.01.173.008.404-.066.632.482.238.574.805 1.96.874 2.1.069.138.115.3.023.483-.092.184-.138.3-.276.46-.138.161-.29.359-.414.482-.138.138-.282.289-.121.565.161.276.715 1.18 1.536 1.91 1.056.938 1.947 1.229 2.223 1.367.276.138.437.115.6-.069.161-.184.69-0.805.874-1.08.184-.276.368-.23.621-.138.253.092 1.609.759 1.885.897.276.138.46.207.529.322.069.115.069.667-.175 1.355z"/></svg>
                    </a>
                    <!-- Instagram -->
                    <a href="https://www.instagram.com/rahmt_nhw?igsh=MWQwcnB3bTA2ZnVidg==" target="_blank" title="Instagram (@rahmt_nhw)" class="p-2.5 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-pink-500 transition-all active:scale-90 flex items-center justify-center border border-transparent hover:border-[var(--border-color)]">
                        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <!-- TikTok -->
                    <a href="https://www.tiktok.com/@r_hmtofc?_r=1&_t=ZS-94KRfWQjeUu" target="_blank" title="TikTok (@r_hmtofc)" class="p-2.5 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-sky-400 transition-all active:scale-90 flex items-center justify-center border border-transparent hover:border-[var(--border-color)]">
                        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.67 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.36 1.48-1.41 2.48-.08 1.25.53 2.5 1.58 3.14.9.55 2.05.62 3.01.21 1.01-.42 1.73-1.36 1.88-2.43.11-1.85.06-3.72.06-5.58V.02z"/></svg>
                    </a>
                    <!-- Telegram -->
                    <a href="https://t.me/rAi_engine" target="_blank" title="Telegram (rAi_engine)" class="p-2.5 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-blue-400 transition-all active:scale-90 flex items-center justify-center border border-transparent hover:border-[var(--border-color)]">
                        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    </a>
                </div>
            </div>
        </div>`;
        
        MP.init();FullPlayer.init();Artist.init();Album.init();Home.render();Search.render();
        if(typeof updateOG==='function') updateOG(null);
        App.switch('home');
        if(typeof lucide!=="undefined")lucide.createIcons();
        setTimeout(function(){ App.checkUrl(); }, 1000);
        window.addEventListener('popstate', function(e) {
            if (typeof Album !== 'undefined' && gid('album-modal') && gid('album-modal').style.display !== 'none') {
                gid('album-modal').style.display = 'none';
                gid('album-content').innerHTML = '';
                Album.currentAlbumId = null;
            }
            if (typeof Artist !== 'undefined' && gid('artist-modal') && gid('artist-modal').style.display !== 'none') {
                gid('artist-modal').style.display = 'none';
                gid('artist-content').innerHTML = '';
                Artist.currentArtistId = null;
            }
        });
    },
    checkUrl(){
        var path = window.location.pathname;
        if(path.startsWith('/search/')){
            var q = path.split('/search/')[1];
            if(q){
                setTimeout(function(){
                    var si=gid('search-input');
                    if(si){
                        si.value=decodeURIComponent(q);
                        gid('search-form').dispatchEvent(new Event('submit'));
                    }
                    App.switch('search');
                },300);
            }
        }
        else if(path.startsWith('/play/')){
            var videoId = path.split('/play/')[1];
            if(videoId) {
                var p = new URLSearchParams(location.search);
                var isShared = p.get('share') === 'true' || p.get('share') === '1';
                if(isShared) {
                    App.showSharePopup(videoId);
                } else {
                    App.autoPlayTrack(videoId);
                }
            }
        }
        else if(path.startsWith('/album/')){
            var albumId = path.split('/album/')[1];
            if(albumId) {
                App.switch('home');
                setTimeout(function(){ Album.open(albumId); }, 300);
            }
        }
        else if(path.startsWith('/artist/')){
            var artistId = path.split('/artist/')[1];
            if(artistId) {
                App.switch('home');
                setTimeout(function(){ Artist.open(artistId); }, 300);
            }
        }
        else {
            var p=new URLSearchParams(location.search);
            var play=p.get('play'),search=p.get('search'),isShared=p.get('share')==='1';
            if(play){if(isShared){App.showSharePopup(play);}else{App.autoPlayTrack(play);}}
            else if(search){setTimeout(function(){var si=gid('search-input');if(si){si.value=decodeURIComponent(search);gid('search-form').dispatchEvent(new Event('submit'));}App.switch('search');},300);}
        }
    },
    autoPlayTrack(videoId){
        fetch(API.search+'?query=https://youtube.com/watch?v='+videoId).then(function(r){return r.json();}).then(function(d){
            var title='Lagu',artist='Soundify',cover=toHDCover('', videoId),artistId='';
            if(d.status&&d.result.songs&&d.result.songs.length>0){var song=d.result.songs[0];title=cn(song.title);artist=cn(song.artist);cover=toHDCover(song.thumbnail, videoId);artistId=song.artistId||'';}
            S.ct={id:videoId,videoId:videoId,title:title,artist:artist,cover:cover,artistId:artistId,ytUrl:'https://youtube.com/watch?v='+videoId};
            S.ps='direct';S.pl=[S.ct];S.pi=0;UU();MP.show();resetLyricsUI(videoId);
            setTimeout(function(){FullPlayer.open();loadTrack(S.ct);},400);
        }).catch(function(){
            S.ct={id:videoId,videoId:videoId,title:'Lagu',artist:'Soundify',cover:toHDCover('', videoId),artistId:'',ytUrl:'https://youtube.com/watch?v='+videoId};
            S.ps='direct';S.pl=[S.ct];S.pi=0;UU();MP.show();resetLyricsUI(videoId);
            setTimeout(function(){FullPlayer.open();loadTrack(S.ct);},400);
        });
    },
    showSharePopup(videoId){
        fetch(API.search+'?query=https://youtube.com/watch?v='+videoId).then(function(r){return r.json();}).then(function(d){
            var title='Lagu',artist='Soundify',cover=toHDCover('', videoId);
            if(d.status&&d.result.songs&&d.result.songs.length>0){var song=d.result.songs[0];title=cn(song.title);artist=cn(song.artist);cover=toHDCover(song.thumbnail, videoId);}
            App.renderPopup(videoId,title,artist,cover);
        }).catch(function(){App.renderPopup(videoId,'Lagu','Soundify',toHDCover('', videoId));});
    },
    renderPopup(videoId,title,artist,cover){
        if(typeof updateOG==='function') updateOG(title, cover, artist);
        var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';
        popup.onclick=function(e){if(e.target===popup)popup.remove();};
        popup.innerHTML='<div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.4s ease-out forwards;"><div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div><div class="flex items-center gap-4 mb-4"><img src="'+cover+'" class="w-16 h-16 rounded-xl object-cover " onerror="this.src=\''+FI+'\'" /><div class="flex-1 truncate"><h3 class="font-bold text-white truncate">'+title+'</h3><p class="text-muted text-sm truncate">'+artist+'</p></div></div><p class="text-white/70 text-xs mb-4 text-center">Seseorang membagikan lagu ini kepadamu</p><div class="flex gap-3"><button id="popup-play" class="flex-1 btn-chrome font-bold py-3 rounded-full active:scale-95">🎵 Putar Sekarang</button><button id="popup-later" class="px-6 py-3 glass glass-hover text-white rounded-full active:scale-95">Nanti</button></div></div>';
        document.body.appendChild(popup);
        popup.querySelector('#popup-play').onclick=function(){popup.remove();S.ct={id:videoId,videoId:videoId,title:title,artist:artist,cover:cover,artistId:'',ytUrl:'https://youtube.com/watch?v='+videoId};S.ps='direct';S.pl=[S.ct];S.pi=0;UU();MP.show();resetLyricsUI(videoId);setTimeout(function(){FullPlayer.open();loadTrack(S.ct);},400);};
        popup.querySelector('#popup-later').onclick=function(){popup.remove();};
    },
    switch(t){
        // Auto-close opened detail modals/tabs when switching bottom navbar
        if(typeof FullPlayer !== 'undefined' && FullPlayer.close) FullPlayer.close();
        if(typeof Album !== 'undefined' && Album.close) Album.close();
        if(typeof Artist !== 'undefined' && Artist.close) Artist.close();
        if(typeof Library !== 'undefined' && Library.closeModalOnly) Library.closeModalOnly();

        // Remove any open popups or dialogs
        document.querySelectorAll('.fixed.z-\\[300\\], .fixed.z-\\[400\\]').forEach(function(el){
            if(el.id !== 'v3-popup' && el.id !== 'mini-player') el.remove();
        });

        var tabs = ['home', 'search', 'library', 'dev'];
        var prevTab = S.at || 'home';
        var prevIndex = tabs.indexOf(prevTab);
        var nextIndex = tabs.indexOf(t);

        S.at = t;

        tabs.forEach(function(id){
            var el = gid('view-' + id);
            if(el) {
                el.style.display = 'none';
                el.classList.remove('animate-slide-right', 'animate-slide-left');
            }
        });

        if(t==='library'){Library.render();}
        if(t==='home'){
            if (prevTab === 'home' && Home.activeCategory) {
                Home.selectCategory('Semua');
            } else {
                Home.render();
            }
        }
        if(t==='search'){Search.onShow();}

        var targetEl = gid('view-' + t);
        if(targetEl) {
            targetEl.style.display = 'block';
            if(prevIndex !== -1 && nextIndex !== -1 && prevIndex !== nextIndex) {
                if(nextIndex > prevIndex) {
                    targetEl.classList.add('animate-slide-right');
                } else {
                    targetEl.classList.add('animate-slide-left');
                }
            }
        }

        ['home','search','library','dev'].forEach(function(n){
            var b=gid('nav-'+n);
            if(!b)return;
            var wrapper = b.querySelector('.nav-icon-wrapper');
            var label = b.querySelector('.nav-label');
            var isCurrent = (n === t);

            if(isCurrent){
                if(wrapper){
                    wrapper.className = 'nav-icon-wrapper w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold shadow-lg -translate-y-1.5 scale-105 transition-all duration-300';
                    wrapper.style.background = 'var(--track-accent, #2563eb)';
                    wrapper.style.boxShadow = '0 6px 18px var(--track-accent-glow, rgba(37, 99, 235, 0.45))';
                }
                if(label){
                    label.className = 'nav-label text-[10px] font-extrabold tracking-wide transition-all duration-300';
                    label.style.color = 'var(--track-accent, #2563eb)';
                }
            } else {
                if(wrapper){
                    wrapper.className = 'nav-icon-wrapper w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-transparent translate-y-0 transition-all duration-300';
                    wrapper.style.background = 'none';
                    wrapper.style.boxShadow = 'none';
                }
                if(label){
                    label.className = 'nav-label text-[9px] font-semibold text-[var(--text-secondary)] translate-y-0 transition-all duration-300';
                    label.style.color = '';
                }
            }
        });

        gid('main-area').scrollTop=0;if(typeof lucide!=="undefined")lucide.createIcons();
    },
    updateNavTheme(){
        var t = S.at || 'home';
        ['home','search','library','dev'].forEach(function(n){
            var b=gid('nav-'+n);
            if(!b)return;
            var wrapper = b.querySelector('.nav-icon-wrapper');
            var label = b.querySelector('.nav-label');
            var isCurrent = (n === t);

            if(isCurrent){
                if(wrapper){
                    wrapper.className = 'nav-icon-wrapper w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold shadow-lg -translate-y-1.5 scale-105 transition-all duration-300';
                    wrapper.style.background = 'var(--track-accent, #2563eb)';
                    wrapper.style.boxShadow = '0 6px 18px var(--track-accent-glow, rgba(37, 99, 235, 0.45))';
                }
                if(label){
                    label.className = 'nav-label text-[10px] font-extrabold tracking-wide transition-all duration-300';
                    label.style.color = 'var(--track-accent, #2563eb)';
                }
            } else {
                if(wrapper){
                    wrapper.className = 'nav-icon-wrapper w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-transparent translate-y-0 transition-all duration-300';
                    wrapper.style.background = 'none';
                    wrapper.style.boxShadow = 'none';
                }
                if(label){
                    label.className = 'nav-label text-[9px] font-semibold text-[var(--text-secondary)] translate-y-0 transition-all duration-300';
                    label.style.color = '';
                }
            }
        });
    },
    openDrawer(){
        var existing = gid('soundify-drawer');
        if (existing) existing.remove();

        var drawer = document.createElement('div');
        drawer.id = 'soundify-drawer';
        drawer.className = 'fixed inset-0 z-[250] flex justify-end bg-black/70 backdrop-blur-sm transition-opacity duration-300';
        drawer.onclick = function(e){ if(e.target === drawer) App.closeDrawer(); };

        drawer.innerHTML = `
        <div id="drawer-inner" class="w-full max-w-xs h-full bg-[var(--surface)] border-l border-white/10 p-5 flex flex-col justify-between shadow-2xl overflow-y-auto transform translate-x-full transition-transform duration-300">
            <div class="space-y-4">
                <!-- Header Drawer -->
                <div class="flex items-center justify-between pb-3.5 border-b border-white/10">
                    <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-xl bg-black border border-white/20 shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                            <img src="/logo.png" class="w-full h-full object-cover" onerror="this.src='${FI}'" />
                        </div>
                        <div>
                            <div class="flex items-center gap-1.5">
                                <h2 class="text-base font-black text-white tracking-tight leading-tight">Soundify</h2>
                                <span class="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 text-[9px] font-bold border border-cyan-500/30">PRO</span>
                            </div>
                            <p class="text-muted text-[10px] font-semibold">Pengaturan & Fitur</p>
                        </div>
                    </div>
                    <button onclick="App.closeDrawer()" class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-muted hover:text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer border border-white/10">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>

                <!-- Developer Card Badge (rhmt.biz.id profile picture) -->
                <div onclick="App.closeDrawer(); Home.selectCategory('Developer Profile');" class="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center justify-between group shadow-sm">
                    <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px] shrink-0">
                            <img src="https://www.rhmt.biz.id/gambar/pp-dev.png" class="w-full h-full object-cover rounded-full bg-black" onerror="this.src='/logo.png'" />
                        </div>
                        <div>
                            <div class="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                                rhmt • Developer
                                <i data-lucide="check-circle" class="w-3 h-3 text-cyan-400 fill-cyan-400/20"></i>
                            </div>
                            <div class="text-[9px] text-muted">Creator of rhmt sound ecosystem</div>
                        </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-muted group-hover:translate-x-0.5 transition-transform"></i>
                </div>

                <!-- Menu Group: PENGATURAN TAMPILAN & AUDIO -->
                <div>
                    <div class="text-[9px] font-black uppercase tracking-widest text-muted mb-2 px-1">Tampilan & Audio</div>
                    <div class="space-y-1.5">
                        <button onclick="App.toggleTheme()" class="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer group">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i id="drawer-theme-icon" data-lucide="sun" class="w-3.5 h-3.5"></i>
                                </div>
                                <div class="text-left">
                                    <div class="text-xs font-bold text-white">Mode Tampilan</div>
                                    <div class="text-[9px] text-muted">Ganti Light / Dark Theme</div>
                                </div>
                            </div>
                            <span id="drawer-theme-badge" class="text-[9px] font-black px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15">DARK</span>
                        </button>

                        <button onclick="App.closeDrawer(); openEqualizer();" class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-white transition-all cursor-pointer group">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i data-lucide="sliders" class="w-3.5 h-3.5"></i>
                                </div>
                                <div class="text-left">
                                    <div class="text-xs font-bold text-white">Equalizer & Audio FX</div>
                                    <div class="text-[9px] text-muted">Preset EQ & Bass Booster</div>
                                </div>
                            </div>
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-muted group-hover:translate-x-0.5 transition-transform"></i>
                        </button>
                    </div>
                </div>

                <!-- Menu Group: FITUR UTAMA -->
                <div>
                    <div class="text-[9px] font-black uppercase tracking-widest text-muted mb-2 px-1">Menu Utama</div>
                    <div class="space-y-1.5">
                        <button onclick="App.closeDrawer(); App.switch('library');" class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-white transition-all cursor-pointer group">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i data-lucide="library" class="w-3.5 h-3.5"></i>
                                </div>
                                <div class="text-left">
                                    <div class="text-xs font-bold text-white">Koleksi Saya</div>
                                    <div class="text-[9px] text-muted">Lagu disukai & playlist</div>
                                </div>
                            </div>
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-muted group-hover:translate-x-0.5 transition-transform"></i>
                        </button>

                        <button onclick="App.closeDrawer(); App.switch('search');" class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-white transition-all cursor-pointer group">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i data-lucide="search" class="w-3.5 h-3.5"></i>
                                </div>
                                <div class="text-left">
                                    <div class="text-xs font-bold text-white">Cari Lagu & Artis</div>
                                    <div class="text-[9px] text-muted">Jelajahi catalog musik HQ</div>
                                </div>
                            </div>
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-muted group-hover:translate-x-0.5 transition-transform"></i>
                        </button>

                        <button onclick="App.closeDrawer(); Home.playRandomSong();" class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-white transition-all cursor-pointer group">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i data-lucide="shuffle" class="w-3.5 h-3.5"></i>
                                </div>
                                <div class="text-left">
                                    <div class="text-xs font-bold text-white">Putar Musik Acak</div>
                                    <div class="text-[9px] text-muted">Rekomendasi musik otomatis</div>
                                </div>
                            </div>
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-muted group-hover:translate-x-0.5 transition-transform"></i>
                        </button>
                    </div>
                </div>

                <!-- Menu Group: ALAT & SISTEM -->
                <div>
                    <div class="text-[9px] font-black uppercase tracking-widest text-muted mb-2 px-1">Sistem & Aplikasi</div>
                    <div class="space-y-1.5">
                        <button onclick="App.closeDrawer(); if (typeof Rating !== 'undefined') Rating.openModal();" class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-white transition-all cursor-pointer group">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
                                </div>
                                <div class="text-left">
                                    <div class="text-xs font-bold text-white flex items-center gap-1.5">
                                        <span>Rating & Ulasan App</span>
                                        <span id="drawer-rating-badge" class="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">⭐ 5.0</span>
                                    </div>
                                    <div class="text-[9px] text-muted">Beri ulasan & lihat umpan balik</div>
                                </div>
                            </div>
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-muted group-hover:translate-x-0.5 transition-transform"></i>
                        </button>

                        <button onclick="App.closeDrawer(); installPWA();" class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-white transition-all cursor-pointer group">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i data-lucide="download" class="w-3.5 h-3.5"></i>
                                </div>
                                <div class="text-left">
                                    <div class="text-xs font-bold text-white">Install PWA App</div>
                                    <div class="text-[9px] text-muted">Pasang di layar utama HP</div>
                                </div>
                            </div>
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-muted group-hover:translate-x-0.5 transition-transform"></i>
                        </button>

                        <button onclick="App.closeDrawer(); Home.refresh();" class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-white transition-all cursor-pointer group">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                                    <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i>
                                </div>
                                <div class="text-left">
                                    <div class="text-xs font-bold text-white">Refresh Catalog</div>
                                    <div class="text-[9px] text-muted">Perbarui data beranda</div>
                                </div>
                            </div>
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-muted"></i>
                        </button>

                        <button onclick="App.clearAppCache()" class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-white transition-all cursor-pointer group">
                            <div class="flex items-center gap-3">
                                <div class="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                </div>
                                <div class="text-left">
                                    <div class="text-xs font-bold text-rose-300">Bersihkan Cache</div>
                                    <div class="text-[9px] text-rose-400/70">Kosongkan memori lokal</div>
                                </div>
                            </div>
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-rose-400"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Footer Drawer -->
            <div class="pt-3 border-t border-white/10 text-center space-y-2.5">
                <div class="grid grid-cols-2 gap-2">
                    <a href="https://www.rhmt.biz.id" target="_blank" class="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-[11px] font-bold transition-all truncate">
                        <i data-lucide="globe" class="w-3.5 h-3.5 shrink-0"></i>
                        <span class="truncate">rhmt.biz.id</span>
                    </a>
                    <a href="https://whatsapp.com/channel/0029VbBjyjlJ93wa6hwSWa0p" target="_blank" class="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold transition-all truncate">
                        <i data-lucide="message-square" class="w-3.5 h-3.5 shrink-0"></i>
                        <span class="truncate">WhatsApp</span>
                    </a>
                </div>
                <div class="text-[10px] text-muted font-mono">Soundify v3.5.0 • rhmt sound ecosystem</div>
            </div>
        </div>`;

        document.body.appendChild(drawer);
        App.updateThemeUI();
        if(typeof lucide!=="undefined")lucide.createIcons();

        setTimeout(function(){
            var inner = gid('drawer-inner');
            if (inner) inner.classList.remove('translate-x-full');
        }, 10);
    },
    closeDrawer(){
        var inner = gid('drawer-inner');
        var drawer = gid('soundify-drawer');
        if (inner) inner.classList.add('translate-x-full');
        setTimeout(function(){
            if (drawer) drawer.remove();
        }, 300);
    },
    clearAppCache(){
        if (confirm('Apakah Anda yakin ingin membersihkan cache & reset memori lokal?')) {
            localStorage.clear();
            if (typeof showToast === 'function') showToast('🧹 Cache dibersihkan! Memuat ulang...');
            setTimeout(function(){ location.reload(); }, 600);
        }
    },
    showV3Popup() {
        if(localStorage.getItem('seen_v3_popup_update')) return;
        var popup = document.createElement('div');
        popup.id = 'v3-popup';
        popup.className = 'fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4';
        popup.innerHTML = `
            <div class="glass-strong w-full max-w-sm rounded-3xl p-5 border border-white/15 text-center relative overflow-hidden bg-zinc-950/90 text-white shadow-2xl" style="animation: slideUp 0.3s ease-out forwards;">
                <!-- Web Title & App Logo -->
                <div class="flex items-center justify-center gap-2.5 mb-3">
                    <img src="/logo.png" class="w-10 h-10 rounded-xl border border-white/20 shadow-md object-cover" onerror="this.src='${FI}'" />
                    <div class="text-left">
                        <h2 class="text-lg font-black text-white leading-tight">Soundify</h2>
                        <p class="text-[10px] text-zinc-400 font-semibold">rhmt sound ecosystem</p>
                    </div>
                </div>

                <!-- Dev Profile Block in Popup -->
                <div class="p-3 rounded-2xl bg-white/5 border border-white/10 mb-4 text-left">
                    <div class="flex items-center gap-3 mb-2.5">
                        <img src="https://www.rhmt.biz.id/gambar/pp-dev.png" class="w-10 h-10 rounded-full border border-blue-400/50 object-cover shrink-0 shadow-md" onerror="this.src='/logo.png'" />
                        <div class="min-w-0 flex-1">
                            <h3 class="text-xs font-black text-white truncate">✧･ﾟ: [𝙍]𝙝𝙢𝙏 | 𝘾𝙤𝙙𝙚⚙️𝘼𝙄 𝙡 :･ﾟ✧</h3>
                            <p class="text-[10px] text-blue-300 font-semibold truncate">@r_hmtofc • Pengembang Soundify</p>
                        </div>
                    </div>

                    <!-- Social Links using ICONS ONLY -->
                    <div class="flex items-center justify-around gap-1 pt-2.5 border-t border-white/10">
                        <!-- Website -->
                        <a href="https://www.rhmt.biz.id" target="_blank" title="Website Official (rhmt.biz.id)" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-blue-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm">
                            <i data-lucide="globe" class="w-4 h-4"></i>
                        </a>
                        <!-- WhatsApp Channel -->
                        <a href="https://whatsapp.com/channel/0029VbBjyjlJ93wa6hwSWa0p" target="_blank" title="WhatsApp Channel" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-emerald-400 hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.221h.005c5.505 0 9.988-4.478 9.989-9.985A9.96 9.96 0 0012.012 2zm5.834 14.164c-.244.688-1.428 1.314-1.97 1.37-.502.052-1.151.082-3.321-.818-2.775-1.151-4.56-3.966-4.698-4.152-.138-.186-1.127-1.5-1.127-2.86 0-1.36.713-2.028.966-2.302.253-.274.552-.343.736-.343.184 0 .368.002.529.01.173.008.404-.066.632.482.238.574.805 1.96.874 2.1.069.138.115.3.023.483-.092.184-.138.3-.276.46-.138.161-.29.359-.414.482-.138.138-.282.289-.121.565.161.276.715 1.18 1.536 1.91 1.056.938 1.947 1.229 2.223 1.367.276.138.437.115.6-.069.161-.184.69-0.805.874-1.08.184-.276.368-.23.621-.138.253.092 1.609.759 1.885.897.276.138.46.207.529.322.069.115.069.667-.175 1.355z"/></svg>
                        </a>
                        <!-- Instagram -->
                        <a href="https://www.instagram.com/rahmt_nhw?igsh=MWQwcnB3bTA2ZnVidg==" target="_blank" title="Instagram (@rahmt_nhw)" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-pink-400 hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                        <!-- TikTok -->
                        <a href="https://www.tiktok.com/@r_hmtofc?_r=1&_t=ZS-94KRfWQjeUu" target="_blank" title="TikTok (@r_hmtofc)" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-sky-400 hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.67 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.36 1.48-1.41 2.48-.08 1.25.53 2.5 1.58 3.14.9.55 2.05.62 3.01.21 1.01-.42 1.73-1.36 1.88-2.43.11-1.85.06-3.72.06-5.58V.02z"/></svg>
                        </a>
                        <!-- Telegram -->
                        <a href="https://t.me/rAi_engine" target="_blank" title="Telegram (rAi_engine)" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-sky-400 hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                        </a>
                    </div>
                </div>

                <!-- Features Highlight -->
                <div class="space-y-2 text-left mb-5 text-xs text-zinc-300">
                    <div class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 shrink-0"></i> 100% Gratis & Bebas Iklan</div>
                    <div class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 shrink-0"></i> Unduh Musik MP3 Langsung</div>
                    <div class="flex items-center gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 shrink-0"></i> Audio HQ 320kbps & Equalizer</div>
                </div>
                
                <!-- Button -->
                <button id="close-v3-popup" class="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg active:scale-95 transition-all cursor-pointer">
                    Mulai Mendengarkan Musik 🚀
                </button>
            </div>
        `;
        document.body.appendChild(popup);
        if(typeof lucide!=="undefined")lucide.createIcons();
        popup.querySelector('#close-v3-popup').onclick = function() {
            localStorage.setItem('seen_v3_popup_update', 'true');
            popup.remove();
        };
    }
};
App.init();Home.fetch();

// SPLASH SCREEN - LOGO BULAT BESAR
(function(){
    var sp=gid('splash-screen');
    if(!sp)return;
    // Ganti logo jadi bulat besar
    var logoWrap=sp.querySelector('.logo-wrap');
    if(logoWrap){
        logoWrap.style.width='200px';
        logoWrap.style.height='200px';
        logoWrap.style.borderRadius='50%';
    }
    var logo=sp.querySelector('.logo');
    if(logo){
        logo.style.borderRadius='50%';
        logo.style.objectFit='cover';
    }
    setTimeout(function(){
        sp.classList.add('hide');
        setTimeout(function(){ 
            if(sp&&sp.parentNode) sp.parentNode.removeChild(sp); 
            // Trigger V3 Update popup here
            App.showV3Popup();
        },350);
    },2000);
})();

var Library={
    activeTab: 'liked',
    setTab(t){
        Library.activeTab = t;
        Library.render();
    },
    render(){
        var likedSongs = typeof getLikedSongs === 'function' ? getLikedSongs() : [];
        var historySongs = typeof getListeningHistory === 'function' ? getListeningHistory() : [];
        var pls = typeof getUserPlaylists === 'function' ? getUserPlaylists() : [];
        var likedArtists = typeof getLikedArtists === 'function' ? getLikedArtists() : [];
        var isLikedTab = Library.activeTab === 'liked';
        var isHistoryTab = Library.activeTab === 'history';
        var isPlaylistsTab = Library.activeTab === 'playlists';
        var isArtistsTab = Library.activeTab === 'artists';

        var html = '<div class="pt-12 px-4 pb-28">' +
            '<div class="flex items-center justify-between mb-4">' +
                '<h1 class="text-3xl font-black text-[var(--text-primary)]">Library</h1>' +
            '</div>' +
            
            '<!-- Tabs Navigation -->' +
            '<div class="flex gap-1 p-1 bg-[var(--surface-2)] rounded-2xl mb-5 border border-[var(--border-color)] overflow-x-auto hide-scrollbar">' +
                '<button onclick="Library.setTab(\'liked\')" class="flex-1 py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ' + (isLikedTab ? 'bg-blue-600 text-white shadow-md ' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]') + '">' +
                    '<i data-lucide="heart" class="w-3.5 h-3.5 ' + (isLikedTab ? 'fill-current text-white' : '') + '"></i>' +
                    '<span>Disukai</span>' +
                '</button>' +
                '<button onclick="Library.setTab(\'history\')" class="flex-1 py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ' + (isHistoryTab ? 'bg-blue-600 text-white shadow-md ' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]') + '">' +
                    '<i data-lucide="history" class="w-3.5 h-3.5 ' + (isHistoryTab ? 'text-white' : '') + '"></i>' +
                    '<span>Riwayat</span>' +
                '</button>' +
                '<button onclick="Library.setTab(\'artists\')" class="flex-1 py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ' + (isArtistsTab ? 'bg-blue-600 text-white shadow-md ' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]') + '">' +
                    '<i data-lucide="user" class="w-3.5 h-3.5 ' + (isArtistsTab ? 'text-white' : '') + '"></i>' +
                    '<span>Artist</span>' +
                '</button>' +
                '<button onclick="Library.setTab(\'playlists\')" class="flex-1 py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ' + (isPlaylistsTab ? 'bg-blue-600 text-white shadow-md ' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]') + '">' +
                    '<i data-lucide="list-music" class="w-3.5 h-3.5 ' + (isPlaylistsTab ? 'text-white' : '') + '"></i>' +
                    '<span>Playlist</span>' +
                '</button>' +
            '</div>';

        if(isHistoryTab){
            // HISTORY TAB CONTENT
            if(historySongs.length === 0){
                html += '<div class="text-center text-white/70 py-16 px-4 glass rounded-3xl border border-white/5 mt-2">' +
                    '<div class="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">' +
                        '<i data-lucide="history" class="w-10 h-10 text-emerald-400 opacity-60"></i>' +
                    '</div>' +
                    '<h3 class="text-white font-bold text-lg mb-1">Belum Ada Riwayat Mendengarkan</h3>' +
                    '<p class="text-xs text-white/70 max-w-xs mx-auto mb-6">Setiap kali Anda memutar musik, riwayat akan otomatis tersimpan di sini.</p>' +
                    '<button onclick="App.switch(\'search\')" class="btn-chrome px-6 py-3 font-bold rounded-full text-xs active:scale-95">🔍 Cari & Putar Musik</button>' +
                '</div>';
            } else {
                html += '<!-- History Header Card -->' +
                '<div class="relative overflow-hidden rounded-2xl p-5 mb-5 bg-gradient-to-r from-emerald-600/30 via-teal-600/20 to-cyan-600/10 border border-white/10 flex items-center justify-between">' +
                    '<div class="flex items-center gap-4 min-w-0">' +
                        '<div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg">' +
                            '<i data-lucide="history" class="w-7 h-7 text-white"></i>' +
                        '</div>' +
                        '<div class="truncate">' +
                            '<h2 class="text-lg font-black text-white truncate">Riwayat Mendengarkan</h2>' +
                            '<p class="text-xs text-muted mt-0.5">' + historySongs.length + ' lagu tersimpan</p>' +
                        '</div>' +
                    '</div>' +
                    '<button onclick="clearListeningHistory()" class="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 font-bold text-xs flex items-center gap-1.5 border border-red-500/30 active:scale-95 transition-all" title="Bersihkan Riwayat">' +
                        '<i data-lucide="trash-2" class="w-3.5 h-3.5"></i>' +
                        '<span>Hapus</span>' +
                    '</button>' +
                '</div>' +

                '<!-- History Song List -->' +
                '<div id="history-songs-list" class="space-y-1.5">';
                
                historySongs.forEach(function(s, i){
                    var isCur = S.ct && (
                        S.ct.id === s.id ||
                        S.ct.videoId === s.videoId ||
                        (S.ct.title === s.title && S.ct.artist === s.artist)
                    );
                    var isPlay = isCur && S.ip;
                    var isLoad = isCur && S.il;

                    var iconOverlay = '';
                    if (isLoad) {
                        iconOverlay = '<div class="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>';
                    } else if (isPlay) {
                        iconOverlay = '<div class="flex items-end justify-center gap-[2px] w-5 h-5 pb-0.5"><span class="w-[2px] bg-emerald-400 rounded-full animate-eq-1"></span><span class="w-[2px] bg-emerald-400 rounded-full animate-eq-2"></span><span class="w-[2px] bg-emerald-400 rounded-full animate-eq-3"></span></div>';
                    } else if (isCur) {
                        iconOverlay = '<i data-lucide="pause" class="w-5 h-5 text-emerald-400 fill-current"></i>';
                    } else {
                        iconOverlay = '<i data-lucide="play" class="w-5 h-5 text-white fill-white"></i>';
                    }

                    var rowBg = isPlay ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/30 shadow-md' : (isCur ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 border border-transparent hover:border-white/5');
                    var titleClass = isCur ? 'text-emerald-400 font-bold' : 'text-white font-bold';

                    html += '<div class="flex items-center gap-3 p-2.5 rounded-2xl active:scale-[0.99] transition-all group ' + rowBg + '">' +
                        '<div onclick="Library.playHistoryIndex(' + i + ')" class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">' +
                            '<div class="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md">' +
                                '<img src="' + (s.cover || FI) + '" class="w-full h-full object-cover" onerror="this.src=\'' + FI + '\'" />' +
                                '<div class="absolute inset-0 bg-black/80 ' + (isCur ? 'opacity-100' : 'opacity-0 group-hover:opacity-100') + ' transition-all flex items-center justify-center">' +
                                    iconOverlay +
                                '</div>' +
                            '</div>' +
                            '<div class="truncate flex-1">' +
                                '<p class="text-sm truncate transition-colors ' + titleClass + '">' + es(s.title) + '</p>' +
                                '<p class="text-white/70 text-xs truncate mt-0.5">' + es(s.artist) + '</p>' +
                            '</div>' +
                        '</div>' +
                        '<button onclick="toggleLikeSong(' + es(JSON.stringify(s)).replace(/"/g, '&quot;') + ')" class="p-2 text-white/60 hover:text-rose-500 active:scale-90 transition-all" title="Sukai Lagu">' +
                            '<i data-lucide="heart" class="w-5 h-5"></i>' +
                        '</button>' +
                    '</div>';
                });
                html += '</div>';
            }
        } else if(isLikedTab){
            // LIKED SONGS TAB CONTENT
            if(likedSongs.length === 0){
                html += '<div class="text-center text-white/70 py-16 px-4 glass rounded-3xl border border-white/5 mt-2">' +
                    '<div class="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">' +
                        '<i data-lucide="heart" class="w-10 h-10 text-rose-400 opacity-60"></i>' +
                    '</div>' +
                    '<h3 class="text-white font-bold text-lg mb-1">Belum Ada Lagu Disukai</h3>' +
                    '<p class="text-xs text-white/70 max-w-xs mx-auto mb-6">Klik ikon <i data-lucide="heart" class="w-3.5 h-3.5 inline text-rose-400"></i> pada Mini Player atau Full Player saat memutar lagu favoritmu.</p>' +
                    '<button onclick="App.switch(\'search\')" class="btn-chrome px-6 py-3 font-bold rounded-full text-xs active:scale-95">🔍 Cari & Temukan Lagu</button>' +
                '</div>';
            } else {
                html += '<!-- Liked Songs Header Card -->' +
                '<div class="relative overflow-hidden rounded-2xl p-5 mb-5 bg-gradient-to-r from-rose-600/30 via-purple-600/20 to-indigo-600/10 border border-white/10  flex items-center justify-between">' +
                    '<div class="flex items-center gap-4 min-w-0">' +
                        '<div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-600 flex items-center justify-center   flex-shrink-0">' +
                            '<i data-lucide="heart" class="w-7 h-7 text-white fill-white"></i>' +
                        '</div>' +
                        '<div class="truncate">' +
                            '<h2 class="text-lg font-black text-white truncate">Lagu Disukai</h2>' +
                            '<p class="text-xs text-muted mt-0.5">' + likedSongs.length + ' lagu tersimpan</p>' +
                        '</div>' +
                    '</div>' +
                    '<button onclick="Library.playAllLiked()" class="btn-chrome p-3.5 rounded-full   active:scale-90 flex-shrink-0" title="Putar Semua">' +
                        '<i data-lucide="play" class="w-5 h-5 fill-current ml-0.5"></i>' +
                    '</button>' +
                '</div>' +

                '<!-- Song List -->' +
                '<div id="liked-songs-list" class="space-y-1.5">';
                
                likedSongs.forEach(function(s, i){
                    var isCur = S.ct && (
                        S.ct.id === s.id ||
                        S.ct.videoId === s.videoId ||
                        (S.ct.title === s.title && S.ct.artist === s.artist)
                    );
                    var isPlay = isCur && S.ip;
                    var isLoad = isCur && S.il;

                    var iconOverlay = '';
                    if (isLoad) {
                        iconOverlay = '<div class="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>';
                    } else if (isPlay) {
                        iconOverlay = '<div class="flex items-end justify-center gap-[2px] w-5 h-5 pb-0.5"><span class="w-[2px] bg-rose-400 rounded-full animate-eq-1"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-2"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-3"></span></div>';
                    } else if (isCur) {
                        iconOverlay = '<i data-lucide="pause" class="w-5 h-5 text-rose-400 fill-current"></i>';
                    } else {
                        iconOverlay = '<i data-lucide="play" class="w-5 h-5 text-white fill-white"></i>';
                    }

                    var rowBg = isPlay ? 'bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-transparent border border-rose-500/30 shadow-md' : (isCur ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 border border-transparent hover:border-white/5');
                    var titleClass = isCur ? 'text-rose-400 font-bold' : 'text-white font-bold';

                    html += '<div class="flex items-center gap-3 p-2.5 rounded-2xl active:scale-[0.99] transition-all group ' + rowBg + '">' +
                        '<div onclick="Library.playLikedIndex(' + i + ')" class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">' +
                            '<div class="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md">' +
                                '<img src="' + s.cover + '" class="w-full h-full object-cover" onerror="this.src=\'' + FI + '\'" />' +
                                '<div class="absolute inset-0 bg-black/80 ' + (isCur ? 'opacity-100' : 'opacity-0 group-hover:opacity-100') + ' transition-all flex items-center justify-center">' +
                                    iconOverlay +
                                '</div>' +
                            '</div>' +
                            '<div class="truncate flex-1">' +
                                '<p class="text-sm truncate transition-colors ' + titleClass + '">' + es(s.title) + '</p>' +
                                '<p class="text-white/70 text-xs truncate mt-0.5">' + es(s.artist) + '</p>' +
                            '</div>' +
                        '</div>' +
                        '<button onclick="toggleLikeSong(' + es(JSON.stringify(s)).replace(/"/g, '&quot;') + ')" class="p-2 text-rose-500 hover:scale-110 active:scale-90 transition-all" title="Hapus dari Lagu Disukai">' +
                            '<i data-lucide="heart" class="w-5 h-5 fill-rose-500"></i>' +
                        '</button>' +
                        '<button onclick="showPlaylistPicker(' + es(JSON.stringify(s)).replace(/"/g, '&quot;') + ')" class="p-2 text-white/70 hover:text-white active:scale-90 transition-all" title="Tambah ke Playlist">' +
                            '<i data-lucide="plus-circle" class="w-5 h-5"></i>' +
                        '</button>' +
                    '</div>';
                });

                html += '</div>';
            }
        } else if (isArtistsTab) {
            // ARTISTS TAB CONTENT
            if(likedArtists.length === 0){
                html += '<div class="text-center text-white/70 py-16 px-4 glass rounded-3xl border border-white/5 mt-2">' +
                    '<div class="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">' +
                        '<i data-lucide="user" class="w-10 h-10 text-amber-400 opacity-60"></i>' +
                    '</div>' +
                    '<h3 class="text-white font-bold text-lg mb-1">Belum Ada Artist Disukai</h3>' +
                    '<p class="text-xs text-white/70 max-w-xs mx-auto mb-6">Sukainya artist favoritmu untuk melihatnya di sini.</p>' +
                    '<button onclick="App.switch(\'search\')" class="btn-chrome px-6 py-3 font-bold rounded-full text-xs active:scale-95">🔍 Cari Artist</button>' +
                '</div>';
            } else {
                html += '<div class="grid grid-cols-2 gap-3">';
                likedArtists.forEach(function(a){
                    html += '<div onclick="Artist.open(\'' + es(a.artistId) + '\', \'' + esJs(a.name) + '\')" class="glass glass-hover rounded-2xl p-4 cursor-pointer active:scale-95 transition-all text-center flex flex-col items-center justify-center">' +
                        '<div class="relative w-24 h-24 mb-3 rounded-full overflow-hidden  border-2 border-white/10">' +
                            '<img src="' + a.thumbnail + '" class="w-full h-full object-cover" onerror="this.src=\'' + FI + '\'" />' +
                        '</div>' +
                        '<h3 class="font-bold text-sm truncate text-white w-full">' + es(a.name) + '</h3>' +
                        '<p class="text-white/70 text-[10px] mt-1 uppercase tracking-wider">Artist</p>' +
                    '</div>';
                });
                html += '</div>';
            }
        } else if (isPlaylistsTab) {
            // PLAYLISTS TAB CONTENT
            html += '<button onclick="Library.createNew()" class="w-full btn-chrome font-bold py-3.5 rounded-2xl active:scale-95 mb-5 flex items-center justify-center gap-2 ">+ Buat Playlist Baru</button>';
            
            if(pls.length === 0){
                html += '<div class="text-center text-white/70 py-16 px-4 glass rounded-3xl border border-white/5 mt-2">' +
                    '<i data-lucide="list-music" class="w-16 h-16 mx-auto mb-4 opacity-30 text-white"></i>' +
                    '<h3 class="text-white font-bold text-lg mb-1">Belum Ada Playlist</h3>' +
                    '<p class="text-xs text-white/70 max-w-xs mx-auto mb-5">Buat playlist pertamamu dan kumpulkan lagu-lagu favoritmu di satu tempat.</p>' +
                '</div>';
            } else {
                html += '<div class="grid grid-cols-2 gap-3">';
                pls.forEach(function(p){
                    html += '<div onclick="Library.open(\'' + p.id + '\')" class="glass glass-hover rounded-2xl p-3 cursor-pointer active:scale-95 transition-all">' +
                        '<div class="relative w-full aspect-square mb-2.5 rounded-xl overflow-hidden ">' +
                            '<img src="' + (p.image || (p.songs.length > 0 ? p.songs[0].cover : FI)) + '" class="w-full h-full object-cover" onerror="this.src=\'' + FI + '\'" />' +
                            '<button onclick="event.stopPropagation();Library.showActions(\'' + p.id + '\')" class="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-2 active:scale-90 transition-all " title="Opsi Playlist"><i data-lucide="more-vertical" class="w-4 h-4 text-white"></i></button>' +
                            (p.songs.length > 0 ? '<button onclick="event.stopPropagation();Library.playSong(\'' + p.id + '\',0)" class="absolute bottom-2 right-2 btn-chrome rounded-full p-2.5  shadow-black/40 active:scale-90" title="Putar"><i data-lucide="play" class="w-4 h-4 fill-current ml-0.5"></i></button>' : '') +
                        '</div>' +
                        '<h3 class="font-bold text-sm truncate text-white">' + es(p.name) + '</h3>' +
                        '<p class="text-white/70 text-xs mt-0.5">' + p.songs.length + ' lagu</p>' +
                    '</div>';
                });
                html += '</div>';
            }
        }

        html += '</div>';
        gid('view-library').innerHTML = html;
        if(typeof lucide!=="undefined")lucide.createIcons();
    },
    playAllLiked(){
        var songs = typeof getLikedSongs === 'function' ? getLikedSongs() : [];
        if(!songs.length) return;
        S.pl = songs;
        S.pi = 0;
        S.ps = 'playlist';
        S.ct = S.pl[S.pi];
        UU(); MP.show(); S.il = true; UB();
        resetLyricsUI(S.ct.videoId);
        loadTrack(S.ct);
    },
    playLikedIndex(index){
        var songs = typeof getLikedSongs === 'function' ? getLikedSongs() : [];
        if(!songs[index]) return;
        var s = songs[index];
        if (S.ct && (S.ct.id === s.id || S.ct.videoId === s.videoId || (S.ct.title === s.title && S.ct.artist === s.artist)) && AU.src) {
            TP();
            return;
        }
        S.pl = songs;
        S.pi = index;
        S.ps = 'playlist';
        S.ct = S.pl[S.pi];
        UU(); MP.show(); S.il = true; UB();
        resetLyricsUI(S.ct.videoId);
        loadTrack(S.ct);
    },
    playHistoryIndex(index){
        var historySongs = typeof getListeningHistory === 'function' ? getListeningHistory() : [];
        if(!historySongs[index]) return;
        var s = historySongs[index];
        if (S.ct && (S.ct.id === s.id || S.ct.videoId === s.videoId || (S.ct.title === s.title && S.ct.artist === s.artist)) && AU.src) {
            TP();
            return;
        }
        S.pl = historySongs;
        S.pi = index;
        S.ps = 'history';
        S.ct = historySongs[S.pi];
        UU(); MP.show(); S.il = true; UB();
        resetLyricsUI(S.ct.videoId);
        loadTrack(S.ct);
    },
    createNew(){
        var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';
        popup.innerHTML='<div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.3s ease-out forwards;"><div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div><h3 class="font-bold text-white mb-4">Buat Playlist Baru</h3><input id="pl-name" class="w-full glass-input text-white rounded-xl px-4 py-3 mb-3 focus:outline-none" placeholder="Nama Playlist" /><input id="pl-image" type="file" accept="image/*" class="w-full text-sm text-white/70 mb-4" /><div class="flex gap-3"><button id="pl-create" class="flex-1 btn-chrome font-bold py-3 rounded-full">Buat</button><button onclick="this.closest(\'.fixed\').remove()" class="px-6 py-3 glass glass-hover text-white rounded-full">Batal</button></div></div>';
        document.body.appendChild(popup);
        popup.querySelector('#pl-create').onclick=function(){
            var name=gid('pl-name').value.trim()||'Playlist Baru';
            var file=gid('pl-image').files[0];
            if(file){var reader=new FileReader();reader.onload=function(e){createPlaylist(name,e.target.result);popup.remove();Library.render();};reader.readAsDataURL(file);}
            else{createPlaylist(name,'');popup.remove();Library.render();}
        };
    },
    showActions(id){
        var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===id;});if(!pl)return;
        var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';
        popup.onclick=function(e){if(e.target===popup)popup.remove();};
        popup.innerHTML='<div class="w-full max-w-md rounded-t-3xl p-6 border-t border-white/10 glass-strong" style="animation:slideUp 0.3s ease-out forwards; background: var(--bg-color);">'+
            '<div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div>'+
            '<div class="flex items-center gap-3 mb-5"><img src="'+(pl.image||(pl.songs.length>0?pl.songs[0].cover:FI))+'" class="w-12 h-12 rounded-lg object-cover" onerror="this.src=\''+FI+'\'" /><div class="truncate"><h3 class="font-bold text-white truncate">'+es(pl.name)+'</h3><p class="text-white/70 text-xs">'+pl.songs.length+' lagu</p></div></div>'+
            '<button onclick="this.closest(\'.fixed\').remove();Library.editPlaylist(\''+id+'\')" class="w-full text-left p-4 rounded-xl hover:bg-white/5 flex items-center gap-3 mb-1"><i data-lucide="pencil" class="w-5 h-5 text-white"></i><span class="font-medium text-white">Edit Playlist</span></button>'+
            '<button onclick="this.closest(\'.fixed\').remove();Library.confirmDelete(\''+id+'\')" class="w-full text-left p-4 rounded-xl hover:bg-red-500/10 flex items-center gap-3"><i data-lucide="trash-2" class="w-5 h-5 text-red-400"></i><span class="font-medium text-red-400">Hapus Playlist</span></button>'+
        '</div>';
        document.body.appendChild(popup);if(typeof lucide!=="undefined")lucide.createIcons();
    },
    editPlaylist(id){
        var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===id;});if(!pl)return;
        var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';
        popup.innerHTML='<div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.3s ease-out forwards;"><div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div><h3 class="font-bold text-white mb-4">Edit Playlist</h3><input id="pl-edit-name" class="w-full glass-input text-white rounded-xl px-4 py-3 mb-3 focus:outline-none" placeholder="Nama Playlist" value="'+es(pl.name).replace(/"/g,'&quot;')+'" /><input id="pl-edit-image" type="file" accept="image/*" class="w-full text-sm text-white/70 mb-4" /><div class="flex gap-3"><button id="pl-edit-save" class="flex-1 btn-chrome font-bold py-3 rounded-full">Simpan</button><button onclick="this.closest(\'.fixed\').remove()" class="px-6 py-3 glass glass-hover text-white rounded-full">Batal</button></div></div>';
        document.body.appendChild(popup);
        popup.querySelector('#pl-edit-save').onclick=function(){
            var name=gid('pl-edit-name').value.trim()||pl.name;
            var file=gid('pl-edit-image').files[0];
            if(file){var reader=new FileReader();reader.onload=function(e){updateUserPlaylist(id,name,e.target.result);popup.remove();Library.render();showToast('✅ Playlist diperbarui');};reader.readAsDataURL(file);}
            else{updateUserPlaylist(id,name,null);popup.remove();Library.render();showToast('✅ Playlist diperbarui');}
        };
    },
    confirmDelete(id){
        var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===id;});if(!pl)return;
        var popup=document.createElement('div');popup.className='fixed inset-0 z-[300] flex items-end justify-center bg-black/60';
        popup.innerHTML='<div class="glass-strong w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.3s ease-out forwards;"><div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4"></div><h3 class="font-bold text-white mb-2">Hapus "'+es(pl.name)+'"?</h3><p class="text-white/70 text-sm mb-5">Playlist ini akan dihapus permanen dan tidak bisa dikembalikan.</p><div class="flex gap-3"><button onclick="deleteUserPlaylist(\''+id+'\');this.closest(\'.fixed\').remove();Library.render();Library.close();showToast(\'🗑️ Playlist dihapus\')" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-full active:scale-95">Hapus</button><button onclick="this.closest(\'.fixed\').remove()" class="px-6 py-3 glass glass-hover text-white rounded-full">Batal</button></div></div>';
        document.body.appendChild(popup);
    },
    handleScroll(){
        const c = gid('library-content');
        const h = gid('library-header');
        if (!h) return;
        if (c && c.scrollTop > 50) {
            h.style.background = 'rgba(5, 5, 7, 0.9)';
            ;
        } else {
            h.style.background = 'transparent';
            ;
        }
    },
    currentPlaylistId: null,
    open(id){
        var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===id;});if(!pl)return;
        Library.currentPlaylistId = id;
        
        var modal = gid('library-modal');
        if(!modal) {
            modal = document.createElement('div');
            modal.id = 'library-modal';
            modal.className = 'fixed inset-0 bg-[var(--bg-color)] flex flex-col z-[100]';
            modal.style.animation = 'slideUp 0.3s ease-out forwards';
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        
        var html=`
            <div class="flex items-center gap-3 p-4 pt-safe bg-transparent absolute top-0 left-0 w-full z-[100] transition-all" id="library-header">
                <button onclick="Library.close()" class="glass glass-hover rounded-full text-white p-3 active:scale-90 shadow-md  bg-black/80"><i data-lucide="arrow-left" class="w-6 h-6"></i></button>
                <div class="flex-1"></div>
                <div class="flex items-center gap-1 bg-black/80  rounded-full shadow-md">
                    <button onclick="Library.editPlaylist('${id}')" class="text-white hover:text-white p-2.5 active:scale-90" title="Edit Playlist"><i data-lucide="pencil" class="w-5 h-5"></i></button>
                    <button onclick="Library.confirmDelete('${id}')" class="text-red-400 hover:text-red-300 p-2.5 active:scale-90" title="Hapus Playlist"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto hide-scrollbar pb-36 relative" id="library-content" onscroll="Library.handleScroll()">
                <div class="relative w-full aspect-square md:aspect-video max-h-[50vh] overflow-hidden -mt-20 mb-6">
                    <img src="${pl.image||(pl.songs.length>0?pl.songs[0].cover:FI)}" class="w-full h-full object-cover" onerror="this.src='${FI}'" />
                    <div class="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/60 to-transparent"></div>
                    <div class="absolute bottom-6 left-6 right-6 flex flex-col justify-end items-center text-center z-10">
                        <img src="${pl.image||(pl.songs.length>0?pl.songs[0].cover:FI)}" class="w-32 h-32 md:w-48 md:h-48 rounded-xl  object-cover border border-white/10 mb-4" onerror="this.src='${FI}'" />
                        <div>
                            <p class="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-1">PLAYLIST LOKAL</p>
                            <h1 class="text-3xl md:text-5xl font-black text-white mb-2 leading-tight drop- line-clamp-2">${es(pl.name)}</h1>
                            <p class="text-white text-xs md:text-sm line-clamp-2">${pl.songs.length} lagu</p>
                        </div>
                    </div>
                </div>
                <div class="px-6 mb-6 flex items-center gap-4">
                    ${pl.songs.length>0?`<button onclick="Library.playSong('${id}',0)" class="bg-white hover:bg-gray-200 text-black w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-all  shadow-white/20"><i data-lucide="play" class="w-7 h-7 fill-current ml-1"></i></button><button onclick="Library.shufflePlaylist('${id}')" class="text-white/70 hover:text-white p-3 rounded-full active:scale-95 bg-white/5 transition-all" title="Acak Urutan (Shuffle)"><i data-lucide="shuffle" class="w-6 h-6"></i></button>`:''}
                </div>
        `;
        if(pl.songs.length===0){
            html+='<div class="text-center text-white/70 mt-10"><p>Belum ada lagu</p></div>';
        } else {
            html+='<div id="playlist-songs-list" class="space-y-1 px-4">';
            pl.songs.forEach(function(s,i){
                var isCur = S.ct && (
                    S.ct.id === s.id ||
                    S.ct.videoId === s.videoId ||
                    (S.ct.title === s.title && S.ct.artist === s.artist)
                );
                var isPlay = isCur && S.ip;
                var isLoad = isCur && S.il;

                var iconOverlay = '';
                if (isLoad) {
                    iconOverlay = '<div class="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>';
                } else if (isPlay) {
                    iconOverlay = '<div class="flex items-end justify-center gap-[2px] w-4 h-4 pb-0.5"><span class="w-[2px] bg-rose-400 rounded-full animate-eq-1"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-2"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-3"></span></div>';
                } else if (isCur) {
                    iconOverlay = '<i data-lucide="pause" class="w-4 h-4 text-rose-400 fill-current"></i>';
                } else {
                    iconOverlay = '<i data-lucide="play" class="w-4 h-4 text-white fill-white"></i>';
                }

                var rowBg = isPlay ? 'bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-transparent border border-rose-500/30 shadow-md' : (isCur ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 border border-transparent');
                var titleClass = isCur ? 'text-rose-400 font-bold' : 'text-white font-medium';

                var libWfHtml = '';
                if (isCur) {
                    var heights = [30, 65, 90, 50, 85, 100, 70, 40, 80, 60, 35, 75, 95, 55, 40, 80];
                    var pct = S.pd > 0 ? (S.pt / S.pd) * 100 : 0;
                    var activeCount = Math.floor((pct / 100) * heights.length);
                    var bars = heights.map(function(h, idx) {
                        var active = idx <= activeCount;
                        var style = active
                            ? 'height:' + h + '%; background-color: var(--track-accent, #10b981); opacity: 1; box-shadow: 0 0 4px var(--track-accent-glow, rgba(16,185,129,0.5));'
                            : 'height:' + h + '%; background-color: rgba(255,255,255,0.2); opacity: 0.35;';
                        return '<span class="lib-wf-bar w-[2px] rounded-full transition-all duration-150 inline-block" style="' + style + '"></span>';
                    }).join('');
                    libWfHtml = '<div class="library-waveform-container flex items-center justify-start gap-[1.5px] h-2.5 mt-1 overflow-hidden" data-is-cur="true">' + bars + '</div>';
                }

                html+='<div class="flex items-center gap-2 p-2 rounded-lg active:scale-[0.98] ' + rowBg + '"><div onclick="Library.playSong(\''+id+'\','+i+')" class="flex items-center gap-3 flex-1 cursor-pointer overflow-hidden"><div class="relative w-10 h-10 rounded overflow-hidden shrink-0"><img src="'+s.cover+'" class="w-full h-full object-cover" onerror="this.src=\'' + FI + '\'" /><div class="absolute inset-0 bg-black/80 ' + (isCur ? 'opacity-100' : 'opacity-0 group-hover:opacity-100') + ' transition-all flex items-center justify-center">' + iconOverlay + '</div></div><div class="truncate flex-1 min-w-0"><p class="text-sm truncate ' + titleClass + '">'+es(s.title)+'</p><p class="text-white/70 text-xs truncate">'+es(s.artist)+'</p>'+libWfHtml+'</div></div><button onclick="Library.removeSong(\''+id+'\','+i+')" class="text-white/70 hover:text-red-400 p-2 active:scale-90 shrink-0" title="Hapus"><i data-lucide="x" class="w-5 h-5"></i></button></div>';
            });
            html+='</div>';
        }
        html+='</div>';
        modal.innerHTML=html;
        if(typeof lucide!=="undefined")lucide.createIcons();
    },
    closeModalOnly() {
        var modal = gid('library-modal');
        if(modal) modal.style.display = 'none';
        Library.currentPlaylistId = null;
    },
    close() { console.log('Library close clicked'); this.closeModalOnly();
        if (S.at === 'library') Library.render();
    },
    renderActive() {
        if (S.at === 'library' && S.libTab === 'liked') {
            Library.render();
            return;
        }
        var modal = gid('library-modal');
        if (!modal || modal.style.display === 'none' || !Library.currentPlaylistId) return;
        var pls = getUserPlaylists();
        var pl = pls.find(function(p){ return p.id === Library.currentPlaylistId; });
        var container = gid('playlist-songs-list');
        if (!container || !pl || !pl.songs) return;

        var children = container.children;
        for (var i = 0; i < pl.songs.length; i++) {
            var s = pl.songs[i];
            var el = children[i];
            if (!el) continue;

            var isCur = S.ct && (
                S.ct.id === s.id ||
                S.ct.videoId === s.videoId ||
                (S.ct.title === s.title && S.ct.artist === s.artist)
            );
            var isPlay = isCur && S.ip;
            var isLoad = isCur && S.il;

            var iconOverlay = '';
            if (isLoad) {
                iconOverlay = '<div class="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>';
            } else if (isPlay) {
                iconOverlay = '<div class="flex items-end justify-center gap-[2px] w-4 h-4 pb-0.5"><span class="w-[2px] bg-rose-400 rounded-full animate-eq-1"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-2"></span><span class="w-[2px] bg-rose-400 rounded-full animate-eq-3"></span></div>';
            } else if (isCur) {
                iconOverlay = '<i data-lucide="pause" class="w-4 h-4 text-rose-400 fill-current"></i>';
            } else {
                iconOverlay = '<i data-lucide="play" class="w-4 h-4 text-white fill-white"></i>';
            }

            var coverOverlay = el.querySelector('.relative.w-10 .absolute');
            if (coverOverlay) {
                coverOverlay.innerHTML = iconOverlay;
                coverOverlay.className = 'absolute inset-0 bg-black/80 ' + (isCur ? 'opacity-100' : 'opacity-0 group-hover:opacity-100') + ' transition-all flex items-center justify-center';
            }

            var rowBg = isPlay ? 'bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-transparent border border-rose-500/30 shadow-md' : (isCur ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5 border border-transparent');
            el.className = 'flex items-center gap-2 p-2 rounded-lg active:scale-[0.98] ' + rowBg;

            var titleEl = el.querySelector('p');
            if (titleEl) {
                titleEl.className = 'text-sm truncate ' + (isCur ? 'text-rose-400 font-bold' : 'text-white font-medium');
            }
        }
        if(typeof lucide!=="undefined")lucide.createIcons();
    },
    removeSong(plId,index){var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===plId;});if(!pl)return;pl.songs.splice(index,1);saveUserPlaylists(pls);Library.open(plId);showToast('🗑️ Lagu dihapus');},
    shufflePlaylist(plId){
        var pls = getUserPlaylists();
        var pl = pls.find(p => p.id === plId);
        if(!pl || pl.songs.length === 0) return;
        var arr = pl.songs;
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        saveUserPlaylists(pls);
        Library.open(plId);
        showToast('🔀 Urutan playlist diacak');
    },
    playSong(plId,index){
        var pls=getUserPlaylists();var pl=pls.find(function(p){return p.id===plId;});if(!pl||!pl.songs[index])return;
        var s = pl.songs[index];
        if (S.ct && (S.ct.id === s.id || S.ct.videoId === s.videoId || (S.ct.title === s.title && S.ct.artist === s.artist)) && AU.src) {
            TP();
            return;
        }
        S.pl=pl.songs;S.pi=index;S.ps='playlist';S.ct=S.pl[S.pi];UU();MP.show();S.il=true;UB();resetLyricsUI(S.ct.videoId);loadTrack(S.ct);
    }
};

function dismissSplashScreen() {
    var splash = gid('splash-screen');
    if (splash) {
        splash.classList.add('hide');
        setTimeout(function() {
            if (splash && splash.parentElement) {
                splash.parentElement.removeChild(splash);
            }
        }, 700);
    }
}

// App.init() sudah dipanggil di atas, blok ini HANYA dismiss splash
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(dismissSplashScreen, 3200);
    });
} else {
    setTimeout(dismissSplashScreen, 3200);
}
