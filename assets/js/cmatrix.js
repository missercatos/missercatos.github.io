// 基于 Canvas 的数码雨实现 - 故事连贯性优化版本
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// 设置 Canvas 尺寸为窗口大小
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 故事文本 - 保持原有分段结构
const textSegments = [
    "你受伤了。在你翻阅文件的时候，纸张以一个极为刁钻的角度划破了你的皮肤。",
    "这并没有什么大不了的，你甚至没有察觉到这一点。直到Mon3tr端着一沓材料进来。",
    "起初，她只是停下动作，环顾左右，似乎是感到办公室里有些异样。",
    "当她抓住你的手腕，夺走你的笔，并把你的手翻过来时，你终于和她一起看到了食指上的那条伤痕。",
    "伤口并不深，血液也只渗出来了一点，你身体的自愈系统已经在发挥作用。",
    "或许贴个创可贴，过个一天伤口就能愈合。但很明显，你面前的医疗顾问并不是这么想的。",
    "由于你之前的诊疗事宜几乎都由凯尔希经手，Mon3tr很清楚你的身体状况，",
    "比这严重得多的外伤，凯尔希自然处理过——有时是包扎，有时用修复凝胶，",
    "极少数情况下也会直接用医疗枪解决问题。但现在，她该怎么做？没有人告诉她答案。",
    "Mon3tr就这么握着你的手思考了半天。看着她的神情，你大概猜到了一些什么，",
    "若是你再不帮帮她，她可能就要背着你到处找石棺了。于是，你指了指一旁的小药箱，",
    "那里放着能应对你基础医疗需求的物品。移动、搜寻、拣取、使用，如蒙大赦的她精准执行了'指令'。",
    "在用棉签蘸取药水清创后，她用轻柔又灵巧的动作为你贴上了创可贴，",
    "做完这一切，又用双手握住你的那只手，嘴里嘟囔着什么，轻轻拍了拍你的手掌，",
    "然后一溜烟地离开了办公室，只留下了还没来得及感谢她的你。",
    "你本以为这件事就这样翻篇了，但在过了十二个小时，当你还戴着安全帽监督新地块建设的时候，",
    "她突然出现在你旁边，切开了你的创可贴。一道浅浅的印记似乎还不足以打消她的顾虑，",
    "于是一个新的创可贴被塞到了你的手中。又过了十二个小时，当你在泡咖啡的时候，",
    "你看到路过的Mon3tr向你挥了挥手——除了问候，这个动作自然有其更深层的意义。",
    "于是你也挥了挥手，好让她能看到你愈合的手指，如此一来，无论是你，还是Mon3tr，",
    "就都能安心地度过一个夜晚——你是这么认为的。只是，在你饮下第一口咖啡时，她还是坐到了你身旁。",
    "'还疼吗？'你摇摇头，把曾经受伤的地方展示给她看，接着两只手指用力搓了几下，",
    "好把她的担忧彻底碾碎。'可记忆里流了血都会很疼。那是什么样的感觉？'",
    "你看着她困惑的样子，知道自己该想点其他法子满足她的求知欲了。",
    "这一次大概有多疼呢？你请她伸出一只手，然后用指甲在她的食指上狠狠划了一下，",
    "接着，你将她的问题返还给了她。疼吗？答案自然是不疼的，",
    "Mon3tr还因为有些痒而挠了挠手指。现在，她彻底放下了心中的不安，",
    "然后带着一种奇怪的语调，'告诫'你身体有任何异常都要优先报告给她。",
    "你当然答应了她，作为感谢，你请她享用了一顿简单却美味的夜宵。"
];

// 故事雨滴数据结构
const fontSize = 18;
let columns = 0;
let drops = []; // 每个雨滴对象：{text: 当前段落, position: 当前位置, speed: 下落速度, offset: 段落中的偏移量}

// 更新列数和雨滴数组
function updateColumns() {
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    
    // 为每一列初始化一个故事雨滴
    for (let i = 0; i < columns; i++) {
        // 随机选择一个段落
        const segmentIndex = Math.floor(Math.random() * textSegments.length);
        const segmentText = textSegments[segmentIndex];
        
        // 在段落中随机选择一个起始位置
        const offset = Math.floor(Math.random() * Math.max(1, segmentText.length - 10));
        
        drops.push({
            segment: segmentText,
            position: -Math.floor(Math.random() * 20), // 从画布上方开始
            speed: 0.5 + Math.random() * 0.5, // 随机速度
            offset: offset,
            colorIndex: i % 3 // 用于颜色变化
        });
    }
}

// 绘制函数
function drawMatrix() {
    // 半透明黑色覆盖，形成拖尾效果
    ctx.fillStyle = 'rgba(10, 10, 18, 0.1)'; // 增加透明度，让文字更清晰
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 设置字体
    ctx.font = `bold ${fontSize}px 'Microsoft YaHei', 'SimSun', sans-serif`; // 优化中文字体显示
    
    // 为每一列绘制故事字符
    for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const x = i * fontSize;
        const y = drop.position * fontSize;
        
        // 只绘制在画布内的字符
        if (y >= 0 && y <= canvas.height) {
            // 从段落中获取当前字符
            const charIndex = Math.floor(drop.offset) % drop.segment.length;
            const text = drop.segment.charAt(charIndex);
            
            // 根据段落位置和颜色索引调整颜色，使相邻段落颜色相近
            const hue = 150 + (drop.colorIndex * 10) + (charIndex / drop.segment.length * 5);
            ctx.fillStyle = `hsl(${hue}, 100%, ${70 + Math.sin(Date.now() * 0.001) * 10}%)`;
            
            // 绘制字符
            ctx.fillText(text, x, y);
            
            // 更新偏移量，确保字符按顺序显示
            drop.offset += drop.speed * 0.5;
            
            // 如果段落显示完毕，重置到开头
            if (drop.offset >= drop.segment.length) {
                drop.offset = 0;
            }
        }
        
        // 更新位置
        drop.position += drop.speed;
        
        // 如果雨滴超出画布底部，重置为新的故事段落
        if (drop.position * fontSize > canvas.height + 50) {
            const segmentIndex = Math.floor(Math.random() * textSegments.length);
            const segmentText = textSegments[segmentIndex];
            
            // 确保重置时显示段落的开头部分，保持故事连贯性
            drop.segment = segmentText;
            drop.position = -Math.floor(Math.random() * 20);
            drop.offset = 0;
            drop.speed = 0.5 + Math.random() * 0.5;
        }
    }
}

// 动画循环
let matrixInterval;
let lastTime = 0;
const fps = 30;
const interval = 1000 / fps;

function startMatrix(timestamp) {
    // 控制帧率
    if (timestamp - lastTime >= interval) {
        drawMatrix();
        lastTime = timestamp;
    }
    
    matrixInterval = requestAnimationFrame(startMatrix);
}

function stopMatrix() {
    if (matrixInterval) {
        cancelAnimationFrame(matrixInterval);
        matrixInterval = null;
    }
}

// 初始化
function initMatrix() {
    // 更新列数并初始化雨滴
    updateColumns();
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        updateColumns();
    });
    
    // 启动数码雨
    startMatrix();
}

// 暴露控制函数给主脚本
window.matrix = { 
    start: initMatrix, 
    stop: stopMatrix,
    getCurrentSegment: (columnIndex) => {
        if (columnIndex >= 0 && columnIndex < drops.length) {
            return drops[columnIndex].segment;
        }
        return null;
    }
};

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMatrix);
} else {
    initMatrix();
}
