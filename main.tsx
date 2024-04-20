/** @jsx jsx */
import { Hono } from "https://deno.land/x/hono@v4.2.5/hono.ts";
import { serveStatic } from "https://deno.land/x/hono@v4.2.5/middleware.ts";
import { jsx } from "https://deno.land/x/hono@v3.11.6/jsx/index.ts";
import { getDecks, createDeck, getDeck, addToDeck } from "./db.ts";

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
      <h1>
        Flashcards app
      </h1>
      <form hx-post="/" hx-target="#main" class="deck-form">
        <fieldset role="group">
          <input name="deckname" placeholder="Create new deck" required/>
          <input type="submit" required/>
        </fieldset>
        </form>
      <div class="decks-container">
        {decksResult.map(d=> <article class="deck-card">
          <a hx-get={`/${String(d.title)}`} hx-target="#main">{d.title}</a>
        </article>)}
      </div>
    </div>

  );
});

app.post("/", async (c) =>{
  const { deckname } = await c.req.parseBody();
  await createDeck(deckname as string);
  return c.redirect("/");
})

app.get("/:deckname", async (c) =>{
  const deckname = c.req.param('deckname');
  const deck:any = await getDeck(c.req.param('deckname'));
  const cards = deck.value;
  return c.html(
    <div>
      <a hx-get="/" hx-target="#main">Back</a>
      <details>
        <summary>Create New Card</summary>
        <form hx-post={`/${deckname}`} hx-target="#main">
          <input name="question" placeholder="Enter New Question" required/>
          <label for="answer">Answer</label>
          <textarea name="answer" required/>
          <input type="submit" />
        </form>
      </details>
      {cards && cards.map(card =>{
        return(<article>
            <span class="question-label">{card.question}</span>
            <details>
              <summary>
                <a>...</a>
              </summary>
              {card.answer}
            </details>
            </article>);
      })}
    </div>
  )
})

app.post("/:deckname", async (c) =>{
  // const body = await c.req.json()
  const deckname = c.req.param('deckname');
  const {question, answer } = await c.req.parseBody()
  await addToDeck(deckname, { question, answer });
  return c.redirect(`/${deckname}`)
})



Deno.serve(app.fetch);
