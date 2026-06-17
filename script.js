// Initialize Video.js player
let player;

document.addEventListener('DOMContentLoaded', () => {
    player = videojs('videoPlayer', {
        controls: true,
        autoplay: false,
        preload: 'auto',
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
        plugins: {
            httpStreaming: {}
        }
    });

    // Add Picture in Picture support
    if (document.pictureInPictureEnabled) {
        const pipButton = document.createElement('button');
        pipButton.className = 'vjs-pip-button vjs-control vjs-button';
        pipButton.title = 'Picture in Picture';
        pipButton.innerHTML = '⧠';
        
        player.controlBar.addChild(pipButton);
        pipButton.addEventListener('click', togglePip);
    }

    // Event listeners
    document.getElementById('playBtn').addEventListener('click', playStream);
    document.getElementById('streamUrl').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') playStream();
    });

    // Player events
    player.on('error', handlePlayerError);
    player.on('play', updateStatus);
    player.on('pause', updateStatus);
});

function playStream() {
    const url = document.getElementById('streamUrl').value.trim();
    
    if (!url) {
        showStatus('Please enter a stream URL', 'error');
        return;
    }

    // Validate URL format
    if (!isValidUrl(url)) {
        showStatus('Invalid URL format. Please enter a valid stream link.', 'error');
        return;
    }

    // Show loading state
    const playBtn = document.getElementById('playBtn');
    playBtn.classList.add('loading');
    playBtn.textContent = '⏳ LOADING...';
    
    showStatus('Loading stream...', 'loading');

    try {
        // Detect stream type
        const streamType = detectStreamType(url);
        
        // Configure player based on stream type
        configurePlayer(url, streamType);
        
        // Update stream details
        updateStreamDetails(url, streamType);
        
        // Start playback
        player.play();
        showStatus('Playing stream', 'success');
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
        console.error('Stream error:', error);
    } finally {
        playBtn.classList.remove('loading');
        playBtn.textContent = '▶ PLAY';
    }
}

function detectStreamType(url) {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('.m3u8') || lowerUrl.includes('hls')) {
        return 'HLS';
    } else if (lowerUrl.includes('.mpd') || lowerUrl.includes('dash')) {
        return 'DASH';
    } else if (lowerUrl.includes('.mp4')) {
        return 'MP4';
    } else if (lowerUrl.includes('.webm')) {
        return 'WebM';
    } else if (lowerUrl.includes('.ogv') || lowerUrl.includes('.ogg')) {
        return 'OGG';
    } else {
        return 'AUTO';
    }
}

function configurePlayer(url, streamType) {
    const source = {
        src: url,
        type: getMimeType(streamType)
    };

    player.src(source);
    player.load();
}

function getMimeType(streamType) {
    const mimeTypes = {
        'HLS': 'application/x-mpegURL',
        'DASH': 'application/dash+xml',
        'MP4': 'video/mp4',
        'WebM': 'video/webm',
        'OGG': 'video/ogg',
        'AUTO': 'video/mp4'
    };
    
    return mimeTypes[streamType] || 'video/mp4';
}

function updateStreamDetails(url, streamType) {
    const details = document.getElementById('streamDetails');
    
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const now = new Date().toLocaleTimeString();
    
    details.innerHTML = `
        <div>
            <strong>📌 Stream Type:</strong> <span style="color: #e94560;">${streamType}</span><br>
            <strong>🔗 Domain:</strong> ${domain}<br>
            <strong>⏰ Started At:</strong> ${now}<br>
            <strong>📊 Bitrate:</strong> <span id="bitrate">Auto-detected</span>
        </div>
    `;
}

function updateStatus(event) {
    const statusText = document.getElementById('statusText');
    const state = event.type === 'play' ? 'Playing' : 'Paused';
    statusText.textContent = state;
}

function handlePlayerError(error) {
    const errorMsg = player.error();
    let errorText = 'Unknown error occurred';
    
    if (errorMsg) {
        switch (errorMsg.code) {
            case 1:
                errorText = 'Media loading aborted';
                break;
            case 2:
                errorText = 'Network error - Check your internet connection';
                break;
            case 3:
                errorText = 'Media decoding failed';
                break;
            case 4:
                errorText = 'Media format not supported';
                break;
            default:
                errorText = 'Player error: ' + errorMsg.message;
        }
    }
    
    showStatus(`Error: ${errorText}`, 'error');
    console.error('Player error:', errorMsg);
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showStatus(message, type) {
    const statusText = document.getElementById('statusText');
    statusText.textContent = message;
    
    // Remove previous status classes
    statusText.className = 'status-value';
    
    if (type === 'error') {
        statusText.style.color = '#ff6b6b';
    } else if (type === 'success') {
        statusText.style.color = '#51cf66';
    } else if (type === 'loading') {
        statusText.style.color = '#ffd93d';
        statusText.className = 'status-value loading';
    } else {
        statusText.style.color = '#e94560';
    }
}

function togglePip() {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else {
        player.videoTechCall_('requestPictureInPicture')
            .catch(error => {
                console.log('PiP error:', error);
                const videoElement = document.getElementById('videoPlayer_html5_api');
                if (videoElement && videoElement.requestPictureInPicture) {
                    videoElement.requestPictureInPicture();
                }
            });
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target === document.getElementById('streamUrl')) return;
    
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            if (player.paused()) {
                player.play();
            } else {
                player.pause();
            }
            break;
        case 'ArrowRight':
            e.preventDefault();
            player.currentTime(player.currentTime() + 5);
            break;
        case 'ArrowLeft':
            e.preventDefault();
            player.currentTime(player.currentTime() - 5);
            break;
        case 'KeyF':
            e.preventDefault();
            if (player.isFullscreen()) {
                player.exitFullscreen();
            } else {
                player.requestFullscreen();
            }
            break;
        case 'KeyM':
            e.preventDefault();
            player.muted(!player.muted());
            break;
        case 'ArrowUp':
            e.preventDefault();
            player.volume(Math.min(player.volume() + 0.1, 1));
            break;
        case 'ArrowDown':
            e.preventDefault();
            player.volume(Math.max(player.volume() - 0.1, 0));
            break;
    }
});

// Display keyboard shortcuts on load
console.log('%c Keyboard Shortcuts:', 'color: #e94560; font-weight: bold; font-size: 16px;');
console.log('%c Space - Play/Pause', 'color: #51cf66; font-size: 14px;');
console.log('%c F - Fullscreen', 'color: #51cf66; font-size: 14px;');
console.log('%c M - Mute/Unmute', 'color: #51cf66; font-size: 14px;');
console.log('%c Arrow Keys - Seek/Volume', 'color: #51cf66; font-size: 14px;');