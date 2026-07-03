// =============================================
//  TIC TAC TOE — Game Logic
// =============================================

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// ── State ──────────────────────────────────
let board       = Array(9).fill(null); // null | 'X' | 'O'
let currentPlayer = 'X';
let gameOver    = false;
let scores      = { X: 0, O: 0, D: 0 };

// ── DOM Refs ───────────────────────────────
const cells       = document.querySelectorAll('.cell');
const statusText  = document.getElementById('status-text');
const indicator   = document.getElementById('turn-indicator');
const xScore      = document.getElementById('x-score');
const oScore      = document.getElementById('o-score');
const drawScore   = document.getElementById('draw-score');
const scoreCardX  = document.getElementById('score-x');
const scoreCardO  = document.getElementById('score-o');
const restartBtn  = document.getElementById('restart-btn');
const resetBtn    = document.getElementById('reset-btn');
const overlay     = document.getElementById('overlay');
const overlaySymbol = document.getElementById('overlay-symbol');
const overlayTitle  = document.getElementById('overlay-title');
const overlaySub    = document.getElementById('overlay-sub');
const overlayBtn    = document.getElementById('overlay-btn');

// ── Init ───────────────────────────────────
function init() {
  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });
  restartBtn.addEventListener('click', newRound);
  resetBtn.addEventListener('click', resetAll);
  overlayBtn.addEventListener('click', () => {
    hideOverlay();
    newRound();
  });
  updateTurnUI();
}

// ── Cell Click ─────────────────────────────
function handleCellClick(e) {
  const idx = parseInt(e.currentTarget.dataset.index);

  if (gameOver || board[idx]) return;

  board[idx] = currentPlayer;
  renderCell(e.currentTarget, currentPlayer);

  const winCombo = checkWin();
  if (winCombo) {
    handleWin(winCombo);
  } else if (board.every(Boolean)) {
    handleDraw();
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnUI();
  }
}

// ── Render Cell ────────────────────────────
function renderCell(cellEl, player) {
  const symbol = document.createElement('span');
  symbol.classList.add('symbol');
  symbol.textContent = player === 'X' ? '✕' : '○';
  cellEl.appendChild(symbol);
  cellEl.classList.add(player === 'X' ? 'x-cell' : 'o-cell', 'taken');
}

// ── Win Check ──────────────────────────────
function checkWin() {
  return WIN_COMBOS.find(combo =>
    combo.every(i => board[i] === currentPlayer)
  ) || null;
}

// ── Handle Win ─────────────────────────────
function handleWin(combo) {
  gameOver = true;
  scores[currentPlayer]++;
  updateScoreUI();

  // Highlight winning cells
  combo.forEach(i => {
    cells[i].classList.add('winning');
  });

  const player = currentPlayer;
  const symbol = player === 'X' ? '✕' : '○';

  statusText.textContent = `Player ${player} wins! 🎉`;

  setTimeout(() => {
    overlaySymbol.textContent = symbol;
    overlaySymbol.className   = `overlay-symbol ${player.toLowerCase()}`;
    overlayTitle.textContent  = `Player ${player} Wins!`;
    overlaySub.textContent    = 'Well played. Ready for another round?';
    showOverlay();
  }, 700);
}

// ── Handle Draw ────────────────────────────
function handleDraw() {
  gameOver = true;
  scores.D++;
  updateScoreUI();

  statusText.textContent = "It's a draw!";

  setTimeout(() => {
    overlaySymbol.textContent = '○';
    overlaySymbol.className   = 'overlay-symbol draw';
    overlayTitle.textContent  = "It's a Draw!";
    overlaySub.textContent    = 'Nobody wins this time. Go again?';
    showOverlay();
  }, 700);
}

// ── Turn UI ────────────────────────────────
function updateTurnUI() {
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (currentPlayer === 'X') {
    indicator.classList.remove('o-turn');
    scoreCardX.classList.add('active-x');
    scoreCardO.classList.remove('active-o');
  } else {
    indicator.classList.add('o-turn');
    scoreCardO.classList.add('active-o');
    scoreCardX.classList.remove('active-x');
  }
}

// ── Score UI ───────────────────────────────
function updateScoreUI() {
  xScore.textContent    = scores.X;
  oScore.textContent    = scores.O;
  drawScore.textContent = scores.D;

  // Pulse the updated score
  const el = currentPlayer === 'X' ? xScore : (gameOver && board.every(Boolean) ? drawScore : oScore);
  el.animate([
    { transform: 'scale(1.3)', color: currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)' },
    { transform: 'scale(1)',   color: 'var(--text)' }
  ], { duration: 400, easing: 'ease-out' });
}

// ── New Round ──────────────────────────────
function newRound() {
  board         = Array(9).fill(null);
  gameOver      = false;

  cells.forEach(cell => {
    cell.innerHTML = '';
    cell.className = 'cell';
  });

  updateTurnUI();
}

// ── Reset Everything ───────────────────────
function resetAll() {
  scores = { X: 0, O: 0, D: 0 };
  currentPlayer = 'X';
  updateScoreUI();
  newRound();
}

// ── Overlay ────────────────────────────────
function showOverlay() {
  overlay.classList.add('show');
}

function hideOverlay() {
  overlay.classList.remove('show');
}

// ── Kick Off ───────────────────────────────
init();
