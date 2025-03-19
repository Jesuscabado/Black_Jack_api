import { drawCards } from './api.js';

export let playerCards = [];
export let dealerCards = [];
export let gameOver = false;


export function setGameOver(value) {
    gameOver = value;
}


export function resetGame() {
    playerCards = [];
    dealerCards = [];
    gameOver = false;
}

export function calculateScore(cards) {
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

export async function dealerPlay() {
    while (calculateScore(dealerCards) < 17) {
        const newCard = await drawCards(1);
        dealerCards.push(...newCard);
    }
}

export function checkWinner() {
    const playerScore = calculateScore(playerCards);
    const dealerScore = calculateScore(dealerCards);

    if (playerScore > 21) return "lose";
    if (dealerScore > 21 || playerScore > dealerScore) return "win";
    if (playerScore === dealerScore) return "draw";
    return "lose";
}
