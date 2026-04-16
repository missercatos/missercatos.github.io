// 基于 Canvas 的故事文字雨实现 - 简化优化版本
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
// 雨滴结构
const fontSize = 16; // 减小字体，增加可读性
let drops = [];
let activeDrops = 10; // 最终保留10条文字雨
// 动画状态
let startTime = Date.now();
let initialPhase = true; // 初始密集阶段
let transitionDuration = 8000; // 8秒过渡时间
// 创建新的雨滴
function createDrop() {
    // 随机选择一个段落
    const segmentIndex = Math.floor(Math.random() * textSegments.length);
    const segment = textSegments[segmentIndex];
    
    // 随机选择段落的起始位置
    const startPos = Math.floor(Math.random() * Math.max(1, segment.length - 30));
    
    return {
        text: segment,
        x: Math.random() * canvas.width,
        y: -Math.random() * canvas.height * 2, // 从上方开始
        speed: 0.8 + Math.random() * 0.8, // 中等速度
        offset: startPos,
        color: `hsl(${150 + Math.random() * 30}, 100%, 70%)`, // 青绿色调
        opacity: 0.9 + Math.random() * 0.1,
        targetY: canvas.height + 100 // 目标位置
    };
}
// 初始化雨滴
function initDrops() {
    drops = [];
    
    // 初始创建大量雨滴（约80个）
    const initialDrops = Math.min(80, Math.floor(canvas.width / fontSize) * 3);
    for (let i = 0; i < initialDrops; i++) {
        drops.push(createDrop());
    }
}
// 更新雨滴数量 - 从密集逐渐减少到10条
function updateDropCount() {
    const elapsedTime = Date.now() - startTime;
    
    if (initialPhase && elapsedTime > transitionDuration) {
        initialPhase = false;
    }
    
    if (initialPhase) {
        // 在过渡期间，线性减少雨滴数量
        const progress = elapsedTime / transitionDuration;
        const currentDrops = Math.max(activeDrops, Math.floor(drops.length * (1 - progress * 0.9)));
        
        // 逐渐移除雨滴
        if (drops.length > currentDrops) {
            drops.splice(currentDrops);
        }
    } else {
        // 稳定阶段，确保有10个雨滴
        while (drops.length < activeDrops) {
            drops.push(createDrop());
        }
        
        // 移除多余的雨滴
        if (drops.length > activeDrops) {
            drops.splice(activeDrops);
        }
    }
}
// 绘制函数
function draw() {
    // 使用非常浅的背景覆盖，几乎看不到重影
    ctx.fillStyle = 'rgba(10, 10, 18, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 更新雨滴数量
    updateDropCount();
    
    // 设置字体
    ctx.font = `${fontSize}px 'Microsoft YaHei', 'SimSun', sans-serif`;
    
    // 绘制每个雨滴
    for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        
        // 雨滴当前位置
        const currentY = drop.y;
        
        // 绘制一行文字（从偏移位置开始取10-20个字符）
        const charsToShow = 15 + Math.floor(Math.random() * 10);
        let displayText = "";
        
        // 从当前偏移位置开始取字符
        for (let j = 0; j < charsToShow; j++) {
            const charIndex = (drop.offset + j) % drop.text.length;
            displayText += drop.text.charAt(charIndex);
        }
        
        // 设置颜色和透明度
        ctx.fillStyle = drop.color;
        ctx.globalAlpha = drop.opacity;
        
        // 绘制文字
        ctx.fillText(displayText, drop.x, currentY);
        
        // 更新雨滴位置
        drop.y += drop.speed;
        drop.offset += 0.3; // 缓慢移动文字偏移
        
        // 如果雨滴完全移出屏幕，重置它
        if (drop.y > drop.targetY) {
            // 重新创建雨滴
            Object.assign(drop, createDrop());
        }
    }
    
    // 重置全局透明度
    ctx.globalAlpha = 1.0;
}
// 动画循环
let animationId;
let lastTime = 0;
const fps = 30;
const frameInterval = 1000 / fps;
function animate(timestamp) {
    // 控制帧率
    if (timestamp - lastTime >= frameInterval) {
        draw();
        lastTime = timestamp;
    }
    
    animationId = requestAnimationFrame(animate);
}
// 初始化并开始动画
function init() {
    startTime = Date.now();
    initialPhase = true;
    initDrops();
    animate(0);
}
// 窗口大小变化时重新初始化
window.addEventListener('resize', () => {
    resizeCanvas();
    initDrops();
});
// 暴露控制函数
window.matrix = {
    start: init,
    stop: () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }
};
// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
