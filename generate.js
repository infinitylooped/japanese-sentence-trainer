// Builds practice sentences from the vocabulary in vocab.js.
// A sentence is { jp, en }: {particle} marks a blank ({に|へ} when either is right) and spaces split tiles.

const DEFAULT_SETTINGS = {
  lessons: [1, 2, 3],
  particles: ["は", "の", "も", "を", "で", "に", "へ"],
  types: ["positive", "negative", "question"],
  length: "any",
  repeat: 3, // a missed sentence comes back after this many other cards; 0 = never
  katakana: "strict", // Type mode: "strict" = katakana words must be written in kana, "english" = English spelling OK too
};

// How many particles (blanks, including the question か) a sentence may have.
const LENGTHS = { any: [1, 9], short: [1, 2], medium: [2, 3], long: [3, 9] };

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const article = (en) => (/^[aeiou]/.test(en) ? "an " : "a ") + en;
const possessive = (person) => person.pos ?? `${person.en}'s`;
const words = (...parts) => parts.filter(Boolean).join(" ");

// です / じゃないです / ですか
const desu = (type) => (type === "negative" ? "じゃないです" : type === "question" ? "です{か}" : "です") + "。";

function context(settings) {
  const lesson = (n) => settings.lessons.includes(n);
  return {
    lesson,
    can: (p) => settings.particles.includes(p),
    // The words of a list that belong to a chosen lesson (and pass the test).
    from: (list, test = () => true) => list.filter((w) => (!w.lesson || lesson(w.lesson)) && test(w)),
  };
}

// は, or sometimes も ("too") when allowed. null if neither particle can be used.
function topicParticle(c, tooOk) {
  if (tooOk && c.can("も") && c.lesson(2) && (!c.can("は") || chance(0.2))) return "も";
  return c.can("は") ? "は" : null;
}

// Who a sentence is about. Left out, it's "I" (or "you" in a question).
// Returns { jp, en, third: whether English uses "is"/"-s", too: whether it's も, person, family }.
function subject(c, type, { tooOk = true, family = false } = {}) {
  const q = type === "question";
  const particle = topicParticle(c, tooOk);
  if (!particle || chance(0.3)) return { jp: "", en: q ? "you" : "I", third: false };
  const too = particle === "も";
  const relatives = c.from(FAMILY);
  if (family && relatives.length && c.can("の") && chance(0.25)) {
    const owner = pick(PEOPLE.filter((p) => !p.me && !p.lesson));
    const f = pick(relatives);
    return { jp: `${owner.jp}{の} ${f.jp}{${particle}}`, en: `${possessive(owner)} ${f.en}`, third: true, too, family: true };
  }
  const p = pick(c.from(PEOPLE, (p) => !(q && p.me)));
  return { jp: `${p.jp}{${particle}}`, en: p.en, third: !p.me, too, person: p };
}

// "Mary is a student." / "Mary isn't a student either." / "Is Mary a student too?"
function copulaEn(s, type, complement) {
  const [is, isnt] = s.en === "I" ? ["am", "am not"] : s.third ? ["is", "isn't"] : ["are", "aren't"];
  if (type === "question") return `${cap(is)} ${s.en} ${complement}${s.too ? " too" : ""}?`;
  if (type === "negative") return `${cap(s.en)} ${isnt} ${complement}${s.too ? " either" : ""}.`;
  return `${cap(s.en)} ${is} ${complement}${s.too ? " too" : ""}.`;
}

// ---------- templates ----------

// メアリーさんは がくせい です。 / メアリーさんは なんさい ですか。
function identity(c, type) {
  const s = subject(c, type, { family: true });
  const ids = c.from(IDENTITIES, (id) => id.jp !== s.person?.jp && (!s.family || ["job", "nationality"].includes(id.kind)));
  const id = pick(ids);
  const ask = ASK[id.kind];
  if (type === "question" && ask && !s.too && chance(0.4)) {
    return { jp: words(s.jp, ask.jp, desu(type)), en: ask.en.replace("{be}", s.third ? "is" : "are").replace("{s}", s.en) };
  }
  return { jp: words(s.jp, id.jp, desu(type)), en: copulaEn(s, type, id.en) };
}

// メアリーさんの せんこうは けいざい です。 / せんこうは なん ですか。
function major(c, type) {
  const q = type === "question";
  const particle = topicParticle(c, true);
  if (!particle) return null;
  const owner = c.can("の") && chance(0.7) ? pick(c.from(PEOPLE, (p) => !(q && p.me))) : null;
  const s = {
    jp: words(owner && `${owner.jp}{の}`, `せんこう{${particle}}`),
    en: `${owner ? possessive(owner) : q ? "your" : "my"} major`,
    third: true,
    too: particle === "も",
  };
  if (q && !s.too && chance(0.4)) return { jp: words(s.jp, "なん", desu(type)), en: `What is ${s.en}?` };
  const m = pick(c.from(MAJORS));
  return { jp: words(s.jp, m.jp, desu(type)), en: copulaEn(s, type, m.en) };
}

