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

    clearInterval(gameLoop);
    gameLoop = setInterval(gameTick, speed);
}

function randomFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    } while (snake.some(part => part.x === x && part.y === y));
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

    // Wrap horizontally
    if (headX < 0) headX = canvas.width - gridSize;
    if (headX >= canvas.width) headX = 0;

    // Wrap vertically
    if (headY < 0) headY = canvas.height - gridSize;
    if (headY >= canvas.height) headY = 0;

    const head = { x: headX, y: headY };

    // Self-collision
    if (snake.some(part => part.x === head.x && part.y === head.y)) {
        endGame(false);
        return;
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreText.textContent = "Score: " + score;

        // Check for win
        if (snake.length === (canvas.width / gridSize) * (canvas.height / gridSize)) {
            endGame(true);
            return;
        }

        food = randomFood();
    } else {
        snake.pop();
    }
}

function drawGame() {
    // Green background
    ctx.fillStyle = "#3fa34d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Snake
    ctx.fillStyle = "lime";
    snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));

    drawEyesAndTongue();
}

function drawEyesAndTongue() {
    const head = snake[0];
    const centerX = head.x + gridSize / 2;
    const centerY = head.y + gridSize / 2;

    // Eyes
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

    // Tongue flick
    const distance =
        Math.abs(head.x - food.x) / gridSize +
        Math.abs(head.y - food.y) / gridSize;

    if (distance <= 2) {
        tongueTimer++;
        if (tongueTimer % 10 === 0) tongueOut = !tongueOut;

        if (tongueOut) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + direction.x * 1.2, centerY + direction.y * 1.2);
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
    if (win) {
        finalScoreText.textContent = "You Win! Score: " + score;
        gameOverScreen.querySelector("button").style.display = "inline-block"; // show Play Again
    } else {
        finalScoreText.textContent = "Game Over! Score: " + score;
        gameOverScreen.querySelector("button").style.display = "none"; // hide button
    }
    gameOverScreen.classList.remove("hidden");
}

function restartGame() {
    startGame();
}

// Keyboard input
document.addEventListener("keydown", e => {
    if (!gameRunning) return;

    if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -gridSize };
    if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: gridSize };
    if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -gridSize, y: 0 };
    if (e.key === "ArrowRight" && direction.x === 0) direction = { x: gridSize, y: 0 };
});

// Start game
startGame();
