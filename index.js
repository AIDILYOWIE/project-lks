const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

// Ukuran kotak grid
const gridSize = 50;

// Ukuran maze
const cols = canvas.width / gridSize;
const rows = canvas.height / gridSize;

// Posisi pemain
let playerX = 0;
let playerY = 0;

// Posisi tujuan (goal)
const goalX = cols - 1;
const goalY = rows - 1;

// Nyawa pemain
let lives = 3;

// array tembok
let walls = [];

// function untuk membuat tembok secara acak
function GenerateRandomWalls() {
  walls = [];
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (Math.random() < 0.3 && !(x === 0 && y === 0) && !(x === goalX && y === goalY)) {
        walls.push([x, y]);
      }
    }
  }

  if (!isPathAvailable()) {
    GenerateRandomWalls();
  }
}

// fungsi untuk menggambar wall
function drawWall() {
  ctx.fillStyle = "grey";
  for (const wall of walls) {
    ctx.fillRect(wall[0] * gridSize, wall[1] * gridSize, gridSize, gridSize);
  }
}

// Fungsi untuk menggambar grid (kotak-kotak)
function drawGrid() {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }
  ctx.stroke();
}

// Fungsi untuk menggambar pemain
function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(playerX * gridSize, playerY * gridSize, gridSize, gridSize);
}

// Fungsi untuk menggambar tujuan
function drawGoal() {
  ctx.fillStyle = "green";
  ctx.fillRect(goalX * gridSize, goalY * gridSize, gridSize, gridSize);
}

// Fungsi untuk menggambar nyawa
function drawLives() {
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText("Lives: " + lives, 10, 30);
}

// Fungsi untuk memperbarui canvas
function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWall();
  drawGrid();
  drawPlayer();
  drawGoal();
  drawLives();
}

// Fungsi untuk menangani input keyboard
function handleKeyDown(event) {
  if (lives > 0) {
    let newX = playerX;
    let newY = playerY;
    switch (event.key) {
      case "ArrowUp":
        newY--;
        break;
      case "ArrowDown":
        newY++;
        break;
      case "ArrowLeft":
        newX--;
        break;
      case "ArrowRight":
        newX++;
        break;
    }

    // Cek apakah ada tembok di posisi yang baru
    if (!isWall(newX, newY) && newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
      playerX = newX;
      playerY = newY;
    }
    checkCollisions();
    updateCanvas();
  }
}

// fungsi untuk apakah posisi baru ada tembok
function isWall(x, y) {
  return walls.some((wall) => wall[0] === x && wall[1] === y);
}

// Fungsi untuk memeriksa apakah pemain mencapai tujuan atau tabrakan
function checkCollisions() {
  if (playerX === goalX && playerY === goalY) {
    alert("Congratulations, you win!");
    resetGame();
  } else if (Math.random() < 0.1) {
    // Simulasi tabrakan
    lives--;
    if (lives <= 0) {
      alert("Game Over!");
      resetGame();
    }
  }
}

// algoritma Breadth-First Search (BFS) untuk cek jalur
function isPathAvailable() {
  const queue = [[0, 0]];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  visited[0][0] = true;

  const directions = [
    [0, 1], // atas
    [1, 0], // bawah
    [0, -1], // kiri
    [-1, 0], // kanan
  ];

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    if (x === goalX && y === goalY) {
      return true;
    }

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && !visited[newY][newX] && !isWall(newX, newY)) {
        visited[newY][newX] = true;
        queue.push([newX, newY]);
      }
    }
  }
  return false;
}

// Fungsi untuk mereset game
function resetGame() {
  playerX = 0;
  playerY = 0;
  lives = 3;
  GenerateRandomWalls();
  updateCanvas();
}

// Event listener untuk input keyboard
window.addEventListener("keydown", handleKeyDown);

// Mulai game
GenerateRandomWalls();
updateCanvas();
