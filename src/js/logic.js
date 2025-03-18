// Importa las funciones de api.js
import { createDeck, drawCards } from "./api.js";

const playerHand = document.getElementById("player-hand");
const dealerHand = document.getElementById("dealer-hand");
const hitButton = document.getElementById("hit");
const standButton = document.getElementById("stand");
const newGameButton = document.getElementById("new-game");

let playerCards = [];
let dealerCards = [];
let deckId = ""; // Agrega el ID del mazo

// ✅ Función para actualizar las cartas en la interfaz
function updateUI() {
    playerHand.innerHTML = playerCards.map(card => `<img src="${card.image}" alt="${card.code}">`).join("");
    dealerHand.innerHTML = dealerCards.map(card => `<img src="${card.image}" alt="${card.code}">`).join("");
}

// ✅ Iniciar una nueva partida
async function startGame() {
    deckId = await createDeck(); // Llamamos a la función para crear el mazo
    playerCards = await drawCards(deckId, 2);  // Robar 2 cartas para el jugador
    dealerCards = await drawCards(deckId, 2);  // Robar 2 cartas para la banca
    updateUI();  // Actualiza la interfaz con las cartas
}

// ✅ Pedir una carta
async function hit() {
    const newCard = await drawCards(deckId, 1);  // Roba 1 carta
    playerCards.push(...newCard);
    updateUI();
}

// ✅ Quedarse (turno de la banca)
async function stand() {
    while (calculateScore(dealerCards) < 17) {
        const newCard = await drawCards(deckId, 1);  // Roba cartas hasta que la banca tenga al menos 17 puntos
        dealerCards.push(...newCard);
    }
    updateUI();
}

// ✅ Calcular puntaje (simplificado)
function calculateScore(cards) {
    let score = 0;
    let aces = 0;

    cards.forEach(card => {
        if (["KING", "QUEEN", "JACK"].includes(card.value)) {
            score += 10;
        } else if (card.value === "ACE") {
            aces += 1;
            score += 11;
        } else {
            score += parseInt(card.value);
        }
    });

    while (score > 21 && aces > 0) {
        score -= 10;
        aces -= 1;
    }

    return score;
}

// ✅ Eventos
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
newGameButton.addEventListener("click", startGame);

// ✅ Iniciar el juego al cargar la página
startGame();
