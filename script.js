/**
 * ECOLOGICALhome - Main JavaScript
 * GSAP animations, Lenis smooth scroll, and interactions
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.registerPlugin(ScrollTrigger);

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const preloaderLogo = document.getElementById('preloaderLogo');
    const preloaderFill = document.getElementById('preloaderFill');
    
    const tl = gsap.timeline({
        onComplete: () => {
            gsap.to(preloader, {
                yPercent: -100,
                duration: 0.8,
                ease: 'power4.inOut',
                onComplete: () => { preloader.style.display = 'none'; }
            });
        }
    });
    
    tl.to(preloaderLogo, { opacity: 1, duration: 0.5 })
      .to(preloaderFill, { width: '100%', duration: 1.5, ease: 'power2.inOut' }, '-=0.2')
      .to(preloaderLogo, { opacity: 0, y: -20, duration: 0.3 }, '+=0.2');
}

// ===== LENIS SMOOTH SCROLL =====
function initLenis() {
    if (prefersReducedMotion) return;
    
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false
    });
    
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    
    // Mobile nav smooth scroll
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) lenis.scrollTo(target);
                closeMobileMenu();
            }
        });
    });
    
    // Desktop nav smooth scroll
    document.querySelectorAll('.nav-link, .header-cta, .cta-btn, .cta-btn-light, .cta-btn-secondary, .floating-card').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) lenis.scrollTo(target, { offset: -80 });
            }
        });
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeader() {
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'scrolled', targets: '#header' }
    });
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = scrolled + '%';
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
}

function closeMobileMenu() {
    document.getElementById('hamburger').classList.remove('active');
    document.getElementById('mobileMenu').classList.remove('active');
    document.body.style.overflow = '';
}

// ===== HERO ANIMATIONS =====
function initHero() {
    if (prefersReducedMotion) {
        document.getElementById('heroImageContainer').style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
        document.getElementById('heroImage').style.transform = 'scale(1)';
        gsap.set('.reveal-item', { opacity: 1 });
        gsap.set('.floating-card', { opacity: 1 });
        return;
    }
    
    const tl = gsap.timeline({ delay: 2.5 });
    
    tl.to('#heroImageContainer', {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.8,
        ease: 'power4.inOut'
    })
    .to('#heroImage', { scale: 1, duration: 2.5, ease: 'power2.out' }, '-=1.5')
    .fromTo('.reveal-item', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
        '-=1.2'
    );
    
    // Floating cards animation
    const cards = document.querySelectorAll('.floating-card');
    cards.forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 80, rotation: -3 },
            { opacity: 1, y: 0, rotation: 0, duration: 0.8, delay: 3.5 + (i * 0.12), ease: 'back.out(1.4)' }
        );
        
        gsap.to(card, {
            y: '+=12',
            duration: 2.5 + (i * 0.4),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
        
        // 3D tilt effect on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
            gsap.to(card, { rotateX: y * -12, rotateY: x * 12, transformPerspective: 800, duration: 0.3 });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5 });
        });
    });
    
    // Hero parallax
    gsap.to('#heroImage', {
        y: '20%',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
}

// ===== REVEAL ANIMATIONS =====
function initReveals() {
    if (prefersReducedMotion) return;
    
    // Left reveal
    gsap.utils.toArray('.reveal-left').forEach(el => {
        gsap.fromTo(el, { opacity: 0, x: -80 }, {
            opacity: 1, x: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' }
        });
    });
    
    // Right reveal
    gsap.utils.toArray('.reveal-right').forEach(el => {
        gsap.fromTo(el, { opacity: 0, x: 80 }, {
            opacity: 1, x: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' }
        });
    });
    
    // Up reveal
    gsap.utils.toArray('.reveal-up').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 60 }, {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
        });
    });
    
    // Feature sections - content animation
    gsap.utils.toArray('.feature-content').forEach(el => {
        const children = el.querySelectorAll('.feature-icon-large, .section-label, .section-title, .section-text, .feature-list, .feature-stats, .cta-btn');
        gsap.fromTo(children, 
            { opacity: 0, y: 40 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.7, 
                stagger: 0.1, 
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' }
            }
        );
    });
    
    // Feature images parallax
    gsap.utils.toArray('.feature-image').forEach(el => {
        const img = el.querySelector('img');
        if (img) {
            gsap.fromTo(img, { scale: 1.1 }, {
                scale: 1,
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
            });
        }
    });
    
    // Stat items
    gsap.utils.toArray('.stat-item').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: 0.7,
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        });
    });
    
    // Testimonials
    gsap.utils.toArray('.testimonial-item').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 50 }, {
            opacity: 1, y: 0, duration: 0.7, delay: i * 0.12,
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
        });
    });
}

// ===== COUNTER ANIMATION =====
function initCounters() {
    gsap.utils.toArray('[data-count]').forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        const obj = { val: 0 };
        
        gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true
            },
            onUpdate: () => {
                el.textContent = Math.round(obj.val) + (target > 50 ? '+' : '');
            }
        });
    });
}

// ===== HORIZONTAL SCROLL SECTION =====
function initHorizontalScroll() {
    const wrapper = document.getElementById('horizontalWrapper');
    const section = document.getElementById('story');
    
    if (!wrapper || !section) return;
    
    if (window.innerWidth > 1024 && !prefersReducedMotion) {
        gsap.to(wrapper, {
            x: () => -(wrapper.scrollWidth - window.innerWidth),
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => '+=' + (wrapper.scrollWidth - window.innerWidth),
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });
    }
    
    gsap.utils.toArray('.story-item').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 60 }, {
            opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' }
        });
    });
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    document.querySelectorAll('[data-faq]').forEach(item => {
        const btn = item.querySelector('.faq-question');
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('[data-faq]').forEach(faq => faq.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}

// ===== FLOATING SHAPES PARALLAX =====
function initFloatingShapes() {
    if (prefersReducedMotion) return;
    gsap.utils.toArray('.floating-shape').forEach(shape => {
        gsap.to(shape, {
            y: -120,
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
        });
    });
}

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initLenis();
    initHeader();
    initScrollProgress();
    initMobileMenu();
    
    // Delay hero animations for after preloader
    setTimeout(() => {
        initHero();
        initReveals();
        initCounters();
        initHorizontalScroll();
        initFAQ();
        initFloatingShapes();
    }, 100);
});

// Refresh ScrollTrigger on resize
window.addEventListener('resize', () => { ScrollTrigger.refresh(); });
