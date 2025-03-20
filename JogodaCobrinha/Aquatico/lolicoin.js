const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;
let score = 0;
let level = 1;
let speed = 300;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = spawnFood();
let gameInterval;
let isGameOver = false;

// URL da imagem da ficha de Lolycoin
const foodImageSrc = "https://static.wixstatic.com/media/11cb05_b3eeaeae3cd64facab6279fab2e1c3ce~mv2.png/v1/fill/w_125,h_125,al_c,q_85,usm_0.33_1.00_0.00,enc_avif,quality_auto/LolicoinBetapp.png"; // Substitua pela URL da sua imagem
const foodImage = new Image();
foodImage.src = foodImageSrc;

// Sistema de fichas e Lolycoins
let lolycoins = parseInt(localStorage.getItem("lolycoins") || "0");
let tokens = parseInt(localStorage.getItem("tokens") || "0");

// Garante que o jogador tenha pelo menos 1 ficha ao iniciar
if (tokens === 0) {
    tokens = 1;
    saveProgress();
}

// Atualiza informações na interface
function updateUI() {
    document.getElementById("score").innerText = `Score: ${score} Lolycoins`;
    document.getElementById("level").innerText = `Level: ${level}`;
    document.getElementById("lolycoins").innerText = `Lolycoins: ${lolycoins}`;
    document.getElementById("tokens").innerText = `Fichas: ${tokens}`;
}

// Gera comida em uma posição aleatória
function spawnFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

// Desenha o elemento
function drawElement(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
    ctx.strokeStyle = "#003300";
    ctx.strokeRect(x, y, gridSize, gridSize);
}

// Atualiza a posição da cobra
function updateSnake() {
    const head = {
        x: snake[0].x + direction.x * gridSize,
        y: snake[0].y + direction.y * gridSize,
    };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        lolycoins += 10;
        if (score % 50 === 0) {
            levelUp();
        }
        updateUI();
        food = spawnFood();
    } else {
        snake.pop();
    }
}

// Aumenta o nível e acelera o jogo
function levelUp() {
    level++;
    speed -= 20;
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, speed);
    alert(`Parabéns! Você alcançou o nível ${level}.`);
}

// Verifica colisões
function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.y < 0 || head.x >= canvasSize || head.y >= canvasSize) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Atualiza o jogo
function updateGame() {
    if (isGameOver) return;

    if (checkCollision()) {
        isGameOver = true;
        alert(`Game Over! Sua pontuação: ${score}`);
        lolycoins += score;
        saveProgress();
        resetGame();
    } else {
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        updateSnake();
        ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize); // Desenha a imagem da ficha
        snake.forEach(part => drawElement(part.x, part.y, "#00cc00"));
    }
}

// Salva o progresso no localStorage
function saveProgress() {
    localStorage.setItem("lolycoins", lolycoins.toString());
    localStorage.setItem("tokens", tokens.toString());
}

// Reinicia o jogo
function resetGame() {
    if (tokens > 0) {
        tokens--;
        saveProgress();
        score = 0;
        level = 1;
        speed = 300;
        snake = [{ x: 200, y: 200 }];
        direction = { x: 0, y: 0 };
        food = spawnFood();
        isGameOver = false;
        updateUI();
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, speed);
    } else {
        alert("Você precisa de fichas para jogar!");
    }
}

// Compra uma ficha e reinicia o jogo
document.getElementById("buyToken").addEventListener("click", () => {
    if (lolycoins >= 10) {
        lolycoins -= 10;
        tokens++;
        saveProgress();
        updateUI();
        alert("Ficha comprada com sucesso! O jogo será reiniciado.");
        resetGame(); // Reinicia o jogo automaticamente
    } else {
        alert("Você não tem Lolycoins suficientes!");
    }
});

// Controla a direção
document.addEventListener("keydown", event => {
    const key = event.key;
    if (key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
    if (key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
    if (key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
    if (key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
});

// Inicializa o jogo
function startGame() {
    updateUI();
    if (tokens > 0) {
        resetGame();
    } else {
        alert("Você precisa de fichas para começar!");
    }
}

startGame();
