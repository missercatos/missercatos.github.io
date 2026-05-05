window.musicPlayer = (function() {
    const player = document.getElementById('bgmPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const nextTrackBtn = document.getElementById('nextTrackBtn');
    const muteBtn = document.getElementById('muteBtn');
    const nowPlayingEl = document.getElementById('nowPlaying');

    // 播放列表 (路径指向 assets/music/)
    const playlist = [
        { title: "不存在的乐园", src: "assets/music/track1.mp3" },
        { title: "****生息****", src: "assets/music/track2.mp3" },
        { title: "走过漫漫时空", src: "assets/music/track3.mp3" },
        { title: "不存在的乐园", src: "assets/music/我的生活.mp3" },
        { title: "**永恒呼吸**",src: "assets/music/永恒呼吸.mp3" },
        { title: "春弦-塞壬唱片", src: "assets/music/春弦-塞壬唱片-MSR,横山克.mp3" },
        { title: "****MY AL****L", src: "assets/music/MY ALL-浜崎あゆみ.mp3" },
        { title: "永世のクレイドル", src: "assets/music/永世のクレイドル-鈴華ゆう子.mp3" },
        { title: "****浸春芜****", src: "assets/music/浸春芜-塞壬唱片-MSR,宋柏,十音,解伟苓.mp3" }
    ];
    let currentTrackIndex = 0;
    let isMuted = false;

    function loadTrack(index) {
        if (index < 0 || index >= playlist.length) return;
        currentTrackIndex = index;
        const track = playlist[currentTrackIndex];
        player.src = track.src;
        nowPlayingEl.textContent = ` ${track.title}`;
        player.play().catch(e => console.log("终止"));
        updatePlayButton(true);
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
        let nextIndex = (currentTrackIndex + 1) % playlist.length;
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

    // 绑定事件
    playPauseBtn.addEventListener('click', playPause);
    nextTrackBtn.addEventListener('click', nextTrack);
    muteBtn.addEventListener('click', toggleMute);

    // 当一首歌结束时自动播放下一首
    player.addEventListener('ended', nextTrack);

    // 暴露控制函数
    return {
        play: () => loadTrack(0),
        pause: () => player.pause(),
        next: nextTrack
    };
})();
