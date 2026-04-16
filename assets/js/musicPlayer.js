window.musicPlayer = (function() {
    const player = document.getElementById('bgmPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const nextTrackBtn = document.getElementById('nextTrackBtn');
    const muteBtn = document.getElementById('muteBtn');
    const nowPlayingEl = document.getElementById('nowPlaying');

    // 播放列表 (路径指向 assets/music/)
    const playlist = [
        { title: "曲目一", src: "assets/music/track1.mp3" },
        { title: "曲目二", src: "assets/music/track2.mp3" },
        { title: "曲目三", src: "assets/music/track3.mp3" }
    ];
    let currentTrackIndex = 0;
    let isMuted = false;

    function loadTrack(index) {
        if (index < 0 || index >= playlist.length) return;
        currentTrackIndex = index;
        const track = playlist[currentTrackIndex];
        player.src = track.src;
        nowPlayingEl.textContent = `正在播放: ${track.title}`;
        player.play().catch(e => console.log("自动播放被阻止，等待用户交互"));
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
        muteBtn.textContent = isMuted ? "🔇" : "🔊";
    }

    function updatePlayButton(isPlaying) {
        playPauseBtn.textContent = isPlaying ? "⏸️" : "▶️";
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
