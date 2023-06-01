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
            return board[row].splice(column, 1, player);
        } else {
            return console.log("invalid move");
        }
    };

    return {getBoard, placeToken};
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
    const board = gameBoard.getBoard();

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };
    
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        console.log(gameBoard.getBoard());
        console.log(`It's ${getActivePlayer().getName()}'s turn...`);
    };
    
    const playRound = (rowSelect, columnSelect) => {
        gameBoard.placeToken(rowSelect, columnSelect, getActivePlayer().getToken());
        switchPlayerTurn();
        printNewRound();
    };
    printNewRound();
    
    return {playRound, getActivePlayer, getBoard: board.getBoard};
})();

const screenRender = (() => {
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = gameEngine.getBoard();
        const activePlayer = gameEngine.getActivePlayer();

        playerTurnDiv.textContent = `${getActivePlayer.getName()}'s turn...`

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
/*
console.log(gameBoard.placeToken(1, 2, "X"));
console.log(gameBoard.getBoard());
gameEngine.playRound(1, 1);
gameEngine.playRound(0, 2);*/
screenRender.clickHandlerBoard();