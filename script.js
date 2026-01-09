const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: gridSize, y: 0 };
let food = randomFood();

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
    snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));

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
    if (head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height) {
        resetGame();
        return;
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        food = randomFood();
    } else {
        snake.pop();
    }
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: gridSize, y: 0 };
    food = randomFood();
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && direction.y === 0)
        direction = { x: 0, y: -gridSize };
    if (e.key === "ArrowDown" && direction.y === 0)
        direction = { x: 0, y: gridSize };
    if (e.key === "ArrowLeft" && direction.x === 0)
        direction = { x: -gridSize, y: 0 };
    if (e.key === "ArrowRight" && direction.x === 0)
        direction = { x: gridSize, y: 0 };
});

setInterval(draw, 100);

