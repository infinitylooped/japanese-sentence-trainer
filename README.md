# Japanese sentence trainer

Drill for the Japanese particles in Genki I, lessons 1–3 (は の も を で に へ, and か for questions), with three modes:

- **Particles**: fill in the missing particles.
- **Translate**: build the Japanese sentence from word tiles, given the English.
- **Type**: type the Japanese sentence in kana or romaji (or a mix), given the English. わたしは can be left out.

Sentences are generated from the Genki vocabulary: positive, negative (ません / じゃないです) and questions (か).
The ⚙ button picks which lessons, particles, sentence types and sentence lengths you get (the defaults use everything),
and how soon a sentence you missed comes back.

## Run

Open `index.html` in a browser. There's no build step or server.

## How sentences are made

- `vocab.js` sorts the vocabulary by the role a word plays: people, places, times, objects, verbs, and so on.
  Words are paired through tags: each verb names the kind of object it takes (`のみます` → `drink`), and each
  place lists what you can do there (`きっさてん` → `drink`, `food`, `reading`, `music`). So `きっさてんで コーヒーを のみます`
  can come up, but `ぎんこうで コーヒーを のみます` can't.
- `generate.js` has one template per sentence pattern (`X は Y です`, `これは X の Y です`, verb sentences, …). A template
  fills its slots from the vocabulary and writes the English alongside.

Sentences use the format `わたし{は} がっこう{に|へ} いきます。`: each blank is `{particle}`, with `|` between particles
when more than one is correct, and spaces split tiles in Translate mode. Time words marked `free` in `vocab.js`, like あした or
まいにち, take no particle and can go anywhere in an answer. Write numbers in kana so they can be typed in romaji.
