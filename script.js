// At the top of your JS
const terminalSound = new Audio('/sound/starting.mp3');
const diceSound = new Audio('/sound/dice.mp3');

// Preload sounds
terminalSound.preload = 'auto';
diceSound.preload = 'auto';

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
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            
            if (this.id === 'fullscreen-btn') {
                
                toggleFullscreen();
                
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all nav items and sections
            navItems.forEach(navItem => navItem.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            const activeSection = document.getElementById(sectionId);
            activeSection.classList.add('active');
            
            // Reset typewriters in the new section
            resetTypewriters(activeSection);
            
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
    
    // Sound effects
    function playTerminalSound() {
        const sound = document.getElementById('terminal-sound');
        sound.currentTime = 0;
        sound.volume = 0.3;
        sound.play();
    }
    
    function playDiceSound() {
        const sound = document.getElementById('dice-sound');
        sound.currentTime = 0;
        sound.volume = 0.2;
        sound.play();
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
    function processCommand(command) {
        if (!command.trim()) return;
        
        const output = document.createElement('div');
        output.innerHTML = `<span class="prompt">></span> ${command}`;
        consoleOutput.appendChild(output);
        
        const response = document.createElement('div');
        
        switch(command.toLowerCase()) {
            case 'help':
                response.innerHTML = `<span class="prompt">></span> <b>ദി ˉ͈̀꒳ˉ͈́ )✧</b> <i>Available commands:</i><br>
                <span class="prompt">></span> - help: Show this help<br>
                <span class="prompt">></span> - about: About this terminal<br>
                <span class="prompt">></span> - clear: Clear the console<br>
                <span class="prompt">></span> - date: Show current date/time<br>
                <span class="prompt">></span> - fullscreen: Toggle fullscreen mode<br>
                <span class="prompt">></span> - glitch: Execute visual glitch effect<br>
                <span class="prompt">></span> - ascii: Show available ASCII art`;
                break;
            case 'about':
                response.innerHTML = `<span class="prompt">></span> ╭────────────────────────────────────────────────╮<br>
                <span class="prompt">></span> ┃ <strong>❤︎ THE_GLASC://KYRIE</strong><br>                                
                <span class="prompt">></span> ┃ Made by <i>@valkyrie_glasc</i><br>      
                <span class="prompt">></span> ┃ Sections: <u>[HOME]</u> <u>[GALLERY]</u> <u>[DICE]</u><br>
                <span class="prompt">></span> ╰────────────────────────────────────────────────╯`;
                break;
            case 'ascii':
                response.innerHTML = `<span class="prompt">></span> <b>ദ്ദി ˉ͈̀꒳ˉ͈́ )✧</b>  <i>Available ASCII art:</i><br>
                <span class="prompt">></span> ✦ chiikawa | hachiware | usagi<br>
                <span class="prompt">></span> ✦ stocking<br>
                <span class="prompt">></span> ✦ dick`;
                break;
            case 'clear':
                playDiceSound();
                consoleOutput.innerHTML = '';
                return;
            case 'date':
                updateVietnamTime();
                response.innerHTML = `<span class="prompt">></span> ⌚ ┃ <b>${document.getElementById('datetime').textContent}</b>`;
                break;
            case 'fullscreen':
                playDiceSound();
                toggleFullscreen();
                response.innerHTML = `<span class="prompt">></span> Fullscreen mode toggled`;
                break;
            case 'glitch':
                playTerminalSound();
                triggerGlitchEffect();
                response.innerHTML = `<span class="prompt">></span> Visual glitch effect executed`;
                break;
            case 'chiikawa':
                response.innerHTML = `⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⣉⠙⠻⣿⠿⠛⠛⠉⠉⣉⣉⣉⣉⣉⠉⠙⠛⠛⠿⢿⡿⠛⢁⣈⡉⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⢰⣿⣿⣷⠀⢠⣴⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣄⠀⣰⣿⣿⣿⡀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠘⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⡿⠀⠰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⣡⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣦⡀⠙⢿⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⣰⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠈⢿⠛⠛⠿⠃⠠⣦⡀⢹⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠈⣿⣷⣶⣦⣄⠁⠠⣾⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⠏⠉⠉⢹⣿⣿⣿⣿⣿⣿⣿⡏⠹⠹⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣀⣸⣿⣿⣿⣿⣷⡀⠸⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⡇⢐⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠘⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⠁⢸⣿⣿⣿⣿⣿⣿⣿⣿⡟⠉⢀⡉⠛⣿⣿⣿⣿⣿⣿⣿⡟⠋⡉⠙⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⢸⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⡄⢸⣿⣿⣿⡿⣟⢻⡛⣛⠇⠀⢉⠡⠀⣿⣿⣿⣿⣿⣿⣿⡀⠈⡉⡁⠀⣻⠿⡿⣿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⣻<br>
⣿⣿⣿⣿⣿⣿⣿⣿⡇⠈⣿⣿⡿⢊⠄⢁⠉⡐⢑⣶⣤⣴⣾⣿⣿⣿⣿⣿⣿⣿⣷⣤⣤⣤⣞⠇⠩⠓⠊⡙⢒⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢀⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠹⣿⣿⣮⣙⣎⣳⣀⣶⣿⣿⣿⣿⣿⠉⠻⠀⠹⠟⢻⣿⣿⣿⣿⣧⡨⠅⣜⣠⠀⢎⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⢸⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡘⠂⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⣿⣿⣿⣿⣏⡀⠻⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣀⠙⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣦⠈⠹⠿⠿⠿⠛⢀⣽<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣄⡈⠙⠛⠛⠻⠿⠿⠿⠿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠿⠿⠛⠿⠛⠛⠛⠛⠛⠛⠋⣁⣴⣿⣶⣶⣶⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣶⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣤⣴⣶⣶⣶⣶⣶⣷⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿`
                break;
            case 'hachiware':
                response.innerHTML = `⣿⣿⣿⣿⣿⣿⠟⠁⠈⢻⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⣿⣿⣿⣿<br>
                ⣿⣿⣿⣿⣿⡏⠂⠂⠂⠂⢙⠛⠙⠛⠻⢿⠟⠁⠂⠂⠸⣿⣿⣿<br>
                ⣿⣿⣿⡿⠟⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⠂⣿⣿⣿<br>
                ⣿⡿⢋⣴⣤⣀⣀⣀⣀⣠⣤⣾⣷⣤⣀⠂⠂⠂⠂⠂⠂⢿⣿⣿<br>
                ⣿⢁⣿⣿⣿⣿⣿⣿⣯⣽⣿⣿⣿⣿⣟⣿⣶⣦⣤⣤⣤⣦⠹⣿<br>
                ⡇⣼⣿⣿⣿⣿⣿⢋⣭⠹⣿⣿⣿⣿⠟⡛⢿⣿⣿⣿⣿⣿⣇⢸<br>
                ⠁⣿⣿⡟⡛⠛⢿⣄⣂⣴⣿⣿⣿⣿⡀⠉⢠⣿⣿⣿⣿⣿⣿⠂<br>
                ⡇⢻⣿⣷⣿⣿⣾⣿⣿⣿⣙⠁⠛⣻⣿⣿⣣⣃⢉⢹⣿⣿⡟⢸<br>
                ⣿⡌⢻⣿⣿⣿⣿⣿⣿⣿⣿⣍⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢁⣾<br>
                ⣿⡘⠦⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⣡⣾⣿`;
                break;
            case 'usagi':
                response.innerHTML = `⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⢁⣠⣦⠀⣿⡿⠋⣠⣴⡄⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⣠⣿⣿⡏⢠⠟⢁⣼⣿⣿⠃⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⣼⣿⣿⣿⠀⡜⢠⣾⣿⣿⡏⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⢰⣿⣿⣿⠇⣸⠁⣿⣿⣿⣿⠀⠆⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⣿⣿⣿⡟⢀⠇⢸⣿⣿⣿⠇⢰⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⣿⣿⣿⠁⢸⠀⣿⣿⣿⡏⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⣿⣿⣿⠀⣿⠀⣿⣿⣿⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⢹⣿⣿⠀⣶⠀⣿⣿⣿⢰⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠟⢆⣈⣿⣿⣄⣠⣤⣿⣿⣿⣤⣀⣈⣉⡉⠛⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠃⠁⣠⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⣀⠉⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⢀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⣛⡛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⠉⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⠋⢀⣴⣿⣿⣿⢟⣭⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣝⢿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠈⠻⣿⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⡏⠁⣠⣿⣿⣿⡿⢡⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠻⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⡿⠁⣴⣿⣿⣿⣿⢃⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣖⡈⢻⣿⣿⣿⣿<br>
⣿⣿⣿⣿⠁⢰⣿⣿⣿⣿⣿⣿⣿⡿⠋⣡⣈⠹⣿⣿⣿⣿⣿⣿⡟⢁⣤⡄⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⢸⣿⣿⣿<br>
⣿⣿⣿⣿⠀⣾⣿⣿⣿⣿⣿⣿⣿⣇⠀⣉⡉⠀⣿⣿⣿⣿⣿⣿⣇⠀⠉⠅⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠌⣿⣿⣿<br>
⣿⣿⣿⣿⠀⣿⣿⣿⣿⣫⡭⢹⡿⣽⡳⣶⣶⣾⡿⣿⡏⠹⣿⡟⢿⣷⣶⣶⣿⠛⣿⠃⡖⢰⡊⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⢧⠀⣿⣿⣿<br>
⣿⣿⣿⣇⠀⢿⣿⣿⣇⣄⢀⣾⣰⣇⡐⣸⣿⣿⣧⣌⠁⠀⠉⢡⣼⣿⣿⣿⣷⢸⣇⣴⣇⡼⡤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⣿⣿⣿<br>
⣿⣿⣿⣿⡄⠘⣿⣿⣿⣿⣯⣭⣭⣽⣾⣿⣿⣿⣿⣿⡄⢀⢠⠈⣿⣿⣿⣿⣿⣷⣶⣶⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣷⡀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠈⠹⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⢠⣼⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣷⡀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠉⢶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⢀⣾⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣦⡀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⢀⣾⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⡽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⢹⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣍⠋⠠⠔⢀⣡⣤⣴⠤⠈⢙⣛⣉⣿⣿⣿⣿⣿⣿⡇⠈⣿⣿⣿⣿⣿⣿<br>
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠘⣿⣿⣿⣿⣿⣿⣿⠙⠿⠻⢿⣷⣶⣾⠿⠟⠋⣠⣴⣿⣿⠿⠟⢛⣿⣿⣿⣿⣿⡇⠀⣿⣿⣿⣿⣿⣿`;
                    break;
                case 'dick':
                    response.innerHTML = `
...........:xxxxxxxxxxxXXXXXX$$$$$$$$$$$$$$$$$$$$$$$$$X$X$$$X..................................................................................<br>
.......:::....xxxxxxxXXXXX$$$$$$$$$$$&&&&&&&&&&&&&&&&$$$XX$$$$.................................................................................<br>
:::::::::::::.::xxxXXXX$$$$$$$$$$$&&&&&&&&&&&&&&&&&&&&&$$$$$$$$.:..............................................................................<br>
:::::::::::::::::;xXXXX$$$$$$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$&&.::...............&............................................................<br>
:::::::::::::::::::+xXXX$$$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&:::::..............$..........................................................<br>
:::::::::::::::::::::xXXX$$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&;.;&&&&&&.:::::...............:........................................................<br>
:::::::::::::::::::::;XXX$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&:::::::......................................................................<br>
:::::::::;:;;;;;;;;;;:+$$$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&.:;;;:::.............................&...:;...............&..................<br>
:::::::;;;++++++++++++x&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&::;;;;:::.........................+:......&.....&.::.+$&..:.&&&&.&...........<br>
::::::;;+++++++xxxxxxxX&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&;;:&&&&&;;;;;;::..................:..;:.............................................<br>
::::::;++++++xxxxxxxxxX&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&;+;::&&&;;+xxX;;:...................................................................<br>
:::::;;++++++xxxxxxxxxx&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&+x+xx&&&:XXXXXXXX&.......................................;..............&...........<br>
:::::;;++++++xxxxxxxxxx&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&;Xxxxxx;.XXXXXXXXX&&..........................&...:&.....&&&x....&;.+.&X&...........<br>
::::::;;++++xxxxxxxxxxx&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&;xx+:;++xxXXXXXXXXX$$&..............:..&...:....:....................+...............<br>
..:::::;;+++xxxxxxxxxxxX&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&:+xxx+x+++x:XXXXXXXXXXX&..............................................................<br>
........:;+++xxxxxxxxxxX&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&:+++xxxxxxxxxxxx:XXXXXXXX&&.............................................................<br>
..........:;++++xxxxxxxX&&&&&&&&&&&&&&&&&&&&&&&&&&&&&+xxxxxxxxxxxx;:::.XXXXXXXXX$&:............................................................<br>
...........::;;xxxxxxxxX&&&&&&&&&&&&&&&&&&&&&&&&&&&&:::xxxxxxxxxxx+:.+XXXXXXXXXX$&&............................................................<br>
::::::::::::::::+++xxXXxx&&&&&&&&&&&&&&&&&&&&&&&&&&&xxxxxxxxxx+xxx:;xxxxx+XXXXXX$$&............................................................<br>
::::::::;+xxxxxX:;;+++xxxx&&&&&&&&&&&&&&&&&&&&&&&&;xXxxxxxxxx:+;::::x.+xXXXXX$XX++&............................................................<br>
::::::::;+xxxxxXX$&;+xx+++x&&&&&&&&&&&&&&&&&&&&:::::xxx++x+:;:.::::..+XXXXXXXXX$$Xx&:..........................................................<br>
::::::::;++xxxXXX$&&&&xxx+++&&&&&&&&&&&&&&&&:::::::;+:::x:::;::..;;;+XXXXXXXXXXXXXXX&..........................................................<br>
:::::::::++xxxxXXX&&&&&&&;+++X&&&&&&&&&&&&&&&:;:;::::::::::;:::::..+xXXXXXXXXXXxXXXXX&X........................................................<br>
:::::::::++xxxxX$XX&&&&&&&&&:;$X&&&&&&&&&&&x;::;;;;;::::::::::..x;++xXXXXXXXXXXXX;xX$X&&.......................................................<br>
:::::::::++xxxxxX&&&&&&&&&&&&&&&&;.;&&&&&&.::::::::::+;+::::::..;$:+xxXXXXXXXXXXXX;$X$$X&&&....................................................<br>
:::::::::+++xxxx$$$&&&&&&&&&&&&&&&&&&::::::::::::::;xxxx;..:...:::.xxxxXXXX+::;;+x+XX$X$$X$Xx..................................................<br>
:::::::::+++xxXXX$$$$&&&&&&&&&&&&&&&&&:;::+::::::;xx+..:;;;;;;;:;;;:xxxxxxxXx+++++x&&&&&$$$$&..................................................<br>
:::::::::;++xxXXX$$$$$&&&&&&&&&&&&&&&&&+++;++;;:x:;++;;;;;x+xx;+;;;;:&xxxxxXXXXx++X&&&$::&$$$&......X..&;X.....................................<br>
:::::::::;++xxxXX$$$$$$X&&&&&&&&&&&&&&&;xxx++++xxxx:;x;:+++++++++++;;;::&&XXXXXXXXX.::::x:::&&&&&&&&;........:&................................<br>
::::::::::++xxxxX$$$$$$$XX&&&&&&&&&&&&&$&&xxx++x+xxx;X+:++++;+++++x++;;::.&&XXXX:;;x:::::::&&:::++x;&&&&&&........&............................<br>
::::::::::;++xxxx$$$$$$$$$$&&&&&&&&&&&&&&&;xx&+:+:+;+x;+;xxx&+;+xxxxx++&;::&&&XX:x;x;::;;:::::&;;;;+++xxx&&&&&&&...............................<br>
:::::::::::++xxxxx$$$$$$$&&XX&&&&&&&&&&&&&.+&&:+;;;;++;&x;;:x&x;xxxxX++&;;:;;&&&X;;+x;;;;;;;;::;&++++++++xxXXX$&&&$............................<br>
:::::::::::;++xxxxX$$$$$$$&$XX&&&&&&&&&&&&&&&&:::+:;;++;;++;+xx;xXX$$.xx&+++;+x;:;;Xx:+;+;;;;;;;:Xx+$+xxxxxxXx$$X&&&&&;&&&&&..&................<br>
::::::::::::++xxxxx$$$$$$$$&$XX&&&&&&&&&x&&&&&&::::;;;;;;;+++xx:X$$$$++xX&+++X++++x++x+++++++++;;:;$x&+xxxxXXxX&x$&X$X&&&&&&&&x...$............<br>
::::::::::::;+xxxxxx$$$$$$$&$XXX&&&&&&&&&X&&&&&.:::;:;;;;;;;;+&++XX$$.;&&xx&&&;xxxxxx++xx++++++xxx+;Xx&$X$XX$xX&x$$+&&&&&&&&&&&&&&....x........<br>
:::::::::::::++xxxxxX$$$$$$$XXXXX&&&&&&&&&&&&&&x::::::::::;;;;:+&&&x&xxx;xX+xXX&;xxxxXXxxxx++xxX$$$:&x$&&$$X&X$$X&$+&&&&&&&&&&&&&&&&&&...;.....<br>
:::::::::::::++xxxxxxX$$$$$$XXXX$X&&&&&&&&X&&&&&..:::::::::::;;;::;;+.:XXXXXX$xx&x;xxX$$$$$$&&&&&&&:$&+&&&&&&X$&X&&X&&&&&&&&&&&&&&&&&&&&.......<br>
::::::::::::::++xxxxxX$$$$$$XXXXXXX&&&&&&&&&&&&&+:::::::::::::;;;;;+x&x++++xxXXx+X&+xxxxX&&&&&&&&&&+$&X&&&&&&X&&$x&$&&;&&&&&&&&&&&&&&&&&&&.....<br>
::::::::::::::+++xxxxX$$$$$$xXXXXXXX&&&&&&&+&&&&&.:::::::::::::::;::;Xx+&&&&&+xxx:x&&;;xxxxxxxX&&.$X&&&&X&&&&&$&&x&&&&&&&&&&&&&&&&&&&&&&&&&....<br>
::::::::::::::;+++xxxxX$$$$XxXXXXXXXX$&&&&&&&&&&&;::::.:.::::::::::::;+;;++++&&&xxx;xX&$x:::::x$&&&XXXX&&&$X&&$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&...<br>
:::::::::::::::++++xxxXX$$$XxxXXXXXXXXX&&&&&&&&&&&.;;::::..:::::::::::::::;;+;;$&&&+;+xxX&&&XXx:+XX$$$$$&x$&&XX&&&x&&&&$$&&&&&&&&&&&&&&&&&&&&..<br>
:::::::::::::::;+++xxxxxX$XXxxXxXXXXXXx&&&&&$&&&&&x&$+;::::::::::::::::::::X;;;;;+;+++::xx$x:XX$$$$$$$$$$$$$xX&&&&X$&&&x$&&&&&&&&&&&&&&&&&&&&..<br>
::::::::::::::::++++xxxxXXXXxx+XxXXXXXXx&&&&$&&&&&&x&&$+;;::::::::::::::::::$;::;;;;;+++:xx:+xX$$$$$$$$$$$$$$$$;&&&x$&&+$&&&&&&&&&&&&&&&&&&&&;.<br>
::::::::::::::::;++++xxxXXXXxxxxxxXXXXXX&&&&$&&&&&&&&&&&&X+;;;::::::::::::::::;::::;;;;+:+x;xxxxxxxxXX$$$$$$$$$$xX$$x$&:X&&&&&&&&&&&&&&&&&&&&:.<br>
:::::::::::::::::;;++xxxXXXXXxx+xxXXXXXxx&&&&&&&&&&&$&&&&&&&X.....::::::::;+;+::;::::::;;:x+;++xxxxxxxxxx$$$$$$$x+x$XXXxxX&&&&&&&&&&&&&&&&&&&..<br>
::::::::::::::::::;;+xxxXXXXXxx++xXXXXXxx&&&&&&&&&&&&&&&&&&&&..........::;;;;;;++;;:::::::::xx:;+++++++xxx+++xXx+++xx+xxxXX&&&&&&&&&&&&&&&&&x..<br>
:::.:::::::::x::::;;;+xxxxxxXxx+x+xXXXXxx&&+&&&&&&&&&&X&&&&&&&+............:;;;;;;;;;;::::::::&+;;;;;+;;;;xx+++++++++x+XxxxXX&&&&&&&&&&&&&&+x..<br>
:::::::::::::::::::;;;xxxxxxX+++;++XXXxx+&&:&&&&&&&&&&&x&&&&&&&:::.::::::+&x...;;;;;;;;;;;:::::+x:;;;::;;;++;;;;+++;;+x+X;xxXXX&&&&&&&&&$X:$&..<br>
::::::::::::::::::::;;+xxxxxx+++:++xXX+++&:&&&x&&&x&&&&&;$&&&x&&X.::::::::::::.&:..;+++++++;;::;:x+;;;;;;;;;;;;;;;;;;;+++:xXxxXXXX$$$Xxxx.&&:::<br>
:::::::::::::::::::::::+xxxxx++++;++XX++x+.&&&&&&&&&&&&&&&&x&&X&&&::::::::::::::::::.&..++xxxxxxxx+x+++++++x++++;;;;;;;+x++.xxxxxxxxxxx.&x&::::<br>
::::::::::::::::::::::::;xxxx+++;;;+x+++x.&&&&&&&&&&&&&&&&&&&&&&&&&&&&:::::::::::::::::::...:xxxxxxxxx++x++++++++++++++++++++:.:;;:.:&&x$::::::<br>
::::::::::::::::::::::::;;;;;+;;;;;+x;;;.&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&:::::::::::::::::&&&&&::..:+:+xxxxxxxxxx+:..::::::::;::::;:::&&X::::::<br>
:::::::::::::::.::::::;:::::::;;:;;;;;;.X&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&$.:::::::::::::::::::::::::;;:;;;::;;;;;;::+&XX:::::;;;;;;;:$&;::::::<br>
:::::::::::::::::::::::::::::::::;;;;;.;&&&&&&&&&&&&&&&&&&&&&&&&&&&x&&&&&&&&.::::::::::::::::::::::;;;;;;::::;;;;;;;;;;;;;;;;;;;;;;;;:&&x::::::<br>
::::::::::::::::::::::::::::::::;;;;;::&&&&&&&&&&&&&&&&&&&&&&&&&&&&&;&&&&&&&&.:::::::::::::::::;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:&&$::::::<br>
:::::::::::::::::::::::::::::::::;;;;.&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&:&&&&&&&&:::::::::::::::::::::;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:$&x::::::<br>
:::::::::::::::::::::::::::::::::;;:;:&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&:&&&&&&&.:::::::::::::::::::::;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;::::::::`;
                    break;
                case 'stocking':
                    response.innerHTML = `⠀⢀⣀⣀⣤⠄⣠⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣦⠀⠀⠀⠀⠀⣀⣴⣶⣿⣿<br>
⣾⣿⣿⣿⠫⣺⡟⢹⣿⣿⣿⠿⠿⠛⠛⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⠇⠀⠀⠀⣰⣿⣿⣿⣿⣿<br>
⣿⣿⡿⠁⠑⡟⣼⡑⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿<br>
⣿⣿⠣⠞⠀⠼⢿⣿⣶⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢀⣤⣶⣿⣿⣿⡛⣿⣿⣿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠈⠙⠿⠿⣿<br>
⣿⠃⠀⠀⠀⠀⠀⠈⠛⢿⣿⣿⣿⣿⣶⣶⠂⠀⢀⣤⣤⣤⣤⣤⣤⣤⣤⣶⣶⣾⣿⠚⣿⣿⣿⣿⠿⠗⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀<br>
⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠛⠿⠟⠀⠀⠾⠛⠛⠻⠿⠇⠿⠿⠿⠿⠟⠛⠛⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡄⠀⠀⠀⠀⠀⠀⢂⠀⠀⠀⠀⠀⠀<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣷⡀⠀⠀⠀⠀⠀⠀⢦⠀⠀⠀⠀⠀<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠀⠀⠀⠀⠀⠀⠀⠀⢿⣧⠀⠀⠀⠀⠀⠀⠈⣧⠀⠀⠀⠀<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡆⠀⠀⠀⠀⠀⠀⢸⣧⠀⠀⠀<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⢸⠿⠓⠀⠀⠀⠀⠀⠀⠀⢿⣧⠀⠀<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠐⠊⠁⠀⠀⠀⠲⠆⣤⣄⣠⣝⢆⠀<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠃⠀⠀⡄⠀⠀⠀⠀⢀⢀⣜⣘⣀⣤⣤⣤⣶⣶⡗⠀⠀⠠⠔⣂⣓⡀⣶⠀⣿⣿⣿⣿⣷⣄<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⠀⠀⠠⠀⠀⠀⠀⠈⠡⢴⣿⣿⣿⣿⣿⣿⢿⠿⢆⡄⠀⠀⢠⣿⠯⣵⡇⢃⢻⣿⣿⣿⣿⣿<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡰⠃⠀⠀⢀⡴⠖⢤⣃⠘⡶⡲⠿⣟⣿⣿⣿⣿⣿⣿⣿⡇⠀⣀⢭⣩⣿⣿⢁⣿⠜⣿⣿⣿⣿⣿<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣧⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⢸⣿⡇⢻⣿⣿⣿⣿<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠳⡀⠀⠤⠀⢘⢻⣙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⡇⣽⣿⣿⣸⣿⣿⣿⣿<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢘⣭⣾⣥⣶⣧⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡈⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⡇⣿⣿⣿⣿<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢺⣿⣿⣿⣿⣿⢱⣿⣿⣿⣇⣿⣿⣿⣿<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢏⣾⣿⣿⣿⣿⢇⣿⣿⣿⣿⣷⢸⣿⣿⣿<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢧⡀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⢏⣾⣿⣿⣿⣿⣿⠘⣿⣿⣿<br>
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣙⣂⣀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣭⣝⣛⠿⢿⡿⠿⠿⠿⣛⣤⣿⣿⡿⠁⣴⣿⣿⣿⣿⣿⣿⠀⢸⣿⣿<br>
⠀⠀⠀⠀⠀⠀⠀⠀⢠⢀⢶⣝⢜⢿⣿⣿⣶⡄⠀⠀⠀⠀⢩⡻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢟⢛⣼⣿⡿⠃⠐⠁⠈⠁⠉⠁⠀⠀⠀⠀⠀⠀⠙<br>
⠀⠀⠀⠀⠀⢀⡄⠀⢸⣧⡳⡹⣷⣦⡙⠿⣿⣿⣦⠀⠀⠀⠀⢮⣔⣉⠻⣿⣿⣿⣿⣿⣿⣿⣿⣷⣭⣾⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀<br>
⠀⠀⠀⠀⣠⣿⡇⠀⠈⣿⣷⣝⢮⡻⣿⣮⡲⣭⡛⠷⡀⠀⠀⠈⠿⣿⣿⣆⠈⠙⠛⠿⢿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀<br>
⠀⠀⠀⣼⣿⣿⣇⠀⠀⢻⣿⣿⣷⣝⠎⡻⣿⣶⣝⠷⣤⡀⠀⠀⠐⣭⣭⢹⠿⢷⢄⠤⡀⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀<br>
⠀⠀⣼⣿⣿⣿⣿⡄⠀⠘⣿⣿⣿⣿⣿⣾⣔⡙⠻⠿⣾⣽⣂⠀⠀⠹⠿⡷⢼⣷⣴⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣴⣾⣿⣿⣿⣶⣦⣄⡀⠀⠀⠀`;
                    break;
                    
            default:
                response.innerHTML = `<span class="prompt">></span> Command not recognized: ${command}<br>
                <span class="prompt">></span> Type 'help' for available commands`;
        }
        
        consoleOutput.appendChild(response);
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
    
    // Gallery Section
    const imageGrid = document.getElementById('image-grid');
    const imageUrls = [];
    for (let i = 1; i <= 11; i++) {
        imageUrls.push(`gallery/pic${i}.jpg`);
    }
    
    const previewContainer = document.createElement('div');
    previewContainer.className = 'image-preview';
    const previewImg = document.createElement('img');
    previewContainer.appendChild(previewImg);
    document.body.appendChild(previewContainer);
    
    // Track hover state
    let isHovering = false;
    let currentHoveredItem = null;
    let hoverTimer = null;
    
    // Function to update preview position based on cursor
    function updatePreviewPosition(e, gridItem) {
        if (!isHovering || !gridItem) return;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Set maximum preview dimensions
        const maxPreviewWidth = Math.min(400, viewportWidth * 0.4);
        const maxPreviewHeight = Math.min(400, viewportHeight * 0.4);
        
        // Calculate position based on cursor
        let leftPos = e.clientX;
        let topPos = e.clientY;
        
        // Get image aspect ratio and adjust dimensions
        const imgWidth = previewImg.naturalWidth || maxPreviewWidth;
        const imgHeight = previewImg.naturalHeight || maxPreviewHeight;
        const aspectRatio = imgWidth / imgHeight;
        
        let previewWidth, previewHeight;
        
        if (aspectRatio > 1) {
            // Landscape image
            previewWidth = maxPreviewWidth / aspectRatio;
            previewHeight = previewWidth / aspectRatio;
        } else {
            // Portrait or square image
            previewHeight = maxPreviewHeight;
            previewWidth = previewHeight * aspectRatio;
        }
        
        // Add margin to prevent preview from touching cursor
        const marginX = 20;
        const marginY = 20;
        
        // Position preview to avoid going off-screen
        if (leftPos + previewWidth + marginX > viewportWidth) {
            leftPos = leftPos - previewWidth - marginX;
        } else {
            leftPos = leftPos + marginX;
        }
        
        if (topPos + previewHeight + marginY > viewportHeight) {
            topPos = topPos - previewHeight - marginY;
        } else {
            topPos = topPos + marginY;
        }
        
        // Set preview container dimensions and position
        previewContainer.style.width = `${previewWidth}px`;
        previewContainer.style.height = `${previewHeight}px`;
        previewContainer.style.left = `${leftPos}px`;
        previewContainer.style.top = `${topPos}px`;
        previewContainer.style.transform = 'none'; // Remove any transform that might interfere
    }
    
    imageUrls.forEach((url, index) => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = `<Image_Placeholder> ${index + 1}`;
        img.loading = 'lazy';
        
        gridItem.appendChild(img);
        imageGrid.appendChild(gridItem);
        
        // Click handler for full-screen preview
        gridItem.addEventListener('click', function() {
            this.classList.add('active');
            setTimeout(() => this.classList.remove('active'), 300);
            
            // Show full image on click
            previewImg.src = url;
            previewContainer.classList.add('fullscreen-preview');
            previewContainer.style.display = 'flex';
            previewContainer.style.left = '50%';
            previewContainer.style.top = '50%';
            previewContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
            previewContainer.style.opacity = '0';
            
            setTimeout(() => {
                previewContainer.classList.add('active');
                previewContainer.style.transform = 'translate(-50%, -50%) scale(1)';
                previewContainer.style.opacity = '1';
            }, 10);
        });
        
        // Hover handler for preview that follows cursor
        gridItem.addEventListener('mouseenter', function(e) {
            isHovering = true;
            currentHoveredItem = this;
            previewImg.src = url;
            
            // Clear any existing hover timer
            clearTimeout(hoverTimer);
            
            // Show preview after a short delay
            hoverTimer = setTimeout(() => {
                if (isHovering) {
                    previewContainer.classList.remove('fullscreen-preview');
                    previewContainer.style.display = 'flex';
                    previewContainer.style.opacity = '0';
                    
                    // Initial positioning
                    updatePreviewPosition(e, this);
                    
                    // Fade in with animation
                    setTimeout(() => {
                        previewContainer.classList.add('active');
                        previewContainer.style.opacity = '1';
                    }, 10);
                }
            }, 300); // Reduced delay for better responsiveness
        });
        
        // Move preview with cursor
        gridItem.addEventListener('mousemove', function(e) {
            if (isHovering && this === currentHoveredItem) {
                updatePreviewPosition(e, this);
            }
        });
        
        // Hide preview on mouse leave
        gridItem.addEventListener('mouseleave', function() {
            isHovering = false;
            currentHoveredItem = null;
            clearTimeout(hoverTimer);
            
            // Only hide if it's not in fullscreen mode
            if (!previewContainer.classList.contains('fullscreen-preview')) {
                previewContainer.classList.remove('active');
                setTimeout(() => {
                    if (!isHovering) {
                        previewContainer.style.display = 'none';
                    }
                }, 300);
            }
        });
    });
    
    // Close preview when clicking outside
    previewContainer.addEventListener('click', function(e) {
        if (e.target === this || e.target === previewImg) {
            this.classList.remove('active');
            this.classList.remove('fullscreen-preview');
            setTimeout(() => {
                this.style.display = 'none';
            }, 300);
        }
    });
    
    // Close preview with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && previewContainer.classList.contains('active')) {
            previewContainer.classList.remove('active');
            previewContainer.classList.remove('fullscreen-preview');
            setTimeout(() => {
                previewContainer.style.display = 'none';
            }, 300);
        }
    });
    
    // Dice Section
    const diceResult = document.getElementById('dice-result');
    const rollBtn = document.getElementById('roll-btn');
    const rollHistory = document.getElementById('roll-history');
    
    function rollDice() {
        rollBtn.disabled = true;
        diceResult.classList.add('dice-roll-glitch');
        
        let rolls = 0;
        const animation = setInterval(() => {
            diceResult.textContent = Math.floor(Math.random() * 6) + 1;
            rolls++;
            
            if (rolls > 15) {
                clearInterval(animation);
                const finalResult = Math.floor(Math.random() * 6) + 1;
                diceResult.textContent = finalResult;
                rollBtn.disabled = false;
                
                diceResult.classList.remove('dice-roll-glitch');
                diceResult.classList.add('dice-result-highlight');
                setTimeout(() => {
                    diceResult.classList.remove('dice-result-highlight');
                }, 1000);
                
                const historyItem = document.createElement('div');
                historyItem.innerHTML = `<span class="prompt">></span> Roll #${rollHistory.children.length + 1}: <span class="highlight">${finalResult}</span>`;
                rollHistory.appendChild(historyItem);
                rollHistory.scrollTop = rollHistory.scrollHeight;
                
                playDiceSound();
            }
        }, 100);
    }
    
    rollBtn.addEventListener('click', rollDice);
    
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
            const elements = document.querySelectorAll('.grid-item, .dice, .cyber-button');
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
});