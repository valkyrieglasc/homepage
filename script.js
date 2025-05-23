// Audio initialization
const terminalSound = new Audio('./sound/starting.mp3');
const diceSound = new Audio('./sound/dice.mp3');
const Badapple = new Audio('./sound/badapple.mp3');

// Preload sound
terminalSound.preload = 'auto';
diceSound.preload = 'auto';
Badapple.preload = 'auto';
Badapple.loop = true; // Enable audio looping

function playTerminalSound() {
    terminalSound.currentTime = 0;
    terminalSound.volume = 0.3;
    terminalSound.play().catch(e => console.log("Audio play failed:", e));
}

function playDiceSound() {
    diceSound.currentTime = 0;
    diceSound.volume = 0.2;
    diceSound.play().catch(e => console.log("Audio play failed:", e));
}

function playBadapple() {
    Badapple.currentTime = 0;
    Badapple.volume = 0.2;
    Badapple.play().catch(e => console.log("Audio play failed:", e));
}

document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items and sections
            navItems.forEach(navItem => navItem.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // Reset typewriters in the new section
            resetTypewriters(document.getElementById(sectionId));
            
            // Initialize typewriters in the new section
            setTimeout(() => {
                initializeTypewriters();
            }, 50);
        });
    });
    
    // Function to reset typewriters when switching sections
    function resetTypewriters(section) {
        // Find all typewriters in the section
        const typewriters = section.querySelectorAll('.typewriter');
        
        typewriters.forEach(tw => {
            // Reset the initialization status
            delete tw.dataset.initialized;
            
            // If it's inside a container, restore original structure
            const container = tw.closest('.typewriter-container');
            if (container) {
                const parent = container.parentNode;
                parent.insertBefore(tw, container);
                parent.removeChild(container);
            }
            
            // Restore original text content
            const originalText = tw.getAttribute('data-original-text') || tw.dataset.text || tw.textContent;
            tw.textContent = originalText;
        });
    }
    
    // Enhance interactivity by adding animations dynamically
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('hovering');
        });
        item.addEventListener('mouseleave', () => {
            item.classList.remove('hovering');
        });
    });

    sections.forEach(section => {
        section.addEventListener('transitionend', () => {
            if (section.classList.contains('active')) {
                section.style.pointerEvents = 'auto';
            } else {
                section.style.pointerEvents = 'none';
            }
        });
    });

    // Add click animation to buttons
    const buttons = document.querySelectorAll('.cyber-button');
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.classList.add('clicked');
        });
        button.addEventListener('mouseup', () => {
            button.classList.remove('clicked');
        });
    });
    
    // Fullscreen functionality
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            document.getElementById('fullscreen-btn').textContent = '[EXIT FULLSCREEN]';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                document.getElementById('fullscreen-btn').textContent = '[FULLSCREEN]';
            }
        }
    }
    
    // Vietnam Time Display
    function updateVietnamTime() {
        const options = {
            timeZone: 'Asia/Ho_Chi_Minh',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const now = new Date();
        document.getElementById('datetime').textContent = now.toLocaleString('en-US', options) + ' (ICT)';
    }

    // Terminal commands
    async function loadAsciiArt(artName) {
        try {
            const response = await fetch(`ascii_art/${artName}.txt`);
            if (!response.ok) return null;
            const text = await response.text();
            
            // Match content between backticks
            const frames = text.match(/`([^`]+)`/g);
            
            if (frames && frames.length > 0) {
                // Remove backticks and clean up each frame
                return frames.map(frame => frame.replace(/^`|`$/g, '').trim());
            } else {
                // Fallback to the old method for backwards compatibility
                return text.split('\n\n').map(frame => frame.trim()).filter(frame => frame);
            }
        } catch (error) {
            console.error('Error loading ASCII art:', error);
            return null;
        }
    }

    async function displayAsciiArt(artName) {
        const frames = await loadAsciiArt(artName);
        if (!frames) return false;

        // Play Bad Apple music only for badapple animation
        if (artName === 'badapple') {
            playBadapple();
        }

        const artContainer = document.createElement('div');
        artContainer.classList.add('ascii-container');
        
        const artDisplay = document.createElement('pre');
        artDisplay.classList.add('ascii-animation');
        artDisplay.classList.add('size-md');
        artDisplay.style.display = 'block';
        artDisplay.style.whiteSpace = 'pre';
        artDisplay.textContent = frames[0];
        
        const controls = document.createElement('div');
        controls.classList.add('ascii-controls');
        
        // Frame counter display
        const frameCounter = document.createElement('div');
        frameCounter.classList.add('ascii-frame-counter');
        frameCounter.textContent = `Frame: 1/${frames.length}`;
        
        // Add timing control
        const speedControl = document.createElement('div');
        speedControl.classList.add('ascii-speed-control');
        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '50';
        speedSlider.max = '500';
        speedSlider.value = '90';
        speedSlider.className = 'ascii-speed-slider';
        const speedLabel = document.createElement('span');
        speedLabel.textContent = 'Speed: ';
        speedControl.appendChild(speedLabel);
        speedControl.appendChild(speedSlider);
        
        // Size controls
        const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
        sizes.forEach(size => {
            const btn = document.createElement('button');
            btn.classList.add('ascii-size-btn');
            btn.textContent = size.toUpperCase();
            if (size === 'md') btn.classList.add('active');
            
            btn.addEventListener('click', () => {
                sizes.forEach(s => {
                    artDisplay.classList.remove(`size-${s}`);
                    controls.querySelector(`button:nth-child(${sizes.indexOf(s) + 1})`).classList.remove('active');
                });
                artDisplay.classList.add(`size-${size}`);
                btn.classList.add('active');
            });
            
            controls.appendChild(btn);
        });
        
        artContainer.appendChild(artDisplay);
        controls.appendChild(speedControl);
        controls.appendChild(frameCounter);
        artContainer.appendChild(controls);
        
        let frame = 0;
        let frameInterval = parseInt(speedSlider.value);
        let animationInterval;

        const updateAnimation = () => {
            if (animationInterval) {
                clearInterval(animationInterval);
            }
            animationInterval = setInterval(() => {
                frame = (frame + 1) % frames.length;
                artDisplay.textContent = frames[frame];
                frameCounter.textContent = `Frame: ${frame + 1}/${frames.length}`;
            }, frameInterval);
        };

        // Start initial animation
        updateAnimation();

        // Update animation speed when slider changes
        speedSlider.addEventListener('input', (e) => {
            frameInterval = parseInt(e.target.value);
            updateAnimation();
        });

        // Clean up when animation is stopped
        setTimeout(() => {
            if (animationInterval) {
                clearInterval(animationInterval);
                // Stop Bad Apple music when animation ends
                if (artName === 'badapple') {
                    Badapple.pause();
                    Badapple.currentTime = 0;
                }
            }
        }, 300000); // 5 minutes timeout
        
        return artContainer;
    }

    function processCommand(command) {
        if (!command.trim()) return;
        
        const output = document.createElement('div');
        output.innerHTML = `<span class="prompt">></span> ${command}`;
        consoleOutput.appendChild(output);
        
        const response = document.createElement('div');
        const [cmd, ...args] = command.toLowerCase().split(' ');
        
        switch(cmd) {
            case 'help':
                response.innerHTML = `<span class="prompt">></span> <b>ദി ˉ͈̀꒳ˉ͈́ )✧</b> <i>Available commands:</i><br>
                <span class="prompt">></span> - help: Show this help<br>
                <span class="prompt">></span> - about: About this terminal<br>
                <span class="prompt">></span> - clear: Clear the console<br>
                <span class="prompt">></span> - date: Show current date/time<br>
                <span class="prompt">></span> - fullscreen: Toggle fullscreen mode<br>
                <span class="prompt">></span> - glitch: Execute visual glitch effect<br>
                <span class="prompt">></span> - ascii [name]: Show ASCII art animation`;
                consoleOutput.appendChild(response);
                break;
                
            case 'ascii':
                if (args.length > 0) {
                    const artName = args[0];
                    displayAsciiArt(artName).then(artDisplay => {
                        if (artDisplay) {
                            response.innerHTML = `<span class="prompt">></span> Displaying ASCII art: ${artName}`;
                            consoleOutput.appendChild(response);
                            consoleOutput.appendChild(artDisplay);
                        } else {
                            response.innerHTML = `<span class="prompt">></span> ASCII art not found: ${artName}<br>
                            <span class="prompt">></span> Available options: chiikawa, hachiware, usagi, stocking, badapple`;
                            consoleOutput.appendChild(response);
                        }
                    });
                } else {
                    response.innerHTML = `<span class="prompt">></span> <b>ദ്ദി ˉ͈̀꒳ˉ͈́ )✧</b>  <i>Available ASCII art:</i><br>
                    <span class="prompt">></span> ✦ chiikawa | hachiware | usagi<br>
                    <span class="prompt">></span> ✦ stocking<br>
                    <span class="prompt">></span> ✦ dick<br>
                    <span class="prompt">></span> ✦ night<br>
                    <span class="prompt">></span> ✦ badapple`;
                    consoleOutput.appendChild(response);
                }
                break;
                
            case 'clear':
                playDiceSound();
                consoleOutput.innerHTML = '';
                return;
                
            case 'date':
                updateVietnamTime();
                response.innerHTML = `<span class="prompt">></span> ⌚ ┃ <b>${document.getElementById('datetime').textContent}</b>`;
                consoleOutput.appendChild(response);
                break;
                
            case 'fullscreen':
                toggleFullscreen();
                response.innerHTML = `<span class="prompt">></span> Fullscreen mode toggled`;
                consoleOutput.appendChild(response);
                break;
                
            case 'glitch':
                triggerGlitchEffect();
                playTerminalSound();
                response.innerHTML = `<span class="prompt">></span> Visual glitch effect executed`;
                consoleOutput.appendChild(response);
                break;
                
            case 'about':
                response.innerHTML = `<span class="prompt">></span> ╭────────────────────────────────────────────────╮<br>
                <span class="prompt">></span> ┃ <strong>❤︎ THE_GLASC://KYRIE</strong><br>                                
                <span class="prompt">></span> ┃ Made by <i>@valkyrie_glasc</i><br>      
                <span class="prompt">></span> ┃ Sections: <u>[HOME]</u> <u>[GALLERY]</u><br>
                <span class="prompt">></span> ╰────────────────────────────────────────────────╯`;
                consoleOutput.appendChild(response);
                break;
            
            case 'ascii badapple':
                playBadapple();
                consoleOutput.innerHTML = '';
                consoleOutput.appendChild(response);
                break;
                
            default:
                response.innerHTML = `<span class="prompt">></span> Command not recognized: ${command}<br>
                <span class="prompt">></span> Type 'help' for available commands`;
                consoleOutput.appendChild(response);
        }
        
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
    
    // Visual glitch effect
    function triggerGlitchEffect() {
        const glitchOverlay = document.querySelector('.glitch-overlay');
        glitchOverlay.style.opacity = "0.5";
        
        const noise = document.createElement('div');
        noise.className = 'digital-noise';
        document.body.appendChild(noise);
        
        document.querySelectorAll('.title, .prompt, .nav-item').forEach(el => {
            el.classList.add('intense-glitch');
        });
        
        setTimeout(() => {
            glitchOverlay.style.opacity = "0.05";
            document.body.removeChild(noise);
            document.querySelectorAll('.intense-glitch').forEach(el => {
                el.classList.remove('intense-glitch');
            });
        }, 800);
    }
    
// Optimized Image Preview System with Smooth Flow and Floating Animation

// Gallery Section
const imageGrid = document.getElementById('image-grid');
const imageUrls = Array.from({ length: 17 }, (_, i) => `gallery/pic${i + 1}.jpg`);

// Create preview container
const previewContainer = document.createElement('div');
previewContainer.className = 'image-preview hidden';
const previewImg = document.createElement('img');
previewContainer.appendChild(previewImg);
document.body.appendChild(previewContainer);

// State variables
let hoverTimer = null;

// Utility: Throttle function for smooth cursor tracking
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function (...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// Utility: Update preview position smoothly
const updatePreviewPosition = throttle((e) => {
    const { clientX: mouseX, clientY: mouseY } = e;
    const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;

    // Calculate image dimensions
    const imgWidth = previewImg.naturalWidth;
    const imgHeight = previewImg.naturalHeight;
    const imgAspectRatio = imgWidth / imgHeight;
    
    // Set base dimensions (percentages of viewport)
    const maxViewportWidth = viewportWidth * 0.4;
    const maxViewportHeight = viewportHeight * 0.4;
    
    // Calculate optimal dimensions while maintaining aspect ratio
    let previewWidth, previewHeight;
    
    if (imgWidth <= maxViewportWidth && imgHeight <= maxViewportHeight) {
        // For small images, use their natural size
        previewWidth = imgWidth;
        previewHeight = imgHeight;
    } else {
        // For larger images, scale down proportionally
        if (imgAspectRatio > maxViewportWidth / maxViewportHeight) {
            previewWidth = maxViewportWidth;
            previewHeight = maxViewportWidth / imgAspectRatio;
        } else {
            previewHeight = maxViewportHeight;
            previewWidth = maxViewportHeight * imgAspectRatio;
        }
    }

    // Ensure minimum dimensions with visual balance
    const minSize = 100;
    if (previewWidth < minSize) {
        previewWidth = minSize;
        previewHeight = minSize / imgAspectRatio;
    }
    if (previewHeight < minSize) {
        previewHeight = minSize;
        previewWidth = minSize * imgAspectRatio;
    }

    // Adjust margins based on aspect ratio for visual balance
    const baseMargin = 20;
    let horizontalMargin = baseMargin;
    let verticalMargin = baseMargin;
    
    // For rectangular images, adjust margins to appear more balanced
    if (imgAspectRatio > 1.2) { // Landscape
        verticalMargin = baseMargin * (0.8 + (1 / imgAspectRatio));
    } else if (imgAspectRatio < 0.8) { // Portrait
        horizontalMargin = baseMargin * (0.8 + imgAspectRatio);
    }

    const left = mouseX + previewWidth + horizontalMargin > viewportWidth
        ? mouseX - previewWidth - horizontalMargin
        : mouseX + horizontalMargin;
    const top = mouseY + previewHeight + verticalMargin > viewportHeight
        ? mouseY - previewHeight - verticalMargin
        : mouseY + verticalMargin;

    previewContainer.style.width = `${previewWidth}px`;
    previewContainer.style.height = `${previewHeight}px`;
    previewContainer.style.transform = `translate(${left}px, ${top}px)`;
}, 16); // Throttle to 60 FPS

// Utility: Show preview
function showPreview(url, e) {
    previewImg.src = url;
    previewImg.onload = () => {
        previewContainer.classList.remove('hidden');
        updatePreviewPosition(e);
    };
}

// Utility: Hide preview
function hidePreview() {
    previewContainer.classList.add('hidden');
}

// Add images to the grid and attach event listeners
imageUrls.forEach((url, index) => {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item floating';

    const img = document.createElement('img');
    img.src = url;
    img.alt = `Image ${index + 1}`;
    img.loading = 'lazy';

    gridItem.appendChild(img);
    imageGrid.appendChild(gridItem);

    // Hover events
    gridItem.addEventListener('mouseenter', (e) => {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => showPreview(url, e), 100); // Debounced hover
    });

    gridItem.addEventListener('mousemove', updatePreviewPosition);

    gridItem.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
        hidePreview();
    });

    // Click event for fullscreen preview
    gridItem.addEventListener('click', () => {
        previewImg.src = url;
        previewContainer.classList.add('fullscreen');
        previewContainer.classList.remove('hidden');
    });
});

// Close preview on click outside or Escape key
previewContainer.addEventListener('click', (e) => {
    if (e.target === previewContainer || e.target === previewImg) {
        previewContainer.classList.remove('fullscreen');
        hidePreview();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !previewContainer.classList.contains('hidden')) {
        previewContainer.classList.remove('fullscreen');
        hidePreview();
    }
});
    
    // Typewriter Effect - IMPROVED
    function initializeTypewriters() {
        const typewriters = document.querySelectorAll('.typewriter:not([data-initialized="true"])');
        
        typewriters.forEach((tw, index) => {
            // Store original text if not already stored
            if (!tw.getAttribute('data-original-text')) {
                tw.setAttribute('data-original-text', tw.textContent);
            }
            
            const originalText = tw.getAttribute('data-original-text');
            tw.textContent = '';
            tw.dataset.initialized = "true";
            
            const baseDelay = parseInt(tw.dataset.delay) || (index * 300);
            
            const container = document.createElement('div');
            container.className = 'typewriter-container';
            tw.parentNode.insertBefore(container, tw);
            container.appendChild(tw);
            
            const cursor = document.createElement('span');
            cursor.className = 'typewriter-cursor';
            container.appendChild(cursor);
            
            setTimeout(() => {
                let charIndex = 0;
                const characters = originalText.split('');
                
                function addNextChar() {
                    if (charIndex < characters.length) {
                        const charSpan = document.createElement('span');
                        charSpan.className = 'typewriter-char';
                        charSpan.textContent = characters[charIndex];
                        tw.appendChild(charSpan);
                        
                        cursor.style.left = `${tw.offsetWidth}px`;
                        charIndex++;
                        
                        const nextDelay = 40 + Math.random() * 80;
                        let extraDelay = 0;
                        const lastChar = characters[charIndex - 1];
                        if (['.', '!', '?', ',', ':'].includes(lastChar)) {
                            extraDelay = lastChar === '.' ? 300 : 150;
                        } else if (Math.random() > 0.9) {
                            extraDelay = 200;
                        }
                        
                        setTimeout(addNextChar, nextDelay + extraDelay);
                    }
                }
                
                addNextChar();
            }, baseDelay);
        });
    }
    
    // Initial setup
    setTimeout(() => {
        processCommand('help');
        initializeTypewriters();
        updateVietnamTime();
        setInterval(updateVietnamTime, 1000);
        
        // Create particles
        const particlesContainer = document.querySelector('.particles');
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.width = `${Math.random() * 3 + 1}px`;
            particle.style.height = particle.style.width;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
            particlesContainer.appendChild(particle);
        }
        
        // Create grid background
        const gridOverlay = document.createElement('div');
        gridOverlay.className = 'grid-overlay';
        document.body.appendChild(gridOverlay);
        
        for (let i = 0; i < 25; i++) {
            const horizontalLine = document.createElement('div');
            horizontalLine.className = 'grid-line horizontal';
            horizontalLine.style.top = `${i * 4}vh`;
            horizontalLine.style.animationDelay = `${Math.random() * 2}s`;
            gridOverlay.appendChild(horizontalLine);
            
            const verticalLine = document.createElement('div');
            verticalLine.className = 'grid-line vertical';
            verticalLine.style.left = `${i * 4}vw`;
            verticalLine.style.animationDelay = `${Math.random() * 2}s`;
            gridOverlay.appendChild(verticalLine);
        }
        
        // Random effects
        setInterval(() => {
            if (Math.random() > 0.97) {
                triggerGlitchEffect();
            }
            if (Math.random() > 0.97) {
                triggerGlitchEffect();

            }
        }, 30000);
        
        setInterval(() => {
            const elements = document.querySelectorAll('.grid-item, .cyber-button');
            const randomElement = elements[Math.floor(Math.random() * elements.length)];
            randomElement.classList.add('pulse-highlight');
            setTimeout(() => {
                randomElement.classList.remove('pulse-highlight');
            }, 800);
        }, 5000);
        
        setInterval(() => {
            if (Math.random() > 0.9) {
                const randomNavItem = navItems[Math.floor(Math.random() * navItems.length)];
                randomNavItem.classList.add('temporary-glitch');
                setTimeout(() => {
                    randomNavItem.classList.remove('temporary-glitch');
                }, 200);
            }
        }, 5000);
    }, 500);
    
    // Command input
    const commandInput = document.getElementById('command-input');
    const consoleOutput = document.getElementById('console');
    
    commandInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processCommand(this.value);
            this.value = '';
        }
    });
// ...existing code...

// === YOUTUBE MUSIC PLAYER ===
const ytPlayer = document.getElementById('yt-player');
const songTitle = document.getElementById('current-song-title');
const inputUrl = document.getElementById('youtube-url');
const inputTitle = document.getElementById('youtube-title');
const volumeSlider = document.getElementById('volume-slider');
const queueContainer = document.getElementById('queue-container');

let playlist = JSON.parse(localStorage.getItem('playlist')) || [];
let currentIndex = 0;
let isLooping = false;
let playerVolume = 50;

function savePlaylist() {
    localStorage.setItem('playlist', JSON.stringify(playlist));
}

function extractYoutubeID(url) {
    try {
        const regex = /(?:youtube\.com.*v=|youtu\.be\/)([^&\n]+)/;
        const match = url.match(regex);
        return match ? match[1] : url;
    } catch {
        return url;
    }
}

function updateQueue() {
    queueContainer.innerHTML = '';
    playlist.forEach((song, index) => {
        const queueItem = document.createElement('div');
        queueItem.className = `queue-item ${index === currentIndex ? 'current' : ''}`;
        queueItem.innerHTML = `
            <span class="song-title">${song.title}</span>
            <div class="queue-controls">
                <button class="queue-btn play-now" title="Play Now">▶️</button>
                <button class="queue-btn move-up" title="Move Up">⬆️</button>
                <button class="queue-btn move-down" title="Move Down">⬇️</button>
                <button class="queue-btn remove" title="Remove">❌</button>
            </div>
        `;

        // Queue item event listeners
        queueItem.querySelector('.play-now').addEventListener('click', () => {
            currentIndex = index;
            loadSong(currentIndex);
        });

        queueItem.querySelector('.move-up').addEventListener('click', () => {
            if (index > 0) {
                [playlist[index], playlist[index - 1]] = [playlist[index - 1], playlist[index]];
                if (currentIndex === index) currentIndex--;
                else if (currentIndex === index - 1) currentIndex++;
                savePlaylist();
                updateQueue();
            }
        });

        queueItem.querySelector('.move-down').addEventListener('click', () => {
            if (index < playlist.length - 1) {
                [playlist[index], playlist[index + 1]] = [playlist[index + 1], playlist[index]];
                if (currentIndex === index) currentIndex++;
                else if (currentIndex === index + 1) currentIndex--;
                savePlaylist();
                updateQueue();
            }
        });

        queueItem.querySelector('.remove').addEventListener('click', () => {
            playlist.splice(index, 1);
            if (currentIndex > index) currentIndex--;
            else if (currentIndex === index && currentIndex === playlist.length) currentIndex = 0;
            savePlaylist();
            updateQueue();
            if (playlist.length === 0) {
                songTitle.textContent = 'No songs in queue';
                ytPlayer.src = '';
            } else if (index === currentIndex) {
                loadSong(currentIndex);
            }
        });

        queueContainer.appendChild(queueItem);
    });
}

function loadSong(index) {
    const song = playlist[index];
    songTitle.textContent = song.title;
    ytPlayer.src = `https://www.youtube.com/embed/${song.id}?autoplay=1&loop=${isLooping ? 1 : 0}&playlist=${song.id}&enablejsapi=1`;
    updateQueue();
}



