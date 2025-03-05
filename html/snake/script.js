document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const levelSelect = document.getElementById('level');
    const toggleButton = document.getElementById('toggleButton');
    const gridSize = 10;
    let snake = [{ x: 2, y: 2 }];
    let direction = 'right';
    let food = getRandomPosition();
    let isPaused = false;
    let gameSpeed = 200;

    function getRandomPosition() {
        const x = Math.floor(Math.random() * (gameBoard.clientWidth / gridSize));
        const y = Math.floor(Math.random() * (gameBoard.clientHeight / gridSize));
        return { x, y };
    }

    function draw() {
        gameBoard.innerHTML = '';

        // Draw Snake
        snake.forEach(segment => {
            const segmentElement = document.createElement('div');
            segmentElement.className = 'snake-segment';
            segmentElement.style.left = segment.x * gridSize + 'px';
            segmentElement.style.top = segment.y * gridSize + 'px';
            gameBoard.appendChild(segmentElement);
        });

        // Draw Food
        const foodElement = document.createElement('div');
        foodElement.className = 'food';
        foodElement.style.left = food.x * gridSize + 'px';
        foodElement.style.top = food.y * gridSize + 'px';
        gameBoard.appendChild(foodElement);
    }

    function update() {
        const head = { ...snake[0] };

        // Update Snake's Position
        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }

        // Check for Collision with Food
        if (head.x === food.x && head.y === food.y) {
            snake.unshift({ ...food });
            food = getRandomPosition();
        } else {
            // Move Snake
            snake.unshift(head);
            snake.pop();
        }

        // Check for Collision with Walls
        if (head.x < 0 || head.x >= gameBoard.clientWidth / gridSize ||
            head.y < 0 || head.y >= gameBoard.clientHeight / gridSize) {
            resetGame();
        }
    }

    function gameLoop() {
        if (!isPaused) {
            update();
            draw();
        }
    }

    function changeDirection(event) {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }

    function togglePause() {
        isPaused = !isPaused;
        toggleButton.textContent = isPaused ? 'Resume' : 'Pause';
    }

    function handleButtonClick() {
        togglePause();
    }

    function resetGame() {
        snake.length = 1;
        snake[0] = { x: 2, y: 2 };
        direction = 'right';
        food = getRandomPosition();
    }

    function changeLevel() {
        const selectedLevel = levelSelect.value;
        switch (selectedLevel) {
            case 'easy':
                gameSpeed = 300;
                break;
            case 'normal':
                gameSpeed = 200;
                break;
            case 'hard':
                gameSpeed = 100;
                break;
        }
        resetGame();
    }

    // Set up button click events
    toggleButton.addEventListener('click', handleButtonClick);
    levelSelect.addEventListener('change', changeLevel);

    setInterval(gameLoop, gameSpeed);
    document.addEventListener('keydown', changeDirection);
});
