// 基于 Canvas 的数码雨实现
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// 设置 Canvas 尺寸为窗口大小
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 数码雨字符集 (可以加入一些特殊符号增加酸性感)
const chars = "01アイウエオカキクケコ≒≡≡≡≡≒≒≒≒≒";
const charArray = chars.split("");

// 计算列数 (根据字体大小)
const fontSize = 18;
const columns = Math.floor(canvas.width / fontSize);

// 创建数组记录每列雨滴的Y坐标
const drops = new Array(columns).fill(1);

// 绘制函数
function drawMatrix() {
    // 半透明黑色覆盖，形成拖尾效果
    ctx.fillStyle = 'rgba(10, 10, 18, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 设置字体和颜色 (酸性青绿色)
    ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
    ctx.fillStyle = '#00ff9d';

    // 为每一列绘制字符
    for (let i = 0; i < drops.length; i++) {
        // 随机选择字符
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        
        // 绘制字符
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);

        // 随机重置雨滴，并让雨滴下落
        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// 动画循环
let matrixInterval;
function startMatrix() {
    if (matrixInterval) clearInterval(matrixInterval);
    matrixInterval = setInterval(drawMatrix, 35); // 控制速度
}
function stopMatrix() {
    clearInterval(matrixInterval);
}

// 初始启动数码雨
startMatrix();

// 暴露控制函数给主脚本
window.matrix = { start: startMatrix, stop: stopMatrix };
