// ===========================
// Navigation Functionality
// ===========================

const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');

// Navbar scroll effect
function handleScroll() {
    if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Throttle scroll event for performance
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            handleScroll();
            setActiveLink();
            handleParallax();
            isScrolling = false;
        });
        isScrolling = true;
    }
}, { passive: true });

// Active navigation link based on scroll position
function setActiveLink() {
    const sections = document.querySelectorAll('section');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 200)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 60;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu if open
        closeMenu();
    });
});

// Hamburger menu toggle
if (hamburger) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        
        if (navLinksContainer.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// Close menu function
function closeMenu() {
    navLinksContainer.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container') && navLinksContainer.classList.contains('active')) {
        closeMenu();
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinksContainer.classList.contains('active')) {
        closeMenu();
    }
});

// ===========================
// Smooth Reveal Animations
// ===========================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Initialize all reveal elements
function initRevealAnimations() {
    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // Hero content reveals immediately on load
    document.querySelectorAll('.fade-in-up').forEach(el => {
        el.classList.add('active');
    });

    // Add staggered delays to grid items
    document.querySelectorAll('.modules-grid, .values-grid, .health-dimensions').forEach(grid => {
        const items = Array.from(grid.children);
        items.forEach((item, index) => {
            item.classList.add('reveal');
            item.style.transitionDelay = `${index * 0.08}s`;
            observer.observe(item);
        });
    });

    // Add reveal to commitment lists
    document.querySelectorAll('.commitment-list li').forEach((item, index) => {
        item.classList.add('reveal');
        item.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(item);
    });
}

// ===========================
// Parallax Effect (Optimized)
// ===========================
function handleParallax() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && window.scrollY < window.innerHeight) {
        const yPos = window.scrollY * 0.15;
        const opacity = 1 - (window.scrollY / 700);
        heroContent.style.transform = `translate3d(0, ${yPos}px, 0)`;
        heroContent.style.opacity = Math.max(opacity, 0);
    }
}

// ===========================
// Enhanced Interactions
// ===========================

// Add hover effect to module cards
document.querySelectorAll('.module-card, .value-card, .health-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
});

// Reading progress bar
function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(to right, var(--maroon-primary), var(--maroon-vibrant));
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true });
}

// Smooth scroll to top button
function createScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--maroon-primary);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(128, 0, 0, 0.3);
    `;
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(128, 0, 0, 0.4)';
    });

    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(128, 0, 0, 0.3)';
    });
}

// Add copy animation to text selections
function enhanceTextSelection() {
    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            // Optional: Add visual feedback for text selection
        }
    });
}

// ===========================
// Photo Gallery Slider
// ===========================

function initGallerySlider() {
    const track = document.querySelector('.gallery-track');
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.gallery-dots');
    
    // Check if all elements exist
    if (!track || !slides.length || !prevBtn || !nextBtn || !dotsContainer) {
        console.log('Gallery slider elements not found');
        return;
    }
    
    let currentIndex = 0;
    let autoPlayInterval = null;
    const autoPlayDelay = 4000; // 4 seconds
    let isTransitioning = false;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('gallery-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.gallery-dot');
    
    function updateSlider() {
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Update track position
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Reset transition lock after animation
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }
    
    function goToSlide(index) {
        if (isTransitioning || index === currentIndex) return;
        currentIndex = index;
        updateSlider();
        resetAutoPlay();
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    }
    
    function startAutoPlay() {
        stopAutoPlay(); // Clear any existing interval
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Event listeners for buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
            resetAutoPlay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
            resetAutoPlay();
        });
    }
    
    // Pause on hover
    const sliderContainer = track.parentElement;
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoPlay);
        sliderContainer.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Keyboard navigation
    let keyboardListener = (e) => {
        // Only trigger if not typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    };
    
    document.addEventListener('keydown', keyboardListener);
    
    // Start autoplay
    startAutoPlay();
    
    console.log('Gallery slider initialized successfully');
}

// ===========================
// Expandable Value Cards
// ===========================

function initExpandableValues() {
    const valueCards = document.querySelectorAll('.value-detailed-card');
    
    valueCards.forEach(card => {
        const header = card.querySelector('.value-header');
        
        header.addEventListener('click', () => {
            // Toggle current card
            const isExpanded = card.classList.contains('expanded');
            
            // Optional: Close other cards (accordion style)
            // valueCards.forEach(c => c.classList.remove('expanded'));
            
            // Toggle current card
            if (isExpanded) {
                card.classList.remove('expanded');
            } else {
                card.classList.add('expanded');
            }
        });
    });
}

// ===========================
// Smooth Hover Effects
// ===========================

function addSmoothHoverEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.gallery-btn, #scroll-to-top');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================
// Section Progress Indicators
// ===========================

function createSectionProgress() {
    const sections = document.querySelectorAll('section[id]');
    let currentSectionIndex = 0;
    
    window.addEventListener('scroll', () => {
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
                currentSectionIndex = index;
            }
        });
    }, { passive: true });
}

// ===========================
// Initialize Everything
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initRevealAnimations();
    createReadingProgress();
    createScrollToTop();
    enhanceTextSelection();
    initGallerySlider();
    initExpandableValues();
    addSmoothHoverEffects();
    createSectionProgress();
    handleScroll();
    setActiveLink();
    
    console.log('✨ Enhanced UI/UX loaded successfully!');
});
