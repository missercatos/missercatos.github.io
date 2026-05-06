(function() {
    // ========== 音乐文件配置 ==========
    const MUSIC_FILES = [
        { title: '不存在的乐园', artist: '塞壬唱片', src: 'assets/music/track1.mp3', filename: '不存在的乐园.mp3' },
        { title: '****生息****', artist: '塞壬唱片', src: 'assets/music/track2.mp3', filename: '生息.mp3' },
        { title: '走过漫漫时空', artist: '塞壬唱片', src: 'assets/music/track3.mp3', filename: '走过漫漫时空.mp3' },
        { title: '我的生活', artist: '塞壬唱片', src: 'assets/music/我的生活.mp3', filename: '我的生活.mp3' },
        { title: '永恒呼吸', artist: '塞壬唱片', src: 'assets/music/永恒呼吸.mp3', filename: '永恒呼吸.mp3' },
        { title: '永世のクレイドル', artist: '鈴華ゆう子', src: 'assets/music/永世のクレイドル-鈴華ゆう子.mp3', filename: '永世のクレイドル-鈴華ゆう子.mp3' },
        { title: 'MY ALL', artist: '浜崎あゆみ', src: 'assets/music/MY ALL-浜崎あゆみ.mp3', filename: 'MY ALL-浜崎あゆみ.mp3' },
        { title: '春弦', artist: '塞壬唱片-MSR,横山克', src: 'assets/music/春弦-塞壬唱片-MSR,横山克.mp3', filename: '春弦-塞壬唱片-MSR,横山克.mp3' },
        { title: '浸春芜', artist: '塞壬唱片-MSR,宋柏,十音,解伟苓', src: 'assets/music/浸春芜-塞壬唱片-MSR,宋柏,十音,解伟苓.mp3', filename: '浸春芜-塞壬唱片-MSR,宋柏,十音,解伟苓.mp3' }
    ];

    const BASE_SPEED = 135; // px/s（数字雨 540px/s 的 0.25 倍）
    const CARD_EST_W = 160;
    const CARD_EST_H = 50;

    var cards = [];
    var animId = null;
    var lastTime = 0;
    var container = null;
    var containerW = 0;
    var containerH = 0;

    function randomSpeed() {
        return BASE_SPEED * (0.7 + Math.random() * 0.6);
    }

    function createCards() {
        container.innerHTML = '';
        cards = [];

        MUSIC_FILES.forEach(function(music) {
            var a = document.createElement('a');
            a.className = 'floating-music-card';
            a.href = music.src;
            a.download = music.filename;
            a.title = music.title + ' / ' + music.artist + ' — 点击下载';

            var titleSpan = document.createElement('span');
            titleSpan.className = 'fmc-title';
            titleSpan.textContent = music.title;

            var artistSpan = document.createElement('span');
            artistSpan.className = 'fmc-artist';
            artistSpan.textContent = music.artist;

            a.appendChild(titleSpan);
            a.appendChild(artistSpan);

            var x = Math.random() * (containerW - CARD_EST_W);
            var y = Math.random() * (containerH - CARD_EST_H);
            var angle = Math.random() * 2 * Math.PI;
            var spd = randomSpeed();
            var vx = Math.cos(angle) * spd;
            var vy = Math.sin(angle) * spd;

            a.style.left = x + 'px';
            a.style.top = y + 'px';

            container.appendChild(a);

            cards.push({
                el: a,
                x: x, y: y,
                vx: vx, vy: vy,
                w: CARD_EST_W,
                h: CARD_EST_H
            });
        });
    }

    function measureCards() {
        for (var i = 0; i < cards.length; i++) {
            var c = cards[i];
            if (c.el.offsetWidth > 0) {
                c.w = c.el.offsetWidth;
                c.h = c.el.offsetHeight;
            }
        }
    }

    function animate(ts) {
        if (!lastTime) lastTime = ts;
        var dt = Math.min((ts - lastTime) / 1000, 0.1);
        lastTime = ts;

        for (var i = 0; i < cards.length; i++) {
            var c = cards[i];

            // 使用测量后的实际尺寸
            if (c.w === CARD_EST_W && c.el.offsetWidth > 0) {
                c.w = c.el.offsetWidth;
                c.h = c.el.offsetHeight;
            }

            c.x += c.vx * dt;
            c.y += c.vy * dt;

            // 边缘碰撞反弹
            if (c.x < 0) { c.x = 0; c.vx = Math.abs(c.vx); }
            if (c.x + c.w > containerW) { c.x = containerW - c.w; c.vx = -Math.abs(c.vx); }
            if (c.y < 0) { c.y = 0; c.vy = Math.abs(c.vy); }
            if (c.y + c.h > containerH) { c.y = containerH - c.h; c.vy = -Math.abs(c.vy); }

            c.el.style.left = c.x + 'px';
            c.el.style.top = c.y + 'px';
        }

        animId = requestAnimationFrame(animate);
    }

    function initFloatingMusicCards() {
        stopFloatingMusicCards();

        container = document.getElementById('floatingMusicWrapper');
        if (!container) return;

        containerW = container.clientWidth;
        containerH = container.clientHeight;

        if (containerW <= 0 || containerH <= 0) return;

        createCards();

        // 延迟测量实际渲染尺寸
        setTimeout(function() {
            measureCards();
        }, 100);

        lastTime = performance.now();
        animId = requestAnimationFrame(animate);

        // 窗口大小变化时更新边界
        window.addEventListener('resize', onResize);
    }

    function onResize() {
        if (!container) return;
        containerW = container.clientWidth;
        containerH = container.clientHeight;

        // 将超出新边界的卡片拉回
        for (var i = 0; i < cards.length; i++) {
            var c = cards[i];
            if (c.x + c.w > containerW) c.x = Math.max(0, containerW - c.w);
            if (c.y + c.h > containerH) c.y = Math.max(0, containerH - c.h);
            c.el.style.left = c.x + 'px';
            c.el.style.top = c.y + 'px';
        }
    }

    function stopFloatingMusicCards() {
        if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
        }
        cards = [];
        lastTime = 0;
        container = null;
        window.removeEventListener('resize', onResize);
    }

    window.floatingMusic = {
        init: initFloatingMusicCards,
        stop: stopFloatingMusicCards
    };
})();
