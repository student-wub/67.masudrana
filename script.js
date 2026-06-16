// TV Stream Configuration
const streamConfig = {
    // Direct stream URL - embedded securely
    url: 'https://tv.ebox.live/'
};

// Initialize TV Player
document.addEventListener('DOMContentLoaded', function() {
    initializePlayer();
    setupFullscreen();
    setupNavigation();
    setupHamburger();
});

function initializePlayer() {
    const playerContainer = document.getElementById('tv-player');
    
    // Create iframe with sandbox for security
    const iframe = document.createElement('iframe');
    iframe.src = streamConfig.url;
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-presentation allow-pointer-lock allow-forms');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '0';
    
    // Clear loading message after iframe is ready
    setTimeout(() => {
        playerContainer.innerHTML = '';
        playerContainer.appendChild(iframe);
        console.log('🎬 Live TV Stream Initialized');
    }, 500);
}

function setupFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const playerContainer = document.getElementById('tv-player');
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            if (playerContainer.requestFullscreen) {
                playerContainer.requestFullscreen();
            } else if (playerContainer.webkitRequestFullscreen) {
                playerContainer.webkitRequestFullscreen();
            } else if (playerContainer.mozRequestFullScreen) {
                playerContainer.mozRequestFullScreen();
            } else if (playerContainer.msRequestFullscreen) {
                playerContainer.msRequestFullscreen();
            }
        });
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            const section = document.querySelector(target);
            
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
}

function setupHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Toggle hamburger animation
            const spans = hamburger.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(10px, 10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

console.log('%c🔒 Live TV Stream Player', 'color: #667eea; font-size: 14px; font-weight: bold;');
