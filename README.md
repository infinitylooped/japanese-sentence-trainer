# Japanese sentence trainer

Drill for the Japanese particles and sentence patterns in Genki I, lessons 1–4 plus the adjectives of lesson 5
(は の も を で に へ が と, and か for questions), with three modes:

- **Particles**: fill in the missing particles.
- **Translate**: build the Japanese sentence from word tiles, given the English.
- **Type**: type the Japanese sentence in kana or romaji (or a mix), given the English. わたしは can be left out.

Sentences are generated from the Genki vocabulary: positive, negative (ません / じゃないです) and questions (か), in the
present and, with lesson 4 on, the past. Lesson 4 adds あります / います, location words (まえ, うえ, あいだ, …), と, も after
other particles, 〜じかん and たくさん. Lesson 5 adds い- and な-adjectives, before a noun and as the predicate, and すき / きらい.
The ⚙ button picks which lessons, particles, sentence types and sentence lengths you get (the defaults use everything),
how soon a sentence you missed comes back, and whether Type mode accepts English for katakana words (Mary for メアリー).

## Run

Open `index.html` in a browser. There's no build step or server.

## How sentences are made

- `vocab.js` sorts the vocabulary by the role a word plays: people, places, times, objects, verbs, and so on.
  Words are paired through tags: each verb names the kind of object it takes (`のみます` → `drink`), and each
  place lists what you can do there (`カフェ` → `drink`, `food`, `reading`, `music`, …). So `カフェで コーヒーを のみます`
  can come up, but `ぎんこうで コーヒーを のみます` can't.
- Clock times use ごぜん / ごご (`ごご じゅうじ` = 10 p.m.). Verbs, objects and places list the hours they happen at (breakfast
  6–9 a.m., the bank 9 a.m.–3 p.m.), so a time only appears when it fits all of them. まいばん and こんばん count as night.
- `generate.js` has one template per sentence pattern (`X は Y です`, `これは X の Y です`, verb sentences, …). A template
  fills its slots from the vocabulary and writes the English alongside.

Sentences use the format `わたし{は} がっこう{に|へ} いきます。`: each blank is `{particle}`, with `|` between particles
when more than one is correct, and spaces split tiles in Translate mode. `{と&}` is a blank whose word stays attached to the
next noun (`パン{と&} さかな{を}` can't be split up in an answer). Words listed in `FREE_WORDS` in `vocab.js`, like あした or
たくさん, take no particle and can go anywhere in an answer. Write numbers in kana so they can be typed in romaji.
