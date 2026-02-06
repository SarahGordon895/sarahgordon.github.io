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
    
    // Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);

    // Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
            document.body.style.overflow = '';
        }
    });

    // Active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Call once on load

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
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
        'UI/UX Designer',
        'Web Developer',
        'Technical Project Manager',
        'Graphic Designer'
    ];
    
    let skillIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
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

    typeEffect();

    // Simple skills tabs functionality with debugging
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    console.log('Tab buttons found:', tabBtns.length);
    console.log('Tab panes found:', tabPanes.length);

    // Set first tab as active on page load
    if (tabBtns.length > 0 && tabPanes.length > 0) {
        console.log('Initializing first tab');
        tabBtns[0].classList.add('active');
        tabPanes[0].classList.add('active');
        
        // Animate first tab skill bars
        setTimeout(() => {
            const skillBars = tabPanes[0].querySelectorAll('.skill-progress');
            console.log('Skill bars in first tab:', skillBars.length);
            skillBars.forEach((bar, index) => {
                const progress = bar.getAttribute('data-progress');
                console.log('Setting progress for skill:', progress);
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, index * 100);
            });
        }, 500);
    }

    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            console.log('Tab clicked:', targetTab);
            
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
            console.log('Target pane found:', !!targetPane);
            if (targetPane) {
                targetPane.classList.add('active');
                
                // Animate skill bars in active pane
                setTimeout(() => {
                    const skillBars = targetPane.querySelectorAll('.skill-progress');
                    console.log('Skill bars in target pane:', skillBars.length);
                    skillBars.forEach((bar, index) => {
                        const progress = bar.getAttribute('data-progress');
                        console.log('Animating skill with progress:', progress);
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
                const category = item.getAttribute('data-category');
                
                if (filter === 'all') {
                    // Show all items with animation
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else if (category === filter) {
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

    // Portfolio filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
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
            
            // Create mailto link
            const mailtoLink = `mailto:gordonsarah2404@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate sending (in real implementation, this would send to a server)
            setTimeout(() => {
                // Open email client
                window.location.href = mailtoLink;
                
                // Show success message
                showFormMessage('Thank you for your message! Your email client has been opened to send the email.', 'success');
                
                // Reset form
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
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

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
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

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

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

    // Initialize tooltips or other interactive elements as needed
    console.log('Sarah Gordon Portfolio - Loaded successfully!');
});
