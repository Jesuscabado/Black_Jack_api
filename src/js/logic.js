import { createDeck, drawCards } from "./api.js";

const playerHand = document.getElementById("player-hand");
const dealerHand = document.getElementById("dealer-hand");
const hitButton = document.getElementById("hit");
const standButton = document.getElementById("stand");
const newGameButton = document.getElementById("new-game");
const modal = document.getElementById("game-modal");
const doubleBtn = document.getElementById("double");
const closeModalBtn = document.getElementById("close-modal");

let playerCards = [];
let dealerCards = [];
let gameOver = false;

function updateUI() {
    playerHand.innerHTML = playerCards.map(card => `<img src="${card.image}" alt="${card.code}">`).join("");
    if (!gameOver) {
        dealerHand.innerHTML = dealerCards.map(() => `<img src="https://deckofcardsapi.com/static/img/back.png">`).join("");
    } else {
        dealerHand.innerHTML = dealerCards.map(card => `<img src="${card.image}" alt="${card.code}">`).join("");
    }
}

function calculateScore(cards) {
    let score = 0;
    let aces = 0;
    cards.forEach(card => {
        if (["KING", "QUEEN", "JACK"].includes(card.value)) score += 10;
        else if (card.value === "ACE") {
            aces++;
            score += 11;
        } else score += parseInt(card.value);
    });
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}

async function startGame() {
    await createDeck();
    playerCards = await drawCards(2);
    dealerCards = await drawCards(2);
    gameOver = false;
    modal.style.display = "none";
    updateUI();
    hitButton.disabled = false;
    standButton.disabled = false;
}

async function hit() {
    const newCard = await drawCards(1);
    playerCards.push(...newCard);
    updateUI();

    if (calculateScore(playerCards) > 21) {
        endGame("lose");
    }
}

async function stand() {
    while (calculateScore(dealerCards) < 17) {
        const newCard = await drawCards(1);
        dealerCards.push(...newCard);
    }
    checkWinner();
}

function checkWinner() {
    const playerScore = calculateScore(playerCards);
    const dealerScore = calculateScore(dealerCards);
    if (dealerScore > 21 || playerScore > dealerScore) {
        alert("¡Ganaste!");
        endGame("win");
    } else if (playerScore === dealerScore) {
        alert("Empate.");
        endGame("draw");
    } else {
        endGame("lose");
    }
}

function endGame(status) {
    gameOver = true;
    updateUI();
    hitButton.disabled = true;
    standButton.disabled = true;

    if (status === "lose") {
        showModal(); // ✅ Lanza el modal al perder
    }
}

function showModal() {
    modal.style.display = "flex";
}

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
