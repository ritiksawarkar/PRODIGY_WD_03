const cells = document.querySelectorAll(".cell");
const statusDisplay = document.getElementById("game-status");
const winHistoryDisplay = document.getElementById("win-history");
const resetButton = document.getElementById("reset");
const modeSelector = document.getElementById("mode");

let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let xWins = 0;
let oWins = 0;
let gameMode = "pvp"; // Default mode is Player vs. Player

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleCellClick(event) {
  const clickedIndex = event.target.getAttribute("data-index");
  if (gameBoard[clickedIndex] !== "" || !gameActive) return;

  gameBoard[clickedIndex] = currentPlayer;
  event.target.textContent = currentPlayer;

  if (checkForWinner()) {
    setTimeout(
      () => alert(`Congratulations! Player ${currentPlayer} wins!`),
      200
    );
    statusDisplay.textContent = `${currentPlayer} wins!`;
    if (currentPlayer === "X") xWins++;
    else oWins++;
    updateWinHistory();
    gameActive = false;
    setTimeout(resetGame, 1500);
    return;
  }

  if (checkForDraw()) {
    setTimeout(() => alert("It's a draw!"), 200);
    statusDisplay.textContent = "It's a draw!";
    gameActive = false;
    setTimeout(resetGame, 1500);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.textContent = `${currentPlayer}'s turn`;

  if (gameMode === "ai" && currentPlayer === "O") {
    setTimeout(makeAIMove, 500); // Delay AI's move for realism
  }
}

function makeAIMove() {
  // AI chooses a random available cell
  const availableCells = gameBoard
    .map((cell, index) => (cell === "" ? index : null))
    .filter((index) => index !== null);

  if (availableCells.length === 0) return;

  const aiMove =
    availableCells[Math.floor(Math.random() * availableCells.length)];
  gameBoard[aiMove] = "O";
  cells[aiMove].textContent = "O";

  if (checkForWinner()) {
    setTimeout(() => alert("Congratulations! Player O (AI) wins!"), 200);
    statusDisplay.textContent = `O wins!`;
    oWins++;
    updateWinHistory();
    gameActive = false;
    setTimeout(resetGame, 1500);
    return;
  }

  if (checkForDraw()) {
    setTimeout(() => alert("It's a draw!"), 200);
    statusDisplay.textContent = "It's a draw!";
    gameActive = false;
    setTimeout(resetGame, 1500);
    return;
  }

  currentPlayer = "X";
  statusDisplay.textContent = `X's turn`;
}

function checkForWinner() {
  return winPatterns.some((pattern) => {
    const [a, b, c] = pattern;
    return (
      gameBoard[a] &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
    );
  });
}

function checkForDraw() {
  return gameBoard.every((cell) => cell !== "");
}

function resetGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  statusDisplay.textContent = `${currentPlayer}'s turn`;
  cells.forEach((cell) => (cell.textContent = ""));
}

function updateWinHistory() {
  winHistoryDisplay.textContent = `X Wins: ${xWins} | O Wins: ${oWins}`;
}

// Update game mode
modeSelector.addEventListener("change", (event) => {
  gameMode = event.target.value;
  resetGame();
});

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
