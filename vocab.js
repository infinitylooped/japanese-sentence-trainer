// Genki I vocabulary (lessons 1–4, plus the adjectives of lesson 5), sorted by the role a word can play in a sentence.
// lesson: where the word is introduced. Words without one (names, わたし) are always available.
// en: the English as it appears in a sentence.

// Hours of the day (0–23) when something happens; used so clock times make sense ("breakfast at 7 a.m.").
// hours on a word limits when it can happen; words without hours fit any waking hour. Noon and midnight aren't used.
const hoursFrom = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i).filter((h) => h !== 12);
const AWAKE = hoursFrom(7, 22);
const DAYTIME = hoursFrom(8, 17);
const NIGHT = hoursFrom(18, 23);
const MEALS = [11, 13, 18, 19, 20];

// People who can be the topic ("X は …") or an owner ("X の …"). pos: English possessive (default "X's").
const PEOPLE = [
  { jp: "わたし", en: "I", pos: "my", me: true },
  { jp: "メアリーさん", en: "Mary" },
  { jp: "たけしさん", en: "Takeshi" },
  { jp: "ロバートさん", en: "Robert" },
  { jp: "ソラさん", en: "Sora" },
  { jp: "ジョンさん", en: "John" },
  { jp: "けんさん", en: "Ken" },
  { jp: "ゆいさん", en: "Yui" },
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
  { jp: "えいご", en: "English", lesson: 2 },
  { jp: "けいざい", en: "economics", lesson: 1 },
  { jp: "れきし", en: "history", lesson: 1 },
  { jp: "ぶんがく", en: "literature", lesson: 1 },
  { jp: "せいじ", en: "politics", lesson: 1 },
  { jp: "ビジネス", en: "business", lesson: 1 },
  { jp: "こうがく", en: "engineering", lesson: 1 },
  { jp: "せいぶつがく", en: "biology", lesson: 1 },
  { jp: "こくさいかんけい", en: "international relations", lesson: 1 },
];

