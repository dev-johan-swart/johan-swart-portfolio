
window.addEventListener("DOMContentLoaded", () => {

  // -------------------------------------------------
  // ASSETS (CORRECT ORDER + CORRECT NAMES)
  // -------------------------------------------------
  const xImageSrc = "assets/dragon.png";
  const oImageSrc = "assets/knight.png";

  const themes = [
      { file: "assets/theme1.jpg", name: "Ice" },
      { file: "assets/theme2.jpg", name: "Gold" },
      { file: "assets/theme3.jpg", name: "Dark" },
      { file: "assets/theme4.jpg", name: "Legendary" },
      { file: "assets/theme5.jpg", name: "Green" }
  ]; 

  // -------------------------------------------------
  // GAME STATE
  // -------------------------------------------------
  let board = Array(9).fill("");
  let turn = "X";
  let themeIndex = 0;
  let playing = true;
  let autoNextTimer = null;

  // -------------------------------------------------
  // DOM ELEMENTS
  // -------------------------------------------------
  const gameContainer = document.getElementById("game-container");
  const boardEl = document.getElementById("board");
  const boardContainer = document.getElementById("board-container");
  const themeLabel = document.getElementById("theme-indicator");
  const resetBtn = document.getElementById("reset-btn");
  const winnerPopup = document.getElementById("winner-popup");
  const winnerText = document.getElementById("winner-text");
  const closePopupBtn = document.getElementById("close-popup");

  // -------------------------------------------------
  // IMAGE PRELOADING (IMPROVED)
  // -------------------------------------------------
  const preload = (src) =>
      new Promise((resolve) => {
          if (!src) return resolve(null);
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
      });

  Promise.all([
      preload(xImageSrc),
      preload(oImageSrc),
      ...themes.map((t) => preload(t.file))
  ]).then(() => {
      updateTheme();
      drawBoard();
      ensurePopupImageSlot();
      ensureCloseButton();
  });

  // -------------------------------------------------
  // DRAW BOARD
  // -------------------------------------------------
  function drawBoard() {
      boardEl.innerHTML = "";

      board.forEach((value, i) => {
          const cell = document.createElement("div");
          cell.className = "cell";
          cell.dataset.index = i;

          if (value === "X" || value === "O") {
              const img = document.createElement("img");
              img.className = "piece-img";
              img.draggable = false;
              img.src = value === "X" ? xImageSrc : oImageSrc;
              img.style.width = "78%";
              img.style.height = "78%";
              img.style.objectFit = "contain";
              img.style.pointerEvents = "none";
              cell.appendChild(img);
          }

          cell.addEventListener("click", () => onCellClick(i));
          boardEl.appendChild(cell);
      });
  }

  // -------------------------------------------------
  // GAME LOGIC
  // -------------------------------------------------
  function onCellClick(i) {
      if (!playing || board[i] !== "") return;
      board[i] = turn;
      turn = turn === "X" ? "O" : "X";
      drawBoard();

      const winner = checkWin();
      if (winner) return endGame(winner);

      if (board.every(Boolean)) return endGame("Draw");
  }

  function checkWin() {
      const wins = [
          [0,1,2],[3,4,5],[6,7,8],
          [0,3,6],[1,4,7],[2,5,8],
          [0,4,8],[2,4,6]
      ];
      for (const [a,b,c] of wins) {
          if (board[a] && board[a] === board[b] && board[b] === board[c]) {
              return board[a];
          }
      }
      return null;
  }

  function endGame(result) {
      playing = false;
      showWinnerPopup(result);
  }

  // -------------------------------------------------
  // POPUP SYSTEM
  // -------------------------------------------------
  function ensurePopupImageSlot() {
      if (!winnerPopup) return;

      if (!document.getElementById("winner-piece-img")) {
          const img = document.createElement("img");
          img.id = "winner-piece-img";
          img.style.width = "96px";
          img.style.height = "96px";
          img.style.objectFit = "contain";
          img.style.display = "block";
          img.style.margin = "0 auto 8px";
          winnerPopup.querySelector(".popup-content").prepend(img);
      }
  }

  function showWinnerPopup(result) {
      const img = document.getElementById("winner-piece-img");

      if (result === "Draw") {
          img.src = themes[themeIndex].file;
      } else {
          img.src = result === "X" ? xImageSrc : oImageSrc;
      }

      winnerText.textContent =
          result === "Draw" ? "It's a Draw!" : `${result} Wins!`;

      winnerPopup.classList.remove("hidden");
      winnerPopup.classList.add("show");

      if (autoNextTimer) clearTimeout(autoNextTimer);
      autoNextTimer = setTimeout(() => {
          hidePopup();
          setTimeout(() => nextTheme(), 260);
      }, 1700);
  }

  function hidePopup() {
      winnerPopup.classList.remove("show");
      winnerPopup.classList.add("hidden");
  }

  if (closePopupBtn) {
      closePopupBtn.addEventListener("click", () => {
          if (autoNextTimer) clearTimeout(autoNextTimer);
          hidePopup();
          setTimeout(() => nextTheme(), 260);
      });
  }

  // -------------------------------------------------
  // THEMES
  // -------------------------------------------------
  function updateTheme() {
      const selected = themes[themeIndex];

      if (boardContainer) {
          boardContainer.style.backgroundImage = `url(${selected.file})`;
          boardContainer.style.backgroundSize = "cover"; 
          boardContainer.style.backgroundPosition = "center";
          boardContainer.style.backgroundRepeat = "no-repeat";
      }

      if (themeLabel) themeLabel.textContent = `Theme ${themeIndex + 1}: ${selected.name}`;
  }

  function nextTheme() {
      themeIndex = (themeIndex + 1) % themes.length;
      updateTheme();
      resetGame();
  }

  // -------------------------------------------------
  // RESET
  // -------------------------------------------------
  function resetGame() {
      if (autoNextTimer) {
          clearTimeout(autoNextTimer);
          autoNextTimer = null;
      }
      board = Array(9).fill("");
      turn = "X";
      playing = true;
      drawBoard();
  }

  if (resetBtn) resetBtn.addEventListener("click", resetGame);

  // -------------------------------------------------
  // CLOSE BUTTON + DRAGGABLE LAUNCHER
  // -------------------------------------------------
  function ensureCloseButton() {
      if (!gameContainer) return;
      if (document.getElementById("tablet-close-btn")) return;

      const btn = document.createElement("button");
      btn.id = "tablet-close-btn";
      btn.innerHTML = "✕";
      btn.style.position = "absolute";
      btn.style.top = "8px";
      btn.style.right = "8px";
      btn.style.width = "36px";
      btn.style.height = "36px";
      btn.style.border = "none";
      btn.style.borderRadius = "8px";
      btn.style.cursor = "pointer";
      btn.style.zIndex = 1200;

      gameContainer.appendChild(btn);
      btn.addEventListener("click", closeApp);
  }

  let launcher = null;

  function closeApp() {
      if (autoNextTimer) clearTimeout(autoNextTimer);
      if (!gameContainer) return;
      gameContainer.style.display = "none";

      if (!document.getElementById("launcher-icon")) {
          launcher = document.createElement("button");
          launcher.id = "launcher-icon";
          launcher.title = "Open Game";
          launcher.style.position = "fixed";
          launcher.style.right = "18px";
          launcher.style.bottom = "18px";
          launcher.style.width = "56px";
          launcher.style.height = "56px";
          launcher.style.borderRadius = "12px";
          launcher.style.border = "none";
          launcher.style.cursor = "grab";
          launcher.style.backgroundImage = `url(${oImageSrc})`;
          launcher.style.backgroundSize = "cover";
          launcher.style.zIndex = 1400;

          document.body.appendChild(launcher);
          makeDraggable(launcher);

          launcher.addEventListener("click", () => {
              if (gameContainer) gameContainer.style.display = "block";
              const el = document.getElementById("launcher-icon"); if (el) el.remove();
              launcher = null;

              animateRestore();
              drawBoard();
          });
      }
  }

  function animateRestore() {
      if (!gameContainer) return;
      gameContainer.style.transform = "scale(0.95)";
      gameContainer.style.opacity = "0";
      requestAnimationFrame(() => {
          gameContainer.style.transition =
              "transform 220ms ease, opacity 180ms ease";
          gameContainer.style.transform = "scale(1)";
          gameContainer.style.opacity = "1";
          setTimeout(() => {
              gameContainer.style.transition = "";
          }, 250);
      });
  }

  // -------------------------------------------------
  // DRAGGABLE ELEMENT
  // -------------------------------------------------
  function makeDraggable(el) {
      let drag = false, sx = 0, sy = 0, sl = 0, st = 0;

      function down(e) {
          drag = true;
          const ev = e.touches ? e.touches[0] : e;
          sx = ev.clientX; sy = ev.clientY;

          const rect = el.getBoundingClientRect();
          sl = rect.left; st = rect.top;

          el.style.left = sl + "px";
          el.style.top = st + "px";
          el.style.right = "auto";
          el.style.bottom = "auto";
          el.style.position = "fixed";
          el.style.cursor = "grabbing";

          e.preventDefault();
      }

      function move(e) {
          if (!drag) return;
          const ev = e.touches ? e.touches[0] : e;
          el.style.left = sl + (ev.clientX - sx) + "px";
          el.style.top = st + (ev.clientY - sy) + "px";
      }

      function up() {
          drag = false;
          el.style.cursor = "grab";
      }

      el.addEventListener("mousedown", down);
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);

      el.addEventListener("touchstart", down, { passive: false });
      document.addEventListener("touchmove", move, { passive: false });
      document.addEventListener("touchend", up);
  }

  // Expose tools
  window.nextTheme = nextTheme;
  window.resetGame = resetGame;
  window.closeApp = closeApp;
});
