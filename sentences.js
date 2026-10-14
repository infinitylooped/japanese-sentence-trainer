// Practice sentences.
// Write each blank as {particle}. If more than one particle is correct, separate them with |, e.g. {に|へ}.
// Spaces split words into separate tiles in translate mode (they're hidden in particle mode).
const SENTENCES = [
  // は / の / も
  { jp: "わたし{は}がくせいです。", en: "I am a student." },
  { jp: "わたし{の}せんこう{は}にほんごです。", en: "My major is Japanese." },
  { jp: "これ{は}わたし{の}ほんです。", en: "This is my book." },
  { jp: "これ{は}だれ{の}かさですか。", en: "Whose umbrella is this?" },
  { jp: "にほんご{の}ほん{を}かいます。", en: "I buy a Japanese(-language) book." },
  { jp: "メアリーさん{も}アメリカじんです。", en: "Mary is American too." },
  { jp: "わたし{も}だいがくせいです。", en: "I'm a university student too." },

  // を / で
  { jp: "わたし{は}コーヒー{を}のみます。", en: "I drink coffee." },
  { jp: "わたし{は}うち{で}テレビ{を}みます。", en: "I watch TV at home." },
  { jp: "メアリーさん{は}としょかん{で}ほん{を}よみます。", en: "Mary reads a book at the library." },
  { jp: "カフェ{で}コーヒー{を}のみます。", en: "I drink coffee at a café." },
  { jp: "どこ{で}ひるごはん{を}たべますか。", en: "Where do you eat lunch?" },

  // に / へ
  { jp: "わたし{は}がっこう{に|へ}いきます。", en: "I go to school." },
  { jp: "どこ{に|へ}いきますか。", en: "Where are you going?" },
  { jp: "うち{に|へ}かえります。", en: "I go back home." },
  { jp: "たけしさん{は}まいにち しちじ{に}おきます。", en: "Takeshi gets up at 7 every day." },
  { jp: "わたし{は}じゅういちじ{に}ねます。", en: "I go to bed at 11." },
  { jp: "わたし{は}にちようび{に}テニス{を}します。", en: "I play tennis on Sunday." },
  { jp: "きっさてん{で}ともだち{に}あいます。", en: "I meet a friend at a café." },

  // と
  { jp: "わたし{は}ともだち{と}えいが{を}みます。", en: "I watch a movie with a friend." },
  { jp: "わたし{は}スーさん{と}としょかん{に|へ}いきます。", en: "I go to the library with Sue." },
  { jp: "ロバートさん{と}たけしさん{は}ともだちです。", en: "Robert and Takeshi are friends." },

  // が (with あります / います)
  { jp: "あそこ{に}ねこ{が}います。", en: "There is a cat over there." },
  { jp: "つくえ{の}うえ{に}ほん{が}あります。", en: "There is a book on the desk." },
  { jp: "ぎんこう{は}ゆうびんきょく{の}となり{に}あります。", en: "The bank is next to the post office." },
];
