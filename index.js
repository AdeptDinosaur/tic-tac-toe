function Cell() {
    let value = ' ';
    
    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;
  
    return {getValue, addToken};
};

const gameBoard = (() => {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i].push(Cell());
          for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
              board[i].push(Cell());
            }
          }
        }
    }
    const getBoard = () => board;

    const placeToken = (row, column, player) => {
        if (board[row][column].getValue() === ' ') {
            board[row][column].addToken(player);
        } 
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
        return boardWithCellValues;
      };

    return {getBoard, placeToken, printBoard};
})();

const Player = (name, token) => {
    const getName = () => name;
    const getToken = () => token;

    return {getName, getToken};
};




const gameEngine = (() => {
    let player1;
    let player2;
    let activePlayer;
    const board = gameBoard;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };
    
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`It's ${getActivePlayer().getName()}'s turn...`);
    };
    
    const playRound = (rowSelect, columnSelect) => {
        board.placeToken(rowSelect, columnSelect, getActivePlayer().getToken());
        switchPlayerTurn();
        printNewRound();
    };
    
    const getPlayer1 = () => player1;

    const getPlayer2 = () => player2;
    
    return {
        playRound,
        switchPlayerTurn,
        getActivePlayer,
        getBoard: board.getBoard,
        setPlayerNames: (name1, name2) => {
            player1 = Player(name1, "X");
            player2 = Player(name2, "O");
            activePlayer = player1;
            printNewRound();
        },
        getPlayer1,
        getPlayer2,
    };
})();

