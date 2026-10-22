// ==========================================================================
// Cassara Tech - Core Scripts & Interactions
// ==========================================================================

// Scroll Video Control (Smooth scroll-tied video seeking)
const video = document.getElementById('scroll-video');
const heroScrollContainer = document.querySelector('.hero-scroll-container');

let targetTime = 0;
let currentTime = 0;

// Phone Mockup animation variables
const phoneMockup = document.querySelector('.phone-mockup');
const mockupContainer = document.querySelector('.mockup-container');
let targetRotateY = -25;
let targetRotateX = 8;
let currentRotateY = -25;
let currentRotateX = 8;

// Force browser to load video for seeking
if (video) {
    video.addEventListener('loadedmetadata', () => {
        video.pause();
    });
}

function updateVideo() {
    if (window.innerWidth > 600 && video && video.readyState >= 1 && video.duration) {
        // Calculate scroll progress within hero container
        const startScroll = heroScrollContainer.offsetTop;
        const scrollDistance = heroScrollContainer.offsetHeight - window.innerHeight;
        
        let progress = (window.scrollY - startScroll) / scrollDistance;
        progress = Math.max(0, Math.min(1, progress));
        
        targetTime = progress * video.duration;
        
        // Easing for smooth playback without harsh jumps
        currentTime += (targetTime - currentTime) * 0.15;
        
        // Only update if difference is noticeable
        if (Math.abs(currentTime - video.currentTime) > 0.01) {
            video.currentTime = currentTime;
        }
    }

    // Mobile phone mockup tilt logic
    if (window.innerWidth <= 600 && phoneMockup && mockupContainer) {
        const rect = mockupContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        let progress = (windowHeight * 0.65 - rect.top) / (windowHeight * 0.5);
        progress = Math.max(0, Math.min(1, progress));
        
        targetRotateY = -25 + (25 * progress);
        targetRotateX = 8 - (8 * progress);
        
        currentRotateY += (targetRotateY - currentRotateY) * 0.1;
        currentRotateX += (targetRotateX - currentRotateX) * 0.1;
        
        phoneMockup.style.transition = 'none';
        phoneMockup.style.transform = `scale(0.9) rotateY(${currentRotateY}deg) rotateX(${currentRotateX}deg)`;
    } else if (phoneMockup && window.innerWidth > 600) {
        if (phoneMockup.style.transform !== '') {
            phoneMockup.style.transition = '';
            phoneMockup.style.transform = '';
            currentRotateY = -25;
            currentRotateX = 8;
        }
    }

    requestAnimationFrame(updateVideo);
}

// Start render loop
requestAnimationFrame(updateVideo);

// Mobile image swap logic (screens <= 600px)
const heroImages = document.querySelectorAll('.hero-images img');
let currentImageIndex = 0;

if (heroImages.length > 0) {
    setInterval(() => {
        if (window.innerWidth <= 600) {
            heroImages[currentImageIndex].classList.remove('active');
            currentImageIndex = (currentImageIndex + 1) % heroImages.length;
            heroImages[currentImageIndex].classList.add('active');
        }
    }, 4000); // Swap every 4 seconds
}

// Scroll Reveal Animation (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Trigger only once
        }
    });
}, {
    root: null,
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));

// Sticky Navbar Scroll Effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}
