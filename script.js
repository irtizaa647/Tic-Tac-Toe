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
  let isVsAI = false;

  const start = (name1, name2, vsAI = false) => {
    isVsAI = vsAI;
    players = [Player(name1, "X"), vsAI ? Player("AI", "O") : Player(name2, "O")];
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
      
      // AI move delay
      if (isVsAI && currentPlayer.name === "AI") {
        DisplayController.updateResult("AI is thinking...");
        setTimeout(() => {
          aiMove();
        }, 2000); // 2 seconds delay
      }
    }
  }
};

const aiMove = () => {
  const board = Gameboard.getBoard();
  const emptyIndices = board
    .map((val, i) => (val === "" ? i : null))
    .filter((i) => i !== null);
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  playRound(randomIndex);
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
  const mode = document.querySelector('input[name="mode"]:checked').value;
  if (p1) {
    if (mode === "ai") {
      Game.start(p1, "AI", true);
    } else if (p2) {
      Game.start(p1, p2, false);
    }
  }
});

document.getElementById("restart").addEventListener("click", () => {
  const p1 = document.getElementById("player1").value.trim();
  const p2 = document.getElementById("player2").value.trim();
  const mode = document.querySelector('input[name="mode"]:checked').value;
  if (p1) {
    if (mode === "ai") {
      Game.start(p1, "AI", true);
    } else if (p2) {
      Game.start(p1, p2, false);
    }
  }
});

//to toggle vsibility
const modeRadios = document.querySelectorAll('input[name="mode"]');
const player2Container = document.getElementById("player2-container");

modeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.value === "ai") {
      player2Container.classList.add("hidden");
    } else {
      player2Container.classList.remove("hidden");
    }
  });
});