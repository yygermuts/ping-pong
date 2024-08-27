const canvas = document.getElementById('pingPongCanvas');
const ctx = canvas.getContext('2d');

// Sons
const hitSound = new Audio('hit.mp3');
const scoreSound = new Audio('score.mp3');
const backgroundMusic = new Audio('background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;
backgroundMusic.play();

// Placar
let playerScore = 0;
let computerScore = 0;

// Nível de dificuldade
const difficultySelect = document.getElementById('difficulty');
let difficulty = parseInt(difficultySelect.value);

difficultySelect.addEventListener('change', function() {
    difficulty = parseInt(this.value);
});

// Propriedades da bola
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 3, // Velocidade reduzida
    dx: 3, // Velocidade horizontal
    dy: 3 // Velocidade vertical
};

// Propriedades das raquetes
const paddleWidth = 10;
const paddleHeight = 100;
const playerPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 8
};

const computerPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 4
};

// Função para desenhar a bola
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

// Função para desenhar as raquetes
function drawPaddle(x, y, width, height) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, width, height);
}

// Função para desenhar o placar
function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Player: ${playerScore} | Computer: ${computerScore}`, canvas.width / 2, 30);
}

// Função para tocar o som de toque
function playHitSound() {
    hitSound.currentTime = 0; // Rewind para tocar o som a partir do início
    hitSound.play();
}

// Função para tocar o som de ponto
function playScoreSound() {
    scoreSound.currentTime = 0; // Rewind para tocar o som a partir do início
    scoreSound.play();
}

// Função para mover a bola
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Verifica colisão com as paredes superior e inferior
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Verifica colisão com as raquetes
    if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y &&
        ball.y < playerPaddle.y + playerPaddle.height) {
        ball.dx *= -1;
        ball.dy += (Math.random() - 0.5) * 2; // Adiciona aleatoriedade na direção vertical
        playHitSound();
    }

    if (ball.x + ball.radius > computerPaddle.x &&
        ball.y > computerPaddle.y &&
        ball.y < computerPaddle.y + computerPaddle.height) {
        ball.dx *= -1;
        ball.dy += (Math.random() - 0.5) * 2; // Adiciona aleatoriedade na direção vertical
        playHitSound();
    }

    // Verifica se a bola saiu pela esquerda ou pela direita
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        playScoreSound();
        if (playerScore >= 10) {
            alert('Você ganhou!');
            resetGame();
        } else {
            resetBall();
        }
    } else if (ball.x - ball.radius < 0) {
        computerScore++;
        playScoreSound();
        if (computerScore >= 10) {
            alert('O computador ganhou!');
            resetGame();
        } else {
            resetBall();
        }
    }
}

// Função para resetar o jogo
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    resetBall();
}

// Função para resetar a bola após um ponto
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx; // Inverte a direção horizontal
    ball.dy = (Math.random() - 0.5) * 2; // Adiciona uma nova direção vertical aleatória
}

// Função para mover a raquete do jogador
function movePlayerPaddle() {
    playerPaddle.y += playerPaddle.dy;

    // Limites da raquete
    if (playerPaddle.y < 0) {
        playerPaddle.y = 0;
    }

    if (playerPaddle.y + playerPaddle.height > canvas.height) {
        playerPaddle.y = canvas.height - playerPaddle.height;
    }
}

// Função para mover a raquete do computador
function moveComputerPaddle() {
    const distanceToBall = Math.abs(ball.y - (computerPaddle.y + computerPaddle.height / 2));

    // Ajusta a velocidade com base na dificuldade
    const speed = difficulty * 2;

    // Introduz um atraso ou erro na reação da IA
    const reactionTime = 1000 / difficulty; // Menor dificuldade = maior erro possível
    const randomFactor = Math.random() * reactionTime;

    if (ball.y < computerPaddle.y + computerPaddle.height / 2 - randomFactor) {
        computerPaddle.y -= speed / difficulty;
    } else if (ball.y > computerPaddle.y + computerPaddle.height / 2 + randomFactor) {
        computerPaddle.y += speed / difficulty;
    }

    // Limites da raquete
    if (computerPaddle.y < 0) {
        computerPaddle.y = 0;
    }

    if (computerPaddle.y + computerPaddle.height > canvas.height) {
        computerPaddle.y = canvas.height - computerPaddle.height;
    }
}

// Função para atualizar o jogo
function update() {
    moveBall();
    movePlayerPaddle();
    moveComputerPaddle();
}

// Função para desenhar o jogo
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    drawPaddle(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height);
    drawScore();
}

// Função principal de loop do jogo
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Controles do jogador
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') {
        playerPaddle.dy = -playerPaddle.speed;
    } else if (e.key === 'ArrowDown') {
        playerPaddle.dy = playerPaddle.speed;
    }
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        playerPaddle.dy = 0;
    }
});

// Inicia o loop do jogo
gameLoop();