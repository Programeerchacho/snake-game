const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");

const gridSize = 20;

let snake, direction, food, score, gameLoop;
let gameRunning = true;

function initGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: gridSize, y: 0 };
    food = randomFood();
    score = 0;
    gameRunning = true;
    scoreText.textContent = "Score: 0";
    gameOverScreen.classList.add("hidden");

    clearInterval(gameLoop);
    gameLoop = setInterval(draw, 100);
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * 20) * gridSize,
        y: Math.floor(Math.random() * 20) * gridSize
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "lime";
    snake.forEach(part =>
        ctx.fillRect(part.x, part.y, gridSize, gridSize)
    );

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    moveSnake();
}

function moveSnake() {
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Wall collision
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        snake.some(part => part.x === head.x && part.y === head.y)
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

function endGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    gameOverScreen.classList.remove("hidden");
}

function restartGame() {
    initGame();
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
initGame();
