/** @jsx jsx */
import { Hono } from "https://deno.land/x/hono@v4.2.5/hono.ts";
import { serveStatic } from "https://deno.land/x/hono@v4.2.5/middleware.ts";
import { jsx } from "https://deno.land/x/hono@v3.11.6/jsx/index.ts";
import { getDecks, createDeck } from "./db.ts";

// for later one day
// https://paulallies.medium.com/htmx-page-navigation-07b54742d251
const app = new Hono();

app.use('/public/*', serveStatic({ root: './' }))


app.get("/", async (c) => {
  const decks = await getDecks();
  const decksResult = decks.map((deck) => {
    return {
      title: deck.key[1],
      cards: deck.value,
    };
  });
  return c.html(
    <div>
      <div>
        Flashcards app
      </div>
      <div>
        {decksResult.map(d=> <article>
          <a hx-get={`/${String(d.title)}`} hx-target="#main">{d.title}</a>
        </article>)}
      </div>
    </div>

  );
});

app.get("/:deckname", (c) =>{
  return c.html(
    <div>
      <button hx-get="/" hx-target="#main">{'<- Back'}</button>
      <article>
        question goes here lol
      </article>
    </div>
  )
})



Deno.serve(app.fetch);
