(function() {
    var player = document.getElementById('musicCardPlayer');
    var cards = document.querySelectorAll('.music-card');
    var currentCard = null;

    if (!player || !cards.length) return;

    function resetAllButtons() {
        cards.forEach(function(card) {
            var btn = card.querySelector('.music-play-btn');
            btn.classList.remove('playing');
            btn.innerHTML = '<i class="fas fa-play"></i> 播放';
        });
    }

    function setPlaying(card) {
        resetAllButtons();
        var btn = card.querySelector('.music-play-btn');
        btn.classList.add('playing');
        btn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
        currentCard = card;
    }

    function setPaused(card) {
        var btn = card.querySelector('.music-play-btn');
        btn.classList.remove('playing');
        btn.innerHTML = '<i class="fas fa-play"></i> 播放';
        currentCard = null;
    }

    cards.forEach(function(card) {
        var btn = card.querySelector('.music-play-btn');
        var src = card.getAttribute('data-src');

        btn.addEventListener('click', function() {
            if (currentCard === card) {
                // 同一首歌: 切换暂停/播放
                if (player.paused) {
                    player.play();
                    setPlaying(card);
                } else {
                    player.pause();
                    setPaused(card);
                }
            } else {
                // 切换到新歌
                player.src = src;
                player.play().then(function() {
                    setPlaying(card);
                }).catch(function() {});
            }
        });
    });

    // 监听卡片播放器的播放事件，自动匹配并高亮对应卡片
    player.addEventListener('play', function() {
        var playingSrc = player.getAttribute('src') || player.src;
        var matchingCard = null;
        cards.forEach(function(c) {
            if (playingSrc.indexOf(c.getAttribute('data-src')) !== -1) {
                matchingCard = c;
            }
        });
        if (matchingCard) {
            setPlaying(matchingCard);
        }
    });

    player.addEventListener('pause', function() {
        if (currentCard) {
            setPaused(currentCard);
        }
    });

    player.addEventListener('ended', function() {
        resetAllButtons();
        currentCard = null;
    });
})();
