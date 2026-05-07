// Scroll Video Control (GSAP-like behavior with pure JS)
const video = document.getElementById('scroll-video');
const heroScrollContainer = document.querySelector('.hero-scroll-container');

let targetTime = 0;
let currentTime = 0;

// Force browser to load video for seeking
if (video) {
    video.addEventListener('loadedmetadata', () => {
        video.pause();
    });
}

function updateVideo() {
    if (window.innerWidth > 600 && video && video.readyState >= 1 && video.duration) { // [FIX] Alterado de 900 para 600 aqui. O problema estava aqui: o JavaScript exigia a tela > 900px para tocar o video no scroll.
        // Calculate how much we scrolled inside the container
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
    requestAnimationFrame(updateVideo);
}

// Start render loop
requestAnimationFrame(updateVideo);

// Mobile image swap logic
const heroImages = document.querySelectorAll('.hero-images img');
let currentImageIndex = 0;

if (heroImages.length > 0) {
    setInterval(() => {
        if (window.innerWidth <= 600) { // [FIX] Alterado de 900 para 600 para que as imagens mudem apenas em telas <= 600px
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
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Trigger only once
        }
    });
}, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));