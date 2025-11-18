// 导航栏平滑滚动
function scrollToSection(event, sectionId) {
    event.preventDefault();
    
    // 更新导航栏活动状态
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // 平滑滚动到目标区域
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 返回按钮功能
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        alert('这是第一个页面');
    }
}

// 监听滚动，自动更新导航栏活动状态
function updateActiveNav() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
}

// 添加滚动监听
const mainContent = document.querySelector('.main-content');
if (mainContent) {
    mainContent.addEventListener('scroll', updateActiveNav);
}

// 图片上传功能（可选）
const profileImg = document.getElementById('profileImg');
if (profileImg) {
    profileImg.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    profileImg.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
    });
}

// 页面加载完成提示
window.addEventListener('load', function() {
    console.log('个人简历页面加载完成');
});

// 技能卡片点击反馈
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
    card.addEventListener('click', function() {
        console.log('点击了技能卡片:', this.querySelector('h3').textContent);
    });
});

// 添加作品集项目点击功能
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach(item => {
    item.addEventListener('click', function() {
        alert('点击查看作品详情（此处可添加弹窗或跳转功能）');
    });
});

// 打印简历功能
function printResume() {
    window.print();
}

// 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // Ctrl+P 打印简历
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        printResume();
    }
    
    // Esc 键返回
    if (e.key === 'Escape') {
        goBack();
    }
});

// 添加联系方式点击复制功能
const contactValues = document.querySelectorAll('.contact-item .value');
contactValues.forEach(value => {
    value.addEventListener('click', function() {
        const text = this.textContent;
        
        // 复制到剪贴板
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                // 显示复制成功提示
                showToast('已复制: ' + text);
            });
        }
    });
    
    // 添加复制提示样式
    value.style.cursor = 'pointer';
    value.title = '点击复制';
});

// 显示Toast提示
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2c3e50;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        font-size: 14px;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 2000);
}

// 响应式导航栏折叠（移动端）
function initResponsiveNav() {
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const navMenu = document.querySelector('.nav-menu');
        
        // 可以添加移动端导航栏折叠功能
        navMenu.style.flexDirection = 'row';
        navMenu.style.overflowX = 'auto';
    }
}

window.addEventListener('resize', initResponsiveNav);
initResponsiveNav();

// 项目经历展开/折叠功能
function toggleExpand(headerElement) {
    const timelineContent = headerElement.closest('.timeline-content');
    
    if (timelineContent && timelineContent.classList.contains('expandable')) {
        timelineContent.classList.toggle('expanded');
        
        // 添加动画反馈
        const icon = headerElement.querySelector('.expand-icon');
        if (icon) {
            icon.style.transform = timelineContent.classList.contains('expanded') 
                ? 'rotate(180deg)' 
                : 'rotate(0deg)';
        }
        
        // 日志记录
        const projectName = headerElement.querySelector('h3').textContent;
        console.log(`项目 "${projectName}" ${timelineContent.classList.contains('expanded') ? '展开' : '折叠'}`);
    }
}

// 全部展开/折叠功能（可选）
function expandAll() {
    const expandableItems = document.querySelectorAll('.timeline-content.expandable');
    expandableItems.forEach(item => {
        item.classList.add('expanded');
    });
    console.log('已展开所有项目经历');
}

function collapseAll() {
    const expandableItems = document.querySelectorAll('.timeline-content.expandable');
    expandableItems.forEach(item => {
        item.classList.remove('expanded');
    });
    console.log('已折叠所有项目经历');
}

// 添加键盘快捷键：Ctrl+E 展开所有，Ctrl+Shift+E 折叠所有
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        if (e.shiftKey) {
            collapseAll();
        } else {
            expandAll();
        }
    }
});