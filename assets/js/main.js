// ========== 技术分享按钮配置 ==========
// ★ 新增分享入口：在下面数组中追加条目即可
// group: 同一 group 的入口会用线连接（相同的 group 值即视为关联）
const TECH_SHARES = [
    {
        id: 'archlinux',
        name: 'Arch Linux',
        url: 'archlinux.html',
        logo: 'assets/ima/cions/archlinux.png',
        description: 'Arch Linux 安装与使用教程',
        color: '#1793d1',
        group: 'linux'
    },
    {
        id: 'cpp_tutorial',
        name: 'C++',
        url: 'cpp.html',
        logo: 'assets/ima/cions/cpp.png',
        description: 'C++ 深化教程 — 从命名空间到标准库',
        color: '#7b2fbe',
        textColor: '#1a1a1a',
        group: 'cpp'
    },
    {
        id: 'git',
        name: 'Git',
        url: 'git.html',
        logo: 'assets/ima/cions/git.png',
        description: 'Git 使用教程 — 从基础到多人协作',
        color: '#f05133',
        textColor: '#1a1a1a',
        group: 'tools'
    }
    // ★ 模板 - 复制以下内容并修改即可添加新技术分享入口：
    // {
    //     id: 'unique-id',
    //     name: '分享名称',
    //     url: '目标页面.html',
    //     logo: 'assets/ima/cions/图标.png',
    //     description: '简短描述',
    //     color: '#主题色',
    //     group: '分组名'
    // },
];

const ITEMS_PER_ROW = 3;

function darkenHex(hex, amount) {
    var n = parseInt(hex.replace('#', ''), 16);
    var r = Math.max(0, Math.min(255, (n >> 16) + amount));
    var g = Math.max(0, Math.min(255, ((n >> 8) & 0xFF) + amount));
    var b = Math.max(0, Math.min(255, (n & 0xFF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function stopFloating() {
    // 已无浮动动画，保留以兼容旧调用
}

function initFloatingShares() {
    stopFloating();

    var container = document.getElementById('floatingShareContainer');
    if (!container) return;

    container.innerHTML = '';
    var numRows = Math.ceil(TECH_SHARES.length / ITEMS_PER_ROW);

    // 先创建 SVG 层用于画连接线
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'share-lines-svg');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '0';
    container.appendChild(svg);

    var btnElements = []; // { id, el, group }

    for (var ri = 0; ri < numRows; ri++) {
        var row = document.createElement('div');
        row.className = 'floating-row';

        var start = ri * ITEMS_PER_ROW;
        var end = Math.min(start + ITEMS_PER_ROW, TECH_SHARES.length);

        for (var i = start; i < end; i++) {
            (function(share) {
                var btn = document.createElement('a');
                btn.className = 'tech-share-btn';
                btn.href = share.url;
                btn.title = share.description;
                btn.setAttribute('data-share-id', share.id);
                btn.setAttribute('data-share-group', share.group);

                var circle = document.createElement('div');
                circle.className = 'tech-share-circle';
                circle.style.background = 'linear-gradient(135deg, ' + share.color + ' 0%, ' + darkenHex(share.color, -30) + ' 100%)';
                circle.style.boxShadow = '0 0 20px ' + share.color + '66, 0 4px 12px rgba(0,0,0,0.2)';

                var img = document.createElement('img');
                img.src = share.logo;
                img.alt = share.name;
                img.onerror = function() {
                    this.style.display = 'none';
                    circle.classList.add('no-logo');
                    circle.textContent = share.name.substring(0, 3);
                    if (share.textColor) {
                        circle.style.color = share.textColor;
                    }
                };

                circle.appendChild(img);
                btn.appendChild(circle);

                var label = document.createElement('span');
                label.className = 'tech-share-label';
                label.textContent = share.name;
                btn.appendChild(label);

                row.appendChild(btn);
                btnElements.push({ id: share.id, el: circle, group: share.group });
            })(TECH_SHARES[i]);
        }

        container.appendChild(row);
    }

    // 绘制连接线：相同 group 的按钮两两连线
    drawShareLines(svg, btnElements, container);

    // resize 时重绘线
    var resizeHandler = function() {
        drawShareLines(svg, btnElements, container);
    };
    window.addEventListener('resize', resizeHandler);
    // 延迟再画一次（图片加载后尺寸可能变化）
    setTimeout(function() { drawShareLines(svg, btnElements, container); }, 300);
}

function drawShareLines(svg, btns, container) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (btns.length < 2) return;

    var containerRect = container.getBoundingClientRect();
    var ns = 'http://www.w3.org/2000/svg';

    // 按 group 分组
    var groups = {};
    for (var i = 0; i < btns.length; i++) {
        var g = btns[i].group;
        if (!groups[g]) groups[g] = [];
        groups[g].push(btns[i]);
    }

    // 画同组按钮之间的线
    for (var key in groups) {
        var members = groups[key];
        if (members.length < 2) continue;

        for (var a = 0; a < members.length; a++) {
            for (var b = a + 1; b < members.length; b++) {
                var rA = members[a].el.getBoundingClientRect();
                var rB = members[b].el.getBoundingClientRect();

                var x1 = rA.left + rA.width / 2 - containerRect.left;
                var y1 = rA.top + rA.height / 2 - containerRect.top;
                var x2 = rB.left + rB.width / 2 - containerRect.left;
                var y2 = rB.top + rB.height / 2 - containerRect.top;

                var line = document.createElementNS(ns, 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.setAttribute('stroke', 'rgba(0, 255, 157, 0.25)');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('stroke-dasharray', '6 4');
                svg.appendChild(line);
            }
        }
    }
}

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
    
    // 保存首页原始 HTML 内容（SPA 返回首页时恢复）
    var homeHTML = mainContent.innerHTML;

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
            // 只处理.html链接且不是外部链接，排除us.html（独立页面）
            if (href && href.endsWith('.html') && !href.startsWith('http') && href !== 'us.html' && href !== 'archlinux.html' && href !== 'cpp.html' && href !== 'git.html') {
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
        
        // 停止浮动动画（离开技术分享页时）
        stopFloating();
        // 停止音乐卡片浮动
        if (window.floatingMusic) window.floatingMusic.stop();
        
        // 如果是首页，恢复原始内容再显示
        if (url === 'index.html' || url === '/' || url === '') {
            stopFloating();
            if (window.floatingMusic) window.floatingMusic.stop();
            // 只有当内容已被替换时才需要恢复
            if (mainContent.innerHTML !== homeHTML) {
                mainContent.innerHTML = homeHTML;
            }
            setTimeout(() => {
                mainContent.classList.remove('hidden');
                if (updateTitle) document.title = 'Misser-catos';
                // 初始化点赞按钮
                setupLikeButton();
                // 加载下载文件列表
                loadDownloads();
                // 滚动到页面顶部（英雄区域）
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    
                    // 初始化浮动分享按钮（about.html）
                    initFloatingShares();
                    // 初始化浮动音乐卡片（music.html）
                    if (window.floatingMusic) window.floatingMusic.init();
                    
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
    
    // 初始化浮动分享按钮（about.html 直接访问时）
    initFloatingShares();
    // 初始化浮动音乐卡片（music.html 直接访问时）
    if (window.floatingMusic) window.floatingMusic.init();
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
        likeButton.disabled = true;
        
        // 添加动画效果
        likeButton.style.transform = 'scale(1.3)';
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
