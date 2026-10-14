// Genki I vocabulary (lessons 1–3), sorted by the role a word can play in a sentence.
// lesson: where the word is introduced. Words without one (names, わたし) are always available.
// en: the English as it appears in a sentence.

// People who can be the topic ("X は …") or an owner ("X の …"). pos: English possessive (default "X's").
const PEOPLE = [
  { jp: "わたし", en: "I", pos: "my", me: true },
  { jp: "メアリーさん", en: "Mary" },
  { jp: "たけしさん", en: "Takeshi" },
  { jp: "ロバートさん", en: "Robert" },
  { jp: "スーさん", en: "Sue" },
  { jp: "けんさん", en: "Ken" },
  { jp: "ゆいさん", en: "Yui" },
  { jp: "はるとさん", en: "Haruto" },
  { jp: "エマさん", en: "Emma" },
  { jp: "ともだち", en: "my friend", pos: "my friend's", lesson: 1 },
  { jp: "せんせい", en: "the teacher", pos: "the teacher's", lesson: 1 },
];

// Only used as "someone's ___", e.g. メアリーさんのおかあさん.
const FAMILY = [
  { jp: "おかあさん", en: "mother", lesson: 1 },
  { jp: "おとうさん", en: "father", lesson: 1 },
  { jp: "おねえさん", en: "older sister", lesson: 1 },
  { jp: "おにいさん", en: "older brother", lesson: 1 },
];

// What a person is: "X は ___ です". kind decides which question word asks for it (see ASK).
const IDENTITIES = [
  { jp: "がくせい", en: "a student", kind: "student", lesson: 1 },
  { jp: "だいがくせい", en: "a college student", kind: "student", lesson: 1 },
  { jp: "だいがくいんせい", en: "a graduate student", kind: "student", lesson: 1 },
  { jp: "りゅうがくせい", en: "an international student", kind: "student", lesson: 1 },
  { jp: "こうこうせい", en: "a high school student", kind: "student", lesson: 1 },
  { jp: "せんせい", en: "a teacher", kind: "job", lesson: 1 },
  { jp: "いしゃ", en: "a doctor", kind: "job", lesson: 1 },
  { jp: "べんごし", en: "a lawyer", kind: "job", lesson: 1 },
  { jp: "かいしゃいん", en: "an office worker", kind: "job", lesson: 1 },
  { jp: "アメリカじん", en: "American", kind: "nationality", lesson: 1 },
  { jp: "にほんじん", en: "Japanese", kind: "nationality", lesson: 1 },
  { jp: "イギリスじん", en: "British", kind: "nationality", lesson: 1 },
  { jp: "ちゅうごくじん", en: "Chinese", kind: "nationality", lesson: 1 },
  { jp: "かんこくじん", en: "Korean", kind: "nationality", lesson: 1 },
  { jp: "オーストラリアじん", en: "Australian", kind: "nationality", lesson: 1 },
  { jp: "いちねんせい", en: "a first-year student", kind: "year", lesson: 1 },
  { jp: "にねんせい", en: "a second-year student", kind: "year", lesson: 1 },
  { jp: "さんねんせい", en: "a third-year student", kind: "year", lesson: 1 },
  { jp: "よねんせい", en: "a fourth-year student", kind: "year", lesson: 1 },
  { jp: "じゅうはっさい", en: "18 years old", kind: "age", lesson: 1 },
  { jp: "じゅうきゅうさい", en: "19 years old", kind: "age", lesson: 1 },
  { jp: "はたち", en: "20 years old", kind: "age", lesson: 1 },
  { jp: "にじゅういっさい", en: "21 years old", kind: "age", lesson: 1 },
];

// Question words for an identity: {be} and {s} are filled in with e.g. "is" and "Mary".
const ASK = {
  nationality: { jp: "なにじん", en: "What nationality {be} {s}?" },
  year: { jp: "なんねんせい", en: "What year {be} {s} in?" },
  age: { jp: "なんさい", en: "How old {be} {s}?" },
};

// "X の せんこう は ___ です"
const MAJORS = [
  { jp: "にほんご", en: "Japanese", lesson: 1 },
  { jp: "えいご", en: "English", lesson: 1 },
  { jp: "けいざい", en: "economics", lesson: 1 },
  { jp: "れきし", en: "history", lesson: 1 },
  { jp: "ぶんがく", en: "literature", lesson: 1 },
  { jp: "せいじ", en: "politics", lesson: 1 },
  { jp: "ビジネス", en: "business", lesson: 1 },
  { jp: "かがく", en: "science", lesson: 1 },
  { jp: "じんるいがく", en: "anthropology", lesson: 1 },
  { jp: "こくさいかんけい", en: "international relations", lesson: 1 },
];

