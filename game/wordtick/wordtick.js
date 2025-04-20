// Add dictionary configuration
const DICTIONARY = new Typo('en_US', false, false, {
    platform: 'web'
});

// Game configuration
const CONFIG = {
    INITIAL_TIME: 10,
    TIME_BONUS: 3,
    MIN_WORD_LENGTH: 2,
    SYLLABLES: ['an', 'in', 'on', 'en', 'un', 'ing', 'er', 'ly', 'ed', 'es', 'al', 'ic', 'able', 'ible', 'ful', 'ous', 'less', 'ness', 'ment', 'tion', 'sion', 'ity', 'ship', 'hood'],
    CORRECT_SOUND: new Audio('../../sound/correct.mp3'),
    WRONG_SOUND: new Audio('../../sound/wrong.mp3'),
    SYLLABLE_RULES: {
        // Suffix rules
        'er': word => word.endsWith('er') || word.includes('er'),
        'ed': word => word.endsWith('ed'),
        'ing': word => word.includes('ing'),
        'ly': word => word.endsWith('ly'),
        'tion': word => word.includes('tion'),
        'sion': word => word.includes('sion'),
        'ment': word => word.endsWith('ment'),
        'ness': word => word.endsWith('ness'),
        'ful': word => word.endsWith('ful'),
        'less': word => word.endsWith('less'),
        'able': word => word.endsWith('able'),
        'ible': word => word.endsWith('ible'),
        'ity': word => word.endsWith('ity'),
        'ship': word => word.endsWith('ship'),
        'hood': word => word.endsWith('hood'),
        // Prefix rules
        'un': word => word.startsWith('un'),
        'in': word => word.startsWith('in') || word.includes('in'),
        'an': word => word.startsWith('an') || word.includes('an'),
        'en': word => word.startsWith('en') || word.includes('en'),
        'on': word => word.startsWith('on') || word.includes('on'),
        // Special cases
        'al': word => word.endsWith('al') || word.includes('al'),
        'ic': word => word.endsWith('ic') || word.includes('ic'),
        'ous': word => word.endsWith('ous'),
        'es': word => word.endsWith('es'),
    }
};

// Game state
let gameState = {
    timeLeft: CONFIG.INITIAL_TIME,
    score: 0,
    timer: null,
    targetSyllable: '',
    usedWords: new Set(),
    isGameOver: false,
    hasStarted: false
};

// DOM Elements
const elements = {
    timeLeft: document.getElementById('timeLeft'),
    score: document.getElementById('score'),
    wordInput: document.getElementById('wordInput'),
    targetSyllable: document.getElementById('targetSyllable'),
    wordList: document.getElementById('wordList'),
    gameOverScreen: document.getElementById('gameOverScreen'),
    finalScore: document.getElementById('finalScore'),
    restartButton: document.getElementById('restartButton'),
    tickSound: document.getElementById('tickSound')
};

// Initialize game
function initGame() {
    gameState = {
        timeLeft: CONFIG.INITIAL_TIME,
        score: 0,
        timer: null,
        targetSyllable: '',
        usedWords: new Set(),
        isGameOver: false,
        hasStarted: false
    };
    
    updateDisplay();
    generateNewSyllable();
    elements.wordInput.value = '';
    elements.wordInput.focus();
    elements.gameOverScreen.classList.add('hidden');
    elements.wordList.innerHTML = '';
}

// Generate new syllable
function generateNewSyllable() {
    const randomIndex = Math.floor(Math.random() * CONFIG.SYLLABLES.length);
    gameState.targetSyllable = CONFIG.SYLLABLES[randomIndex];
    elements.targetSyllable.textContent = gameState.targetSyllable;
    elements.targetSyllable.setAttribute('data-text', gameState.targetSyllable);
}

