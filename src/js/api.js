const API_BASE = "https://deckofcardsapi.com/api/deck";
let deckId = ""; // Se almacenará el ID del mazo

// ✅ Crear un nuevo mazo y barajar
async function createDeck() {
    try {
        const response = await fetch(`${API_BASE}/new/shuffle/?deck_count=1`);
        const data = await response.json();
        deckId = data.deck_id;
        console.log(`Mazo creado: ${deckId}`);
    } catch (error) {
        console.error("Error al crear el mazo:", error);
    }
}
console.log(`Mazo creado: ${deckId}`); // <-- Verifica en consola

// ✅ Robar cartas (se usa para repartir al jugador y la banca)
async function drawCards(count) {
    try {
        const response = await fetch(`${API_BASE}/${deckId}/draw/?count=${count}`);
        const data = await response.json();
        return data.cards; // Devuelve un array con las cartas
    } catch (error) {
        console.error("Error al robar cartas:", error);
        return [];
    }
}

export default{
     createDeck,
      drawCards 
};
