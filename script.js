const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const finalScoreText = document.getElementById("finalScore");
const gameOverScreen = document.getElementById("gameOver");

const gridSize = 20;
const speed = 100;

let snake;
let direction;
let food;
let score;
let gameLoop;
let gameRunning = false;

function startGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: gridSize, y: 0 };
    food = randomFood();
    score = 0;
    gameRunning = true;

    scoreText.textContent = "Score: 0";
    gameOverScreen.classList.add("hidden");

    clearInterval(gameLoop);
    gameLoop = setInterval(gameTick, speed);
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * 20) * gridSize,
        y: Math.floor(Math.random() * 20) * gridSize
    };
}

function gameTick() {
    if (!gameRunning) return;
    moveSnake();
    drawGame();
}

function moveSnake() {
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Wall collision ONLY
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height
    ) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreText.textContent = "Score: " + score;
        food = randomFood();
    } else {
        snake.pop();
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Draw snake body
    ctx.fillStyle = "lime";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });

    drawEyesAndTongue();
}

function drawEyesAndTongue() {
    const head = snake[0];
    const centerX = head.x + gridSize / 2;
    const centerY = head.y + gridSize / 2;

    // 🧿 Eyes
    ctx.fillStyle = "black";

    let eyeOffsetX = 0;
    let eyeOffsetY = 0;

    if (direction.x !== 0) {
        eyeOffsetY = 5;
        ctx.beginPath();
        ctx.arc(centerX + direction.x / 2, centerY - eyeOffsetY, 2, 0, Math.PI * 2);
        ctx.arc(centerX + direction.x / 2, centerY + eyeOffsetY, 2, 0, Math.PI * 2);
        ctx.fill();
    } else {
        eyeOffsetX = 5;
        ctx.beginPath();
        ctx.arc(centerX - eyeOffsetX, centerY + direction.y / 2, 2, 0, Math.PI * 2);
        ctx.arc(centerX + eyeOffsetX, centerY + direction.y / 2, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // 👅 Tongue when close to apple (2 blocks)
    const distance =
        Math.abs(head.x - food.x) / gridSize +
        Math.abs(head.y - food.y) / gridSize;

    if (distance <= 2) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + direction.x * 0.8,
            centerY + direction.y * 0.8
        );
        ctx.stroke();
    }
}

function endGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    finalScoreText.textContent = "Final Score: " + score;
    gameOverScreen.classList.remove("hidden");
}

function restartGame() {
    startGame();
}

document.addEventListener("keydown", e => {
    if (!gameRunning) return;

    if (e.key === "ArrowUp" && direction.y === 0)
        direction = { x: 0, y: -gridSize };

    if (e.key === "ArrowDown" && direction.y === 0)
        direction = { x: 0, y: gridSize };

    if (e.key === "ArrowLeft" && direction.x === 0)
        direction = { x: -gridSize, y: 0 };

    if (e.key === "ArrowRight" && direction.x === 0)
        direction = { x: gridSize, y: 0 };
});

// Start game
startGame();
