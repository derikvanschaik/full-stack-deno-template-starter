import { Hono } from "https://deno.land/x/hono@v4.2.5/mod.ts";
import { serveStatic } from "https://deno.land/x/hono@v4.2.5/middleware.ts";
import { getDecks, createDeck } from "./db.ts";

const app = new Hono();

app.get("/", async (c) => {
  const decks = await getDecks();
  const decksResult = decks.map((deck) => {
    return {
      title: deck.key[1],
      cards: deck.value,
    };
  });
  return c.json(decksResult);
});

app.post("/", async (c) => {
  const { deckname } = await c.req.json();
  await createDeck(deckname);
  return c.json({});
});
Deno.serve(app.fetch);
