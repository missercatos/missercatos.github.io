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
        if (window.musicPlayer && window.musicPlayer.play) {
            window.musicPlayer.play();
        }
        
        // 移除事件监听器，防止重复触发
        window.removeEventListener('click', revealContent);
        window.removeEventListener('keydown', revealContent);
    }

    // 初始状态：主内容隐藏
    mainContent.classList.add('hidden');
    
    // 添加触发事件
    window.addEventListener('click', revealContent);
    window.addEventListener('keydown', revealContent);

    // 2. 履历数据已硬编码在HTML中，无需动态加载

    // 3. SPA路由 - 拦截导航链接点击
    function setupSPARouting() {
        // 拦截所有站内链接点击
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            // 只处理.html链接且不是外部链接
            if (href && href.endsWith('.html') && !href.startsWith('http')) {
                e.preventDefault();
                navigateTo(href);
                return false;
            }
        });

        // 监听浏览器前进/后退
        window.addEventListener('popstate', function(e) {
            if (e.state && e.state.page) {
                loadPage(e.state.page, false);
            }
        });
    }

    // 导航到页面
    function navigateTo(url) {
        // 更新浏览器历史
        history.pushState({ page: url }, '', url);
        // 加载页面
        loadPage(url, true);
    }

    // 加载页面内容
    function loadPage(url, updateTitle = true) {
        // 显示加载状态
        mainContent.classList.add('hidden');
        
        // 如果是首页，直接显示现有内容
        if (url === 'index.html' || url === '/' || url === '') {
            setTimeout(() => {
                mainContent.classList.remove('hidden');
                if (updateTitle) document.title = 'Misser-catos';
            }, 100);
            return;
        }
        
        // 获取页面内容
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('页面加载失败');
                return response.text();
            })
            .then(html => {
                // 从响应中提取主要内容
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newMainContent = doc.getElementById('mainContent');
                
                if (newMainContent) {
                    // 替换当前内容
                    mainContent.innerHTML = newMainContent.innerHTML;
                    
                    // 更新页面标题
                    if (updateTitle) {
                        const newTitle = doc.querySelector('title');
                        if (newTitle) document.title = newTitle.textContent;
                    }
                    
                    // 音乐控制按钮保持不变，无需重新绑定
                    
                    // 显示内容
                    setTimeout(() => {
                        mainContent.classList.remove('hidden');
                    }, 100);
                }
            })
            .catch(error => {
                console.error('加载页面失败:', error);
                mainContent.innerHTML = '<div class="content-placeholder"><p class="placeholder-text">页面加载失败</p><p class="placeholder-subtext">' + error.message + '</p></div>';
                mainContent.classList.remove('hidden');
            });
    }

    // 初始化SPA路由
    setupSPARouting();
}
