window.musicPlayer = (function() {
    const player = document.getElementById('bgmPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const nextTrackBtn = document.getElementById('nextTrackBtn');
    const muteBtn = document.getElementById('muteBtn');
    const volDownBtn = document.getElementById('volDownBtn');
    const volUpBtn = document.getElementById('volUpBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const playlistBtn = document.getElementById('playlistBtn');
    const playlistDropdown = document.getElementById('playlistDropdown');
    const nowPlayingEl = document.getElementById('nowPlaying');
    const musicControl = document.querySelector('.music-control');

    // 播放列表 (路径指向 assets/music/)
    const playlist = [
        { title: "不存在的乐园", src: "assets/music/track1.mp3" },
        { title: "****生息****", src: "assets/music/track2.mp3" },
        { title: "走过漫漫时空", src: "assets/music/track3.mp3" },
        { title: "我的生活", src: "assets/music/我的生活.mp3" },
        { title: "永恒呼吸", src: "assets/music/永恒呼吸.mp3" },
        { title: "春弦-塞壬唱片", src: "assets/music/春弦-塞壬唱片-MSR,横山克.mp3" },
        { title: "MY ALL", src: "assets/music/MY ALL-浜崎あゆみ.mp3" },
        { title: "永世のクレイドル", src: "assets/music/永世のクレイドル-鈴華ゆう子.mp3" },
        { title: "浸春芜", src: "assets/music/浸春芜-塞壬唱片-MSR,宋柏,十音,解伟苓.mp3" },
        { title: "殉道之人", src: "assets/music/殉道之人-塞壬唱片-MSR,Erik Castro.mp3" },
        { title: "Somniomancer [null set]", src: "assets/music/Somniomancer [null set]-塞壬唱片-MSR,Crywolf.mp3" }
    ];

    let currentTrackIndex = 0;
    let isMuted = false;
    let playlistOpen = false;

    // 默认音量 100%
    player.volume = 1.0;

    function loadTrack(index) {
        if (index < 0 || index >= playlist.length) return;
        currentTrackIndex = index;
        const track = playlist[currentTrackIndex];
        player.src = track.src;
        nowPlayingEl.textContent = track.title;
        player.play().catch(function(e) { console.log("播放失败:", e); });
        updatePlayButton(true);
        updatePlaylistHighlight();
    }

    function playPause() {
        if (player.paused) {
            player.play();
            updatePlayButton(true);
        } else {
            player.pause();
            updatePlayButton(false);
        }
    }

    function nextTrack() {
        var nextIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(nextIndex);
    }

    function toggleMute() {
        isMuted = !isMuted;
        player.muted = isMuted;
        muteBtn.textContent = isMuted ? "◇" : "◆";
    }

    function updatePlayButton(isPlaying) {
        playPauseBtn.textContent = isPlaying ? "⏸" : "▶";
    }

    // ========== 音量控制 ==========
    function volDown() {
        player.volume = Math.max(0, Math.round((player.volume - 0.1) * 10) / 10);
    }

    function volUp() {
        player.volume = Math.min(1, Math.round((player.volume + 0.1) * 10) / 10);
    }

    // 鼠标滚轮调节音量
    if (musicControl) {
        musicControl.addEventListener('wheel', function(e) {
            e.preventDefault();
            if (e.deltaY > 0) {
                volDown();
            } else {
                volUp();
            }
        }, { passive: false });
    }

    // ========== 播放列表下拉 ==========
    function buildPlaylist() {
        if (!playlistDropdown) return;
        playlistDropdown.innerHTML = '';
        playlist.forEach(function(track, index) {
            var item = document.createElement('button');
            item.className = 'playlist-item';
            if (index === currentTrackIndex) item.classList.add('active');
            item.textContent = (index + 1) + '. ' + track.title;
            item.addEventListener('click', function() {
                loadTrack(index);
                closePlaylist();
            });
            playlistDropdown.appendChild(item);
        });
    }

    function updatePlaylistHighlight() {
        if (!playlistDropdown) return;
        var items = playlistDropdown.querySelectorAll('.playlist-item');
        items.forEach(function(item, index) {
            if (index === currentTrackIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function togglePlaylist() {
        if (playlistOpen) {
            closePlaylist();
        } else {
            openPlaylist();
        }
    }

    function openPlaylist() {
        if (!playlistDropdown) return;
        buildPlaylist();
        playlistDropdown.classList.remove('hidden');
        playlistOpen = true;
        if (playlistBtn) playlistBtn.classList.add('active');
    }

    function closePlaylist() {
        if (!playlistDropdown) return;
        playlistDropdown.classList.add('hidden');
        playlistOpen = false;
        if (playlistBtn) playlistBtn.classList.remove('active');
    }

    // 点击页面其他地方关闭播放列表
    document.addEventListener('click', function(e) {
        if (playlistOpen && playlistBtn && playlistDropdown) {
            if (!playlistDropdown.contains(e.target) && e.target !== playlistBtn) {
                closePlaylist();
            }
        }
    });

    // ========== 下载当前歌曲 ==========
    function downloadCurrent() {
        var track = playlist[currentTrackIndex];
        if (!track) return;
        var a = document.createElement('a');
        a.href = track.src;
        a.download = track.title.replace(/[*]/g, '') + '.mp3';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // 绑定事件
    if (playPauseBtn) playPauseBtn.addEventListener('click', playPause);
    if (nextTrackBtn) nextTrackBtn.addEventListener('click', nextTrack);
    if (muteBtn) muteBtn.addEventListener('click', toggleMute);
    if (volDownBtn) volDownBtn.addEventListener('click', volDown);
    if (volUpBtn) volUpBtn.addEventListener('click', volUp);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadCurrent);
    if (playlistBtn) playlistBtn.addEventListener('click', togglePlaylist);

    // 当一首歌结束时自动播放下一首
    player.addEventListener('ended', nextTrack);

    // 暴露控制函数
    return {
        play: function() { loadTrack(0); },
        pause: function() { player.pause(); },
        next: nextTrack
    };
})();
