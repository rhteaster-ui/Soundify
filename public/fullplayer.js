var FullPlayer={
    init(){
        gid('full-container').innerHTML=`
        <div id="full-player" class="fixed flex flex-col justify-between z-[170] bg-[var(--bg-color)] text-[var(--text-primary)] p-4 pt-safe sm:p-6 sm:pt-safe" style="display:none;transition:transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);transform:translateY(100%);top:0;left:0;right:0;bottom:0;overflow:hidden;touch-action:none;">
            
            <!-- Ambient Artwork Background -->
            <img id="full-bg-artwork" src="" class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0 blur-2xl" />
            <div class="absolute inset-0 full-scrim pointer-events-none z-0"></div>

            <!-- Top Header -->
            <div class="relative z-10 flex justify-between items-center flex-shrink-0 pt-1 pb-1">
                <button onclick="FullPlayer.close()" class="text-[var(--text-primary)] hover:opacity-80 p-2 rounded-full active:scale-90 transition-all cursor-pointer" title="Tutup Player"><i data-lucide="chevron-down" class="w-6 h-6"></i></button>
                <div class="text-center">
                    <p class="text-[9px] uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-extrabold">Sedang Diputar</p>
                    <p id="full-header-artist" class="text-xs font-bold text-[var(--text-primary)] truncate max-w-[180px] mt-0.5"></p>
                </div>
                <div class="flex items-center gap-1">
                    <button onclick="FullPlayer.openMoreSheet()" class="text-[var(--text-primary)] hover:opacity-80 p-2 rounded-full active:scale-90 transition-all cursor-pointer" title="Opsi"><i data-lucide="more-vertical" class="w-5 h-5"></i></button>
                </div>
            </div>

            <!-- Central Card View Container (Cover Art & Inline Lyrics) -->
            <div class="relative z-10 flex-1 flex flex-col items-center justify-center my-auto px-4 py-2" style="min-height:0;overflow:hidden;">
                
                <!-- Segmented Mode Pills (Sampul / Lirik) -->
                <div class="flex items-center gap-1 p-1 rounded-full bg-[var(--surface-2)] border border-[var(--border-color)] mb-3 shadow-sm z-20">
                    <button id="full-tab-cover" onclick="FullPlayer.setViewMode('cover')" class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer bg-[var(--text-primary)] text-[var(--surface)] shadow-sm">
                        Sampul
                    </button>
                    <button id="full-tab-lyrics" onclick="FullPlayer.setViewMode('lyrics')" class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        Lirik
                    </button>
                </div>

                <!-- Interactive Card Slider Area -->
                <div id="full-card-slider" class="relative w-[85%] sm:w-[90%] max-w-[300px] aspect-square flex items-center justify-center rounded-2xl border border-[var(--border-color-strong)] shadow-xl bg-[var(--surface)] overflow-hidden select-none">
                    
                    <!-- Cover View -->
                    <div id="full-view-cover" onclick="FullPlayer.toggleViewMode()" class="absolute inset-0 w-full h-full transition-all duration-300 flex items-center justify-center cursor-pointer group">
                        <img id="full-cover" src="" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        
                        <!-- Tap indicator badge -->
                        <div class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-all shadow-md">
                            <i data-lucide="mic-2" class="w-3.5 h-3.5 text-blue-400"></i>
                            <span>Tekan u/ Lirik</span>
                        </div>

                        <!-- Loading & Overlay -->
                        <div id="full-cover-overlay" class="absolute inset-0 rounded-2xl flex flex-col items-center justify-center bg-black/50 transition-opacity duration-200 opacity-0 pointer-events-none z-20">
                            <div id="full-cover-icon" class="mb-2 text-white flex items-center justify-center"></div>
                            <span id="full-cover-text" class="text-xs font-black text-white tracking-[0.2em] uppercase drop-shadow text-center px-4"></span>
                        </div>
                    </div>

                    <!-- Inline Lyrics View -->
                    <div id="full-view-lyrics" class="absolute inset-0 w-full h-full transition-all duration-300 opacity-0 pointer-events-none flex flex-col p-3.5 bg-[var(--surface)]">
                        <!-- Header inside lyrics box -->
                        <div class="flex items-center justify-between pb-2 border-b border-[var(--border-color)] shrink-0">
                            <div class="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                                <i data-lucide="mic-2" class="w-3.5 h-3.5 text-blue-600"></i>
                                <span>Lirik Lagu</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <button onclick="event.stopPropagation(); lyricSyncPrev();" class="w-6 h-6 rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] flex items-center justify-center text-xs font-bold active:scale-90 cursor-pointer">-</button>
                                <span id="full-inline-sync-badge" class="text-[10px] font-bold text-[var(--text-primary)] px-1 hidden">+0</span>
                                <button onclick="event.stopPropagation(); lyricSyncNext();" class="w-6 h-6 rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] flex items-center justify-center text-xs font-bold active:scale-90 cursor-pointer">+</button>
                                <button onclick="event.stopPropagation(); toggleLyrics();" class="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface-2)] active:scale-90 transition cursor-pointer ml-1" title="Tampilan Lirik Layar Penuh">
                                    <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
                                </button>
                                <button onclick="event.stopPropagation(); FullPlayer.setViewMode('cover');" class="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer" title="Tutup Lirik">
                                    <i data-lucide="x" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Scrollable Lyrics Area -->
                        <div id="full-inline-lyrics-scroll" class="flex-1 overflow-y-auto hide-scrollbar py-2 px-1 relative">
                            <div id="full-inline-lyrics-loading" class="flex items-center justify-center h-full">
                                <div class="w-5 h-5 border-2 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <div id="full-inline-lyrics-content" class="hidden space-y-2.5"></div>
                            <div id="full-inline-lyrics-empty" class="hidden flex flex-col items-center justify-center h-full text-[var(--text-tertiary)] text-center">
                                <i data-lucide="music" class="w-7 h-7 mb-1.5 opacity-40"></i>
                                <p class="text-xs">Lirik tidak tersedia</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Song Info + Progress + Controls -->
            <div class="relative z-10 flex-shrink-0 w-full max-w-md mx-auto space-y-3 pb-6 sm:pb-10">
                <!-- Song Info (Title + Heart on same line) -->
                <div class="flex items-center justify-between gap-3 px-1">
                    <div class="flex-1 min-w-0 truncate">
                        <div class="flex items-center gap-2">
                            <h2 id="full-title" class="text-xl sm:text-2xl font-black text-[var(--text-primary)] truncate leading-tight">Pilih lagu</h2>
                            <span id="full-status-tag" class="hidden px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase border border-[var(--border-color)] text-[var(--text-primary)] bg-[var(--surface-2)] shrink-0"></span>
                        </div>
                        <p id="full-artist" class="text-[var(--text-secondary)] text-xs sm:text-sm font-semibold truncate cursor-pointer hover:text-[var(--text-primary)] mt-1" onclick="FullPlayer.openArtist()"></p>
                    </div>
                    <button id="full-like-btn" onclick="toggleCurrentLike(); if(typeof event !== 'undefined') event.stopPropagation();" class="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:text-rose-500 flex items-center justify-center active:scale-90 transition-all shrink-0 cursor-pointer shadow-sm" title="Sukai Lagu">
                        <i data-lucide="heart" class="w-5 h-5"></i>
                    </button>
                </div>

                <!-- Clean Progress & Duration Bar -->
                <div class="relative px-1 my-1">
                    <div class="flex items-center justify-between text-xs font-semibold mb-1.5 px-0.5">
                        <span id="time-curr" class="font-mono text-blue-600 font-bold tracking-wide">0:00</span>
                        <span id="time-dur" class="font-mono text-[var(--text-tertiary)] font-medium tracking-wide">0:00</span>
                    </div>

                    <div class="relative w-full h-1.5 rounded-full bg-[var(--border-color)] hover:bg-[var(--border-color-strong)] transition-all overflow-hidden cursor-pointer group">
                        <div id="full-progress" class="h-full bg-blue-600 rounded-full transition-all duration-100" style="width: 0%;"></div>
                        <input type="range" id="seek-bar" min="0" max="100" value="0" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" oninput="SK(this.value)" title="Geser durasi lagu" />
                    </div>
                </div>

                <!-- Direct Playback Control Buttons -->
                <div class="relative z-10 flex items-center justify-between px-2 pt-1 pb-1">
                    <button id="full-shuffle-btn" onclick="SF()" class="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:scale-90 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer" title="Acak (Shuffle)">
                        <i data-lucide="shuffle" class="w-5 h-5"></i>
                        <span id="full-shuffle-dot" class="hidden absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    </button>
                    <button id="full-prev-btn" onclick="PV()" class="text-[var(--text-primary)] hover:opacity-80 active:scale-90 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer" title="Lagu Sebelumnya">
                        <i data-lucide="skip-back" class="w-6 h-6 fill-current"></i>
                    </button>
                    <button onclick="TP()" id="full-play-btn-wrap" class="relative bg-[var(--text-primary)] text-[var(--surface)] rounded-full hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 shrink-0">
                        <div id="full-play-btn" class="flex items-center justify-center">
                            <i data-lucide="play" class="w-7 h-7 fill-current ml-0.5"></i>
                        </div>
                    </button>
                    <button id="full-next-btn" onclick="NX()" class="text-[var(--text-primary)] hover:opacity-80 active:scale-90 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer" title="Lagu Berikutnya">
                        <i data-lucide="skip-forward" class="w-6 h-6 fill-current"></i>
                    </button>
                    <button onclick="TR()" id="btn-repeat" class="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:scale-90 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer" title="Ulang (Repeat)">
                        <i data-lucide="repeat" class="w-5 h-5"></i>
                        <span id="repeat-one" class="hidden absolute top-0.5 left-1/2 -translate-x-1/2 text-[8px] font-black text-blue-600">1</span>
                    </button>
                </div>
            </div>
        </div>`;

        gid('lyrics-container').innerHTML=`
        <div id="lyrics-overlay" class="fixed flex flex-col z-[200]" style="display:none;background:#000000;transition:transform 0.35s ease-out;transform:translateY(100%);top:0;left:0;width:100%;height:100%;overflow:hidden;touch-action:none;">
            <!-- Mobile Header -->
            <div class="md:hidden flex justify-between items-center p-4 pt-safe flex-shrink-0 bg-[var(--bg-color)] border-b border-white/10 relative z-20 ">
                <div class="flex items-center gap-3 overflow-hidden">
                    <img id="lyrics-header-cover" src="" class="w-12 h-12 rounded-md object-cover shadow-md flex-shrink-0 bg-white/5" />
                    <div class="flex flex-col min-w-0">
                        <span id="lyrics-header-title" class="font-bold text-white text-base truncate">Lirik</span>
                        <span id="lyrics-header-artist" class="text-white/70 text-sm truncate"></span>
                    </div>
                </div>
                <button onclick="toggleLyrics()" class="text-white/70 hover:text-white p-2 rounded-full active:scale-90 flex-shrink-0 transition-all bg-white/10 ml-3"><i data-lucide="chevron-down" class="w-6 h-6"></i></button>
            </div>

            <!-- Floating Sync Controls -->
            <div class="md:hidden absolute top-[100px] right-6 z-30 flex items-center gap-2 bg-black/90 px-3 py-1.5 rounded-full border border-white/10 ">
                <button onclick="lyricSyncPrev()" class="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full active:scale-90 flex items-center justify-center transition-all"><i data-lucide="minus" class="w-4 h-4"></i></button>
                <p id="lyric-sync-badge-mobile" class="hidden text-xs font-bold text-white tracking-wide">+0</p>
                <button onclick="lyricSyncNext()" class="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full active:scale-90 flex items-center justify-center transition-all"><i data-lucide="plus" class="w-4 h-4"></i></button>
            </div>

            <!-- Desktop Close Button -->
            <button onclick="toggleLyrics()" class="hidden md:flex absolute top-8 right-8 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full active:scale-90 transition-all ">
                <i data-lucide="chevron-down" class="w-8 h-8"></i>
            </button>
            
            <div class="flex-1 flex flex-col md:flex-row w-full h-full overflow-hidden relative">
                <!-- Left Side: Lyrics Scroll -->
                <div id="lyrics-scroll-container" class="w-full md:w-3/5 h-full overflow-y-auto px-6 md:px-16 hide-scrollbar z-10 relative">
                    <div class="pt-[30vh] pb-[60vh] w-full max-w-3xl mx-auto md:mx-0">
                        <div id="lyrics-loading" class="flex justify-center items-center h-[30vh] w-full">
                            <div class="w-10 h-10 border-4 border-[var(--track-accent)] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div id="lyrics-content" class="hidden w-full"></div>
                        <div id="lyrics-empty" class="hidden flex justify-center items-center h-[30vh] w-full text-white/50">
                            <div class="text-center">
                                <i data-lucide="music" class="w-20 h-20 mx-auto mb-4 opacity-30"></i>
                                <p class="text-lg">Lirik tidak tersedia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Side: Cover & Info -->
                <div class="hidden md:flex w-2/5 flex-col justify-center items-start p-12 z-10 pl-16">
                    <img id="lyrics-desktop-cover" src="" class="w-[350px] max-w-full aspect-square rounded-xl  mb-8 object-cover bg-white/5" />
                    <h2 id="lyrics-desktop-title" class="font-bold text-white text-3xl mb-2 line-clamp-2 leading-tight">Lirik</h2>
                    <p id="lyrics-desktop-artist" class="text-white/70 text-lg line-clamp-1"></p>
                    <div class="flex items-center justify-start gap-3 mt-8">
                        <button onclick="lyricSyncPrev()" title="Sinkron mundur 1 lirik" class="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full active:scale-90 flex items-center justify-center transition-all"><i data-lucide="minus" class="w-5 h-5"></i></button>
                        <p id="lyric-sync-badge-desktop" class="text-xs font-bold text-white tracking-wide">+0</p>
                        <button onclick="lyricSyncNext()" title="Sinkron lanjut 1 lirik" class="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 w-12 h-12 rounded-full active:scale-90 flex items-center justify-center transition-all"><i data-lucide="plus" class="w-5 h-5"></i></button>
                    </div>
                </div>
            </div>
        </div>`;
        lucide.createIcons();
        FullPlayer.setupSwipeHandlers();
    },
    viewMode: 'cover',
    setViewMode(mode) {
        if (!mode) mode = (FullPlayer.viewMode === 'cover' ? 'lyrics' : 'cover');
        FullPlayer.viewMode = mode;
        var tabCover = gid('full-tab-cover');
        var tabLyrics = gid('full-tab-lyrics');
        var viewCover = gid('full-view-cover');
        var viewLyrics = gid('full-view-lyrics');

        if (mode === 'lyrics') {
            if (tabCover) tabCover.className = "px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer text-white/70 hover:text-white";
            if (tabLyrics) tabLyrics.className = "px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer bg-white text-black shadow-sm";
            if (viewCover) {
                viewCover.style.opacity = '0';
                viewCover.style.transform = 'scale(0.92)';
                viewCover.style.pointerEvents = 'none';
            }
            if (viewLyrics) {
                viewLyrics.style.opacity = '1';
                viewLyrics.style.transform = 'scale(1)';
                viewLyrics.style.pointerEvents = 'auto';
            }
            if (typeof S !== 'undefined' && S.ct && S.ct.videoId) {
                if (!S.ld || !S.ld.lines || S.ld.lines.length === 0) {
                    if (typeof FL === 'function') FL(S.ct.videoId);
                } else {
                    S.cli = -2;
                    if (typeof ULH === 'function') ULH(S.pt, true);
                }
            }
        } else {
            if (tabCover) tabCover.className = "px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer bg-white text-black shadow-sm";
            if (tabLyrics) tabLyrics.className = "px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer text-white/70 hover:text-white";
            if (viewCover) {
                viewCover.style.opacity = '1';
                viewCover.style.transform = 'scale(1)';
                viewCover.style.pointerEvents = 'auto';
            }
            if (viewLyrics) {
                viewLyrics.style.opacity = '0';
                viewLyrics.style.transform = 'scale(0.92)';
                viewLyrics.style.pointerEvents = 'none';
            }
        }
    },
    toggleViewMode() {
        FullPlayer.setViewMode(FullPlayer.viewMode === 'cover' ? 'lyrics' : 'cover');
    },
    setupSwipeHandlers() {
        var slider = gid('full-card-slider');
        if (!slider || slider._hasSwipe) return;
        slider._hasSwipe = true;
        var startX = 0, startY = 0, diffX = 0, diffY = 0;

        slider.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                diffX = 0; diffY = 0;
            }
        }, { passive: true });

        slider.addEventListener('touchmove', function(e) {
            if (e.touches.length === 1) {
                diffX = e.touches[0].clientX - startX;
                diffY = e.touches[0].clientY - startY;
            }
        }, { passive: true });

        slider.addEventListener('touchend', function(e) {
            if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX < 0) {
                    FullPlayer.setViewMode('lyrics');
                } else {
                    FullPlayer.setViewMode('cover');
                }
            }
        }, { passive: true });
    },
    open(){
        var fp=gid('full-player');
        if(!fp) return;
        fp.style.display='flex';
        document.body.style.overflow='hidden';
        requestAnimationFrame(function(){fp.style.transform='translateY(0)';});
        if(typeof MP !== 'undefined' && MP.hide) MP.hide();
        try{
            updateSleepBadge();
            updateSpeedBadge();
            if(typeof UB==='function')UB();
            if(typeof updateLikeButtons==='function')updateLikeButtons();
            if(S.ct && typeof FullPlayer.updateBeats === 'function') FullPlayer.updateBeats(S.ct);
        }catch(e){}
    },
    close(){
        var fp=gid('full-player');
        if(!fp) return;
        fp.style.transform='translateY(100%)';
        document.body.style.overflow='';
        setTimeout(function(){
            fp.style.display='none';
            if(typeof S!=='undefined'&&!S.lo&&typeof MP!=='undefined')MP.show();
        },350);
    },
    openArtist(){if(S.ct&&S.ct.artistId){FullPlayer.close();setTimeout(function(){Artist.open(S.ct.artistId,S.ct.artist);},400);}},
    openMoreSheet() {
        var existing = gid('full-more-sheet');
        if (existing) existing.remove();

        var sheet = document.createElement('div');
        sheet.id = 'full-more-sheet';
        sheet.className = 'fixed inset-0 z-[250] flex items-end justify-center bg-black/60 ';
        sheet.onclick = function(e) { if (e.target === sheet) sheet.remove(); };

        sheet.innerHTML = `
        <div class="bg-[var(--surface)] w-full max-w-md rounded-t-3xl p-6 border-t border-white/10" style="animation:slideUp 0.25s ease-out forwards;">
            <div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5"></div>
            
            <div class="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-white/5">
                <img src="${(S.ct && S.ct.cover) ? S.ct.cover : FI}" class="w-12 h-12 rounded-xl object-cover" onerror="this.src='${FI}'" />
                <div class="min-w-0 flex-1">
                    <h4 class="font-bold text-white text-sm truncate">${(S.ct && S.ct.title) ? es(S.ct.title) : 'Pilih Lagu'}</h4>
                    <p class="text-xs text-muted truncate">${(S.ct && S.ct.artist) ? es(S.ct.artist) : ''}</p>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-3 mb-4">
                <button onclick="toggleAutoNext(); gid('full-more-sheet').remove();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer" style="opacity: ${S.autoNext ? '1' : '0.5'};">
                    <i data-lucide="skip-forward" class="w-5 h-5 ${S.autoNext ? 'text-rose-400' : 'text-white'}"></i>
                    <span class="text-xs font-semibold ${S.autoNext ? 'text-rose-400' : 'text-white/90'}">Auto Next</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();openEqualizer();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="sliders" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">EQ</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();openSleepTimer();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="clock" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Timer</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();addCurrentToPlaylist();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="list-plus" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Playlist</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();FullPlayer.setViewMode('lyrics');" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="mic-2" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Lirik</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();openPlaybackSpeed();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="gauge" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Speed</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();openQueue();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="list-music" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Queue</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();openCustomQueue();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 active:scale-95 transition cursor-pointer">
                    <i data-lucide="list-ordered" class="w-5 h-5 text-blue-400"></i>
                    <span class="text-xs font-bold text-blue-300">Custom Queue</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();downloadCurrentSong();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="download" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Download</span>
                </button>
                <button onclick="gid('full-more-sheet').remove();openShareCard();" class="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition cursor-pointer">
                    <i data-lucide="share-2" class="w-5 h-5 text-white"></i>
                    <span class="text-xs font-semibold text-white/90">Share</span>
                </button>
            </div>

            <button onclick="gid('full-more-sheet').remove()" class="w-full mt-2 py-3 bg-white/10 text-white font-bold rounded-full border border-white/10 active:scale-95 transition cursor-pointer">Tutup</button>
        </div>`;

        document.body.appendChild(sheet);
        lucide.createIcons();
    },
    applyColors(colors) {
        if (!colors || !colors[0]) return;
        var primary = colors[0];
        var secondary = colors[1] || primary;

        if (typeof S !== 'undefined') {
            S.currentAccentColor = primary;
        }

        // Full Player Progressbar Accent
        var fullProgress = gid('full-progress');
        if (fullProgress) {
            fullProgress.style.backgroundColor = primary;
        }

        // Play Button Background Accent & Ambient Glow
        var playBtn = gid('full-play-btn-wrap');
        if (playBtn) {
            playBtn.style.backgroundColor = primary;
            playBtn.style.boxShadow = '0 10px 32px color-mix(in srgb, ' + primary + ' 55%, transparent)';
        }

        // Album Cover Card Ambient Glow
        var cardSlider = gid('full-card-slider');
        if (cardSlider) {
            cardSlider.style.boxShadow = '0 20px 50px -10px color-mix(in srgb, ' + primary + ' 45%, transparent), 0 0 0 1px rgba(255, 255, 255, 0.15)';
        }

        // Soft Radial Ambient Glow
        var bgGlow = gid('full-bg-glow');
        if (bgGlow) {
            bgGlow.style.background = 'radial-gradient(circle at 50% 30%, color-mix(in srgb, ' + primary + ' 35%, transparent), color-mix(in srgb, ' + secondary + ' 15%, transparent) 60%, transparent 85%)';
        }

        // Floating Time Badge & Disc Icon Accent
        var timeCurr = gid('time-curr');
        if (timeCurr) {
            timeCurr.style.color = primary;
        }
    },
    updateBeats(track) {
        if (!track) return;
        var palette = (typeof MP !== 'undefined' && MP.getTrackColors) ? MP.getTrackColors(track) : ['#ffffff', '#a0a5b0'];
        FullPlayer.applyColors(palette);

        if (track.cover && track.cover.startsWith('http')) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = track.cover;
            img.onload = function() {
                var colors = (typeof MP !== 'undefined' && MP.extractFromImage) ? MP.extractFromImage(img) : null;
                if (colors) {
                    FullPlayer.applyColors(colors);
                }
            };
        }
    }
};