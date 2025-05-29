// 导出PDF功能
function exportToPDF() {
    // 显示导出提示
    const exportBtn = document.querySelector('.export-btn');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 准备导出...';
    exportBtn.disabled = true;

    // 隐藏导航栏
    const navbar = document.querySelector('.navbar');
    navbar.style.display = 'none';

    // 调整主内容边距
    const mainContent = document.querySelector('.main-content');
    mainContent.style.marginTop = '0';

    // 添加打印类
    document.body.classList.add('printing');

    // 确保所有样式都已应用
    setTimeout(() => {
        // 使用浏览器的打印功能
        window.print();

        // 恢复导航栏和边距
        setTimeout(() => {
            navbar.style.display = 'block';
            mainContent.style.marginTop = '80px';
            document.body.classList.remove('printing');
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
        }, 1000);
    }, 500);
}

// 平滑滚动功能
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加滚动动画效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察所有区块
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // 添加键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        // Ctrl+P 导出PDF
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            exportToPDF();
        }
    });

    // 添加鼠标滚轮平滑滚动
    let isScrolling = false;
    document.addEventListener('wheel', function(e) {
        if (isScrolling) return;

        // 检测是否是大幅滚动（可能是想要跳转到下一个区块）
        if (Math.abs(e.deltaY) > 100) {
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    });

    // 添加导航提示
    console.log('💡 提示：');
    console.log('- 点击右上角按钮或按 Ctrl+P 导出PDF');
    console.log('- 页面已优化为适合PDF导出的格式');
    console.log('- 每个区块对应一个逻辑页面');
});

// 添加页面性能监控
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`📊 页面加载完成，耗时: ${Math.round(loadTime)}ms`);
});

// 添加错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

// 添加打印前的优化
window.addEventListener('beforeprint', function() {
    console.log('🖨️ 准备打印/导出PDF...');

    // 确保所有图片都已加载
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            console.warn('图片未完全加载:', img.src);
        }
    });

    // 优化打印样式
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
    console.log('✅ 打印/导出完成');
    document.body.classList.remove('printing');
});

// 添加响应式检测
function checkResponsive() {
    const width = window.innerWidth;
    if (width < 768) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}

window.addEventListener('resize', checkResponsive);
checkResponsive(); // 初始检测

// 添加主题切换功能（可选）
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// 恢复主题设置
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// 添加页面可见性检测
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('页面隐藏');
    } else {
        console.log('页面可见');
    }
});

// 添加复制文本功能
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('文本已复制到剪贴板');
    }).catch(function(err) {
        console.error('复制失败:', err);
    });
}

// 添加分享功能
function shareContent() {
    if (navigator.share) {
        navigator.share({
            title: 'Web后端总监竞聘方案',
            text: 'AI时代的技术领导者竞聘方案',
            url: window.location.href
        }).then(() => {
            console.log('分享成功');
        }).catch((error) => {
            console.log('分享失败:', error);
        });
    } else {
        // 降级到复制链接
        copyToClipboard(window.location.href);
        alert('链接已复制到剪贴板');
    }
}

// 添加全屏功能
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('无法进入全屏模式:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// 添加页面统计
let pageStats = {
    startTime: Date.now(),
    scrollCount: 0,
    clickCount: 0
};

document.addEventListener('scroll', function() {
    pageStats.scrollCount++;
});

document.addEventListener('click', function() {
    pageStats.clickCount++;
});

// 页面卸载时显示统计
window.addEventListener('beforeunload', function() {
    const duration = Date.now() - pageStats.startTime;
    console.log('📈 页面统计:');
    console.log(`- 浏览时长: ${Math.round(duration / 1000)}秒`);
    console.log(`- 滚动次数: ${pageStats.scrollCount}`);
    console.log(`- 点击次数: ${pageStats.clickCount}`);
});
