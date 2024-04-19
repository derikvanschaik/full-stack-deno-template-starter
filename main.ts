import { Hono } from "https://deno.land/x/hono@v4.2.5/mod.ts";
import { getDecks } from "./db.ts";

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

Deno.serve(app.fetch);