document.getElementById('play-btn').addEventListener('click', () => {
    ytPlayer.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (playlist.length > 0) {
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (playlist.length > 0) {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentIndex);
    }
});

document.getElementById('loop-btn').addEventListener('click', () => {
    isLooping = !isLooping;
    if (playlist.length > 0) loadSong(currentIndex);
    document.getElementById('loop-btn').textContent = isLooping ? "🔂 Looping" : "🔁 Loop";
});

document.getElementById('add-song-btn').addEventListener('click', () => {
    const rawUrl = inputUrl.value.trim();
    const title = inputTitle.value.trim() || "New Song";
    if (!rawUrl) return;

    const id = extractYoutubeID(rawUrl);
    playlist.push({ title, id });
    savePlaylist();
    inputUrl.value = '';
    inputTitle.value = '';
    updateQueue();
    if (playlist.length === 1) {
        loadSong(0);
    }
});

// Volume control event listener
volumeSlider.addEventListener('input', (e) => {
    playerVolume = e.target.value;
    const percent = playerVolume;
    volumeSlider.style.background = `linear-gradient(90deg, var(--primary) ${percent}%, rgba(125,95,255,0.15) ${percent}%)`;

    ytPlayer.contentWindow.postMessage(
        JSON.stringify({
            event: 'command',
            func: 'setVolume',
            args: [playerVolume]
        }), '*'
    );
});

