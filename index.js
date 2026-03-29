const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    let isGameActive = true;
    let CurrentPlayer = "X";
    const winnerCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const getBoard = () => board;
    const getCurrentPlayer = () => CurrentPlayer;
    const getGameStatus = () => isGameActive;

    // Funcao para realizar a jogada do jogador
    const playerTurn = (index) => {
        if(board[index] !== "" || !isGameActive) return false;
        board[index] = CurrentPlayer;
        checkWin();
        if(isGameActive) {
            CurrentPlayer = CurrentPlayer === "X" ? "O" : "X";
        }
        return true;
    };

    // Função para verificar se há um vencedor ou empate
    const checkWin = () => {
        for(let i = 0; i < winnerCombinations.length; i++) {
            let roundWon = false;
            const [a, b, c] = winnerCombinations[i];
            if(board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                break;
            }
            if(roundWon) {
                isGameActive = false;
                return true;
            }

            if(!board.includes("")) {
                isGameActive = false;
                return true;
            }
        }
        if(!board.includes("")) {
            isGameActive = false;
        }
        return false;
    };

    // função para reiniciar o jogo
    const resetGame = () => {
        for(let i = 0; i < board.length; i++) {
            board[i] = "";
        }
        CurrentPlayer = players[0];
        isGameActive = true;
    };

    return {
        getBoard,
        getCurrentPlayer,
        getGameStatus,
        playerTurn,
        resetGame
    };
})();

// Funcao para controlar a exibição do jogo e lidar com os eventos de clique nas células
const display = (() => {
    const cells = document.querySelectorAll(".cell");
    const startButton = document.getElementById("start-button");
    const resetButton = document.getElementById("reset-button");
    const GameStatus = document.getElementById("game-status");
    // Função para atualizar a exibição do tabuleiro
    const updateBoard = () => {
        const board = gameBoard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    if(!gameBoard.getGameStatus()) {
        const boardFull = !board.includes("");
        if(boardFull) {
            alert("Empate!");
        } else {
            alert(`Jogador ${gameBoard.getCurrentPlayer()} venceu!`);
        }
    }
    // Função para lidar com o clique em uma célula
    const handleCellClick = (e) => {
        const index = e.target.getAttribute("data-index");
        const validMove = gameBoard.playerTurn(index);
        if(validMove) {
            updateBoard();
        };
    };

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    startButton.addEventListener("click", updateBoard);
    resetButton.addEventListener("click", () => {
        gameBoard.resetGame();
        updateBoard();
    });

    return {
        updateBoard
    };
})();