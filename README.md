# Japanese sentence trainer

Drill for Japanese particles (は が を に へ で の と も), with three modes:

- **Particles**: fill in the missing particles.
- **Translate**: build the Japanese sentence from word tiles, given the English.
- **Type**: type the Japanese sentence in kana or romaji (or a mix), given the English.

## Run

Open `index.html` in a browser. There's no build step or server.

## Add sentences

Edit `sentences.js`. Write each blank as `{particle}`, and use `|` when more than one is correct:

```js
{ jp: "わたし{は}がっこう{に|へ}いきます。", en: "I go to school." },
```

Spaces split a chunk into separate tiles in Translate mode, e.g. `まいにち しちじ{に}`. Write numbers in kana so they can be typed in romaji.
