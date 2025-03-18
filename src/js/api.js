const API_BASE = "https://deckofcardsapi.com/api/deck";
let deckId = ""; // Se almacenará el ID del mazo

// ✅ Crear un nuevo mazo y barajar
async function createDeck() {
    try {
        const response = await fetch(`${API_BASE}/new/shuffle/?deck_count=1`);
        const data = await response.json();

        if (data.success) {
            deckId = data.deck_id;
            console.log(`✅ Mazo creado: ${deckId}`);

            // Muestra el ID en pantalla (opcional)
            const deckInfo = document.getElementById("deck-info");
            if (deckInfo) {
                deckInfo.textContent = `Mazo ID: ${deckId}`;
            }
        } else {
            throw new Error('No se pudo crear el mazo');
        }
    } catch (error) {
        console.error("❌ Error al crear el mazo:", error);
    }
}

// ✅ Robar cartas (se usa para repartir al jugador y la banca)
async function drawCards(count) {
    if (!deckId) {
        console.error("❌ Error: El mazo no ha sido creado. Llama a createDeck() primero.");
        throw new Error("El mazo no ha sido creado. Llama a createDeck() primero.");
    }

    try {
        const response = await fetch(`${API_BASE}/${deckId}/draw/?count=${count}`);
        const data = await response.json();

        if (data.success) {
            console.log(`✅ Robadas ${count} carta(s):`, data.cards);
            return data.cards; // Devuelve un array con las cartas
        } else {
            throw new Error(data.error || 'No se pudieron robar cartas');
        }
    } catch (error) {
        console.error("❌ Error al robar cartas:", error);
        return [];
    }
}

export { createDeck, drawCards };
