let score = 0;
let interval = 3000;  // Начальный интервал медленнее (3 секунды)
let missedClicks = 0;
const maxMissedClicks = 1;  // Количество допустимых ошибок уменьшено до 1
let gameStarted = false;
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const imageContainer = document.getElementById('image-container');
const accelerationFactor = 0.95;  // Более постепенное ускорение

// Проверка наличия лучшего результата в LocalStorage при загрузке страницы
let bestScore = localStorage.getItem('bestScore') || 0;
bestScoreDisplay.innerText = `Best Score: ${bestScore}`;

function getRandomPosition(imageWidth, imageHeight) {
    const x = Math.random() * (gameContainer.clientWidth - imageWidth);
    const y = Math.random() * (gameContainer.clientHeight - 50 - imageHeight); // Учитываем верхний отступ
    return { x, y };
}

function spawnImage() {
    const img = document.createElement('img');
    img.src = './images/pepe.png'; // Относительный путь к вашему изображению
    const imageSize = getImageSize();
    img.style.width = `${imageSize}px`;  // Увеличенный размер изображения
    img.style.height = `${imageSize}px`; // Увеличенный размер изображения

    const { x, y } = getRandomPosition(imageSize, imageSize);
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    imageContainer.appendChild(img);

    const decreaseSizeInterval = setInterval(() => {
        const currentWidth = parseInt(img.style.width);
        const currentHeight = parseInt(img.style.height);
        if (currentWidth > 12.5 && currentHeight > 12.5) {  // Минимальный размер изображения
            img.style.width = `${currentWidth - imageSize * 0.01}px`;
            img.style.height = `${currentHeight - imageSize * 0.01}px`;
        } else {
            clearInterval(decreaseSizeInterval);
            imageContainer.removeChild(img);
            missedClicks++;
            if (missedClicks >= maxMissedClicks) {
                resetGame();
            } else {
                if (imageContainer.children.length === 0) {
                    spawnImage();
                }
            }
        }
    }, interval / 100);

    img.addEventListener('click', () => {
        if (!gameStarted) {
            gameStarted = true;
        }
        clearInterval(decreaseSizeInterval);
        imageContainer.removeChild(img);
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
        interval *= accelerationFactor;
        spawnImage();
    });
}

function resetGame() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }
    bestScoreDisplay.innerText = `Best Score: ${bestScore}`; // Обновление отображения лучшего результата
    missedClicks = 0;
    score = 0;
    interval = 3000;  // Сброс начального интервала до более медленного значения
    gameStarted = false;
    scoreDisplay.innerText = `Score: ${score}`;
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }
    spawnInitialImage();
}

function spawnInitialImage() {
    const img = document.createElement('img');
    img.src = './images/pepe.png'; // Относительный путь к вашему изображению
    const imageSize = getImageSize();
    img.style.width = `${imageSize}px`;  // Увеличенный размер изображения
    img.style.height = `${imageSize}px`; // Увеличенный размер изображения
    img.classList.add('pulsing'); // Добавление класса пульсации

    const { x, y } = getRandomPosition(imageSize, imageSize);
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    imageContainer.appendChild(img);

    img.addEventListener('click', () => {
        gameStarted = true;
        img.classList.remove('pulsing'); // Удаление класса пульсации после первого клика
        imageContainer.removeChild(img);
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
        interval *= accelerationFactor;
        spawnImage();
    });
}

function getImageSize() {
    const width = window.innerWidth;
    if (width <= 480) {
        return 60;
    } else if (width <= 768) {
        return 80;
    } else if (width <= 1200) {
        return 100;
    } else {
        return 125;
    }
}

// Начало игры при загрузке страницы, показ первого изображения
spawnInitialImage();