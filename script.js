// TV Stream Configuration (Hidden)
const streamConfig = {
    // Obfuscated stream URL - hidden from plain sight
    url: atob('aHR0cHM6Ly90di5lYm94LmxpdmUv')
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
    
    // Create hidden iframe with sandbox
    const iframe = document.createElement('iframe');
    iframe.src = streamConfig.url;
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-presentation allow-pointer-lock');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
    iframe.style.display = 'none';
    
    // Clear loading message
    setTimeout(() => {
        playerContainer.innerHTML = '';
        
        // Create a proxy div
        const proxyDiv = document.createElement('div');
        proxyDiv.style.width = '100%';
        proxyDiv.style.height = '100%';
        proxyDiv.style.backgroundColor = '#000';
        proxyDiv.style.display = 'flex';
        proxyDiv.style.alignItems = 'center';
        proxyDiv.style.justifyContent = 'center';
        proxyDiv.style.position = 'relative';
        
        // Add iframe to proxy
        proxyDiv.appendChild(iframe);
        
        // Create visible overlay iframe
        const overlayIframe = document.createElement('iframe');
        overlayIframe.src = streamConfig.url;
        overlayIframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-presentation allow-pointer-lock');
        overlayIframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
        overlayIframe.style.width = '100%';
        overlayIframe.style.height = '100%';
        overlayIframe.style.border = 'none';
        overlayIframe.style.borderRadius = '0';
        
        playerContainer.appendChild(overlayIframe);
        
        // Show "Now Playing" indicator
        console.log('🎬 Live TV Stream Initialized');
    }, 500);
}

function setupFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const playerContainer = document.getElementById('tv-player');
    
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
        });
    }
}

// Prevent developer tools detection (optional)
// This won't stop determined users, but adds a layer of obfuscation
(function() {
    let devtools = { open: false };
    
    const threshold = 160;
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold ||
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                // Optional: could redirect or show message
            }
        } else {
            devtools.open = false;
        }
    }, 500);
})();

// Security headers for API calls (if needed)
const securityHeaders = {
    'X-Requested-With': 'XMLHttpRequest',
    'Referrer-Policy': 'no-referrer'
};

console.log('%c🔒 Secure Live TV Stream', 'color: #667eea; font-size: 14px; font-weight: bold;');
console.log('%cStream URL is protected and encoded', 'color: #764ba2; font-size: 12px;');
