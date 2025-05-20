
//IIFE(gameboard module)
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  const setMark = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };
  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setMark, resetBoard };
})();

//Player factory
const Player = (name, mark) => {
  return { name, mark };
};

//IIFE(game controller module)
const Game = (() => {
  let currentPlayer;
  let players = [];
  let gameOver = false;

  const start = (name1, name2) => {
    players = [Player(name1, "X"), Player(name2, "O")];
    currentPlayer = players[0];
    Gameboard.resetBoard();
    gameOver = false;
    DisplayController.renderBoard();
    DisplayController.updateResult(`${currentPlayer.name}'s turn`);
  };

  const playRound = (index) => {
    if (gameOver) return;
    if (Gameboard.setMark(index, currentPlayer.mark)) {
      DisplayController.renderBoard();
      if (checkWin()) {
        DisplayController.updateResult(`${currentPlayer.name} wins!`);
        gameOver = true;
      } else if (checkTie()) {
        DisplayController.updateResult("It's a tie!");
        gameOver = true;
      } else {
        switchPlayer();
        DisplayController.updateResult(`${currentPlayer.name}'s turn`);
      }
    }
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  const checkWin = () => {
    const board = Gameboard.getBoard();
    const winningCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winningCombos.some(combo => 
      combo.every(i => board[i] === currentPlayer.mark)
    );
  };

  const checkTie = () => {
    return Gameboard.getBoard().every(cell => cell !== "");
  };

  return { start, playRound };
})();

//DOM
const DisplayController = (() => {
  const boardElement = document.getElementById("board");
  const resultElement = document.getElementById("result");

  const renderBoard = () => {
    boardElement.innerHTML = "";
    Gameboard.getBoard().forEach((cell, index) => {
      const square = document.createElement("div");
      square.classList.add("square");
      square.textContent = cell;
      square.addEventListener("click", () => Game.playRound(index));
      boardElement.appendChild(square);
    });
  };

  const updateResult = (message) => {
    resultElement.textContent = message;
  };

  return { renderBoard, updateResult };
})();

//form + restart button
document.getElementById("player-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const p1 = document.getElementById("player1").value.trim();
  const p2 = document.getElementById("player2").value.trim();
  if (p1 && p2) Game.start(p1, p2);
});

document.getElementById("restart").addEventListener("click", () => {
  const p1 = document.getElementById("player1").value.trim();
  const p2 = document.getElementById("player2").value.trim();
  if (p1 && p2) Game.start(p1, p2);
});