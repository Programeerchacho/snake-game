const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const finalScoreText = document.getElementById("finalScore");
const gameOverScreen = document.getElementById("gameOver");

const gridSize = 20;
const speed = 100;

// Game state
let snake;
let direction;
let food;
let score;
let gameLoop;
let gameRunning = false;

// Tongue animation
let tongueTimer = 0;
let tongueOut = false;

// Grass particles
let grass = [];

function startGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: gridSize, y: 0 };
    food = randomFood();
    score = 0;
    gameRunning = true;

    scoreText.textContent = "Score: 0";
    gameOverScreen.classList.add("hidden");

    tongueTimer = 0;
    tongueOut = false;

    createGrass();

    clearInterval(gameLoop);
    gameLoop = setInterval(gameTick, speed);
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * 20) * gridSize,
        y: Math.floor(Math.random() * 20) * gridSize
    };
}

/* 🌱 Create grass */
function createGrass() {
    grass = [];
    for (let i = 0; i < 150; i++) {
        grass.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            height: 4 + Math.random() * 6,
            sway: Math.random() * Math.PI * 2
        });
    }
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

    // 🚨 WALL COLLISION ONLY
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
    // 🟢 Paint green background manually
    ctx.fillStyle = "#3fa34d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrass();

    // 🍎 Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // 🐍 Snake
    ctx.fillStyle = "lime";
    snake.forEach(part =>
        ctx.fillRect(part.x, part.y, gridSize, gridSize)
    );

    drawEyesAndTongue();
}

/* 🌿 Grass animation */
function drawGrass() {
    ctx.strokeStyle = "#1b5e20";
    ctx.lineWidth = 1;

    grass.forEach(g => {
        g.sway += 0.05;

        ctx.beginPath();
        ctx.moveTo(g.x, g.y);
        ctx.lineTo(
            g.x + Math.sin(g.sway) * 2,
            g.y - g.height
        );
        ctx.stroke();
    });
}

function drawEyesAndTongue() {
    const head = snake[0];
    const centerX = head.x + gridSize / 2;
    const centerY = head.y + gridSize / 2;

    // 👀 Eyes
    ctx.fillStyle = "black";
    ctx.beginPath();

    if (direction.x !== 0) {
        ctx.arc(centerX + direction.x / 2, centerY - 5, 2, 0, Math.PI * 2);
        ctx.arc(centerX + direction.x / 2, centerY + 5, 2, 0, Math.PI * 2);
    } else {
        ctx.arc(centerX - 5, centerY + direction.y / 2, 2, 0, Math.PI * 2);
        ctx.arc(centerX + 5, centerY + direction.y / 2, 2, 0, Math.PI * 2);
    }
    ctx.fill();

    // Distance to apple (blocks)
    const distance =
        Math.abs(head.x - food.x) / gridSize +
        Math.abs(head.y - food.y) / gridSize;

    // 👅 Animated tongue
    if (distance <= 2) {
        tongueTimer++;

        if (tongueTimer % 10 === 0) {
            tongueOut = !tongueOut;
        }

        if (tongueOut) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + direction.x * 1.2,
                centerY + direction.y * 1.2
            );
            ctx.stroke();
        }
    } else {
        tongueOut = false;
        tongueTimer = 0;
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

// ▶ Start game
startGame();