// Things you can point at or own: "これ は X の ___ です".
const THINGS = [
  { jp: "でんわ", en: "phone", lesson: 1 },
  { jp: "えんぴつ", en: "pencil", lesson: 2 },
  { jp: "かさ", en: "umbrella", lesson: 2 },
  { jp: "かばん", en: "bag", lesson: 2 },
  { jp: "さいふ", en: "wallet", lesson: 2 },
  { jp: "じしょ", en: "dictionary", lesson: 2 },
  { jp: "じてんしゃ", en: "bicycle", lesson: 2 },
  { jp: "しんぶん", en: "newspaper", lesson: 2 },
  { jp: "とけい", en: "watch", lesson: 2 },
  { jp: "ノート", en: "notebook", lesson: 2 },
  { jp: "ペン", en: "pen", lesson: 2 },
  { jp: "ぼうし", en: "hat", lesson: 2 },
  { jp: "ほん", en: "book", lesson: 2 },
];

const POINTERS = [
  { jp: "これ", en: "this", lesson: 2 },
  { jp: "それ", en: "that", lesson: 2 },
  { jp: "あれ", en: "that over there", lesson: 2 },
];

// この/その/あの + thing. {x} is the thing's English.
const POINTER_ADJ = [
  { jp: "この", en: "this {x}", lesson: 2 },
  { jp: "その", en: "that {x}", lesson: 2 },
  { jp: "あの", en: "that {x} over there", lesson: 2 },
];

const HERE = [
  { jp: "ここ", en: "here", lesson: 2 },
  { jp: "そこ", en: "there", lesson: 2 },
  { jp: "あそこ", en: "over there", lesson: 2 },
];

const PRICES = [
  { jp: "ひゃくえん", en: "100 yen", lesson: 2 },
  { jp: "さんびゃくえん", en: "300 yen", lesson: 2 },
  { jp: "ごひゃくえん", en: "500 yen", lesson: 2 },
  { jp: "せんえん", en: "1,000 yen", lesson: 2 },
  { jp: "さんぜんえん", en: "3,000 yen", lesson: 2 },
  { jp: "いちまんえん", en: "10,000 yen", lesson: 2 },
];

// Places.
//   name: English as a sentence subject ("The library is over there"); places without one aren't used that way.
//   at / to: English for "で" / "に・へ" (default "at <en>" / "to <en>").
//   own: English after an owner ("Mary's house"); places without one can't have an owner.
//   go: can be a destination. back: can be where you go back to (かえります).
//   does: the kinds of object (see OBJECTS) you can do things with there.
const PLACES = [
  { jp: "うち", en: "home", at: "at home", to: "home", own: "house", go: true, back: true,
    does: ["drink", "food", "reading", "music", "show", "subject", "language"], lesson: 3 },
  { jp: "がっこう", en: "school", name: "the school", go: true, does: ["food", "subject", "language", "sport", "reading"], lesson: 3 },
  { jp: "だいがく", en: "the university", name: "the university", go: true, does: ["food", "subject", "language", "sport", "reading"], lesson: 1 },
  { jp: "こうこう", en: "high school", go: true, does: ["subject", "sport"], lesson: 1 },
  { jp: "としょかん", en: "the library", name: "the library", go: true, does: ["reading", "subject"], lesson: 2 },
  { jp: "きっさてん", en: "the café", name: "the café", go: true, does: ["drink", "food", "reading", "music"], lesson: 2 },
  { jp: "ぎんこう", en: "the bank", name: "the bank", go: true, does: [], lesson: 2 },
  { jp: "ゆうびんきょく", en: "the post office", name: "the post office", go: true, does: [], lesson: 2 },
  { jp: "トイレ", en: "the restroom", name: "the restroom", does: [], lesson: 2 },
  { jp: "にほん", en: "Japan", at: "in Japan", go: true, back: true, does: ["subject", "language", "food"], lesson: 1 },
  { jp: "アメリカ", en: "America", at: "in America", go: true, back: true, does: ["subject", "language", "food"], lesson: 1 },
  { jp: "イギリス", en: "Britain", at: "in Britain", go: true, back: true, does: ["subject", "language"], lesson: 1 },
  { jp: "ちゅうごく", en: "China", at: "in China", go: true, back: true, does: ["subject", "language", "food"], lesson: 1 },
  { jp: "かんこく", en: "Korea", at: "in Korea", go: true, back: true, does: ["subject", "language", "food"], lesson: 1 },
];

