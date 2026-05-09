// ============================================
// REGALSTUDIO - MAIN JAVASCRIPT
// Interactivity & Dynamic Features
// ============================================

// ---------- WAIT FOR DOM TO LOAD ----------
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== 0. LOAD USER SESSION TO NAVBAR ==========
    loadUserNavbar();
    
    // ========== 1. NAVBAR SCROLL EFFECT ==========
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // ========== 2. HAMBURGER MENU (MOBILE) ==========
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
    
    // ========== 3. ANIMATED STATISTICS COUNTER ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateNumbers() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const suffix = stat.nextElementSibling?.classList.contains('stat-suffix') ? stat.nextElementSibling : null;
            
            // Check if already animated
            if (stat.classList.contains('animated')) return;
            
            const updateCounter = () => {
                const current = parseInt(stat.innerText);
                const increment = target / 50;
                
                if (current < target) {
                    stat.innerText = Math.ceil(current + increment);
                    setTimeout(updateCounter, 20);
                } else {
                    stat.innerText = target;
                    stat.classList.add('animated');
                }
            };
            
            updateCounter();
        });
    }
    
    // Trigger counter when stats section is in view
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // ========== 4. SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== "#" && href !== "#!" && href !== "javascript:void(0)") {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ========== 5. DARK MODE TOGGLE (Optional) ==========
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('regalstudio-theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
    
    // Function to toggle dark mode (call this from a button if you add one)
    window.toggleDarkMode = function() {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('regalstudio-theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('regalstudio-theme', 'dark');
        }
    };
    
    // ========== 6. SERVICE CARD ANIMATION ON SCROLL ==========
    const serviceCards = document.querySelectorAll('.service-card, .testimonial-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
    
    // ========== 7. TYPING EFFECT FOR HERO (Optional) ==========
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle && heroTitle.classList.contains('typing-effect')) {
        const originalText = heroTitle.innerText;
        heroTitle.innerText = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.innerText += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        typeWriter();
    }
    
    // ========== 8. BACK TO TOP BUTTON (Create if not exists) ==========
    let backToTop = document.querySelector('.back-to-top');
    
    if (!backToTop) {
        backToTop = document.createElement('button');
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.className = 'back-to-top';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.4);
            transition: all 0.3s ease;
            z-index: 999;
        `;
        document.body.appendChild(backToTop);
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        }
    });
    
    // ========== 9. PRELOADER (Optional - remove after load) ==========
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }, 500);
    }
    
    // ========== 10. ACTIVE NAV LINK HIGHLIGHT ==========
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else if (currentPage === '' && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });
    
    // ========== 11. FORM VALIDATION UTILITY ==========
    window.validateEmail = function(email) {
        const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return re.test(email);
    };
    
    window.validatePhone = function(phone) {
        const re = /^[0-9]{10,13}$/;
        return re.test(phone);
    };
    
    window.showNotification = function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.875rem;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
        `;
        
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    };
    
    // ========== 12. CONSOLE WELCOME MESSAGE ==========
    console.log('%c✨ RegalStudio ✨', 'color: #8B5CF6; font-size: 20px; font-weight: bold;');
    console.log('%cJasa Website, Desain, Edit Video, Writer & E-book', 'color: #64748B; font-size: 12px;');
    console.log('%cReady to serve you!', 'color: #0EA5E9; font-size: 14px;');
    
});

// ========== FUNCTION: LOAD USER SESSION TO NAVBAR ==========
function loadUserNavbar() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;
    
    // Get session from localStorage or sessionStorage
    const session = JSON.parse(localStorage.getItem('regalstudio_session') || sessionStorage.getItem('regalstudio_session') || 'null');
    
    if (session && session.email) {
        // User is logged in
        const users = JSON.parse(localStorage.getItem('regalstudio_users') || '[]');
        const admins = JSON.parse(localStorage.getItem('regalstudio_admins') || '[]');
        
        // Cek apakah user adalah admin
        const isAdmin = session.role === 'admin';
        let userData = null;
        let userName = '';
        let userAvatar = null;
        
        if (isAdmin) {
            // Cari di data admins
            userData = admins.find(a => a.email === session.email);
            userName = userData?.name || session.name || 'Administrator';
            userAvatar = userData?.avatar || null;
        } else {
            // Cari di data users
            userData = users.find(u => u.email === session.email);
            userName = userData?.name || session.name || session.email.split('@')[0];
            userAvatar = userData?.avatar || null;
        }
        
        // Badge untuk admin
        const adminBadge = isAdmin ? '<span style="background:#EF4444; color:white; font-size:0.7rem; padding:0.15rem 0.5rem; border-radius:50px; margin-left:0.5rem;">Admin</span>' : '';
        
        // Dropdown menu berdasarkan role
        let dropdownMenu = '';
        if (isAdmin) {
            dropdownMenu = `
                <a href="../admin/index.html">
                    <i class="fas fa-tachometer-alt"></i> Dashboard Admin
                </a>
                <a href="../admin/orders.html">
                    <i class="fas fa-shopping-bag"></i> Kelola Pesanan
                </a>
                <a href="../admin/services.html">
                    <i class="fas fa-cog"></i> Kelola Layanan
                </a>
                <a href="../admin/manage-admins.html">
                    <i class="fas fa-users-cog"></i> Kelola Admin
                </a>
                <div class="divider"></div>
                <a href="#" id="navbarLogoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            `;
        } else {
            dropdownMenu = `
                <a href="../dashboard/index.html">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
                <a href="../dashboard/profile.html">
                    <i class="fas fa-user-circle"></i> Profil Saya
                </a>
                <a href="../dashboard/orders.html">
                    <i class="fas fa-shopping-bag"></i> Pesanan Saya
                </a>
                <div class="divider"></div>
                <a href="#" id="navbarLogoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            `;
        }
        
        navActions.innerHTML = `
            <div class="user-menu">
                <div class="user-avatar-small">
                    ${userAvatar ? `<img src="${userAvatar}" alt="Avatar">` : '<i class="fas fa-user"></i>'}
                </div>
                <span class="user-name">${userName}${adminBadge}</span>
                <i class="fas fa-chevron-down" style="font-size: 0.75rem; color: var(--gray);"></i>
                <div class="user-dropdown">
                    ${dropdownMenu}
                </div>
            </div>
        `;
        
        // Add logout event listener
        const logoutBtn = document.getElementById('navbarLogoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('regalstudio_session');
                sessionStorage.removeItem('regalstudio_session');
                window.location.reload();
            });
        }
        
    } else {
        // User is not logged in
        navActions.innerHTML = `
            <div class="auth-buttons">
                <a href="login.html" class="btn-login-nav">
                    <i class="fas fa-sign-in-alt"></i> Masuk
                </a>
                <a href="register.html" class="btn-register-nav">
                    <i class="fas fa-user-plus"></i> Daftar
                </a>
                <div class="hamburger" id="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        // Re-attach hamburger event
        const newHamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        if (newHamburger && navMenu) {
            newHamburger.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                newHamburger.classList.toggle('active');
            });
            
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    newHamburger.classList.remove('active');
                });
            });
        }
    }
}

// ========== 13. WINDOW LOAD HANDLER ==========
window.addEventListener('load', function() {
    document.body.style.visibility = 'visible';
    
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
    });
    
    // Reload user navbar after page load (to ensure consistency)
    loadUserNavbar();
});

// ========== 14. RESIZE HANDLER ==========
let resizeTimer;
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('navMenu');
        const hamburger = document.getElementById('hamburger');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    }
});