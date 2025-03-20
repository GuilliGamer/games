// Obter elementos do HTML
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

// URL da imagem da cabeça da cobra
const snakeHeadImageSrc = "https://static.wixstatic.com/media/11cb05_6cea4633f59c47eda675092173a1476c~mv2.gif"; // Substitua pela URL da sua imagem
const snakeHeadImage = new Image();
snakeHeadImage.src = snakeHeadImageSrc;

// URL da imagem da ficha de Lolycoin
const foodImageSrc = "https://static.wixstatic.com/media/11cb05_b3eeaeae3cd64facab6279fab2e1c3ce~mv2.png/v1/fill/w_125,h_125,al_c,q_85,usm_0.33_1.00_0.00,enc_avif,quality_auto/LolicoinBetapp.png"; // Substitua pela URL da sua imagem
const foodImage = new Image();
foodImage.src = foodImageSrc;

// Sistema de fichas e Lolicoins
let Lolicoins = parseInt(localStorage.getItem("Lolicoins") || "0");
let tokens = parseInt(localStorage.getItem("tokens") || "0");

// Garante que o jogador tenha pelo menos 1 ficha ao iniciar
if (tokens === 0) {
    tokens = 1;
    saveProgress();
}

// Atualiza informações na interface
function updateUI() {
    document.getElementById("score").innerText = `Score: ${score} Lolicoins`;
    document.getElementById("level").innerText = `Level: ${level}`;
    document.getElementById("Lolicoins").innerText = `Lolicoins: ${Lolicoins}`;
    document.getElementById("tokens").innerText = `Fichas: ${tokens}`;
}

// Gera comida em uma posição aleatória
function spawnFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

// Desenha o elemento
function drawElement(x, y, isHead = false) {
    if (isHead) {
        ctx.drawImage(snakeHeadImage, x, y, gridSize, gridSize); // Desenha a imagem da cabeça da cobra
    } else {
        ctx.drawImage(foodImage, x, y, gridSize, gridSize); // Desenha a imagem do corpo da cobra
    }
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
        Lolicoins += 10;
        playEatSound();  // Toca o som de "comer" ao comer o item
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
    playScoreSound();  // Toca o som de "pontuação" ao atingir um novo nível
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
        playGameOverSound();  // Toca o som de "game over"
        alert(`Game Over! Sua pontuação: ${score}`);
        Lolicoins += score;
        saveProgress();
        resetGame();
    } else {
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        updateSnake();
        ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize); // Desenha a imagem da ficha
        snake.forEach((part, index) => {
            const isHead = index === 0;
            drawElement(part.x, part.y, isHead); // Desenha a cabeça com a imagem e o corpo com a imagem da comida
        });
    }
}

// Salva o progresso no localStorage
function saveProgress() {
    localStorage.setItem("Lolicoins", Lolicoins.toString());
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
    if (Lolicoins >= 10) {
        Lolicoins -= 10;
        tokens++;
        saveProgress();
        updateUI();
        alert("Ficha comprada com sucesso! O jogo será reiniciado.");
        resetGame(); // Reinicia o jogo automaticamente
    } else {
        alert("Você não tem Lolicoins suficientes!");
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

//-----------SONS PARA O JOGO ------------
// Carregar sons
const eatSound = new Audio('sounds/eat.mp3');
const gameOverSound = new Audio('sounds/gameover.mp3');
const scoreSound = new Audio('sounds/score.mp3');

// Função para tocar o som de "comer"
function playEatSound() {
    eatSound.play();
}

// Função para tocar o som de "game over"
function playGameOverSound() {
    gameOverSound.play();
}

// Função para tocar o som de "pontuação"
function playScoreSound() {
    scoreSound.play();
}
