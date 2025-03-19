import { createDeck, drawCards } from "./api.js";
import { 
    playerCards, dealerCards, setGameOver, resetGame, 
    calculateScore, dealerPlay, checkWinner 
} from './blackJack.js';

const playerHand = document.getElementById("player-hand");
const dealerHand = document.getElementById("dealer-hand");
const hitButton = document.getElementById("hit");
const standButton = document.getElementById("stand");
const newGameButton = document.getElementById("new-game");
const modal = document.getElementById("game-modal");
const doubleBtn = document.getElementById("double");
const closeModalBtn = document.getElementById("close-modal");

function updateUI() {
    playerHand.innerHTML = playerCards.map(card => `<img src="${card.image}" alt="${card.code}">`).join("");
    if (!setGameOver) {
        dealerHand.innerHTML = dealerCards.map(() => `<img src="https://deckofcardsapi.com/static/img/back.png">`).join("");
    } else {
        dealerHand.innerHTML = dealerCards.map(card => `<img src="${card.image}" alt="${card.code}">`).join("");
    }
}

async function startGame() {
    await createDeck();
    resetGame();
    playerCards.push(...await drawCards(2));
    dealerCards.push(...await drawCards(2));
    updateUI();
    hitButton.disabled = false;
    standButton.disabled = false;
    modal.style.display = "none";
}

async function hit() {
    playerCards.push(...await drawCards(1));
    updateUI();
    if (calculateScore(playerCards) > 21) {
        endGame("lose");
    }
}

async function stand() {
    await dealerPlay();
    const result = checkWinner();
    endGame(result);
}

function endGame(status) {
    hitButton.disabled = true;
    standButton.disabled = true;
    setGameOver(true);   // ✅ Así modificas el valor exportado
    updateUI();

    // Actualizar puntaje solo si ganó el jugador
    updateScore(status);

    if (status === "win") {
        alert("¡Ganaste!");
    } else if (status === "draw") {
        alert("Empate");
    } else {
        showModal();
    }
}

function updateScore(status) {
    let score = parseInt(localStorage.getItem("blackjackScore")) || 0;

    if (status === "win") {
        score += 100;
    } else if (status === "lose") {
        score -= 50;  // Penalización por perder
        if (score < 0) score = 0;  // Evita score negativo
    }

    localStorage.setItem("blackjackScore", score);
    document.getElementById("score").textContent = `Puntuación: ${score}`;
}


function loadScore() {
    const score = parseInt(localStorage.getItem("blackjackScore")) || 0;
    const scoreElement = document.getElementById("score");
    if (scoreElement) scoreElement.textContent = `Puntuación: ${score}`;
}


function showModal() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

doubleBtn.addEventListener("click", () => {
    closeModal();
});

async function doubleOrNothing() {
    const card = await drawCards(1);
    let cardValue = ["KING", "QUEEN", "JACK"].includes(card[0].value) ? 10 :
                    card[0].value === "ACE" ? 11 : parseInt(card[0].value);
    alert(`Tu carta es: ${card[0].value} (${cardValue})`);

    if (cardValue > 8) {
        alert("¡Ganaste el Doble o Nada!");
    } else {
        alert("Perdiste el Doble o Nada.");
    }
    modal.style.display = "none";
}

hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
newGameButton.addEventListener("click", startGame);
doubleBtn.addEventListener("click", doubleOrNothing);
closeModalBtn.addEventListener("click", () => modal.style.display = "none");

startGame();
loadScore();
