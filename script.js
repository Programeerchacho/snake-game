const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const finalScoreText = document.getElementById("finalScore");
const gameOverScreen = document.getElementById("gameOver");
const playAgainBtn = gameOverScreen.querySelector("button");

const gridSize = 20;
const speed = 100;

let snake = [];
let direction = { x: gridSize, y: 0 };
let food = {};
let score = 0;
let gameLoop;
let gameRunning = false;

// Tongue
let tongueTimer = 0;
let tongueOut = false;

function startGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: gridSize, y: 0 };
    food = spawnFood();
    score = 0;
    gameRunning = true;
    scoreText.textContent = "Score: 0";
    gameOverScreen.style.display = "none";
    tongueTimer = 0;
    tongueOut = false;

    clearInterval(gameLoop);
    gameLoop = setInterval(gameTick, speed);
}

function spawnFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    } while (snake.some(p => p.x === x && p.y === y));
    return { x, y };
}

function gameTick() {
    if (!gameRunning) return;
    moveSnake();
    drawGame();
}

function moveSnake() {
    let headX = snake[0].x + direction.x;
    let headY = snake[0].y + direction.y;

    // Wrap
    if (headX < 0) headX = canvas.width - gridSize;
    if (headX >= canvas.width) headX = 0;
    if (headY < 0) headY = canvas.height - gridSize;
    if (headY >= canvas.height) headY = 0;

    const head = { x: headX, y: headY };

    // Self-collision
    if (snake.some(p => p.x === head.x && p.y === head.y)) {
        endGame(false);
        return;
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreText.textContent = "Score: " + score;

        // Win condition
        const maxLength = (canvas.width / gridSize) * (canvas.height / gridSize);
        if (snake.length === maxLength) {
            endGame(true);
            return;
        }

        food = spawnFood();
    } else {
        snake.pop();
    }
}

function drawGame() {
    ctx.fillStyle = "#3fa34d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Snake
    ctx.fillStyle = "lime";
    snake.forEach(p => ctx.fillRect(p.x, p.y, gridSize, gridSize));

    drawEyesAndTongue();
}

function drawEyesAndTongue() {
    const head = snake[0];
    const cx = head.x + gridSize / 2;
    const cy = head.y + gridSize / 2;

    // Eyes
    ctx.fillStyle = "black";
    ctx.beginPath();
    if (direction.x !== 0) {
        ctx.arc(cx + direction.x / 2, cy - 5, 2, 0, Math.PI * 2);
        ctx.arc(cx + direction.x / 2, cy + 5, 2, 0, Math.PI * 2);
    } else {
        ctx.arc(cx - 5, cy + direction.y / 2, 2, 0, Math.PI * 2);
        ctx.arc(cx + 5, cy + direction.y / 2, 2, 0, Math.PI * 2);
    }
    ctx.fill();

    // Tongue
    const distance = Math.abs(head.x - food.x) / gridSize + Math.abs(head.y - food.y) / gridSize;
    if (distance <= 2) {
        tongueTimer++;
        if (tongueTimer % 10 === 0) tongueOut = !tongueOut;

        if (tongueOut) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + direction.x * 1.2, cy + direction.y * 1.2);
            ctx.stroke();
        }
    } else {
        tongueOut = false;
        tongueTimer = 0;
    }
}

function endGame(win) {
    gameRunning = false;
    clearInterval(gameLoop);
    finalScoreText.textContent = win ? `You Win! Score: ${score}` : `Game Over! Score: ${score}`;
    playAgainBtn.style.display = win ? "inline-block" : "none";
    gameOverScreen.style.display = "block";
}

function restartGame() {
    startGame();
}

document.addEventListener("keydown", e => {
    if (!gameRunning) return;

    if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -gridSize };
    if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: gridSize };
    if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -gridSize, y: 0 };
    if (e.key === "ArrowRight" && direction.x === 0) direction = { x: gridSize, y: 0 };
});

// Start the game
startGame();
