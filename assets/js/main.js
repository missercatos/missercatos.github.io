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
    // 注意：main.js在assets/js目录中，resume.json在根目录的_data目录
    // 所以路径应该是：../../_data/resume.json
    fetch('_data/resume.json')  // 修改为正确路径
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
                
                // 根据您提供的JSON数据结构创建HTML
                itemEl.innerHTML = `
                    <div class="timeline-year">${item.year}</div>
                    <div class="timeline-content">
                        <p>${item.description}</p>
                        ${item.tags ? `<div class="tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
                    </div>
                `;
                timelineEl.appendChild(itemEl);
            });
        })
        .catch(error => {
            console.error('加载简历数据时出错:', error);
            document.getElementById('resumeTimeline').innerHTML = '<p class="error">这里的主人被虚空吞噬</p>';
        });
});
