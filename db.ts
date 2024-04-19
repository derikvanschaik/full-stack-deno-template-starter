const kv = await Deno.openKv();

async function createDeck(deckname: string) {
  await kv.set(["deck", deckname], [{}]);
}

async function addToDeck(deckname: string, card: any) {
  // Begin a transaction
  const transaction = kv.atomic();

  // Check if the deck exists and fetch the current state
  const currentDeck = await kv.get(["deck", deckname]);
  transaction.set(["deck", deckname], [...currentDeck.value, card]);

  // Commit the transaction
  const result = await transaction.commit();
  if (result.ok) {
    console.log("Transaction successful, card added.");
  } else {
    console.error("Transaction failed.");
  }
}

async function getDecks() {
  const entries = await Array.fromAsync(kv.list({ prefix: ["deck"] }));
  return entries;
}

export { createDeck, addToDeck, getDecks };
