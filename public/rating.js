// Soundify Rating System with JSONBin Integration & Periodic Prompt
var Rating = {
    selectedStars: 5,
    promptTimer: null,
    stats: { average: 0.0, total: 0, ratings: [] },

    init() {
        Rating.fetchStats();
        Rating.schedulePrompt();
    },

    fetchStats(callback) {
        fetch('/api/rating')
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data && data.status) {
                    Rating.stats = {
                        average: typeof data.average === 'number' ? data.average : 0.0,
                        total: data.total || 0,
                        ratings: data.ratings || []
                    };
                    Rating.updateBadgeUI();
                    if (typeof callback === 'function') callback(Rating.stats);
                }
            })
            .catch(function(err) {
                console.warn('[Rating] Failed to load rating stats:', err);
            });
    },

    updateBadgeUI() {
        var badges = document.querySelectorAll('#drawer-rating-badge, .drawer-rating-score');
        badges.forEach(function(el) {
            el.textContent = Rating.stats.total > 0 ? ('⭐ ' + Rating.stats.average + ' (' + Rating.stats.total + ')') : '⭐ Rating';
        });
    },

    schedulePrompt() {
        // Jangan tampilkan jika sudah pernah rate atau klik "tutup selamanya"
        var isRated = localStorage.getItem('soundify_rated') === 'true';
        var isNever = localStorage.getItem('soundify_rating_never') === 'true';
        if (isRated || isNever) return;

        // Cek jika disembunyikan sesi ini
        var isDismissedSession = sessionStorage.getItem('soundify_rating_dismissed_session') === 'true';
        var delay = isDismissedSession ? 180000 : 35000; // 35s pertama kali, atau 3 min jika nanti saja

        if (Rating.promptTimer) clearTimeout(Rating.promptTimer);
        Rating.promptTimer = setTimeout(function() {
            var alreadyOpen = gid('rating-prompt-popup') || gid('rating-modal');
            if (!alreadyOpen) {
                Rating.showPromptPopup();
            }
        }, delay);
    },

    setStarScore(score, containerId) {
        Rating.selectedStars = score;
        var container = gid(containerId || 'star-picker-container');
        if (!container) return;
        var stars = container.querySelectorAll('.star-btn');
        stars.forEach(function(s, idx) {
            if (idx < score) {
                s.classList.add('text-amber-400', 'fill-amber-400', 'scale-110');
                s.classList.remove('text-zinc-500', 'fill-none');
            } else {
                s.classList.remove('text-amber-400', 'fill-amber-400', 'scale-110');
                s.classList.add('text-zinc-500', 'fill-none');
            }
        });
    },

    // ── Prompt Popup Periodic ───────────────────────────────────────────────
    showPromptPopup() {
        var isRated = localStorage.getItem('soundify_rated') === 'true';
        var isNever = localStorage.getItem('soundify_rating_never') === 'true';
        if (isRated || isNever) return;

        var existing = gid('rating-prompt-popup');
        if (existing) existing.remove();

        Rating.selectedStars = 5;

        var popup = document.createElement('div');
        popup.id = 'rating-prompt-popup';
        popup.className = 'fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-fade-in';
        
        popup.innerHTML = `
            <div class="glass-strong w-full max-w-sm rounded-3xl p-5 border border-amber-500/30 text-center relative overflow-hidden bg-zinc-950/95 text-white shadow-2xl animate-card-up">
                <!-- Top Decorative Icon -->
                <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg group">
                    <i data-lucide="star" class="w-8 h-8 fill-amber-400 animate-pulse"></i>
                </div>

                <h3 class="text-base font-black text-white tracking-tight">Suka Menggunakan Soundify?</h3>
                <p class="text-xs text-zinc-300 mt-1 mb-4 font-medium leading-relaxed">
                    Bantu kami meningkatkan kualitas app dengan memberikan rating & saran Anda!
                </p>

                <!-- Star Picker -->
                <div id="prompt-star-picker" class="flex items-center justify-center gap-2 mb-3">
                    ${[1,2,3,4,5].map(function(num) {
                        return '<button onclick="Rating.setStarScore(' + num + ', \'prompt-star-picker\')" class="star-btn p-1.5 transition-all transform active:scale-95 cursor-pointer text-amber-400 fill-amber-400 scale-110">' +
                            '<i data-lucide="star" class="w-7 h-7"></i>' +
                        '</button>';
                    }).join('')}
                </div>

                <!-- Feedback Comment Input -->
                <div class="mb-4 text-left">
                    <textarea id="prompt-comment-input" rows="2" placeholder="Tulis ulasan/saran Anda (opsional)..." class="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60 resize-none transition-all"></textarea>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-2">
                    <button onclick="Rating.submitFromPrompt()" class="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-black text-xs shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2">
                        <span>Kirim Rating & Ulasan</span>
                        <i data-lucide="send" class="w-3.5 h-3.5"></i>
                    </button>
                    <div class="grid grid-cols-2 gap-2 pt-1">
                        <button onclick="Rating.dismissPrompt()" class="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-[11px] font-bold transition-all cursor-pointer">
                            Nanti Saja
                        </button>
                        <button onclick="Rating.neverShowPrompt()" class="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-bold transition-all cursor-pointer">
                            Tutup Selamanya
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    dismissPrompt() {
        var popup = gid('rating-prompt-popup');
        if (popup) popup.remove();
        sessionStorage.setItem('soundify_rating_dismissed_session', 'true');
        Rating.schedulePrompt();
    },

    neverShowPrompt() {
        var popup = gid('rating-prompt-popup');
        if (popup) popup.remove();
        localStorage.setItem('soundify_rating_never', 'true');
        if (typeof showToast === 'function') showToast('Rating otomatis dinonaktifkan.');
    },

    submitFromPrompt() {
        var commentEl = gid('prompt-comment-input');
        var comment = commentEl ? commentEl.value : '';
        Rating.submit(Rating.selectedStars, comment, 'Pengguna Soundify', 'rating-prompt-popup');
    },

    // ── Full Rating Modal (Dari Menu Hamburger) ────────────────────────────
    openModal() {
        var existing = gid('rating-modal');
        if (existing) existing.remove();

        Rating.selectedStars = 5;

        var modal = document.createElement('div');
        modal.id = 'rating-modal';
        modal.className = 'fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-fade-in';

        modal.innerHTML = `
            <div class="glass-strong w-full max-w-md max-h-[90vh] rounded-3xl p-5 border border-white/15 flex flex-col relative overflow-hidden bg-zinc-950/95 text-white shadow-2xl animate-card-up">
                <!-- Header Modal -->
                <div class="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
                    <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                            <i data-lucide="star" class="w-5 h-5 fill-amber-400"></i>
                        </div>
                        <div>
                            <h2 class="text-base font-black text-white tracking-tight leading-tight">Rating & Ulasan App</h2>
                            <p class="text-zinc-400 text-[10px] font-semibold">Soundify • Community Feedback</p>
                        </div>
                    </div>
                    <button onclick="gid('rating-modal').remove()" class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer border border-white/10">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>

                <!-- Scrollable Body -->
                <div class="flex-1 overflow-y-auto space-y-4 py-4 pr-1 hide-scrollbar">
                    <!-- Rating Summary Card -->
                    <div class="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-500/20 text-center">
                        <div class="text-3xl font-black text-amber-400 tracking-tight flex items-center justify-center gap-1.5">
                            <span>${Rating.stats.total > 0 ? Rating.stats.average : '0.0'}</span>
                            <span class="text-lg text-amber-300">/ 5.0</span>
                        </div>
                        <div class="flex justify-center gap-1 my-1.5 text-amber-400">
                            ${[1,2,3,4,5].map(function() { return '<i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>'; }).join('')}
                        </div>
                        <p class="text-[11px] text-zinc-400 font-semibold">
                            Berdasarkan <span id="modal-total-count" class="text-amber-300 font-bold">${Rating.stats.total || 0}</span> ulasan pengguna
                        </p>
                    </div>

                    <!-- Input Form Rating -->
                    <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div class="text-xs font-extrabold text-white">Tulis Rating Anda:</div>
                        
                        <!-- Star Selection -->
                        <div id="modal-star-picker" class="flex items-center justify-center gap-2">
                            ${[1,2,3,4,5].map(function(num) {
                                return '<button onclick="Rating.setStarScore(' + num + ', \'modal-star-picker\')" class="star-btn p-1.5 transition-all transform active:scale-95 cursor-pointer text-amber-400 fill-amber-400 scale-110">' +
                                    '<i data-lucide="star" class="w-6 h-6"></i>' +
                                '</button>';
                            }).join('')}
                        </div>

                        <!-- Name Input -->
                        <input id="modal-name-input" type="text" placeholder="Nama Anda (opsional)..." class="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60 transition-all" />

                        <!-- Comment Textarea -->
                        <textarea id="modal-comment-input" rows="2" placeholder="Tuliskan ulasan atau saran pengembangan..." class="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60 resize-none transition-all"></textarea>

                        <button onclick="Rating.submitFromModal()" class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2">
                            <span>Kirim Rating & Ulasan</span>
                            <i data-lucide="send" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>

                    <!-- Community Reviews List -->
                    <div>
                        <div class="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center justify-between">
                            <span>Ulasan Pengguna Terbaru</span>
                            <span class="text-[10px] text-amber-400 font-bold">Terverifikasi</span>
                        </div>
                        <div id="modal-reviews-list" class="space-y-2.5">
                            ${Rating.renderReviewsList()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    renderReviewsList() {
        if (!Rating.stats.ratings || Rating.stats.ratings.length === 0) {
            return '<div class="p-4 rounded-xl bg-white/5 text-center text-xs text-zinc-400 font-medium">Belum ada ulasan. Jadilah yang pertama memberikan rating!</div>';
        }
        return Rating.stats.ratings.map(function(item) {
            var starCount = Number(item.stars) || 5;
            var formattedDate = item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Terbaru';
            return `
                <div class="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <div class="flex items-center justify-between">
                        <div class="text-xs font-bold text-white flex items-center gap-2">
                            <span>${item.name || 'Pengguna Soundify'}</span>
                            <span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">⭐ ${starCount}.0</span>
                        </div>
                        <span class="text-[9px] text-zinc-500">${formattedDate}</span>
                    </div>
                    ${item.comment ? '<p class="text-xs text-zinc-300 font-medium leading-normal">' + item.comment + '</p>' : ''}
                </div>
            `;
        }).join('');
    },

    submitFromModal() {
        var commentEl = gid('modal-comment-input');
        var nameEl = gid('modal-name-input');
        var comment = commentEl ? commentEl.value : '';
        var name = nameEl && nameEl.value ? nameEl.value : 'Pengguna Soundify';
        Rating.submit(Rating.selectedStars, comment, name, 'rating-modal');
    },

    // ── Kirim Rating (Wajib Publish ke Server) ──────────────────────────────
    submit(stars, comment, name, containerId) {
        var cardContainer = gid(containerId);
        var submitBtn = cardContainer ? cardContainer.querySelector('button[onclick*="submit"]') : null;
        var originalBtnText = submitBtn ? submitBtn.innerHTML : '';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';
            submitBtn.innerHTML = '<span class="animate-spin mr-1">⏳</span> Mempublikasikan...';
        }

        fetch('/api/rating', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stars: stars, comment: comment, name: name })
        })
        .then(function(res) {
            if (!res.ok) {
                return res.json().then(function(errData) {
                    throw new Error(errData.message || 'Gagal mempublikasikan rating');
                }).catch(function() {
                    throw new Error('Gagal mempublikasikan rating (HTTP ' + res.status + ')');
                });
            }
            return res.json();
        })
        .then(function(data) {
            if (!data || !data.status) {
                throw new Error((data && data.message) || 'Respon server tidak valid');
            }

            // Sukses terpublikasi di server
            localStorage.setItem('soundify_rated', 'true');

            // Refresh stats publik
            Rating.fetchStats();

            // Animasi sukses
            if (cardContainer) {
                var innerCard = cardContainer.querySelector('.glass-strong');
                if (innerCard) {
                    innerCard.innerHTML = `
                        <div class="py-8 px-4 text-center space-y-4 animate-scale-up">
                            <div class="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                                <i data-lucide="check-circle" class="w-10 h-10"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-black text-white">Rating Berhasil Dipublikasikan!</h3>
                                <p class="text-xs text-zinc-300 mt-1 font-medium max-w-xs mx-auto leading-relaxed">
                                    Terima kasih! Penilaian & ulasan Anda telah resmi tersimpan secara publik.
                                </p>
                            </div>
                            <div class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/30">
                                <span>⭐ Terima Kasih!</span>
                            </div>
                        </div>
                    `;
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }

                setTimeout(function() {
                    if (cardContainer && cardContainer.parentNode) {
                        cardContainer.remove();
                    }
                }, 2200);
            }

            if (typeof showToast === 'function') {
                showToast('✨ Rating & ulasan berhasil dipublikasikan!');
            }
        })
        .catch(function(err) {
            console.error('[Rating] Gagal mempublikasikan rating:', err);

            // Restore tombol jika gagal
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.innerHTML = originalBtnText;
            }

            // Tampilkan notifikasi error kecil
            var errMsg = err && err.message ? err.message : 'Koneksi internet bermasalah';
            if (typeof showToast === 'function') {
                showToast('❌ Gagal mempublikasikan rating: ' + errMsg);
            } else {
                alert('Gagal mempublikasikan rating: ' + errMsg);
            }
        });
    }
};

// Initialize rating stats when document ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { Rating.init(); });
} else {
    Rating.init();
}
