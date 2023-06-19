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
    let player1 = Player("Player 1", "X");
    let player2 = Player("Player 2", "O");
    let activePlayer = player1;
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
    printNewRound();
    
    return {playRound, switchPlayerTurn, getActivePlayer, getBoard: board.getBoard};
})();

const screenRender = (() => {
    const game = gameEngine;
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

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


        if (isVictoryX || isVictoryO) {
            gameEngine.switchPlayerTurn();
            const activePlayer = gameEngine.getActivePlayer();
            playerTurnDiv.textContent = `${activePlayer.getName()} wins...`;
            console.log("Triggered")
            boardDiv.removeEventListener("click", clickHandlerBoard);
        } else {
            console.log("No victory yet...");
        }   
    };

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        
        updateScreen();
        checkVictory();
        
    }


    boardDiv.addEventListener("click", clickHandlerBoard);
    

    updateScreen();
})();