// Start timer
function startTimer() {
    if (gameState.timer) clearInterval(gameState.timer);
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateDisplay();
        
        // Play tick sound at low time
        if (gameState.timeLeft <= 3 && gameState.timeLeft > 0) {
            elements.tickSound.currentTime = 0;
            elements.tickSound.play();
        }
        
        if (gameState.timeLeft <= 0) {
            gameOver();
        }
    }, 1000);
}

// Update display
function updateDisplay() {
    elements.timeLeft.textContent = gameState.timeLeft;
    elements.score.textContent = gameState.score;
}

// Add word to history
function addWordToHistory(word) {
    const wordEntry = document.createElement('div');
    wordEntry.classList.add('word-entry');
    wordEntry.textContent = `> ${word}`;
    elements.wordList.insertBefore(wordEntry, elements.wordList.firstChild);
    return wordEntry;
}

// Check word validity
function isValidWord(word) {
    word = word.toLowerCase();
    const syllable = gameState.targetSyllable.toLowerCase();
    
    // Check minimum length and not used before
    if (word.length < CONFIG.MIN_WORD_LENGTH || gameState.usedWords.has(word)) {
        return false;
    }

    // Use specific rule if exists
    const rule = CONFIG.SYLLABLE_RULES[syllable];
    if (rule) {
        return rule(word);
    }

    // General case - check if syllable exists as part of word
    return word.includes(syllable);
}

// Add spell checking function
function isValidSpelling(word) {
    return DICTIONARY.check(word);
}

// Submit word
function submitWord(word) {
    if (!word || gameState.isGameOver) return;
    
    word = word.trim();
    
    if (gameState.usedWords.has(word.toLowerCase())) {
        showError('used', word);
        return;
    }
    
    if (!isValidSpelling(word)) {
        showError('spelling', word);
        return;
    }
    
    if (!isValidWord(word)) {
        showError('syllable', word);
        return;
    }
    
    // Word is valid
    gameState.usedWords.add(word.toLowerCase());
    gameState.score += word.length;
    gameState.timeLeft += CONFIG.TIME_BONUS;
    
    const wordEntry = addWordToHistory(word);
    wordEntry.classList.add('correct');
    CONFIG.CORRECT_SOUND.currentTime = 0;
    CONFIG.CORRECT_SOUND.play();
    
    generateNewSyllable();
    elements.wordInput.value = '';
    updateDisplay();
}

// Add error handling function
function showError(type, word) {
    elements.wordInput.classList.add('incorrect');
    
    let message = 'Invalid word!';
    if (type === 'spelling') {
        message = 'Invalid spelling!';
    } else if (type === 'used') {
        message = 'Word already used!';
    } else if (type === 'syllable') {
        message = `Word must contain "${gameState.targetSyllable}" correctly!`;
    }
    
    // Create and show tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'error-tooltip';
    tooltip.textContent = message;
    elements.wordInput.parentNode.appendChild(tooltip);
    
    setTimeout(() => {
        elements.wordInput.classList.remove('incorrect');
        tooltip.remove();
    }, 1500);
}

// Game over
function gameOver() {
    clearInterval(gameState.timer);
    gameState.isGameOver = true;
    elements.finalScore.textContent = gameState.score;
    elements.gameOverScreen.classList.remove('hidden');
}

// Event listeners
elements.wordInput.addEventListener('keypress', (e) => {
    if (!gameState.hasStarted) {
        gameState.hasStarted = true;
        startTimer();
    }
    
    if (e.key === 'Enter') {
        submitWord(e.target.value);
    }
});

// Also start timer on input event to catch paste, drag & drop, etc.
elements.wordInput.addEventListener('input', () => {
    if (!gameState.hasStarted) {
        gameState.hasStarted = true;
        startTimer();
    }
});

elements.restartButton.addEventListener('click', initGame);

// Auto focus input when typing anywhere
document.addEventListener('keydown', (e) => {
    if (!gameState.isGameOver && !elements.wordInput.matches(':focus')) {
        elements.wordInput.focus();
    }
});

// Start game setup on load
window.addEventListener('load', initGame);