// Things you can point at or own: "これ は X の ___ です". big: too big to be on a desk or in a bag.
const THINGS = [
  { jp: "でんわ", en: "phone", lesson: 1 },
  { jp: "えんぴつ", en: "pencil", lesson: 2 },
  { jp: "かさ", en: "umbrella", lesson: 2 },
  { jp: "かばん", en: "bag", lesson: 2 },
  { jp: "さいふ", en: "wallet", lesson: 2 },
  { jp: "じしょ", en: "dictionary", lesson: 2 },
  { jp: "じてんしゃ", en: "bicycle", big: true, lesson: 2 },
  { jp: "しんぶん", en: "newspaper", lesson: 2 },
  { jp: "とけい", en: "watch", lesson: 2 },
  { jp: "ノート", en: "notebook", lesson: 2 },
  { jp: "ペン", en: "pen", lesson: 2 },
  { jp: "ぼうし", en: "hat", lesson: 2 },
  { jp: "ほん", en: "book", lesson: 2 },
  { jp: "つくえ", en: "desk", big: true, lesson: 4 },
  { jp: "いす", en: "chair", big: true, lesson: 4 },
  { jp: "はな", en: "flower", lesson: 4 },
  { jp: "しゃしん", en: "photo", lesson: 4 },
  { jp: "レポート", en: "paper", lesson: 4 },
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

// Where a place is compared to another place: "X は Y の ___ です". {x} is Y's English.
const BESIDE = [
  { jp: "まえ", en: "in front of {x}", lesson: 4 },
  { jp: "うしろ", en: "behind {x}", lesson: 4 },
  { jp: "となり", en: "next to {x}", lesson: 4 },
  { jp: "ちかく", en: "near {x}", lesson: 4 },
  { jp: "みぎ", en: "to the right of {x}", lesson: 4 },
  { jp: "ひだり", en: "to the left of {x}", lesson: 4 },
];

// Where a small thing is: "つくえの うえ". holders: the words from HOLDERS it goes with.
const ON_THINGS = [
  { jp: "うえ", en: "on {x}", holders: ["つくえ", "いす"], lesson: 4 },
  { jp: "した", en: "under {x}", holders: ["つくえ", "いす"], lesson: 4 },
  { jp: "なか", en: "in {x}", holders: ["かばん"], lesson: 4 },
];

const HOLDERS = [
  { jp: "つくえ", en: "the desk", lesson: 4 },
  { jp: "いす", en: "the chair", lesson: 4 },
  { jp: "かばん", en: "the bag", lesson: 2 },
];

// Who or what "___ が います". have: can be "X has a ___". many: English plural (たくさん). animal: asked with なに, not だれ.
const ANIMATE = [
  { jp: "いぬ", en: "dog", many: "dogs", have: true, animal: true, lesson: 4 },
  { jp: "ねこ", en: "cat", many: "cats", have: true, animal: true, lesson: 4 },
  { jp: "こども", en: "child", many: "children", have: true, lesson: 4 },
  { jp: "ともだち", en: "friend", many: "friends", have: true, lesson: 1 },
  { jp: "ひと", en: "person", many: "people", lesson: 4 },
  { jp: "せんせい", en: "teacher", many: "teachers", lesson: 1 },
];

// "あした ___ が あります" = "I have ___ tomorrow".
const EVENTS = [
  { jp: "クラス", en: "a class", lesson: 4 },
  { jp: "アルバイト", en: "work", lesson: 4 },
  { jp: "デート", en: "a date", lesson: 3 },
];

// Places.
//   name: English as a sentence subject ("The library is over there"); places without one aren't used that way.
//   at / to: English for "で" / "に・へ" (default "at <en>" / "to <en>").
//   own: English after an owner ("Mary's house"); places without one can't have an owner.
//   go: can be a destination. back: can be where you go back to (かえります).
//   does: the kinds of object (see OBJECTS) you can do things with there, and what's sold there (see sold on OBJECTS).
//   hours: when you're there (toHours: when you go there, if different). [] = no clock time or night (countries).
const PLACES = [
  { jp: "うち", en: "home", at: "at home", to: "home", own: "house", go: true, back: true, toHours: hoursFrom(16, 23),
    does: ["drink", "food", "reading", "music", "show", "subject", "language", "writing", "person"], lesson: 3 },
  { jp: "がっこう", en: "school", name: "the school", go: true, hours: DAYTIME, does: ["food", "subject", "language", "sport", "reading", "writing", "person"], lesson: 3 },
  { jp: "だいがく", en: "the university", name: "the university", go: true, hours: DAYTIME, does: ["food", "subject", "language", "sport", "reading", "writing", "person"], lesson: 1 },
  { jp: "こうこう", en: "high school", go: true, hours: DAYTIME, does: ["subject", "sport"], lesson: 1 },
  { jp: "としょかん", en: "the library", name: "the library", go: true, hours: hoursFrom(9, 20), does: ["reading", "subject", "writing", "person"], lesson: 2 },
  { jp: "カフェ", en: "the café", name: "the café", go: true, hours: hoursFrom(8, 21), does: ["drink", "food", "reading", "music", "writing", "person"], lesson: 3 },
  { jp: "ぎんこう", en: "the bank", name: "the bank", go: true, hours: hoursFrom(9, 15), does: [], lesson: 2 },
  { jp: "ゆうびんきょく", en: "the post office", name: "the post office", go: true, hours: hoursFrom(9, 15), does: [], lesson: 2 },
  { jp: "トイレ", en: "the restroom", name: "the restroom", does: [], lesson: 2 },
  { jp: "にほん", en: "Japan", at: "in Japan", go: true, back: true, hours: [], does: ["subject", "language", "food", "photo"], lesson: 1 },
  { jp: "アメリカ", en: "America", at: "in America", go: true, back: true, hours: [], does: ["subject", "language", "food", "photo"], lesson: 1 },
  { jp: "イギリス", en: "Britain", at: "in Britain", go: true, back: true, hours: [], does: ["subject", "language", "photo"], lesson: 1 },
  { jp: "ちゅうごく", en: "China", at: "in China", go: true, back: true, hours: [], does: ["subject", "language", "food", "photo"], lesson: 1 },
  { jp: "かんこく", en: "Korea", at: "in Korea", go: true, back: true, hours: [], does: ["subject", "language", "food", "photo"], lesson: 1 },
  { jp: "こうえん", en: "the park", name: "the park", go: true, hours: DAYTIME, does: ["food", "reading", "sport", "photo", "person"], lesson: 4 },
  { jp: "おてら", en: "the temple", name: "the temple", go: true, hours: DAYTIME, does: ["photo", "person"], lesson: 4 },
  { jp: "スーパー", en: "the supermarket", name: "the supermarket", go: true, hours: hoursFrom(9, 21), does: ["grocery", "person"], lesson: 4 },
  { jp: "ほんや", en: "the bookstore", name: "the bookstore", go: true, hours: hoursFrom(10, 20), does: ["book", "person"], lesson: 4 },
  { jp: "レストラン", en: "the restaurant", name: "the restaurant", go: true, hours: hoursFrom(11, 22), does: ["drink", "food", "person"], lesson: 4 },
  { jp: "ホテル", en: "the hotel", name: "the hotel", go: true, back: true, does: ["drink", "food", "person"], lesson: 4 },
  { jp: "びょういん", en: "the hospital", name: "the hospital", go: true, hours: DAYTIME, does: [], lesson: 4 },
  { jp: "バスてい", en: "the bus stop", name: "the bus stop", go: true, does: ["person"], lesson: 4 },
  { jp: "まち", en: "town", name: "the town", at: "in town", to: "to town", go: true, does: ["drink", "food", "photo", "person", "shop"], lesson: 4 },
];

// Objects of verbs ("___ を のみます"), grouped by kind. own: English after an owner ("Mary's book").
// hours: when you'd do it (see AWAKE). sold: can be bought (かいます); the value is the tag in a place's does.
const OBJECTS = [
  { jp: "コーヒー", en: "coffee", kind: "drink", sold: "grocery", hours: hoursFrom(7, 17), lesson: 3 },
  { jp: "おちゃ", en: "green tea", kind: "drink", sold: "grocery", hours: hoursFrom(7, 20), lesson: 3 },
  { jp: "みず", en: "water", kind: "drink", sold: "grocery", lesson: 3 },
  { jp: "おさけ", en: "sake", kind: "drink", hours: NIGHT, lesson: 3 },
  { jp: "あさごはん", en: "breakfast", kind: "food", hours: hoursFrom(6, 9), lesson: 3 },
  { jp: "ひるごはん", en: "lunch", kind: "food", hours: [11, 13], lesson: 3 },
  { jp: "ばんごはん", en: "dinner", kind: "food", hours: hoursFrom(18, 21), lesson: 3 },
  { jp: "ハンバーガー", en: "hamburgers", kind: "food", hours: MEALS, lesson: 3 },
  { jp: "アイスクリーム", en: "ice cream", kind: "food", hours: hoursFrom(13, 21), lesson: 3 },
  { jp: "さかな", en: "fish", kind: "food", sold: "grocery", hours: MEALS, lesson: 2 },
  { jp: "にく", en: "meat", kind: "food", sold: "grocery", hours: MEALS, lesson: 2 },
  { jp: "やさい", en: "vegetables", kind: "food", sold: "grocery", hours: MEALS, lesson: 2 },
  { jp: "とんかつ", en: "tonkatsu", kind: "food", hours: MEALS, lesson: 2 },
  { jp: "ごはん", en: "rice", kind: "food", hours: MEALS, lesson: 4 },
  { jp: "パン", en: "bread", kind: "food", sold: "grocery", hours: hoursFrom(7, 20), lesson: 4 },
  { jp: "ほん", en: "books", own: "book", kind: "reading", sold: "book", lesson: 2 },
  { jp: "しんぶん", en: "the newspaper", own: "newspaper", kind: "reading", sold: "book", lesson: 2 },
  { jp: "ざっし", en: "magazines", own: "magazine", kind: "reading", sold: "book", lesson: 3 },
  { jp: "おんがく", en: "music", kind: "music", lesson: 3 },
  { jp: "えいが", en: "movies", kind: "show", hours: hoursFrom(13, 22), lesson: 3 },
  { jp: "テレビ", en: "TV", kind: "show", hours: [7, 8, ...NIGHT], lesson: 3 },
  { jp: "テニス", en: "tennis", kind: "sport", hours: DAYTIME, lesson: 3 },
  { jp: "スポーツ", en: "sports", kind: "sport", hours: DAYTIME, lesson: 3 },
  { jp: "ゲーム", en: "games", kind: "sport", lesson: 4 },
  ...MAJORS.map((m) => ({ ...m, kind: "subject" })),
  { jp: "にほんご", en: "Japanese", kind: "language", lesson: 1 },
  { jp: "えいご", en: "English", kind: "language", lesson: 2 },
  { jp: "ちゅうごくご", en: "Chinese", kind: "language", lesson: 1 },
  { jp: "かんこくご", en: "Korean", kind: "language", lesson: 1 },
  { jp: "かさ", en: "an umbrella", kind: "goods", sold: "shop", lesson: 2 },
  { jp: "かばん", en: "a bag", kind: "goods", sold: "shop", lesson: 2 },
  { jp: "さいふ", en: "a wallet", kind: "goods", sold: "shop", lesson: 2 },
  { jp: "とけい", en: "a watch", kind: "goods", sold: "shop", lesson: 2 },
  { jp: "ノート", en: "a notebook", kind: "goods", sold: "shop", lesson: 2 },
  { jp: "ペン", en: "a pen", kind: "goods", sold: "shop", lesson: 2 },
  { jp: "ぼうし", en: "a hat", kind: "goods", sold: "shop", lesson: 2 },
  { jp: "じしょ", en: "a dictionary", kind: "goods", sold: "book", lesson: 2 },
  { jp: "はな", en: "flowers", kind: "goods", sold: "shop", lesson: 4 },
  { jp: "レポート", en: "a paper", kind: "writing", lesson: 4 },
  { jp: "しゃしん", en: "pictures", kind: "photo", hours: DAYTIME, lesson: 4 },
  { jp: "アルバイト", en: "part-time work", kind: "chore", lesson: 4 },
  { jp: "かいもの", en: "the shopping", kind: "chore", hours: hoursFrom(9, 21), lesson: 4 },
  { jp: "いぬ", en: "dogs", kind: "animal", lesson: 4 },
  { jp: "ねこ", en: "cats", kind: "animal", lesson: 4 },
  ...PEOPLE.filter((p) => !p.me).map((p) => ({ ...p, kind: "person" })),
];

// Verbs. en: [base form, third person, past].
//   object: the kind of object it takes (it always gets one); "sold" = anything with sold. particle: its particle, if not を.
//   what: English verb when asking "なにを". who: asked with だれ instead of なに.
//   to: takes a destination ("go": any place you can go to, "back": only places with back).
//   noWhere: don't ask "どこに" with it ("Where do you come?" isn't English).
//   time: always gets a clock time (otherwise "I get up." would be the whole sentence).
//   hours: when it happens (default AWAKE).
//   noClock / noWhat / noPlace: no clock time ("I speak Chinese at 5"), no "なにを" ("What do you speak?"), no "で".
//   noTime: no time words or "how often" at all ("I understand English every night").
//   invite: works as ませんか ("Would you like to …?"). together: can be done with someone (と). long: can last hours (にじかん).
const VERBS = [
  { jp: "いきます", en: ["go", "goes", "went"], to: "go", invite: true, together: true, lesson: 3 },
  { jp: "きます", en: ["come", "comes", "came"], to: "go", noWhere: true, together: true, lesson: 3 },
  { jp: "かえります", en: ["go back", "goes back", "went back"], to: "back", noWhere: true, together: true, lesson: 3 },
  { jp: "のみます", en: ["drink", "drinks", "drank"], object: "drink", invite: true, together: true, lesson: 3 },
  { jp: "たべます", en: ["eat", "eats", "ate"], object: "food", invite: true, together: true, lesson: 3 },
  { jp: "よみます", en: ["read", "reads", "read"], object: "reading", long: true, lesson: 3 },
  { jp: "ききます", en: ["listen to", "listens to", "listened to"], object: "music", invite: true, long: true, lesson: 3 },
  { jp: "みます", en: ["watch", "watches", "watched"], object: "show", invite: true, together: true, long: true, lesson: 3 },
  { jp: "します", en: ["play", "plays", "played"], object: "sport", what: "do", invite: true, together: true, long: true, lesson: 3 },
  { jp: "べんきょうします", en: ["study", "studies", "studied"], object: "subject", invite: true, together: true, long: true, lesson: 3 },
  { jp: "はなします", en: ["speak", "speaks", "spoke"], object: "language", noClock: true, noWhat: true, lesson: 3 },
  { jp: "おきます", en: ["get up", "gets up", "got up"], time: true, hours: hoursFrom(5, 10), lesson: 3 },
  { jp: "ねます", en: ["go to bed", "goes to bed", "went to bed"], time: true, hours: [21, 22, 23, 1], lesson: 3 },
  { jp: "あいます", en: ["meet", "meets", "met"], object: "person", particle: "に", who: true, noWhat: true, lesson: 4 },
  { jp: "まちます", en: ["wait for", "waits for", "waited for"], object: "person", who: true, noWhat: true, long: true, lesson: 4 },
  { jp: "かいます", en: ["buy", "buys", "bought"], object: "sold", together: true, lesson: 4 },
  { jp: "かきます", en: ["write", "writes", "wrote"], object: "writing", noWhat: true, long: true, lesson: 4 },
  { jp: "とります", en: ["take", "takes", "took"], object: "photo", noWhat: true, together: true, lesson: 4 },
  { jp: "します", en: ["do", "does", "did"], object: "chore", what: "do", together: true, long: true, lesson: 4 },
  { jp: "わかります", en: ["understand", "understands", "understood"], object: "language", particle: "が", noTime: true, noWhat: true, noPlace: true, lesson: 4 },
];

const WEEKDAYS = [
  { jp: "にちようび", en: "Sunday", lesson: 3 },
  { jp: "げつようび", en: "Monday", lesson: 4 },
  { jp: "かようび", en: "Tuesday", lesson: 4 },
  { jp: "すいようび", en: "Wednesday", lesson: 4 },
  { jp: "もくようび", en: "Thursday", lesson: 4 },
  { jp: "きんようび", en: "Friday", lesson: 4 },
  { jp: "どようび", en: "Saturday", lesson: 3 },
];

// Times. clock: a clock time. hours: when it is (see AWAKE).
// free: takes no particle (Genki 3: no に after あした, まいにち, …). future: English uses "will".
// past: only with the past tense. pastToo: a future word that also works with the past tense. habit: not with the past tense.
const HOURS = ["いち", "に", "さん", "よ", "ご", "ろく", "しち", "はち", "く", "じゅう", "じゅういち"];
// ごぜん しちじ = 7 a.m., ごご しちじはん = 7:30 p.m.
const CLOCK_TIMES = hoursFrom(1, 23).flatMap((h) => {
  const n = h % 12;
  const [jp, en] = h < 12 ? ["ごぜん", "a.m."] : ["ごご", "p.m."];
  return [
    { jp: `${jp} ${HOURS[n - 1]}じ`, en: `at ${n} ${en}`, clock: true, hours: [h], lesson: 1 },
    { jp: `${jp} ${HOURS[n - 1]}じはん`, en: `at ${n}:30 ${en}`, clock: true, hours: [h], lesson: 1 },
  ];
});
const TIMES = [
  ...CLOCK_TIMES,
  ...WEEKDAYS.map((d) => ({ ...d, en: `on ${d.en}` })),
  { jp: "まいにち", en: "every day", free: true, habit: true, lesson: 3 },
  { jp: "まいばん", en: "every night", free: true, habit: true, hours: NIGHT, lesson: 3 },
  { jp: "きょう", en: "today", free: true, future: true, pastToo: true, lesson: 3 },
  { jp: "あした", en: "tomorrow", free: true, future: true, lesson: 3 },
  { jp: "こんばん", en: "tonight", free: true, future: true, hours: NIGHT, lesson: 3 },
  { jp: "きのう", en: "yesterday", free: true, past: true, lesson: 4 },
  { jp: "せんしゅう", en: "last week", free: true, past: true, lesson: 4 },
];

// How long something takes (lesson 4). No particle.
const DURATIONS = [
  { jp: "いちじかん", en: "for an hour", lesson: 4 },
  { jp: "にじかん", en: "for 2 hours", lesson: 4 },
  { jp: "さんじかん", en: "for 3 hours", lesson: 4 },
  { jp: "よじかん", en: "for 4 hours", lesson: 4 },
  { jp: "ごじかん", en: "for 5 hours", lesson: 4 },
];

// How often (lesson 3). types: the sentence types it fits; あまり and ぜんぜん only go with a negative verb.
const FREQUENCY = [
  { jp: "よく", en: "often", types: ["positive", "question"], lesson: 3 },
  { jp: "ときどき", en: "sometimes", types: ["positive", "question"], lesson: 3 },
  { jp: "たいてい", en: "usually", types: ["positive", "question"], lesson: 3 },
  { jp: "あまり", en: "much", types: ["negative"], lesson: 3 },
  { jp: "ぜんぜん", en: "at all", types: ["negative"], lesson: 3 },
];

// "___ は げつようび です" and "___ は さむい です".
const DAYS = [
  { jp: "きょう", en: "today" },
  { jp: "きのう", en: "yesterday", past: true },
  { jp: "あした", en: "tomorrow", future: true },
];

// Adjectives (lesson 5; たかい and おいしい are introduced in lesson 2, but only conjugated from lesson 5).
// Adjective sentences use nouns from any earlier lesson, so none of the lists below have a lesson.
//   na: な-adjective. ii: conjugates with よ-, like いい (よくない, よかった).
//   of: the kinds of noun it describes. person and the kinds in DESCRIBED, plus weather ("It is cold today") and schedule ("I am busy today").
//   predOnly: not used before a noun (ひまな ひと isn't "a free person").
const ADJECTIVES = [
  { jp: "あたらしい", en: "new", of: ["thing", "place"] },
  { jp: "ふるい", en: "old", of: ["thing", "place"] },
  { jp: "おおきい", en: "big", of: ["thing", "place", "animal"] },
  { jp: "ちいさい", en: "small", of: ["thing", "place", "animal"] },
  { jp: "たかい", en: "expensive", of: ["thing"] },
  { jp: "やすい", en: "cheap", of: ["thing"] },
  { jp: "いい", en: "good", ii: true, of: ["thing", "place", "media", "person"] },
  { jp: "かっこいい", en: "good-looking", ii: true, of: ["thing", "person"] },
  { jp: "おもしろい", en: "interesting", of: ["media", "subject", "event", "person"] },
  { jp: "つまらない", en: "boring", of: ["media", "subject", "event"] },
  { jp: "むずかしい", en: "difficult", of: ["subject", "event"] },
  { jp: "やさしい", en: "easy", of: ["subject", "event"] },
  { jp: "やさしい", en: "kind", of: ["person"] },
  { jp: "こわい", en: "scary", of: ["media", "animal", "person"] },
  { jp: "たのしい", en: "fun", of: ["event"] },
  { jp: "いそがしい", en: "busy", of: ["person", "schedule"] },
  { jp: "あつい", en: "hot", of: ["weather", "drink"] },
  { jp: "さむい", en: "cold", of: ["weather"] },
  { jp: "おいしい", en: "delicious", of: ["food", "drink"] },
  { jp: "きれい", en: "beautiful", na: true, of: ["thing", "place", "person"] },
  { jp: "げんき", en: "energetic", na: true, of: ["person"] },
  { jp: "しずか", en: "quiet", na: true, of: ["place", "person"] },
  { jp: "にぎやか", en: "lively", na: true, of: ["place"] },
  { jp: "ひま", en: "free", na: true, predOnly: true, of: ["person", "schedule"] },
];

// "X は ___ が すき です". negative: fine with じゃないです (だいすき じゃないです sounds odd).
const FEELINGS = [
  { jp: "すき", en: ["like", "likes", "liked"], negative: true },
  { jp: "きらい", en: ["dislike", "dislikes", "disliked"], negative: true },
  { jp: "だいすき", en: ["love", "loves", "loved"] },
  { jp: "だいきらい", en: ["hate", "hates", "hated"] },
];

// Nouns an adjective can describe, by kind (see of on ADJECTIVES). en: singular, without "a".
//   bare: stands alone ("Japanese is difficult", "The library is quiet"); the others get この/その/あの.
//   mass: no "a" ("delicious coffee"). noAttr: not used after an adjective.
//   verb: for sentences like おもしろい えいがを みました.
const DESCRIBED = [
  ...THINGS.map((t) => ({ jp: t.jp, en: t.en, kind: "thing" })),
  ...PLACES.filter((p) => p.name && p.jp !== "トイレ").map((p) => ({ jp: p.jp, en: p.name, kind: "place", bare: true })),
  ...MAJORS.map((m) => ({ jp: m.jp, en: m.en, kind: "subject", bare: true })),
  { jp: "いぬ", en: "dog", kind: "animal" },
  { jp: "ねこ", en: "cat", kind: "animal" },
  { jp: "さかな", en: "fish", kind: "food", mass: true, verb: "たべます" },
  { jp: "にく", en: "meat", kind: "food", mass: true, verb: "たべます" },
  { jp: "パン", en: "bread", kind: "food", mass: true, verb: "たべます" },
  { jp: "とんかつ", en: "tonkatsu", kind: "food", mass: true, verb: "たべます" },
  { jp: "アイスクリーム", en: "ice cream", kind: "food", mass: true, verb: "たべます" },
  { jp: "ハンバーガー", en: "hamburger", kind: "food", verb: "たべます" },
  { jp: "コーヒー", en: "coffee", kind: "drink", mass: true, verb: "のみます" },
  { jp: "おちゃ", en: "green tea", kind: "drink", mass: true, verb: "のみます" },
  { jp: "えいが", en: "movie", kind: "media", verb: "みます" },
  { jp: "ほん", en: "book", kind: "media", verb: "よみます" },
  { jp: "ざっし", en: "magazine", kind: "media", verb: "よみます" },
  { jp: "おんがく", en: "music", kind: "media", mass: true, verb: "ききます" },
  { jp: "クラス", en: "class", kind: "event" },
  { jp: "デート", en: "date", kind: "event" },
  { jp: "ゲーム", en: "game", kind: "event" },
  { jp: "アルバイト", en: "part-time job", kind: "event" },
  { jp: "かいもの", en: "shopping", kind: "event", bare: true, noAttr: true },
];

// English accepted in Type mode for katakana words when the katakana setting allows it (メアリーさん -> "Mary san").
const LOANWORDS = {
  "メアリー": ["Mary"],
  "ロバート": ["Robert"],
  "ソラ": ["Sora"],
  "ジョン": ["John"],
  "アメリカ": ["America"],
  "イギリス": ["Britain", "England"],
  "オーストラリア": ["Australia"],
  "コーヒー": ["coffee"],
  "ハンバーガー": ["hamburger", "hamburgers"],
  "アイスクリーム": ["ice cream"],
  "テレビ": ["TV", "television"],
  "テニス": ["tennis"],
  "スポーツ": ["sports", "sport"],
  "ビジネス": ["business"],
  "トイレ": ["toilet", "restroom"],
  "ノート": ["notebook", "note"],
  "ペン": ["pen"],
  "パン": ["bread"],
  "ゲーム": ["game", "games"],
  "クラス": ["class"],
  "デート": ["date"],
  "レポート": ["report", "paper"],
  "レストラン": ["restaurant"],
  "ホテル": ["hotel"],
  "カフェ": ["cafe"],
  "スーパー": ["supermarket", "super"],
  "バス": ["bus"],
};

// Words that stand alone without a particle, so they can move around in the sentence like a phrase.
const FREE_WORDS = new Set([
  ...TIMES.filter((t) => t.free).map((t) => t.jp),
  ...DURATIONS.map((d) => d.jp),
  ...FREQUENCY.map((f) => f.jp),
  "たくさん",
  "いつ",
]);
