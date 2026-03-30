const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    let isGameActive = true;
    let CurrentPlayer = "X";
    const winnerCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const getBoard = () => board;
    const getCurrentPlayer = () => CurrentPlayer;
    const getGameStatus = () => isGameActive;

    const playerTurn = (index) => {
        if(board[index] !== "" || !isGameActive) return false;
        
        board[index] = CurrentPlayer;
        checkWin();
        
        if(isGameActive) {
            CurrentPlayer = CurrentPlayer === "X" ? "O" : "X";
        }
        return true;
    };

    const checkWin = () => {
        let roundWon = false;
        
        // Verifica se alguém fez a trinca
        for(let i = 0; i < winnerCombinations.length; i++) {
            const [a, b, c] = winnerCombinations[i];
            if(board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                break; // Sai do loop, já achamos um vencedor
            }
        }

        // A avaliação acontece FORA do loop
        if(roundWon) {
            isGameActive = false;
            return "win"; 
        }

        // Se não teve vencedor, verifica empate
        if(!board.includes("")) {
            isGameActive = false;
            return "draw";
        }

        return null;
    };

    const resetGame = () => {
        for(let i = 0; i < board.length; i++) {
            board[i] = "";
        }
        CurrentPlayer = "X"; // Corrigido de players[0]
        isGameActive = true;
    };

    return { getBoard, getCurrentPlayer, getGameStatus, playerTurn, resetGame, checkWin };
})();

const display = (() => {
    const cells = document.querySelectorAll(".cell");
    const startButton = document.getElementById("start-button");
    const resetButton = document.getElementById("reset-button");
    const gameStatusText = document.getElementById("game-status"); 

    const updateBoard = () => {
        const board = gameBoard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const checkGameOver = () => {
        // Se o jogo acabou, disparamos a mensagem
        if(!gameBoard.getGameStatus()) {
            // Pegamos o array atualizado para ver se tem espaços em branco
            const currentBoard = gameBoard.getBoard();
            const boardFull = !currentBoard.includes("");
            
            // Usamos um pequeno atraso (setTimeout) para o HTML renderizar 
            // a última letra na tela antes de o alert travar a página.
            setTimeout(() => {
                if(boardFull && gameBoard.checkWin() === "draw") {
                    alert("Deu Velha! Empate.");
                } else {
                    alert(`Jogador ${gameBoard.getCurrentPlayer()} venceu!`);
                }
            }, 10);
        }
    };

    const handleCellClick = (e) => {
        const index = e.target.getAttribute("data-index");
        const validMove = gameBoard.playerTurn(index);
        
        if(validMove) {
            updateBoard();
            checkGameOver(); // Checamos se o jogo acabou após cada clique válido
        }
    };

    // Event Listeners
    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    
    // Assumindo que o startButton tenha a mesma função de reset aqui
    if(startButton) startButton.addEventListener("click", () => {
        gameBoard.resetGame();
        updateBoard();
    });

    if(resetButton) resetButton.addEventListener("click", () => {
        gameBoard.resetGame();
        updateBoard();
    });

    return { updateBoard };
})();