// Initialize player
if (playlist.length > 0) {
    loadSong(currentIndex);
} else {
    songTitle.textContent = 'No songs in queue';
}

// Load the first song
loadSong(currentIndex);
});

// filepath: c:\Users\hiroz\Documents\GitHub\homepage\script.js

let ytApiPlayer = null;
let ytApiReady = false;

// This function is called by the YouTube API script
window.onYouTubeIframeAPIReady = function() {
    ytApiPlayer = new YT.Player('yt-player', {
        height: '0',
        width: '100%',
        videoId: playlist.length > 0 ? playlist[currentIndex].id : '',
        playerVars: {
            autoplay: 1,
            loop: isLooping ? 1 : 0,
            playlist: playlist.length > 0 ? playlist[currentIndex].id : ''
        },
        events: {
            'onReady': function() {
                ytApiReady = true;
                ytApiPlayer.setVolume(playerVolume);
            },
            'onStateChange': function(event) {
                // Optionally handle end of song, etc.
            }
        }
    });
};

// Update loadSong to use the API
function loadSong(index) {
    const song = playlist[index];
    songTitle.textContent = song.title;
    if (ytApiPlayer && ytApiReady) {
        ytApiPlayer.loadVideoById(song.id);
        ytApiPlayer.setVolume(playerVolume);
    }
    updateQueue();
}

