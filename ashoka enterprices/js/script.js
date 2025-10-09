// Load HTML sections and components
async function loadHTML(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        // Provide fallback content
        document.getElementById(elementId).innerHTML = `
            <div style="padding: 20px; text-align: center; color: #e11d48;">
                <p>Error loading section. Please refresh the page.</p>
            </div>
        `;
    }
}

// Load all components and sections
async function loadAllSections() {
    try {
        // Load all sections in parallel for faster loading
        await Promise.all([
            loadHTML('header-container', 'sections/components/header.html'),
            loadHTML('about-container', 'sections/about.html'),
            loadHTML('services-container', 'sections/services.html'),
            loadHTML('products-container', 'sections/products.html'),
            loadHTML('testimonials-container', 'sections/testimonials.html'),
            loadHTML('contact-container', 'sections/contact.html'),
            loadHTML('footer-container', 'sections/components/footer.html'),
            loadHTML('floating-button-container', 'sections/components/floating_button.html')
        ]);

        // Initialize after loading
        initializeApp();

    } catch (error) {
        console.error('Error loading sections:', error);
    }
}

function initializeApp() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const mobileNav = document.querySelector('.mobile-nav');
                if (mobileNav) {
                    mobileNav.classList.remove('active');
                    const toggle = document.querySelector('.mobile-menu-toggle i');
                    if (toggle) {
                        toggle.classList.remove('fa-times');
                        toggle.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (mobileNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        let current = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNav);

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };

            // Show success message
            const formSuccess = document.getElementById('formSuccess');
            if (formSuccess) {
                formSuccess.style.display = 'flex';

                // Reset form
                contactForm.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
            }

            // Log form data (in production, send to server/email service)
            console.log('Form submitted:', formData);

            // Here you would typically send the data to your backend
            // Example: sendToServer(formData);
        });
    }

    // Add scroll animation to elements
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

    // Observe elements for animation
    setTimeout(() => {
        document.querySelectorAll('.card, .service-card, .product-card, .advantage-card, .stat-card, .warranty-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }, 100);

    // Header scroll effect
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    // Initialize testimonials slider
    initializeTestimonials();

    // Initialize Swiper for projects section
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.testimonial-slider', {
            // Enable infinite loop
            loop: true,

            // Autoplay configuration
            autoplay: {
                delay: 2000,
                disableOnInteraction: false, // Continue autoplay after user interaction
                pauseOnMouseEnter: true, // Pause when hovering
            },

            // Space between slides
            spaceBetween: 30,

            // Responsive breakpoints
            breakpoints: {
                // Mobile devices (less than 768px)
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // Tablets (768px and up)
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25
                },
                // Desktop (1024px and up)
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            },

            speed: 800,

            // Allow dragging/swiping
            grabCursor: true,

            // Center slides
            centeredSlides: false,
        });
    }
}

function initializeTestimonials() {
    const container = document.querySelector('.testimonial-container');
    const track = document.querySelector('.testimonial-track');

    if (!container || !track) return;

    let currentTranslate = 0;
    let isAnimating = true;
    let animationId;
    let isDragging = false;
    let startX, startTranslate;

    function startAnimation() {
        if (!isAnimating) {
            isAnimating = true;
            requestAnimationFrame(animate);
        }
    }

    function stopAnimation() {
        isAnimating = false;
        cancelAnimationFrame(animationId);
    }

    function animate() {
        currentTranslate -= 0.02; // Adjust speed for smooth animation
        if (currentTranslate <= -50) currentTranslate += 50;
        track.style.transform = `translateX(${currentTranslate}%)`;
        if (isAnimating) {
            animationId = requestAnimationFrame(animate);
        }
    }

    startAnimation();

    // Pause on hover
    container.addEventListener('mouseenter', stopAnimation);
    container.addEventListener('mouseleave', startAnimation);

    // Pause on touch
    container.addEventListener('touchstart', stopAnimation, { passive: true });
    container.addEventListener('touchend', startAnimation, { passive: true });

    // Mouse drag
    container.addEventListener('mousedown', (e) => {
        stopAnimation();
        isDragging = true;
        startX = e.clientX;
        startTranslate = currentTranslate;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaPercent = (deltaX / container.clientWidth) * 100;
        currentTranslate = startTranslate + deltaPercent;
        if (currentTranslate <= -50) currentTranslate += 50;
        else if (currentTranslate > 0) currentTranslate -= 50;
        track.style.transform = `translateX(${currentTranslate}%)`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            startAnimation();
        }
    });

    // Touch drag
    container.addEventListener('touchstart', (e) => {
        stopAnimation();
        isDragging = true;
        startX = e.touches[0].clientX;
        startTranslate = currentTranslate;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        const deltaPercent = (deltaX / container.clientWidth) * 100;
        currentTranslate = startTranslate + deltaPercent;
        if (currentTranslate <= -50) currentTranslate += 50;
        else if (currentTranslate > 0) currentTranslate -= 50;
        track.style.transform = `translateX(${currentTranslate}%)`;
    }, { passive: true });

    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            startAnimation();
        }
    });
}

// Load everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllSections);
} else {
    loadAllSections();
}