// これは メアリーさんの かさ です。 / これは だれの かさ ですか。
function belongs(c, type) {
  const particle = topicParticle(c, true);
  if (!particle) return null;
  const ptr = pick(c.from(POINTERS));
  const thing = pick(c.from(THINGS));
  const s = { jp: `${ptr.jp}{${particle}}`, en: ptr.en, third: true, too: particle === "も" };
  if (type === "question" && !s.too && chance(0.4)) {
    if (c.can("の") && chance(0.6)) {
      return { jp: words(s.jp, `だれ{の}`, thing.jp, desu(type)), en: `Whose ${thing.en} is ${ptr.en}?` };
    }
    return { jp: words(s.jp, "なん", desu(type)), en: `What is ${ptr.en}?` };
  }
  const owner = c.can("の") && chance(0.7) ? pick(c.from(PEOPLE)) : null;
  const what = owner ? `${possessive(owner)} ${thing.en}` : article(thing.en);
  return { jp: words(s.jp, owner && `${owner.jp}{の}`, thing.jp, desu(type)), en: copulaEn(s, type, what) };
}

// としょかんは あそこ です。 / としょかんは どこ ですか。
function whereIs(c, type) {
  const particle = topicParticle(c, true);
  if (!particle) return null;
  const place = pick(c.from(PLACES, (p) => p.name));
  const s = { jp: `${place.jp}{${particle}}`, en: place.name, third: true, too: particle === "も" };
  if (type === "question" && !s.too && chance(0.5)) return { jp: words(s.jp, "どこ", desu(type)), en: `Where is ${place.name}?` };
  const here = pick(c.from(HERE));
  return { jp: words(s.jp, here.jp, desu(type)), en: copulaEn(s, type, here.en) };
}

// この かさは せんえん です。 / メアリーさんの かさは いくら ですか。
function price(c, type) {
  const particle = topicParticle(c, true);
  if (!particle) return null;
  const thing = pick(c.from(THINGS));
  const owner = c.can("の") && chance(0.3) ? pick(PEOPLE.filter((p) => !p.me)) : null;
  const ptr = pick(c.from(POINTER_ADJ));
  const s = owner
    ? { jp: `${owner.jp}{の} ${thing.jp}{${particle}}`, en: `${possessive(owner)} ${thing.en}` }
    : { jp: `${ptr.jp} ${thing.jp}{${particle}}`, en: ptr.en.replace("{x}", thing.en) };
  Object.assign(s, { third: true, too: particle === "も" });
  if (type === "question" && !s.too && chance(0.6)) return { jp: words(s.jp, "いくら", desu(type)), en: `How much is ${s.en}?` };
  const yen = pick(c.from(PRICES));
  return { jp: words(s.jp, yen.jp, desu(type)), en: copulaEn(s, type, yen.en) };
}

