function Cell() {
    let value = 0;
    
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
          board[i].push(Cell());for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
              board[i].push(Cell());
            }
          }
        }
    }
    const getBoard = () => board;

    const placeToken = (row, column, player) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].addToken(player);
        } else {
            console.log("invalid move");
        }
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
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
    
    return {playRound, getActivePlayer, getBoard: board.getBoard};
})();
/*
const screenRender = (() => {
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = gameEngine.getBoard();
        const activePlayer = gameEngine.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`

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

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) return;

        gameEngine.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    return {clickHandlerBoard, updateScreen}
})();
*/
//console.log(gameBoard.placeToken(1, 2, gameEngine.player1));
//console.log(gameBoard.getBoard());
gameEngine.playRound(1, 1);
gameEngine.playRound(0, 2);
gameEngine.playRound(0, 1);
gameEngine.playRound(1, 1);
//screenRender.clickHandlerBoard();