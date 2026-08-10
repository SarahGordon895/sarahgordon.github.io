// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Image loading optimization
    const images = document.querySelectorAll('img');
    
    // Add load event listeners to all images
    images.forEach(img => {
        // Add loaded class when image loads
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                img.classList.add('loaded');
            });
            
            // Add error handling
            img.addEventListener('error', function() {
                img.style.background = '#f0f0f0';
                img.classList.add('loaded');
            });
        }
    });
    
    // Progressive image loading for portfolio
    const portfolioImages = document.querySelectorAll('.portfolio-img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Start loading the image if it has data-src
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    // Observe portfolio images for progressive loading
    portfolioImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Loader — respect reduced motion and avoid unnecessary delay
    const loader = document.getElementById('loader');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loaderDelay = prefersReducedMotion ? 0 : 1100;
    setTimeout(() => {
        if (loader) loader.classList.add('hidden');
    }, loaderDelay);

    // Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    function syncMobileNavUI() {
        if (!navToggle || !navMenu) return;
        const open = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (open) {
                if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
        document.body.style.overflow = open ? 'hidden' : '';
    }

    function closeMobileNav() {
        if (!navMenu) return;
        navMenu.classList.remove('active');
        syncMobileNavUI();
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            syncMobileNavUI();
        });

        navToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navMenu.classList.toggle('active');
                syncMobileNavUI();
            }
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileNav();
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileNav();
        }
    });

    // Active navigation link based on scroll position
    function updateActiveNavLink() {
        const navOffset = (document.querySelector('.navbar')?.offsetHeight || 72) + 16;
        const scrollY = window.pageYOffset + navOffset;
        const navLinksAll = document.querySelectorAll('.nav-link');
        navLinksAll.forEach(l => l.classList.remove('active'));

        const sections = [
            document.getElementById('home'),
            ...document.querySelectorAll('main section[id]')
        ].filter(Boolean);

        let current = 'home';
        sections.forEach((section) => {
            const top = section.getBoundingClientRect().top + window.pageYOffset;
            if (scrollY >= top) current = section.id;
        });

        const active = document.querySelector(`.nav-link[href="#${current}"]`);
        if (active) active.classList.add('active');
    }

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink();

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (!navbar) return;
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Typed text effect
    const typedTextElement = document.querySelector('.typed-text');
    const cursor = document.querySelector('.cursor');
    const skills = [
        'Full Stack Developer',
        'Support & Implementation Engineer',
        'UI/UX Designer',
        'Graphic Designer',
        'Technical Project Manager',
        'Web Developer',
        'Digital Product Builder'
    ];
    
    let skillIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        if (!typedTextElement || !cursor) return;
        const currentSkill = skills[skillIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentSkill.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedTextElement.textContent = currentSkill.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentSkill.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            skillIndex = (skillIndex + 1) % skills.length;
            typingSpeed = 500;
        }

        cursor.style.opacity = '1';
        setTimeout(typeEffect, typingSpeed);
    }

    if (typedTextElement && cursor) {
        typeEffect();
    }

    // Simple skills tabs functionality (optional tab markup)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Set first tab as active on page load
    if (tabBtns.length > 0 && tabPanes.length > 0) {
        tabBtns[0].classList.add('active');
        tabPanes[0].classList.add('active');
        
        // Animate first tab skill bars
        setTimeout(() => {
            const skillBars = tabPanes[0].querySelectorAll('.skill-progress');
            skillBars.forEach((bar, index) => {
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, index * 100);
            });
        }, 500);
    }

    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => {
                p.classList.remove('active');
                // Reset all skill bars
                const bars = p.querySelectorAll('.skill-progress');
                bars.forEach(bar => {
                    bar.style.width = '0%';
                });
            });
            
            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
                
                // Animate skill bars in active pane
                setTimeout(() => {
                    const skillBars = targetPane.querySelectorAll('.skill-progress');
                    skillBars.forEach((bar, index) => {
                        const progress = bar.getAttribute('data-progress');
                        setTimeout(() => {
                            bar.style.width = progress + '%';
                        }, index * 100);
                    });
                }, 100);
            }
        });
    });

    // Animate skill bars on initial load
    const activeTabPane = document.querySelector('.tab-pane.active');
    if (activeTabPane) {
        setTimeout(() => {
            const skillBars = activeTabPane.querySelectorAll('.skill-progress');
            skillBars.forEach((bar, index) => {
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = progress + '%';
                    bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                }, index * 100);
            });
        }, 500);
    }

    // Enhanced animations for skills and sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    if (entry.target.classList.contains('skill-item')) {
                        const progressBar = entry.target.querySelector('.skill-progress');
                        if (progressBar) {
                            const progress = progressBar.getAttribute('data-progress');
                            progressBar.style.width = progress + '%';
                            
                            // Add shimmer effect
                            progressBar.style.background = `linear-gradient(90deg, 
                                rgba(102, 126, 234, 0.8) 0%, 
                                rgba(118, 75, 162, 0.9) 50%, 
                                rgba(102, 126, 234, 0.8) 100%)`;
                            progressBar.style.backgroundSize = '200% 100%';
                            progressBar.style.animation = 'shimmer 2s ease-in-out';
                        }
                    }
                    
                    if (entry.target.classList.contains('service-card')) {
                        entry.target.style.animation = 'fadeInUp 0.6s ease forwards, pulse 0.8s ease-in-out';
                    }
                    
                    if (entry.target.classList.contains('portfolio-item')) {
                        entry.target.style.animation = 'fadeInUp 0.6s ease forwards, slideInLeft 0.8s ease-out';
                    }
                    
                    if (entry.target.classList.contains('skills-description')) {
                        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    }
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.skill-item, .service-card, .portfolio-item, .skills-description').forEach(el => {
        observer.observe(el);
    });

    // Portfolio Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show/hide portfolio items based on filter
            portfolioItems.forEach(item => {
                const categories = (item.getAttribute('data-category') || '').trim().split(/\s+/);
                
                if (filter === 'all') {
                    // Show all items with animation
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else if (categories.includes(filter)) {
                    // Show matching items with animation
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    // Hide non-matching items with animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Initialize - show all items on page load
    portfolioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Enhanced contact form functionality
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Validate form
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
            submitBtn.disabled = true;

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' }
            })
                .then((res) => {
                    if (!res.ok) throw new Error('send-failed');
                    showFormMessage('Thank you. Your enquiry has been received — I typically reply within one business day.', 'success');
                    contactForm.reset();
                })
                .catch(() => {
                    const mailtoLink = `mailto:gordonsarah2404@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
                    window.location.href = mailtoLink;
                    showFormMessage('Opening your email client as a fallback. You can also reach me on WhatsApp.', 'error');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }

    // Add input animations
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Smooth scrolling — use viewport position (offsetTop breaks inside <main>)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();

            const navHeight = document.querySelector('.navbar')?.offsetHeight || 72;
            let top = 0;
            if (href !== '#home' && href !== '#main-content') {
                top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
            }

            window.scrollTo({
                top: Math.max(0, top),
                behavior: 'smooth'
            });
            history.pushState(null, '', href);
            closeMobileNav();
        });
    });

    // Smooth scrolling for navigation links
    // Add CSS animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .skill-item,
        .service-card,
        .portfolio-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .portfolio-item {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }
        
        updateCounter();
    }

    // Observe stat numbers for counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const text = entry.target.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (!isNaN(number)) {
                    animateCounter(entry.target, number);
                    entry.target.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Hero must stay in document flow — no parallax (it overlapped About)

    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Contact cards interactions
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add pulse animation to icon
            const icon = this.querySelector('.contact-card-icon');
            if (icon) {
                icon.style.animation = 'pulse 0.6s ease-in-out';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            // Remove pulse animation
            const icon = this.querySelector('.contact-card-icon');
            if (icon) {
                icon.style.animation = '';
            }
        });
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.contact-action-btn') && !e.target.closest('.contact-link')) {
                const ripple = document.createElement('div');
                ripple.className = 'contact-ripple';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(102, 126, 234, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            }
        });
    });
    
    // Social link cards interactions
    const socialLinkCards = document.querySelectorAll('.social-link-card');
    
    socialLinkCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add CSS for animations
    const contactStyle = document.createElement('style');
    contactStyle.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .contact-ripple {
            z-index: 1;
        }
    `;
    document.head.appendChild(contactStyle);

    // Skills Summary animations
    const summaryCards = document.querySelectorAll('.summary-card');
    const summaryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                setTimeout(() => {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    entry.target.classList.add('animated');
                    
                    // Animate proficiency bars if present
                    const proficiencyFills = entry.target.querySelectorAll('.proficiency-fill');
                    proficiencyFills.forEach((fill, fillIndex) => {
                        const width = fill.style.width;
                        fill.style.width = '0%';
                        setTimeout(() => {
                            fill.style.width = width;
                        }, 100 + (fillIndex * 200));
                    });
                }, index * 150);
                summaryObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    summaryCards.forEach(card => {
        summaryObserver.observe(card);
    });
    
    // Tech stack animations
    const techCategories = document.querySelectorAll('.tech-category');
    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                setTimeout(() => {
                    entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                    entry.target.classList.add('animated');
                    
                    // Animate tech items
                    const techItems = entry.target.querySelectorAll('.tech-item');
                    techItems.forEach((item, itemIndex) => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.transition = 'all 0.3s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100 + (itemIndex * 50));
                    });
                }, index * 100);
                techObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    techCategories.forEach(category => {
        techObserver.observe(category);
    });
    
    // Industry tags animation
    const industryTags = document.querySelectorAll('.industry-tag');
    const tagsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const tags = entry.target.querySelectorAll('.industry-tag');
                tags.forEach((tag, index) => {
                    tag.style.opacity = '0';
                    tag.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        tag.style.transition = 'all 0.3s ease';
                        tag.style.opacity = '1';
                        tag.style.transform = 'scale(1)';
                    }, index * 100);
                });
                tagsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    const industrySection = document.querySelector('.industry-tags');
    if (industrySection) {
        tagsObserver.observe(industrySection);
    }
    
    // Add CSS for new animations
    const skillsStyle = document.createElement('style');
    skillsStyle.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .tech-item {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(skillsStyle);

    // Back to top (matches .back-to-top.show in CSS)
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 400) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Portfolio lightbox: keep users on the page when expanding images
    const lightboxStyle = document.createElement('style');
    lightboxStyle.textContent = `
        .sg-lightbox {
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.88);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.25s ease, visibility 0.25s ease;
            padding: 24px;
        }
        .sg-lightbox.active {
            opacity: 1;
            visibility: visible;
        }
        .sg-lightbox img {
            max-width: min(96vw, 1200px);
            max-height: 88vh;
            width: auto;
            height: auto;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .sg-lightbox-close {
            position: absolute;
            top: 16px;
            right: 20px;
            width: 44px;
            height: 44px;
            border: none;
            border-radius: 50%;
            background: rgba(255,255,255,0.15);
            color: #fff;
            font-size: 28px;
            line-height: 1;
            cursor: pointer;
            transition: background 0.2s ease;
        }
        .sg-lightbox-close:hover {
            background: rgba(255,255,255,0.28);
        }
    `;
    document.head.appendChild(lightboxStyle);

    let lightboxEl = null;
    function ensureLightbox() {
        if (lightboxEl) return lightboxEl;
        lightboxEl = document.createElement('div');
        lightboxEl.className = 'sg-lightbox';
        lightboxEl.setAttribute('role', 'dialog');
        lightboxEl.setAttribute('aria-modal', 'true');
        lightboxEl.setAttribute('aria-label', 'Image preview');
        lightboxEl.innerHTML = '<button type="button" class="sg-lightbox-close" aria-label="Close">&times;</button><img src="" alt="">';
        document.body.appendChild(lightboxEl);

        const img = lightboxEl.querySelector('img');
        const closeBtn = lightboxEl.querySelector('.sg-lightbox-close');

        function closeLightbox() {
            lightboxEl.classList.remove('active');
            document.body.style.overflow = '';
            img.removeAttribute('src');
            img.alt = '';
        }

        closeBtn.addEventListener('click', closeLightbox);
        lightboxEl.addEventListener('click', (e) => {
            if (e.target === lightboxEl) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxEl.classList.contains('active')) {
                closeLightbox();
            }
        });

        return lightboxEl;
    }

    document.querySelectorAll('a.portfolio-lightbox').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (!href) return;
            const root = link.closest('.portfolio-image');
            const thumb = root ? root.querySelector('.portfolio-img') : null;
            const box = ensureLightbox();
            const img = box.querySelector('img');
            img.src = href;
            img.alt = thumb ? thumb.getAttribute('alt') || '' : '';
            box.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
});