// メアリーさんは あした としょかんで ほんを よみます。 / どこで ひるごはんを たべますか。
function action(c, type) {
  const q = type === "question";
  const goes = c.can("に") || c.can("へ");
  const objectsFor = (v) => c.from(OBJECTS, (o) => o.kind === v.object);
  const verbs = c.from(
    VERBS,
    (v) =>
      (!v.object || (c.can("を") && objectsFor(v).length)) &&
      (!v.to || (goes && c.from(PLACES, (p) => p[v.to]).length)) &&
      (!v.time || (c.can("に") && c.lesson(1)))
  );
  if (!verbs.length) return null;
  const verb = pick(verbs);
  const s = subject(c, type, { tooOk: type === "positive" });

  // Each role: { word, jp (word + particle), en }. Filled in sentence order below.
  const object = verb.object && { word: pick(objectsFor(verb)), particle: "を" };
  const dest = verb.to && { word: pick(c.from(PLACES, (p) => p[verb.to])), particle: "に|へ" };
  const placesFor = verb.object && !verb.to && c.can("で") ? c.from(PLACES, (p) => p.does.includes(verb.object)) : [];
  const place = placesFor.length && chance(0.4) && { word: pick(placesFor), particle: "で" };

  // The hours this can happen at, narrowed by the verb, object and places (breakfast: 6–9 a.m., the bank: 9 a.m.–3 p.m.).
  const limits = [verb.hours ?? AWAKE, object && object.word.hours, dest && (dest.word.toHours ?? dest.word.hours), place && place.word.hours];
  const hours = limits.filter(Boolean).reduce((hrs, limit) => hrs.filter((h) => limit.includes(h)));
  const fits = (t) => !t.hours || t.hours.some((h) => hours.includes(h));
  const times = c.from(TIMES, (t) => (t.free || c.can("に")) && (verb.time ? t.clock : !(verb.noClock && t.clock)) && fits(t));
  if (verb.time && !times.length) return null;
  const time = times.length && (verb.time || chance(0.4)) && { word: pick(times) };

  // Sometimes "someone's ___": Mary's book, Takeshi's house.
  const ownable = [object, dest, place].filter((r) => r && r.word.own && !(r === dest && verb.to === "back"));
  if (ownable.length && c.can("の") && chance(0.3)) {
    const owners = PEOPLE.filter((p) => p !== s.person && !(p.me && !s.third) && (!p.lesson || c.lesson(p.lesson)));
    pick(ownable).owner = pick(owners);
  }

  for (const r of [object, dest, place, time].filter(Boolean)) {
    const w = r.word;
    const ownerJp = r.owner ? `${r.owner.jp}{の} ` : "";
    r.jp = ownerJp + w.jp + (r.particle ? `{${r.particle}}` : w.free ? "" : "{に}");
    const noun = r.owner ? `${possessive(r.owner)} ${w.own}` : w.en;
    r.en = r === dest ? (r.owner || !w.to ? `to ${noun}` : w.to) : r === place ? (r.owner || !w.at ? `at ${noun}` : w.at) : noun;
  }

  // A question word replaces one role: なにを, どこに, どこで, いつ, なんじに.
  let wh = null;
  if (q && chance(0.5)) {
    const asks = [];
    if (object && !verb.noWhat) asks.push(["object", "なに{を}", "What"]);
    if (dest && !verb.noWhere && c.lesson(2)) asks.push(["dest", "どこ{に|へ}", "Where"]);
    if (verb.object && !verb.to && c.can("で") && c.lesson(2)) asks.push(["place", "どこ{で}", "Where"]);
    if (!verb.time) asks.push(["time", "いつ", "When"]);
    if (c.can("に") && c.lesson(1) && !verb.noClock && hours.length) asks.push(["time", "なんじ{に}", "What time"]);
    wh = pick(asks);
  }
  const roles = { object, dest, place, time };
  if (wh) roles[wh[0]] = { jp: wh[1], en: "" };

  const future = !!roles.time?.word?.future;
  const rest = ["object", "dest", "place", "time"].map((k) => roles[k]?.en).filter(Boolean).map((e) => " " + e).join("");
  const [base, third] = verb.en;
  let en;
  if (q) {
    const aux = future ? "will" : s.third ? "does" : "do";
    const v = wh?.[0] === "object" && verb.what ? verb.what : base;
    en = wh ? `${wh[2]} ${aux} ${s.en} ${v}${rest}?` : `${cap(aux)} ${s.en} ${base}${rest}?`;
  } else if (type === "negative") {
    en = `${cap(s.en)} ${future ? "won't" : s.third ? "doesn't" : "don't"} ${base}${rest}.`;
  } else {
    en = `${cap(s.en)}${s.too ? ", too," : ""} ${future ? `will ${base}` : s.third ? third : base}${rest}.`;
  }

  const verbJp = type === "negative" ? verb.jp.replace(/ます$/, "ません") : q ? `${verb.jp}{か}` : verb.jp;
  const jp = words(s.jp, roles.time?.jp, roles.dest?.jp, roles.place?.jp, roles.object?.jp, verbJp) + "。";
  return { jp, en };
}

const TEMPLATES = [
  { make: identity, lesson: 1, weight: 2 },
  { make: major, lesson: 1, weight: 1 },
  { make: belongs, lesson: 2, weight: 2 },
  { make: whereIs, lesson: 2, weight: 1 },
  { make: price, lesson: 2, weight: 1 },
  { make: action, lesson: 3, weight: 7 },
];

function pickWeighted(items) {
  let r = Math.random() * items.reduce((sum, t) => sum + t.weight, 0);
  return items.find((t) => (r -= t.weight) < 0) ?? items[items.length - 1];
}

// A random sentence that fits the settings, or null if none could be found.
function generate(settings) {
  const c = context(settings);
  const templates = TEMPLATES.filter((t) => c.lesson(t.lesson));
  const [min, max] = LENGTHS[settings.length] ?? LENGTHS.any;
  if (!templates.length || !settings.types.length) return null;
  for (let i = 0; i < 500; i++) {
    const sentence = pickWeighted(templates).make(c, pick(settings.types));
    if (!sentence) continue;
    const blanks = [...sentence.jp.matchAll(/\{([^}]+)\}/g)].map((m) => m[1].split("|"));
    if (blanks.length < min || blanks.length > max) continue;
    if (!blanks.every((b) => b.some((p) => p === "か" || c.can(p)))) continue;
    sentence.en = sentence.en.replace(/\.\.$/, "."); // "at 8 a.m.." -> "at 8 a.m."
    return sentence;
  }
  return null;
}
