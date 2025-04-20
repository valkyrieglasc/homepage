const clickSound = new Audio('../../sound/dice.mp3');
clickSound.volume = 0.2;

document.addEventListener('DOMContentLoaded', function() {
    let selectedCell = null;
    let difficulty = 'easy';
    let board = [];
    let solution = [];
    let errorCount = 0;
    let timer = 0;
    let timerInterval;
    const difficultyRemovals = {
        easy: 30,
        medium: 40,
        hard: 50
    };

    const numberPopup = document.querySelector('.number-popup');
    const numberList = document.querySelector('.number-list');
    let currentCell = null;
    let currentNumberIndex = 0;

    function updateTimer() {
        const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
        const seconds = (timer % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    }

    function startTimer() {
        stopTimer();
        timer = 0;
        updateTimer();
        timerInterval = setInterval(() => {
            timer++;
            updateTimer();
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
    }

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
                        setTimeout(addNextChar, nextDelay);
                    }
                }
                
                addNextChar();
            }, baseDelay);
        });
    }

    // Generate a valid Sudoku board
    function generateSudoku() {
        // Initialize empty board
        board = Array(9).fill().map(() => Array(9).fill(0));
        
        // Fill diagonal 3x3 boxes first (they are independent)
        for (let i = 0; i < 9; i += 3) {
            fillBox(i, i);
        }
        
        // Fill the rest
        solveSudoku(board);
        
        // Create a copy for the solution
        solution = board.map(row => [...row]);
        
        // Remove numbers based on difficulty
        const cellsToRemove = difficultyRemovals[difficulty];
        let removed = 0;
        
        while (removed < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            
            if (board[row][col] !== 0) {
                board[row][col] = 0;
                removed++;
            }
        }
    }

    // Fill a 3x3 box with valid numbers
    function fillBox(row, col) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        let index = 0;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[row + i][col + j] = nums[index];
                index++;
            }
        }
    }

    // Shuffle array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Check if number is valid in position
    function isValid(num, row, col) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) return false;
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num) return false;
            }
        }
        
        return true;
    }

    // Solve the Sudoku using backtracking
    function solveSudoku(board) {
        const emptySpot = findEmptySpot(board);
        if (!emptySpot) return true;
        
        const [row, col] = emptySpot;
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
        for (const num of nums) {
            if (isValid(num, row, col)) {
                board[row][col] = num;
                
                if (solveSudoku(board)) {
                    return true;
                }
                
                board[row][col] = 0;
            }
        }
        
        return false;
    }

    // Find empty spot in the board
    function findEmptySpot(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    return [i, j];
                }
            }
        }
        return null;
    }

    // Create game board UI
    function createBoard() {
        const gameBoard = document.querySelector('.game-board');
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (board[i][j] !== 0) {
                    cell.textContent = board[i][j];
                    cell.classList.add('static');
                }
                
                cell.addEventListener('click', () => handleCellClick(cell));
                
                gameBoard.appendChild(cell);
            }
        }
    }

    function showNumberPopup(cell) {
        const popup = document.querySelector('.number-popup');
        const numberList = popup.querySelector('.number-list');
        const rect = cell.getBoundingClientRect();
        let selectedCell = document.querySelector('.cell.selected');
        
        // Xóa số cũ và tạo danh sách số mới
        numberList.innerHTML = '';
        const numbers = Array.from({length: 9}, (_, i) => i + 1);
        numbers.push(0); // Thêm số 0 để xóa
        
        numbers.forEach(num => {
            const item = document.createElement('div');
            item.classList.add('number-item');
            item.textContent = num === 0 ? 'Clear' : num;
            
            // Kiểm tra xem số đã được dùng hết chưa
            const isUnavailable = num !== 0 && isNumberFullyUsed(num);
            if (isUnavailable) {
                item.classList.add('hidden');
            }
            
            item.addEventListener('click', () => {
                if (selectedCell) {
                    const success = fillNumber(selectedCell, num);
                    if (success) {
                        hideNumberPopup();
                        checkVictory();
                    }
                }
            });
            
            numberList.appendChild(item);
        });
        
        // Định vị popup
        const cellCenterX = rect.left + rect.width / 2;
        const spaceOnRight = window.innerWidth - cellCenterX;
        const spaceOnLeft = cellCenterX;
        
        // Ưu tiên hiển thị bên phải nếu có đủ chỗ
        if (spaceOnRight >= 100) {
            popup.style.left = `${rect.right + 5}px`;
        } else if (spaceOnLeft >= 100) {
            popup.style.left = `${rect.left - 85}px`;
        } else {
            // Nếu không đủ chỗ hai bên, hiển thị ở giữa phía trên
            popup.style.left = `${cellCenterX - 40}px`;
        }
        
        // Điều chỉnh vị trí theo chiều dọc
        const popupHeight = 250; // Chiều cao tối đa của popup
        if (rect.top + popupHeight > window.innerHeight) {
            popup.style.top = `${window.innerHeight - popupHeight - 10}px`;
        } else {
            popup.style.top = `${rect.top}px`;
        }
        
        popup.classList.add('active');

        // Thêm event listener để đóng popup khi click ra ngoài
        document.addEventListener('click', closePopupOnOutsideClick);
    }

    function hideNumberPopup() {
        const popup = document.querySelector('.number-popup');
        popup.classList.remove('active');
        document.removeEventListener('click', closePopupOnOutsideClick);
    }

    function closePopupOnOutsideClick(event) {
        const popup = document.querySelector('.number-popup');
        const cells = document.querySelectorAll('.cell');
        
        // Kiểm tra xem click có phải ở ngoài popup và cell không
        if (!popup.contains(event.target) && 
            ![...cells].some(cell => cell.contains(event.target))) {
            hideNumberPopup();
        }
    }

    function handleCellClick(cell) {
        if (cell.classList.contains('static')) return;
        
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        
        selectedCell = cell;
        cell.classList.add('selected');
        
        // Focus vào ô để nhận input từ bàn phím
        cell.setAttribute('tabindex', '0');
        cell.focus();
    }

    // Xử lý input từ bàn phím
    document.addEventListener('keydown', function(e) {
        if (!selectedCell || selectedCell.classList.contains('static')) return;

        const key = e.key;
        if ((key >= '1' && key <= '9') || key === 'Backspace' || key === 'Delete') {
            clickSound.currentTime = 0;
            clickSound.play();

            const row = Math.floor([...selectedCell.parentNode.children].indexOf(selectedCell) / 9);
            const col = [...selectedCell.parentNode.children].indexOf(selectedCell) % 9;

            if (key === 'Backspace' || key === 'Delete') {
                selectedCell.textContent = '';
                board[row][col] = 0;
            } else {
                const number = parseInt(key);
                if (solution[row][col] === number) {
                    selectedCell.textContent = number;
                    board[row][col] = number;
                    selectedCell.classList.remove('error');
                    
                    addCompletionEffects(row, col);
                    
                    if (checkVictory()) {
                        document.querySelector('.game-board').classList.add('victory');
                        stopTimer();
                    }
                } else {
                    selectedCell.classList.add('error');
                    setTimeout(() => selectedCell.classList.remove('error'), 1000);
                    errorCount++;
                    document.getElementById('error-count').textContent = errorCount;
                }
            }
        }
    });

    // Find the input handling function and add the effects check
    function handleInput(event, row, col) {
        const value = parseInt(event.target.value) || 0;
        if (isValidMove(row, col, value)) {
            board[row][col] = value;
            event.target.classList.remove('invalid');
            
            // Add this line to trigger completion effects
            addCompletionEffects(row, col);
        } else {
            event.target.classList.add('invalid');
        }
    }

    // Check for victory
    function checkVictory() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] !== solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    // Thêm các hàm kiểm tra vào file JavaScript

    function checkBox(startRow, startCol) {
        const numbers = new Set();
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                const value = board[startRow + i][startCol + j];
                if(value === 0) return false;
                numbers.add(value);
            }
        }
        return numbers.size === 9;
    }

    function checkLine(index, isRow = true) {
        const numbers = new Set();
        for(let i = 0; i < 9; i++) {
            const value = isRow ? board[index][i] : board[i][index];
            if(value === 0) return false;
            numbers.add(value);
        }
        return numbers.size === 9;
    }

    function addCompletionEffects(row, col) {
        // Kiểm tra box 3x3
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        if(checkBox(boxRow, boxCol)) {
            const boxCells = document.querySelectorAll(
                `.sudoku-cell[data-row="${boxRow}"][data-col="${boxCol}"],
                 .sudoku-cell[data-row="${boxRow}"][data-col="${boxCol + 1}"],
                 .sudoku-cell[data-row="${boxRow}"][data-col="${boxCol + 2}"],
                 .sudoku-cell[data-row="${boxRow + 1}"][data-col="${boxCol}"],
                 .sudoku-cell[data-row="${boxRow + 1}"][data-col="${boxCol + 1}"],
                 .sudoku-cell[data-row="${boxRow + 1}"][data-col="${boxCol + 2}"],
                 .sudoku-cell[data-row="${boxRow + 2}"][data-col="${boxCol}"],
                 .sudoku-cell[data-row="${boxRow + 2}"][data-col="${boxCol + 1}"],
                 .sudoku-cell[data-row="${boxRow + 2}"][data-col="${boxCol + 2}"]`
            );
            boxCells.forEach(cell => {
                cell.classList.add('box-complete');
                setTimeout(() => cell.classList.remove('box-complete'), 1000);
            });
        }

        // Kiểm tra hàng
        if(checkLine(row, true)) {
            const rowCells = document.querySelectorAll(`.sudoku-cell[data-row="${row}"]`);
            rowCells.forEach(cell => {
                cell.classList.add('line-complete');
                setTimeout(() => cell.classList.remove('line-complete'), 1000);
            });
        }

        // Kiểm tra cột
        if(checkLine(col, false)) {
            const colCells = document.querySelectorAll(`.sudoku-cell[data-col="${col}"]`);
            colCells.forEach(cell => {
                cell.classList.add('line-complete');
                setTimeout(() => cell.classList.remove('line-complete'), 1000);
            });
        }

        // Kiểm tra hoàn thành toàn bộ game
        if(isGameComplete()) {
            const board = document.querySelector('.sudoku-board');
            board.classList.add('game-complete');
            setTimeout(() => {
                board.classList.remove('game-complete');
                showGameCompleteMessage();
            }, 1500);
        }
    }

    function isGameComplete() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                if(board[i][j] === 0) return false;
            }
        }
        return true;
    }

    function showGameCompleteMessage() {
        // Thêm thông báo hoàn thành game
        alert('Chúc mừng! Bạn đã hoàn thành Sudoku!');
    }

    // Initialize difficulty buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            difficulty = btn.dataset.difficulty;
            stopTimer();
            errorCount = 0;
            document.getElementById('error-count').textContent = '0';
            generateSudoku();
            createBoard();
            selectedCell = null;
            document.querySelector('.game-board').classList.remove('victory');
            startTimer();
        });
    });

    // Initialize game
    initializeTypewriters();
    generateSudoku();
    createBoard();
    startTimer();
});