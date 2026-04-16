document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('mainContent');
    const body = document.body;

    // 1. 点击或按任意键隐藏数码雨，显示主内容
    function revealContent() {
        // 停止数码雨动画（可选，也可以保留作为背景）
        // window.matrix.stop();
        
        // 淡入主内容
        mainContent.classList.remove('hidden');
        body.classList.remove('preload');
        
        // 开始播放BGM
        window.musicPlayer.play();
        
        // 移除事件监听器，防止重复触发
        window.removeEventListener('click', revealContent);
        window.removeEventListener('keydown', revealContent);
    }

    // 初始状态：主内容隐藏
    mainContent.classList.add('hidden');
    
    // 添加触发事件
    window.addEventListener('click', revealContent);
    window.addEventListener('keydown', revealContent);

    // 2. 动态加载履历数据 (从 _data/resume.json)
    fetch('_data/resume.json')
        .then(response => {
            if (!response.ok) throw new Error('履历数据加载失败');
            return response.json();
        })
        .then(data => {
            const timelineEl = document.getElementById('resumeTimeline');
            timelineEl.innerHTML = ''; // 清除加载中文字
            
            data.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'timeline-item polygon-shape';
                itemEl.innerHTML = `
                    <h3>${item.year} - ${item.title}</h3>
                    <p><strong>${item.company}</strong></p>
                    <p>${item.description}</p>
                    ${item.tags ? `<div class="tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
                `;
                timelineEl.appendChild(itemEl);
            });
        })
        .catch(error => {
            console.error(error);
            document.getElementById('resumeTimeline').innerHTML = '<p class="error">履历加载失败，请稍后刷新。</p>';
        });
});
