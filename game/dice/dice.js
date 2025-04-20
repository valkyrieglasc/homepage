const diceSound = new Audio('../../sound/dice.mp3');

// Preload sound
diceSound.preload = 'auto';

function playDiceSound() {
    diceSound.currentTime = 0;
    diceSound.volume = 0.2;
    diceSound.play().catch(e => console.log("Audio play failed:", e));
}

document.addEventListener('DOMContentLoaded', function() {
    // Setup Typewriter Effect
    function initializeTypewriters() {
        const typewriters = document.querySelectorAll('.typewriter:not([data-initialized="true"])');
        
        typewriters.forEach((tw, index) => {
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

    // Dice Game Logic
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

    // Initialize typewriters
    initializeTypewriters();
});