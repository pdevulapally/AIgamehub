document.addEventListener('DOMContentLoaded', () => {
    const mazeElement = document.getElementById('maze');
    const glyphsDisplay = document.getElementById('glyphs');
    const movesDisplay = document.getElementById('moves');
    const easyButton = document.getElementById('easy');
    const mediumButton = document.getElementById('medium');
    const hardButton = document.getElementById('hard');

    let glyphs = 0;
    let moves = 0;
    let playerPosition;
    let trapPositions = [];
    let glyphPositions = [];

    const levels = {
        easy: { size: 5, traps: 3, glyphs: 3 },
        medium: { size: 7, traps: 5, glyphs: 4 },
        hard: { size: 10, traps: 8, glyphs: 5 }
    };

    const colors = ['#ffcccb', '#add8e6', '#90ee90', '#ffa07a', '#e6e6fa'];

    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function setupGame(level) {
        const { size, traps, glyphs } = levels[level];
        mazeElement.style.gridTemplateColumns = `repeat(${size}, 50px)`;
        mazeElement.style.gridTemplateRows = `repeat(${size}, 50px)`;
        mazeElement.innerHTML = '';

        playerPosition = [0, 0];
        trapPositions = [];
        glyphPositions = [];

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.backgroundColor = getRandomColor();
            cell.addEventListener('click', handleTouch); // Add touch event listener
            mazeElement.appendChild(cell);
        }

        placePlayer();
        placeElements(traps, 'trap', '💣');
        placeElements(glyphs, 'glyph', '⭐');
        updateScore();
    }

    function placePlayer() {
        const index = playerPosition[1] * Math.sqrt(mazeElement.childElementCount) + playerPosition[0];
        mazeElement.children[index].classList.add('player');
    }

    function placeElements(count, className, symbol) {
        const size = Math.sqrt(mazeElement.childElementCount);
        for (let i = 0; i < count; i++) {
            let x, y, index;
            do {
                x = Math.floor(Math.random() * size);
                y = Math.floor(Math.random() * size);
                index = y * size + x;
            } while (mazeElement.children[index].classList.contains('player') ||
                     mazeElement.children[index].classList.contains('trap') ||
                     mazeElement.children[index].classList.contains('glyph'));

            mazeElement.children[index].classList.add(className);
            mazeElement.children[index].dataset.symbol = symbol; // Store the symbol
            mazeElement.children[index].dataset.revealed = false; // Track if the element is revealed
            if (className === 'trap') {
                trapPositions.push([x, y]);
            } else {
                glyphPositions.push([x, y]);
            }
        }
    }

    function updateScore() {
        glyphsDisplay.innerText = glyphs;
        movesDisplay.innerText = moves;
    }

    function handleMove(event) {
        const key = event.key;
        movePlayer(key);
    }

    function handleTouch(event) {
        const touchedCell = event.target;
        const index = Array.from(mazeElement.children).indexOf(touchedCell);
        const size = Math.sqrt(mazeElement.childElementCount);
        const newX = index % size;
        const newY = Math.floor(index / size);
        const [currentX, currentY] = playerPosition;

        let direction = '';

        if (newY < currentY) direction = 'ArrowUp';
        if (newY > currentY) direction = 'ArrowDown';
        if (newX < currentX) direction = 'ArrowLeft';
        if (newX > currentX) direction = 'ArrowRight';

        movePlayer(direction);
    }

    function movePlayer(direction) {
        const size = Math.sqrt(mazeElement.childElementCount);
        const [x, y] = playerPosition;
        let newX = x;
        let newY = y;

        if (direction === 'ArrowUp' || direction === 'w') newY--;
        if (direction === 'ArrowDown' || direction === 's') newY++;
        if (direction === 'ArrowLeft' || direction === 'a') newX--;
        if (direction === 'ArrowRight' || direction === 'd') newX++;

        if (newX < 0 || newY < 0 || newX >= size || newY >= size) return;

        const newIndex = newY * size + newX;
        const newCell = mazeElement.children[newIndex];
        if (newCell.classList.contains('trap') && newCell.dataset.revealed === 'false') {
            newCell.innerText = newCell.dataset.symbol;
            newCell.dataset.revealed = 'true';
            setTimeout(() => {
                alert('Game Over! You hit a trap.');
                resetGame();
            }, 100); // Delay to show the emoji before alert
            return;
        }

        if (newCell.classList.contains('glyph') && newCell.dataset.revealed === 'false') {
            glyphs++;
            newCell.innerText = newCell.dataset.symbol;
            newCell.dataset.revealed = 'true';
        }

        const oldIndex = y * size + x;
        mazeElement.children[oldIndex].classList.remove('player');
        mazeElement.children[newIndex].classList.add('player');
        playerPosition = [newX, newY];
        moves++;
        updateScore();
    }

    function resetGame() {
        glyphs = 0;
        moves = 0;
        updateScore();
        setupGame('easy'); // Reset the game to the easy level
    }

    easyButton.addEventListener('click', () => setupGame('easy'));
    mediumButton.addEventListener('click', () => setupGame('medium'));
    hardButton.addEventListener('click', () => setupGame('hard'));
    document.addEventListener('keydown', handleMove);

    setupGame('easy'); // Start with easy level by default
});
