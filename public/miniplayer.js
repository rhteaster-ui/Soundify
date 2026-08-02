var MP={
    init(){
        gid('mini-container').innerHTML=`
        <div id="mini-player" class="hidden fixed left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-[160]" style="bottom:calc(64px + env(safe-area-inset-bottom, 8px));transition:transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);transform:translateY(150px);">
            <div id="mini-player-inner" onclick="FullPlayer.open()" class="rounded-xl px-3.5 py-2.5 flex flex-col cursor-pointer active:scale-[0.99] transition-all relative overflow-hidden bg-[var(--surface)] border border-[var(--border-color-strong)] shadow-lg group">
                
                <div class="flex items-center gap-3 z-10 w-full">
                    <!-- Thumbnail with Progress Ring -->
                    <div class="relative w-10 h-10 shrink-0 flex items-center justify-center z-10" onclick="FullPlayer.open(); if(typeof event !== 'undefined') event.stopPropagation();">
                        <div class="w-9 h-9 rounded-lg overflow-hidden border border-[var(--border-color)]">
                            <img id="mini-cover" src="" class="w-full h-full object-cover" onerror="this.src=FI" />
                        </div>
                    </div>

                    <!-- Meta Info Judul & Artis -->
                    <div class="flex-1 min-w-0 z-10">
                        <div id="mini-title" class="font-bold text-xs sm:text-sm text-[var(--text-primary)] truncate">Pilih lagu</div>
                        <div id="mini-artist" class="text-[var(--text-secondary)] text-[10px] sm:text-[11px] truncate mt-0.5">Soundify</div>
                    </div>

                    <!-- Center Equalizer Indicator -->
                    <div class="hidden xs:flex items-end gap-[2px] h-4 px-1 shrink-0 z-10 text-[var(--text-primary)]">
                        <span class="w-[2px] bg-[var(--text-primary)] rounded-full animate-eq-1 h-2.5"></span>
                        <span class="w-[2px] bg-[var(--text-primary)] rounded-full animate-eq-2 h-3.5"></span>
                        <span class="w-[2px] bg-[var(--text-primary)] rounded-full animate-eq-3 h-2"></span>
                    </div>

                    <!-- Controls: Play/Pause and Heart -->
                    <div class="flex items-center gap-1 z-10 shrink-0">
                        <button onclick="TP(); if(typeof event !== 'undefined') event.stopPropagation();" class="text-[var(--text-primary)] active:scale-90 p-0.5 cursor-pointer" title="Putar/Jeda">
                            <div id="mini-play-btn" class="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-[var(--text-primary)] text-[var(--surface)] hover:opacity-90 shadow-sm">
                                <i data-lucide="play" class="w-3.5 h-3.5 fill-current ml-0.5"></i>
                            </div>
                        </button>
                        <button id="mini-like-btn" onclick="toggleCurrentLike(); if(typeof event !== 'undefined') event.stopPropagation();" class="text-[var(--text-secondary)] hover:text-rose-500 active:scale-90 p-1.5 cursor-pointer" title="Sukai Lagu">
                            <i data-lucide="heart" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <!-- Bottom Sleek Mini Progress Bar -->
                <div class="relative w-full h-1 mt-2 z-10 rounded-full bg-[var(--border-color)] overflow-hidden cursor-pointer" onclick="if(typeof event !== 'undefined') event.stopPropagation();">
                    <div id="mini-progress" class="h-full bg-blue-600 rounded-full transition-all duration-150" style="width: 0%;"></div>
                    <input type="range" min="0" max="100" value="0" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" oninput="SK(this.value); if(typeof event !== 'undefined') event.stopPropagation();" onclick="if(typeof event !== 'undefined') event.stopPropagation();" title="Geser progres lagu" />
                </div>
            </div>
        </div>`;
        lucide.createIcons();
    },
    show(){
        // Jangan muncul kalau belum ada lagu yang dipilih!
        if (!S || !S.ct || (!S.ct.id && !S.ct.videoId && !S.ct.title)) {
            return;
        }
        var mp=gid('mini-player');
        if(!mp) return;
        mp.classList.remove('hidden');
        requestAnimationFrame(function(){mp.style.transform='translateY(0)';});
        if (typeof S !== 'undefined' && S.ct) {
            MP.updateBeats(S.ct);
        }
    },
    hide(){
        var mp=gid('mini-player');
        if(!mp) return;
        mp.style.transform='translateY(150px)';
        setTimeout(function(){mp.classList.add('hidden');},300);
    },
    getTrackColors(track) {
        if (!track) return ['#ff2a5f', '#ff5e82', '#cc1b47', '#ff4070'];
        var str = (track.videoId || '') + (track.title || '') + (track.artist || '');
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        hash = Math.abs(hash);
        var hue = hash % 360;
        return [
            'hsl(' + hue + ', 85%, 55%)',
            'hsl(' + hue + ', 95%, 68%)',
            'hsl(' + hue + ', 75%, 42%)',
            'hsl(' + hue + ', 88%, 60%)'
        ];
    },
    applyColors(colors) {
        if (!colors || !colors.length) return;
        var primary = colors[0];
        var secondary = colors[1] || primary;
        var tertiary = colors[2] || primary;
        var inner = gid("mini-player-inner");
        if (inner) inner.style.background = "linear-gradient(to right, " + "color-mix(in srgb, " + tertiary + " 26%, var(--surface)), var(--surface) 80%)";
        if (typeof S !== 'undefined') S.currentAccentColor = primary;

        document.documentElement.style.setProperty('--track-accent', primary);
        document.documentElement.style.setProperty('--track-accent-secondary', secondary);
        document.documentElement.style.setProperty('--track-accent-glow', 'color-mix(in srgb, ' + primary + ' 42%, transparent)');
        document.documentElement.style.setProperty('--track-accent-glow-secondary', 'color-mix(in srgb, ' + secondary + ' 18%, transparent)');

        var metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.setAttribute('content', primary);

        var circleProgress = gid('mini-circle-progress');
        if (circleProgress) circleProgress.style.stroke = primary;

        var playBtn = gid('mini-play-btn');
        if (playBtn) {
            playBtn.style.borderColor = "color-mix(in srgb, " + primary + " 50%, transparent)";
            playBtn.style.boxShadow = "0 0 16px color-mix(in srgb, " + primary + " 40%, transparent)";
        }

        var beatBars = document.querySelectorAll('.mini-beat-bar');
        beatBars.forEach(function(bar, idx) {
            bar.style.backgroundColor = (idx % 2 === 0) ? primary : secondary;
        });

        var beatsGradient = gid('mini-beats-bg-gradient');
        if (beatsGradient) {
            beatsGradient.style.background = 'linear-gradient(to right, color-mix(in srgb, ' + primary + ' 30%, transparent), color-mix(in srgb, ' + secondary + ' 18%, transparent), transparent)';
        }

        if (typeof App !== 'undefined' && typeof App.updateNavTheme === 'function') {
            App.updateNavTheme();
        }

        if (typeof FullPlayer !== 'undefined' && FullPlayer.applyColors) {
            FullPlayer.applyColors(colors);
        }
    },
    extractFromImage(img) {
        try {
            var canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 16, 16);
            var imgData = ctx.getImageData(0, 0, 16, 16).data;
            
            var totalR = 0, totalG = 0, totalB = 0;
            var maxSat = -1;
            var bestR = 255, bestG = 42, bestB = 95;
            
            for (var i = 0; i < imgData.length; i += 4) {
                var r = imgData[i];
                var g = imgData[i+1];
                var b = imgData[i+2];
                
                totalR += r;
                totalG += g;
                totalB += b;
                
                var maxC = Math.max(r, g, b);
                var minC = Math.min(r, g, b);
                var sat = maxC - minC;
                
                if (sat > maxSat && maxC > 50 && minC < 220) {
                    maxSat = sat;
                    bestR = r;
                    bestG = g;
                    bestB = b;
                }
            }
            
            var count = imgData.length / 4;
            var avgR = Math.round(totalR / count);
            var avgG = Math.round(totalG / count);
            var avgB = Math.round(totalB / count);
            
            var mainR = (maxSat > 30) ? bestR : (Math.max(avgR, avgG, avgB) < 40 ? 220 : avgR);
            var mainG = (maxSat > 30) ? bestG : (Math.max(avgR, avgG, avgB) < 40 ? 100 : avgG);
            var mainB = (maxSat > 30) ? bestB : (Math.max(avgR, avgG, avgB) < 40 ? 140 : avgB);
            
            var c1 = 'rgb(' + mainR + ',' + mainG + ',' + mainB + ')';
            var c2 = 'rgb(' + Math.min(255, Math.round(mainR * 1.25 + 20)) + ',' + Math.min(255, Math.round(mainG * 1.25 + 20)) + ',' + Math.min(255, Math.round(mainB * 1.25 + 20)) + ')';
            var c3 = 'rgb(' + Math.max(30, Math.round(mainR * 0.75)) + ',' + Math.max(30, Math.round(mainG * 0.75)) + ',' + Math.max(30, Math.round(mainB * 0.75)) + ')';
            var c4 = 'rgb(' + Math.min(255, Math.round(mainR * 1.1 + 10)) + ',' + Math.min(255, Math.round(mainG * 1.1 + 10)) + ',' + Math.min(255, Math.round(mainB * 1.1 + 10)) + ')';
            
            return [c1, c2, c3, c4];
        } catch(e) {
            return null;
        }
    },
    updateBeats(track) {
        if (!track) return;
        var palette = MP.getTrackColors(track);
        MP.applyColors(palette);

        if (track.cover && track.cover.startsWith('http')) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = track.cover;
            img.onload = function() {
                var colors = MP.extractFromImage(img);
                if (colors) {
                    MP.applyColors(colors);
                    if (typeof FullPlayer !== 'undefined' && FullPlayer.applyColors) {
                        FullPlayer.applyColors(colors);
                    }
                }
            };
        }
    }
};