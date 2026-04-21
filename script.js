

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMobileNavigation();
    initScrollEffects();
    initCounters();
    initContactForm();
    initSmoothScrolling();
    initIntersectionObserver();
});


function initNavigation() {
    const header = document.querySelector('.header');
    const desktopNav = document.querySelector('.desktop-nav');
    const mobileNav = document.querySelector('.mobile-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            if (desktopNav) {
                desktopNav.style.background = 'rgba(255, 255, 255, 0.98)';
            }
            if (mobileNav) {
                mobileNav.style.background = 'rgba(255, 255, 255, 0.98)';
            }
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
            if (desktopNav) {
                desktopNav.style.background = 'rgba(255, 255, 255, 0.95)';
            }
            if (mobileNav) {
                mobileNav.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        }
    });
}

function initMobileNavigation() {
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileNavHeader = document.querySelector('.mobile-nav-header');
    
    if (mobileNavToggle && mobileNavMenu) {
    
        mobileNavToggle.addEventListener('click', function() {
            mobileNavMenu.classList.toggle('active');
            mobileNavToggle.classList.toggle('active');
            mobileNavHeader.classList.toggle('active');
            
    
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = mobileNavToggle.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            mobileNavToggle.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
        
    
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNavMenu.classList.remove('active');
                mobileNavToggle.classList.remove('active');
                mobileNavHeader.classList.remove('active');
            });
        });
        
    
        document.addEventListener('click', function(e) {
            if (!mobileNavToggle.contains(e.target) && !mobileNavMenu.contains(e.target)) {
                mobileNavMenu.classList.remove('active');
                mobileNavToggle.classList.remove('active');
                mobileNavHeader.classList.remove('active');
            }
        });
        
    
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                mobileNavMenu.classList.remove('active');
                mobileNavToggle.classList.remove('active');
                mobileNavHeader.classList.remove('active');
            }
        });
    }
}


function initScrollEffects() {
    const sections = document.querySelectorAll('section');
    
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

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
}


function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}


function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
    
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            

            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Slanje...';
            submitButton.disabled = true;
            

            fetch('process-form.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification(data.message, 'success');
                    this.reset();
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Došlo je do greške. Molimo pokušajte ponovo kasnije.', 'error');
            })
            .finally(() => {
        
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            });
        });
    }
}


function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    console.log('Found links:', links.length);
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Link clicked:', this.getAttribute('href'));
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                if (targetId === '#home') {
            
                    console.log('Scrolling to top');
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
            
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
        
                console.log('Section not found, scrolling to top');
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            
    
            const mobileNavMenu = document.getElementById('mobileNavMenu');
            const mobileNavToggle = document.getElementById('mobileNavToggle');
            const mobileNavHeader = document.querySelector('.mobile-nav-header');
            if (mobileNavMenu && mobileNavMenu.classList.contains('active')) {
                mobileNavMenu.classList.remove('active');
                mobileNavToggle.classList.remove('active');
                mobileNavHeader.classList.remove('active');
            }

        });
    });
}




function initIntersectionObserver() {
    const animatedElements = document.querySelectorAll('.course-card, .level-card, .contact-item, .feature-item');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
        animationObserver.observe(element);
    });
}


function showNotification(message, type = 'info') {
    
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    
    document.body.appendChild(notification);
    
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}


function validateForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            showFieldError(input, 'Ovo polje je obavezno');
            isValid = false;
        } else if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showFieldError(input, 'Unesite validnu email adresu');
                isValid = false;
            }
        } else {
            clearFieldError(input);
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ef4444';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    `;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}


function initParallax() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}


function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}


function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {

        if (e.key === 'Escape') {
            const mobileNavMenu = document.getElementById('mobileNavMenu');
            const mobileNavToggle = document.getElementById('mobileNavToggle');
            const mobileNavHeader = document.querySelector('.mobile-nav-header');
            
            if (mobileNavMenu && mobileNavMenu.classList.contains('active')) {
                mobileNavMenu.classList.remove('active');
                mobileNavToggle.classList.remove('active');
                mobileNavHeader.classList.remove('active');
            }
        }
    });
}


function initPerformanceOptimizations() {
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
    
        }, 16);
    });
    
    
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
}


function initAnalytics() {
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {

            console.log('Form submitted');
        });
    }
    
    
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {

            console.log('Button clicked:', button.textContent.trim());
        });
    });
}


function initAccessibility() {
    
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Preskočite na glavni sadržaj';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    
    const mainContent = document.querySelector('.hero');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    initParallax();
    initLazyLoading();
    initKeyboardNavigation();
    initPerformanceOptimizations();
    initAnalytics();
    initAccessibility();
});


window.SkolaNemackog = {
    showNotification,
    validateForm,
    initCounters
}; 