// Update play/pause/next/prev to use the API
document.getElementById('play-btn').addEventListener('click', () => {
    if (ytApiPlayer && ytApiReady) {
        const state = ytApiPlayer.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            ytApiPlayer.pauseVideo();
        } else {
            ytApiPlayer.playVideo();
        }
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (playlist.length > 0) {
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (playlist.length > 0) {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentIndex);
    }
});

document.getElementById('loop-btn').addEventListener('click', () => {
    isLooping = !isLooping;
    if (ytApiPlayer && ytApiReady) {
        ytApiPlayer.setLoop(isLooping);
    }
    document.getElementById('loop-btn').textContent = isLooping ? "🔂 Looping" : "🔁 Loop";
});

volumeSlider.addEventListener('input', (e) => {
    playerVolume = e.target.value;
    if (ytApiPlayer && ytApiReady) {
        ytApiPlayer.setVolume(playerVolume);
    }
   // Add this to your slider input event handlers
slider.addEventListener('input', function() {
    const percentage = (this.value - this.min) / (this.max - this.min) * 100;
    this.style.setProperty('--slider-percentage', `${percentage}%`);
}); 

// Add this to your JavaScript file
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', function() {
        const percentage = (this.value - this.min) / (this.max - this.min) * 100;
        this.style.setProperty('--slider-percentage', `${percentage}%`);
    });
});

});