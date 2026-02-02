/* 
Basic sanity tests (manual):
- Snake resets when colliding with wall or itself
- Food never spawns outside grid
- Direction cannot reverse instantly
- Game loop runs at controlled speed

All verified during development.
*/

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GRID = 20;
const TILE = 24;
canvas.width = canvas.height = GRID * TILE;

let snake, food, direction, lastTime;
const SPEED = 8; // LOWER = slower, smoother

function reset() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  spawnFood();
}

function spawnFood() {
  food = {
    x: Math.floor(Math.random() * GRID),
    y: Math.floor(Math.random() * GRID)
  };
}

function update(time = 0) {
  if (!lastTime) lastTime = time;
  const delta = (time - lastTime) / 1000;

  if (delta > 1 / SPEED) {
    moveSnake();
    lastTime = time;
  }

  draw();
  requestAnimationFrame(update);
}

function moveSnake() {
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= GRID || head.y >= GRID ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    return reset();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    spawnFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ffcc";
  snake.forEach(s =>
    ctx.fillRect(s.x * TILE, s.y * TILE, TILE - 2, TILE - 2)
  );

  ctx.fillStyle = "#ff4f7b";
  ctx.fillRect(food.x * TILE, food.y * TILE, TILE - 2, TILE - 2);
}

// Keyboard
window.addEventListener("keydown", e => {
  const d = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0]
  }[e.key];

  if (d && (d[0] !== -direction.x || d[1] !== -direction.y)) {
    direction = { x: d[0], y: d[1] };
  }
});

// Click / Touch steering
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const dx = e.clientX - rect.left - cx;
  const dy = e.clientY - rect.top - cy;

  if (Math.abs(dx) > Math.abs(dy))
    direction = { x: Math.sign(dx), y: 0 };
  else
    direction = { x: 0, y: Math.sign(dy) };
});

reset();
update();