// Objects of verbs ("___ を のみます"), grouped by kind. own: English after an owner ("Mary's book").
const OBJECTS = [
  { jp: "コーヒー", en: "coffee", kind: "drink", lesson: 3 },
  { jp: "おちゃ", en: "green tea", kind: "drink", lesson: 3 },
  { jp: "みず", en: "water", kind: "drink", lesson: 3 },
  { jp: "おさけ", en: "sake", kind: "drink", lesson: 3 },
  { jp: "あさごはん", en: "breakfast", kind: "food", lesson: 3 },
  { jp: "ひるごはん", en: "lunch", kind: "food", lesson: 3 },
  { jp: "ばんごはん", en: "dinner", kind: "food", lesson: 3 },
  { jp: "ハンバーガー", en: "hamburgers", kind: "food", lesson: 3 },
  { jp: "アイスクリーム", en: "ice cream", kind: "food", lesson: 3 },
  { jp: "さかな", en: "fish", kind: "food", lesson: 2 },
  { jp: "にく", en: "meat", kind: "food", lesson: 2 },
  { jp: "やさい", en: "vegetables", kind: "food", lesson: 2 },
  { jp: "とんかつ", en: "tonkatsu", kind: "food", lesson: 2 },
  { jp: "ほん", en: "books", own: "book", kind: "reading", lesson: 2 },
  { jp: "しんぶん", en: "the newspaper", own: "newspaper", kind: "reading", lesson: 2 },
  { jp: "ざっし", en: "magazines", own: "magazine", kind: "reading", lesson: 3 },
  { jp: "おんがく", en: "music", kind: "music", lesson: 3 },
  { jp: "えいが", en: "movies", kind: "show", lesson: 3 },
  { jp: "テレビ", en: "TV", kind: "show", lesson: 3 },
  { jp: "テニス", en: "tennis", kind: "sport", lesson: 3 },
  { jp: "スポーツ", en: "sports", kind: "sport", lesson: 3 },
  ...MAJORS.map((m) => ({ ...m, kind: "subject" })),
  { jp: "にほんご", en: "Japanese", kind: "language", lesson: 1 },
  { jp: "えいご", en: "English", kind: "language", lesson: 1 },
  { jp: "ちゅうごくご", en: "Chinese", kind: "language", lesson: 1 },
  { jp: "かんこくご", en: "Korean", kind: "language", lesson: 1 },
];

// Verbs (all lesson 3). en: [base form, third person].
//   object: the kind of object it takes (it always gets one). what: English verb when asking "なにを".
//   to: takes a destination ("go": any place you can go to, "back": only places with back).
//   noWhere: don't ask "どこに" with it ("Where do you come?" isn't English).
//   time: always gets a clock time (otherwise "I get up." would be the whole sentence), at one of hours.
//   noClock / noWhat: no clock time ("I speak Chinese at 5"), no "なにを" ("What do you speak?").
const VERBS = [
  { jp: "いきます", en: ["go", "goes"], to: "go", lesson: 3 },
  { jp: "きます", en: ["come", "comes"], to: "go", noWhere: true, lesson: 3 },
  { jp: "かえります", en: ["go back", "goes back"], to: "back", noWhere: true, lesson: 3 },
  { jp: "のみます", en: ["drink", "drinks"], object: "drink", lesson: 3 },
  { jp: "たべます", en: ["eat", "eats"], object: "food", lesson: 3 },
  { jp: "よみます", en: ["read", "reads"], object: "reading", lesson: 3 },
  { jp: "ききます", en: ["listen to", "listens to"], object: "music", lesson: 3 },
  { jp: "みます", en: ["watch", "watches"], object: "show", lesson: 3 },
  { jp: "します", en: ["play", "plays"], object: "sport", what: "do", lesson: 3 },
  { jp: "べんきょうします", en: ["study", "studies"], object: "subject", lesson: 3 },
  { jp: "はなします", en: ["speak", "speaks"], object: "language", noClock: true, noWhat: true, lesson: 3 },
  { jp: "おきます", en: ["get up", "gets up"], time: true, hours: [5, 6, 7, 8, 9, 10], lesson: 3 },
  { jp: "ねます", en: ["go to bed", "goes to bed"], time: true, hours: [9, 10, 11, 12, 1], lesson: 3 },
];

// Times. clock: the hour of a clock time. free: takes no particle (Genki 3: no に after あした, まいにち, …). future: English uses "will".
const HOURS = ["いち", "に", "さん", "よ", "ご", "ろく", "しち", "はち", "く", "じゅう", "じゅういち", "じゅうに"];
const TIMES = [
  ...HOURS.map((h, i) => ({ jp: `${h}じ`, en: `at ${i + 1}`, clock: i + 1, lesson: 1 })),
  ...HOURS.map((h, i) => ({ jp: `${h}じはん`, en: `at ${i + 1}:30`, clock: i + 1, lesson: 1 })),
  { jp: "にちようび", en: "on Sunday", lesson: 3 },
  { jp: "どようび", en: "on Saturday", lesson: 3 },
  { jp: "まいにち", en: "every day", free: true, lesson: 3 },
  { jp: "まいばん", en: "every night", free: true, lesson: 3 },
  { jp: "きょう", en: "today", free: true, future: true, lesson: 3 },
  { jp: "あした", en: "tomorrow", free: true, future: true, lesson: 3 },
  { jp: "こんばん", en: "tonight", free: true, future: true, lesson: 3 },
];

// Words that stand alone without a particle, so they can move around in the sentence like a phrase.
const FREE_WORDS = new Set([...TIMES.filter((t) => t.free).map((t) => t.jp), "いつ"]);
