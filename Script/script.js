const hangmanImage = document.querySelector(".hangman-box img");
const WordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");

let currentword, correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    // Resetando variáveis e interface
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `../Assets/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    WordDisplay.innerHTML = currentword.split("").map(() => ` <li class="letter"></li>`).join("");
    // Remove o modal
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    // Seleciona uma palavra e uma pista aleatória da wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentword = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

const gameOver = (isVictory) => {
    // Depois de 300ms do jogo completo... mostrar o modal revelando os detalhes
    setTimeout(() => {
        const modalTex = isVictory ? `Você encontrou a palavra:` : `A palavra correta era:`;
        gameModal.querySelector(".img").src = `../Assets/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = `${isVictory ? 'Parabéns' : 'Fim de Jogo'}`;
        gameModal.querySelector("p").innerHTML = `${modalTex} <b>${currentword}</b>`;
        gameModal.classList.add("show");
    }, 300);
}

initGame = (button, clickedLetter) => {
    // Verifica se a letra clicada existe na palavra atual
    if (currentword.includes(clickedLetter)) {
        // Mostra todas as letras corretas na exibição da palavra
        [...currentword].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter)
                WordDisplay.querySelectorAll("li")[index].innerText = letter;
                WordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        })
    } else {
        // Caso a letra não exista, atualiza a contagem de erros e a imagem da forca
        wrongGuessCount++;
        hangmanImage.src = `../Assets/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Chama a função gameOver se alguma dessas condições for atingida
    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentword.length) return gameOver(true);
}

// Criação dos botões do teclado e adicionando eventos de clique
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)))
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
