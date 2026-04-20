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
                // 初始化点赞按钮
                setupLikeButton();
                // 加载下载文件列表
                loadDownloads();
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
                        // 重新初始化点赞按钮
                        setupLikeButton();
                        // 加载下载文件列表
                        loadDownloads();
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
    
    // 初始化点赞功能
    setupLikeButton();
    // 加载下载文件列表
    loadDownloads();
    
    // 图片点击放大功能
    setupImageZoom();
});

// 图片放大功能
function setupImageZoom() {
    // 创建lightbox元素
    const lightbox = document.createElement('div');
    lightbox.id = 'imageLightbox';
    lightbox.className = 'lightbox hidden';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-image" src="" alt="放大图片">
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    // 获取所有可点击放大的图片
    const zoomImages = document.querySelectorAll('img[data-fullsize]');
    
    zoomImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            const fullSizeSrc = this.getAttribute('data-fullsize');
            const caption = this.nextElementSibling ? this.nextElementSibling.textContent : '';
            
            const lightboxImg = lightbox.querySelector('.lightbox-image');
            const lightboxCaption = lightbox.querySelector('.lightbox-caption');
            
            lightboxImg.src = fullSizeSrc;
            lightboxCaption.textContent = caption;
            
            lightbox.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // 防止滚动
        });
    });
    
    // 关闭lightbox
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', function() {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    });
    
    // 点击背景关闭
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
}

// 点赞功能
function setupLikeButton() {
    const likeButton = document.getElementById('likeButton');
    const likeCountEl = document.getElementById('likeCount');
    
    if (!likeButton || !likeCountEl) {
        return; // 当前页面没有点赞按钮
    }
    
    // 从localStorage获取点赞数，默认为0
    let likeCount = parseInt(localStorage.getItem('siteLikes')) || 0;
    let liked = localStorage.getItem('userLiked') === 'true';
    
    // 更新显示
    likeCountEl.textContent = likeCount;
    if (liked) {
        likeButton.classList.add('liked');
        likeButton.innerHTML = '<i class="fas fa-heart"></i> 已点赞';
        likeButton.disabled = true;
    }
    
    // 点赞按钮点击事件
    likeButton.addEventListener('click', function() {
        if (liked) return;
        
        // 增加点赞数
        likeCount++;
        liked = true;
        
        // 更新localStorage
        localStorage.setItem('siteLikes', likeCount);
        localStorage.setItem('userLiked', 'true');
        
        // 更新UI
        likeCountEl.textContent = likeCount;
        likeButton.classList.add('liked');
        likeButton.innerHTML = '<i class="fas fa-heart"></i> 已点赞';
        likeButton.disabled = true;
        
        // 添加动画效果
        likeButton.style.transform = 'scale(1.2)';
        setTimeout(() => {
            likeButton.style.transform = '';
        }, 300);
    });
}

// 加载下载文件列表
function loadDownloads() {
    const downloadsList = document.getElementById('downloadsList');
    if (!downloadsList) {
        return; // 当前页面没有下载区域
    }
    
    // 显示加载状态
    downloadsList.innerHTML = '<div class="loading">加载文件中...</div>';
    
    // 从JSON文件加载数据
    fetch('data/downloads.json')
        .then(response => {
            if (!response.ok) throw new Error('无法加载文件列表');
            return response.json();
        })
        .then(files => {
            if (files.length === 0) {
                downloadsList.innerHTML = '<div class="loading">暂无文件可下载</div>';
                return;
            }
            
            // 清空容器
            downloadsList.innerHTML = '';
            
            // 为每个文件创建下载项
            files.forEach(file => {
                const item = document.createElement('div');
                item.className = 'download-item polygon-shape';
                item.innerHTML = `
                    <div class="download-info">
                        <h3 class="download-title">${file.title}</h3>
                        <p class="download-description">${file.description}</p>
                        <div class="download-meta">
                            <span class="file-type">${file.type}</span>
                            <span class="file-size">${file.size}</span>
                        </div>
                    </div>
                    <a href="${file.path}" download class="download-button polygon-shape">
                        <i class="fas fa-download"></i> 下载
                    </a>
                `;
                downloadsList.appendChild(item);
            });
        })
        .catch(error => {
            console.error('加载下载文件列表失败:', error);
            downloadsList.innerHTML = '<div class="loading">加载失败，请刷新页面</div>';
        });
}
