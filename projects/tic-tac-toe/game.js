// ----------------------------
// Tic Tac Toe Widget Embed JS
// ----------------------------

const themes = [
  "assets/theme1.jpg",
  "assets/theme2.jpg",
  "assets/theme3.jpg",
  "assets/theme4.jpg",
  "assets/theme5.jpg"
];

let themeIndex = 0;
let board = Array(9).fill("");
let turn = "X";
let playing = true;

// DOM
const boardEl = document.getElementById("board");
const themeLabel = document.getElementById("theme-indicator");
const resetBtn = document.getElementById("reset-btn");
const gameContainer = document.getElementById("game-container");

// ----------------------------
// Setup winner popup
// ----------------------------
let winnerPopup = document.createElement("div");
winnerPopup.id = "winner-popup";
winnerPopup.style.position = "absolute";
winnerPopup.style.top = "50%";
winnerPopup.style.left = "50%";
winnerPopup.style.transform = "translate(-50%, -50%)";
winnerPopup.style.background = "rgba(0,0,0,0.85)";
winnerPopup.style.color = "#fff";
winnerPopup.style.fontWeight = "bold";
winnerPopup.style.fontSize = "14px";
winnerPopup.style.padding = "10px 16px";
winnerPopup.style.borderRadius = "10px";
winnerPopup.style.textAlign = "center";
winnerPopup.style.display = "none";
winnerPopup.style.zIndex = "2000";
gameContainer.appendChild(winnerPopup);

// ----------------------------
// Close button only (top-right)
// ----------------------------
let closeBtn = document.createElement("button");
closeBtn.className = "tablet-close";
closeBtn.textContent = "✕";
gameContainer.appendChild(closeBtn);

closeBtn.addEventListener("click", () => {
  gameContainer.classList.add("minimized");

  // create draggable launcher if not exists
  if (!document.getElementById("launcher-icon")) {
    const launcher = document.createElement("div");
    launcher.id = "launcher-icon";
    document.body.appendChild(launcher);
    makeDraggable(launcher);

    launcher.addEventListener("click", () => {
      gameContainer.classList.remove("minimized");
      launcher.remove();
    });
  }
});

// ----------------------------
// Board
// ----------------------------
function drawBoard() {
  boardEl.innerHTML = "";

  board.forEach((value, idx) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = idx;

    if (value === "X") cell.classList.add("x");
    if (value === "O") cell.classList.add("o");

    cell.textContent = value;
    cell.addEventListener("click", onCellClick);

    boardEl.appendChild(cell);
  });
}

// ----------------------------
// Player action
// ----------------------------
function onCellClick(e) {
  const i = e.target.dataset.index;
  if (!playing || board[i] !== "") return;

  board[i] = turn;
  turn = turn === "X" ? "O" : "X";
  drawBoard();

  const win = checkWin();
  if (win) endGame(win);
  else if (board.every(v => v !== "")) endGame("Draw");
}

// ----------------------------
// Win logic
// ----------------------------
function checkWin() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let combo of wins) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// ----------------------------
// End game
// ----------------------------
function endGame(result) {
  playing = false;
  winnerPopup.textContent = result === "Draw" ? "It's a Draw!" : `${result} Wins!`;
  winnerPopup.style.display = "block";

  setTimeout(() => {
    winnerPopup.style.display = "none";
    nextTheme();
  }, 1200);

  startConfetti();
}

// ----------------------------
// Next theme
// ----------------------------
function nextTheme() {
  themeIndex = (themeIndex + 1) % themes.length;
  document.body.style.backgroundImage = `url(${themes[themeIndex]})`;
  resetGame();
  updateThemeLabel();
}

// ----------------------------
// Update theme label
// ----------------------------
function updateThemeLabel() {
  themeLabel.textContent = `Theme: ${themeIndex + 1}`;
}

// ----------------------------
// Reset
// ----------------------------
function resetGame() {
  board = Array(9).fill("");
  turn = "X";
  playing = true;
  drawBoard();
}

resetBtn.addEventListener("click", resetGame);

// ----------------------------
// Confetti
// ----------------------------
function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = canvas.offsetHeight;
  const pieces = [];
  for (let i = 0; i < 100; i++) {
    pieces.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*6+4,
      dx: (Math.random()-0.5)*4,
      dy: Math.random()*4+2,
      color: `hsl(${Math.random()*360},80%,60%)`
    });
  }

  let animation;
  function animate() {
    ctx.clearRect(0,0,w,h);
    pieces.forEach(p=>{
      p.x += p.dx; p.y += p.dy;
      if(p.y > h) p.y = 0;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    animation = requestAnimationFrame(animate);
  }
  animate();

  setTimeout(()=>{
    cancelAnimationFrame(animation);
    ctx.clearRect(0,0,w,h);
  },3000);
}

// ----------------------------
// Draggable helper
// ----------------------------
function makeDraggable(el) {
  let dragging = false, startX=0, startY=0, startLeft=0, startTop=0;

  function down(e) {
    dragging = true;
    const ev = (e.touches && e.touches[0]) || e;
    startX = ev.clientX; startY = ev.clientY;
    const r = el.getBoundingClientRect();
    startLeft = r.left; startTop = r.top;
    el.style.position = "fixed";
    el.style.left = startLeft + "px";
    el.style.top = startTop + "px";
    el.style.cursor = "grabbing";
    e.preventDefault();
  }

  function move(e) {
    if(!dragging) return;
    const ev = (e.touches && e.touches[0]) || e;
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    el.style.left = (startLeft + dx) + "px";
    el.style.top = (startTop + dy) + "px";
    el.style.right = "auto";
    el.style.bottom = "auto";
  }

  function up() {
    dragging = false;
    el.style.cursor = "grab";
  }

  el.addEventListener("mousedown", down);
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
  el.addEventListener("touchstart", down, {passive:false});
  document.addEventListener("touchmove", move, {passive:false});
  document.addEventListener("touchend", up);
}

// ----------------------------
// Initialize
// ----------------------------
updateThemeLabel();
drawBoard();
