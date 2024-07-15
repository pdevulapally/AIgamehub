document.addEventListener('DOMContentLoaded', () => {
    const ticTacToeBoard = document.querySelector('#tic-tac-toe-board');
    const ticTacToeCells = ticTacToeBoard.querySelectorAll('.cell');
    const chooseSymbolModal = document.getElementById('choose-symbol');
    const chooseSymbolButtons = chooseSymbolModal.querySelectorAll('button');
    const difficultyButtons = document.querySelectorAll('#difficulty-levels button');
    const winsDisplay = document.getElementById('wins');
    const lossesDisplay = document.getElementById('losses');
    const drawsDisplay = document.getElementById('draws');
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let currentPlayer = 'X';
    let playerSymbol = 'X';
    let aiSymbol = 'O';
    let difficulty = 'easy';
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function checkWin(player) {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return ticTacToeCells[index].textContent === player;
            });
        });
    }

    function checkDraw() {
        return [...ticTacToeCells].every(cell => {
            return cell.textContent === 'X' || cell.textContent === 'O';
        });
    }

    function makeMove(index, player) {
        ticTacToeCells[index].textContent = player;
        ticTacToeCells[index].classList.add(player);
        if (checkWin(player)) {
            if (player === playerSymbol) {
                wins++;
                alert('You win!');
            } else {
                losses++;
                alert('AI wins!');
            }
            updateScores();
            resetTicTacToeBoard();
        } else if (checkDraw()) {
            draws++;
            alert(`It's a draw!`);
            updateScores();
            resetTicTacToeBoard();
        }
    }

    function handleClick(e) {
        const index = e.target.dataset.index;
        if (e.target.textContent === '') {
            makeMove(index, currentPlayer);
            if (!checkWin(currentPlayer) && !checkDraw()) {
                currentPlayer = (currentPlayer === playerSymbol) ? aiSymbol : playerSymbol;
                if (currentPlayer === aiSymbol) {
                    setTimeout(aiMove, 500);
                }
            }
        }
    }

    function aiMove() {
        let bestMove;
        switch(difficulty) {
            case 'easy':
                bestMove = randomMove();
                break;
            case 'medium':
                bestMove = Math.random() < 0.5 ? randomMove() : minimax(ticTacToeCells, aiSymbol).index;
                break;
            case 'hard':
                bestMove = minimax(ticTacToeCells, aiSymbol).index;
                break;
        }
        makeMove(bestMove, aiSymbol);
        if (!checkWin(aiSymbol) && !checkDraw()) {
            currentPlayer = playerSymbol;
        }
    }

    function randomMove() {
        const emptyCells = [...ticTacToeCells].filter(cell => cell.textContent === '');
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex].dataset.index;
    }

    function minimax(newBoard, player) {
        const availSpots = [...newBoard].filter(cell => cell.textContent === '').map(cell => cell.dataset.index);
        if (checkWin(playerSymbol)) {
            return { score: -10 };
        } else if (checkWin(aiSymbol)) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]].textContent = player;

            if (player === aiSymbol) {
                const result = minimax(newBoard, playerSymbol);
                move.score = result.score;
            } else {
                const result = minimax(newBoard, aiSymbol);
                move.score = result.score;
            }

            newBoard[availSpots[i]].textContent = '';
            moves.push(move);
        }

        let bestMove;
        if (player === aiSymbol) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function updateScores() {
        winsDisplay.textContent = wins;
        lossesDisplay.textContent = losses;
        drawsDisplay.textContent = draws;
    }

    function resetTicTacToeBoard() {
        ticTacToeCells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O');
            cell.addEventListener('click', handleClick, { once: true });
        });
        currentPlayer = playerSymbol;
    }

    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            difficulty = button.dataset.level;
            resetTicTacToeBoard();
        });
    });

    chooseSymbolButtons.forEach(button => {
        button.addEventListener('click', () => {
            playerSymbol = button.dataset.symbol;
            aiSymbol = (playerSymbol === 'X') ? 'O' : 'X';
            currentPlayer = playerSymbol;
            chooseSymbolModal.style.display = 'none';
            resetTicTacToeBoard();
        });
    });

    chooseSymbolModal.style.display = 'flex';
});