const screenRender = (() => {
    const game = gameEngine;
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const closeModalBtn = document.querySelector('.btn-close');

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`;

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;

                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }
    
    
    const checkVictory = () => {
        const status = gameBoard.printBoard();
        
        const victoryConditionsX = [
            [['X', 'X', 'X'], [' ', ' ', ' '], [' ', ' ', ' ']], // Row 1
            [[' ', ' ', ' '], ['X', 'X', 'X'], [' ', ' ', ' ']], // Row 2
            [[' ', ' ', ' '], [' ', ' ', ' '], ['X', 'X', 'X']], // Row 3
            [['X', ' ', ' '], ['X', ' ', ' '], ['X', ' ', ' ']], // Column 1
            [[' ', 'X', ' '], [' ', 'X', ' '], [' ', 'X', ' ']], // Column 2
            [[' ', ' ', 'X'], [' ', ' ', 'X'], [' ', ' ', 'X']], // Column 3
            [['X', ' ', ' '], [' ', 'X', ' '], [' ', ' ', 'X']], // Diagonal 1
            [[' ', ' ', 'X'], [' ', 'X', ' '], ['X', ' ', ' ']]  // Diagonal 2    
        ]

        const isVictoryX = victoryConditionsX.some(condition => {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (condition[i][j] !== ' ' && status[i][j] !== condition[i][j]) {
                        return false;
                    }
                }
            }
            return true;
        });

        const victoryConditionsO = [
            [['O', 'O', 'O'], [' ', ' ', ' '], [' ', ' ', ' ']], // Row 1
            [[' ', ' ', ' '], ['O', 'O', 'O'], [' ', ' ', ' ']], // Row 2
            [[' ', ' ', ' '], [' ', ' ', ' '], ['O', 'O', 'O']], // Row 3
            [['O', ' ', ' '], ['O', ' ', ' '], ['O', ' ', ' ']], // Column 1
            [[' ', 'O', ' '], [' ', 'O', ' '], [' ', 'O', ' ']], // Column 2
            [[' ', ' ', 'O'], [' ', ' ', 'O'], [' ', ' ', 'O']], // Column 3
            [['O', ' ', ' '], [' ', 'O', ' '], [' ', ' ', 'O']], // Diagonal 1
            [[' ', ' ', 'O'], [' ', 'O', ' '], ['O', ' ', ' ']]  // Diagonal 2    
        ]

        const isVictoryO = victoryConditionsO.some(condition => {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (condition[i][j] !== ' ' && status[i][j] !== condition[i][j]) {
                        return false;
                    }
                }
            }
            return true;
        });

        function isTie() {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (status[i][j] === ' ') {
                        return false;
                    }
                }
            }
            return true;                    
        }
        
        if (isVictoryX || isVictoryO) {
            gameEngine.switchPlayerTurn();
            const activePlayer = gameEngine.getActivePlayer();
            playerTurnDiv.textContent = `${activePlayer.getName()} wins...`;
            boardDiv.removeEventListener("click", clickHandlerBoard);
            askForAnotherRound(isVictoryX, isVictoryO, isTie, gameEngine.getPlayer1(), gameEngine.getPlayer2());
        } else if (isTie()) {
            playerTurnDiv.textContent = "The result is a tie.";
            askForAnotherRound(isVictoryX, isVictoryO, isTie, gameEngine.getPlayer1(), gameEngine.getPlayer2());
        } else {
            console.log("No victory yet...");
        }   
    };

    

    function askForAnotherRound(isVictoryX, isVictoryO, isTie, player1, player2) {
        const modal = document.querySelector('.modal');
        const overlay = document.querySelector('.overlay');
        const playAgainBtn = document.querySelector('.btn-play-again');
        const resultModalDiv = document.querySelector('.result');

        const resetGame = () => {
          closeModal();
          let playerName1 = document.getElementById("playerName1").value;   
          let playerName2 = document.getElementById("playerName2").value;
          game.setPlayerNames(playerName1, playerName2);
          game.getBoard().forEach(row => row.forEach(cell => cell.addToken(' ')));
          updateScreen();
          boardDiv.addEventListener("click", clickHandlerBoard);
        };
    
        const openModal = function() {
          modal.classList.remove('hidden');
          overlay.classList.remove('hidden');
        };
        playAgainBtn.addEventListener('click', resetGame) 
    
        const closeModal = function() {
          modal.classList.add('hidden');
          overlay.classList.add('hidden');
        };
        closeModalBtn.addEventListener('click', closeModal);
        openModal();

        if (isVictoryX) {
            resultModalDiv.textContent = `${player1.getName()} wins!`;
        } else if (isVictoryO) {
            resultModalDiv.textContent = `${player2.getName()} wins!`;
        } else if (isTie) {
            resultModalDiv.textContent = "The result is a tie.";
        }
      }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn ) return;
        
        const selectedCell = game.getBoard()[selectedRow][selectedColumn];
        if (selectedCell.getValue() !== ' ') return;

        game.playRound(selectedRow, selectedColumn);
        
        updateScreen();
        checkVictory();
        
    }
    
    const nameInput = (() => {
        const modal = document.querySelector(".modal");
        const overlay = document.querySelector(".overlay");
        const openModalBtn = document.querySelector(".btn-open");
        const closeModalBtn = document.querySelector(".btn-close");
        const nameForm = document.querySelector("#nameForm");

        const openModal = function () {
            modal.classList.remove("hidden");
            overlay.classList.remove("hidden");
            };
        openModalBtn.addEventListener("click", openModal);
        
        function submitName(e) {
            e.preventDefault();
            let playerName1 = document.getElementById("playerName1").value;   
            let playerName2 = document.getElementById("playerName2").value;
            game.setPlayerNames(playerName1, playerName2);
            closeModal();
            boardDiv.addEventListener("click", clickHandlerBoard);
            updateScreen();
        };
    
        const closeModal = function () {
            modal.classList.add("hidden");
            overlay.classList.add("hidden");
            };
        closeModalBtn.addEventListener("click", closeModal);
        nameForm.addEventListener("submit", submitName);
        closeModalBtn.addEventListener("click", updateScreen);

        return {openModal, submitName, askForAnotherRound};
    })();
    
    nameInput.openModal();
    
})();


