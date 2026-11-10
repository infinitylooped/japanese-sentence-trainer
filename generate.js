// Builds practice sentences from the vocabulary in vocab.js.
// A sentence is { jp, en }: {particle} marks a blank ({に|へ} when either is right) and spaces split tiles.
// {と&}: the & means the word before it stays attached to the next noun, as with の ("パンと さかなを" can't be split up).

const DEFAULT_SETTINGS = {
  lessons: [1, 2, 3, 4, 5],
  particles: ["は", "の", "も", "を", "で", "に", "へ", "が", "と"],
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
const article = (en) => (/^(?!uni)[aeiou]/.test(en) ? "an " : "a ") + en;
const possessive = (person) => person.pos ?? `${person.en}'s`;
const words = (...parts) => parts.filter(Boolean).join(" ");

// The particles accepted in a blank, given what's between its braces.
const blankAnswers = (blank) => blank.replace("&", "").split("|");

// です / じゃないです / ですか, and the past: でした / じゃなかったです / でしたか
function desu(type, past = false) {
  if (type === "negative") return (past ? "じゃなかったです" : "じゃないです") + "。";
  return (past ? "でした" : "です") + (type === "question" ? "{か}" : "") + "。";
}

// たべます -> たべません / たべました / たべませんでした; か is added for questions.
function conjugate(masu, type, past) {
  const stem = masu.replace(/ます$/, "");
  const ending = type === "negative" ? (past ? "ませんでした" : "ません") : past ? "ました" : "ます";
  return stem + ending + (type === "question" ? "{か}" : "");
}

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
// Returns { jp, en, third: whether English uses "is"/"-s", too: whether it's も, person, family, pair }.
function subject(c, type, { tooOk = true, family = false, pairOk = false } = {}) {
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
  if (pairOk && c.can("と") && chance(0.12)) {
    const names = PEOPLE.filter((p) => !p.me && !p.lesson);
    const a = pick(names);
    const b = pick(names.filter((p) => p !== a));
    return { jp: `${a.jp}{と&} ${b.jp}{${particle}}`, en: `${a.en} and ${b.en}`, third: false, too, pair: [a, b] };
  }
  const p = pick(c.from(PEOPLE, (p) => !(q && p.me)));
  return { jp: `${p.jp}{${particle}}`, en: p.en, third: !p.me, too, person: p };
}

// "Mary is a student." / "Mary wasn't a student either." / "Will it be cold tomorrow?" tense: present, past or future.
function copulaEn(s, type, complement, tense = "present") {
  const singular = s.third || s.en === "I";
  const [is, isnt] =
    tense === "past" ? (singular ? ["was", "wasn't"] : ["were", "weren't"])
    : tense === "future" ? ["will be", "won't be"]
    : s.en === "I" ? ["am", "am not"]
    : s.third ? ["is", "isn't"]
    : ["are", "aren't"];
  if (type === "question") {
    const [aux, be] = is.split(" ");
    return `${cap(aux)} ${words(s.en, be, complement)}${s.too ? " too" : ""}?`;
  }
  if (type === "negative") return `${cap(s.en)} ${isnt} ${complement}${s.too ? " either" : ""}.`;
  return `${cap(s.en)} ${is} ${complement}${s.too ? " too" : ""}.`;
}

const auxEn = (s, tense) => (tense === "past" ? "did" : tense === "future" ? "will" : s.third ? "does" : "do");

// "Mary ate fish." / "Mary didn't eat fish." / "Did Mary eat fish?"
// tail: the rest of the sentence, with a leading space. adv: "often" and the like, also with a leading space.
function verbEn(s, verb, type, tense, tail, adv = "") {
  const [base, third, pastForm] = verb.en;
  if (type === "question") return `${cap(auxEn(s, tense))} ${s.en}${adv} ${base}${tail}?`;
  if (type === "negative") {
    const aux = tense === "past" ? "didn't" : tense === "future" ? "won't" : s.third ? "doesn't" : "don't";
    return `${cap(s.en)} ${aux} ${base}${tail}.`;
  }
  const v = tense === "past" ? pastForm : tense === "future" ? `will ${base}` : s.third ? third : base;
  return `${cap(s.en)}${s.too ? ", too," : ""}${adv} ${v}${tail}.`;
}

// Whether a time word can go with this tense (no "yesterday" with ます, no "tomorrow" with ました).
const tenseFits = (t, past) => (past ? !t.habit && (!t.future || t.pastToo) : !t.past);

// ---------- templates ----------

// メアリーさんは がくせい です。 / メアリーさんは なんさい ですか。 / メアリーさんは こうこうせい でした。
function identity(c, type) {
  const s = subject(c, type, { family: true });
  const past = c.lesson(4) && chance(0.25);
  const ids = c.from(IDENTITIES, (id) => id.jp !== s.person?.jp && (!s.family || ["job", "nationality"].includes(id.kind)) && !(past && id.kind === "nationality"));
  const id = pick(ids);
  const ask = ASK[id.kind];
  if (type === "question" && ask && !s.too && chance(0.4)) {
    const be = past ? (s.third ? "was" : "were") : s.third ? "is" : "are";
    return { jp: words(s.jp, ask.jp, desu(type, past)), en: ask.en.replace("{be}", be).replace("{s}", s.en) };
  }
  return { jp: words(s.jp, id.jp, desu(type, past)), en: copulaEn(s, type, id.en, past ? "past" : "present") };
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

// この かさは せんえん です。 / メアリーさんの かさは いくら ですか。 / この かさは せんえん でした。
function price(c, type) {
  const particle = topicParticle(c, true);
  if (!particle) return null;
  const past = c.lesson(4) && chance(0.25);
  const thing = pick(c.from(THINGS));
  const owner = c.can("の") && chance(0.3) ? pick(PEOPLE.filter((p) => !p.me)) : null;
  const ptr = pick(c.from(POINTER_ADJ));
  const s = owner
    ? { jp: `${owner.jp}{の} ${thing.jp}{${particle}}`, en: `${possessive(owner)} ${thing.en}` }
    : { jp: `${ptr.jp} ${thing.jp}{${particle}}`, en: ptr.en.replace("{x}", thing.en) };
  Object.assign(s, { third: true, too: particle === "も" });
  if (type === "question" && !s.too && chance(0.6)) {
    return { jp: words(s.jp, "いくら", desu(type, past)), en: `How much ${past ? "was" : "is"} ${s.en}?` };
  }
  const yen = pick(c.from(PRICES));
  return { jp: words(s.jp, yen.jp, desu(type, past)), en: copulaEn(s, type, yen.en, past ? "past" : "present") };
}

// メアリーさんは あした としょかんで ほんを よみます。 / どこで ひるごはんを たべましたか。 / えいがを みませんか。
function action(c, type) {
  const q = type === "question";
  const goes = c.can("に") || c.can("へ");
  const objectsFor = (v) => c.from(OBJECTS, (o) => (v.object === "sold" ? o.sold : o.kind === v.object));
  const verbs = c.from(
    VERBS,
    (v) =>
      (!v.object || (c.can(v.particle ?? "を") && objectsFor(v).length)) &&
      (!v.to || (goes && c.from(PLACES, (p) => p[v.to]).length)) &&
      (!v.time || (c.can("に") && c.lesson(1)))
  );
  if (!verbs.length) return null;
  const verb = pick(verbs);
  const past = c.lesson(4) && chance(0.35);
  const invite = q && !past && verb.invite && chance(0.25);
  const s = invite ? { jp: "", en: "you", third: false } : subject(c, type, { tooOk: type === "positive", pairOk: c.lesson(4) });
  const isSubject = (p) => p.jp === s.person?.jp || s.pair?.some((x) => x.jp === p.jp);

  // Each role: { word, jp (word + particle), en }. Filled in sentence order below.
  const objects = verb.object ? objectsFor(verb).filter((o) => !isSubject(o)) : [];
  const object = verb.object && { word: pick(objects), particle: verb.particle ?? "を" };
  const dest = verb.to && { word: pick(c.from(PLACES, (p) => p[verb.to])), particle: "に|へ" };
  const placeTag = verb.object === "sold" ? object.word.sold : verb.object;
  const placesFor = verb.object && !verb.to && !verb.noPlace && c.can("で") ? c.from(PLACES, (p) => p.does.includes(placeTag)) : [];
  const place = placesFor.length && chance(0.4) && { word: pick(placesFor), particle: "で" };

  // The hours this can happen at, narrowed by the verb, object and places (breakfast: 6–9 a.m., the bank: 9 a.m.–3 p.m.).
  const limits = [verb.hours ?? AWAKE, object && object.word.hours, dest && (dest.word.toHours ?? dest.word.hours), place && place.word.hours];
  const hours = limits.filter(Boolean).reduce((hrs, limit) => hrs.filter((h) => limit.includes(h)));
  const fits = (t) => !t.hours || t.hours.some((h) => hours.includes(h));

  // A question word replaces one role: なにを, だれに, どこに, どこで, いつ, なんじに.
  let wh = null;
  if (q && !invite && chance(0.5)) {
    const asks = [];
    if (object && verb.who && c.lesson(2)) asks.push(["object", `だれ{${object.particle}}`, "Who"]);
    if (object && !verb.noWhat) asks.push(["object", `なに{${object.particle}}`, "What"]);
    if (dest && !verb.noWhere && c.lesson(2)) asks.push(["dest", "どこ{に|へ}", "Where"]);
    if (verb.object && !verb.to && !verb.noPlace && c.can("で") && c.lesson(2)) asks.push(["place", "どこ{で}", "Where"]);
    if (!verb.time && !verb.noTime) asks.push(["time", "いつ", "When"]);
    if (c.can("に") && c.lesson(1) && !verb.noClock && !verb.noTime && hours.length) asks.push(["time", "なんじ{に}", "What time"]);
    wh = pick(asks);
  }

  // At most one extra detail, which also keeps down the number of word orders Type mode has to accept.
  const details = [];
  if (!invite) {
    const freqs = !wh && !past && !verb.time && !verb.noTime ? c.from(FREQUENCY, (f) => f.types.includes(type)) : [];
    if (freqs.length) details.push({ kind: "freq", word: pick(freqs) });
    if (c.lesson(4)) {
      const partners = verb.together && c.can("と") && !s.pair ? c.from(PEOPLE, (p) => !p.me && !isSubject(p)) : [];
      if (partners.length) details.push({ kind: "with", word: pick(partners) });
      const durations = verb.long && type !== "negative" && !wh ? c.from(DURATIONS) : [];
      if (durations.length) details.push({ kind: "for", word: pick(durations) });
      const plenty = object && ["food", "drink", "reading"].includes(object.word.kind) && !/ごはん$|^しんぶん/.test(object.word.jp);
      if (plenty && type !== "negative" && wh?.[0] !== "object") details.push({ kind: "many" });
    }
  }
  const detail = details.length && chance(0.35) ? pick(details) : null;
  const freq = detail?.kind === "freq" ? detail.word : null;

  const times = verb.noTime ? [] : c.from(TIMES, (t) => (t.free || c.can("に")) && (verb.time ? t.clock : !(verb.noClock && t.clock)) && fits(t) && tenseFits(t, past));
  if (verb.time && !times.length) return null;
  const timeChoices = detail?.kind === "for" ? times.filter((t) => !t.clock) : times; // not "at 7 p.m. for 2 hours"
  const time = timeChoices.length && !freq && (verb.time || chance(0.4)) && { word: pick(timeChoices) };

  // Sometimes "someone's ___": Mary's book, Takeshi's house.
  const ownable = [object, dest, place].filter((r) => r && r.word.own && !(r === dest && verb.to === "back") && !(r === object && verb.object === "sold"));
  if (ownable.length && c.can("の") && chance(0.3)) {
    const owners = PEOPLE.filter((p) => !isSubject(p) && !(p.me && !s.third) && (!p.lesson || c.lesson(p.lesson)));
    pick(ownable).owner = pick(owners);
  }

  // Sometimes two objects: パンと さかなを かいました.
  if (object && !object.owner && c.lesson(4) && c.can("と") && ["food", "reading", "goods", "subject", "language"].includes(object.word.kind) && chance(0.15)) {
    const others = objects.filter((o) => o !== object.word && o.jp !== object.word.jp && o.hours === object.word.hours);
    if (others.length) object.and = pick(others);
  }

  for (const r of [object, dest, place, time].filter(Boolean)) {
    const w = r.word;
    const ownerJp = r.owner ? `${r.owner.jp}{の} ` : "";
    const andJp = r.and ? `{と&} ${r.and.jp}` : "";
    r.jp = ownerJp + w.jp + andJp + (r.particle ? `{${r.particle}}` : w.free ? "" : "{に}");
    const noun = r.owner ? `${possessive(r.owner)} ${w.own}` : w.en;
    const en = r === dest ? (r.owner || !w.to ? `to ${noun}` : w.to) : r === place ? (r.owner || !w.at ? `at ${noun}` : w.at) : noun;
    r.en = en + (r.and ? ` and ${r.and.en}` : "");
  }

  const roles = { object, dest, place, time };
  if (wh) roles[wh[0]] = { jp: wh[1], en: "" };

  // Sometimes も on a role other than the subject: it replaces を and が, and follows に and で.
  const alsoRoles = [roles.object, roles.dest, roles.place].filter(Boolean);
  const also = !wh && !invite && !freq && !s.too && c.lesson(4) && c.can("も") && alsoRoles.length && chance(0.12);
  if (also) {
    const r = pick(alsoRoles);
    r.jp = r.jp.replace(/\{([^}]+)\}$/, (blank, p) => (p === "を" || p === "が" ? "{も}" : `${blank}{も}`));
  }

  const many = detail?.kind === "many";
  if (many) roles.object.en = `a lot of ${roles.object.en}`;

  const parts = [roles.object?.en, roles.dest?.en, detail?.kind === "with" && `with ${detail.word.en}`, roles.place?.en, roles.time?.en, detail?.kind === "for" && detail.word.en];
  let tail = parts.filter(Boolean).map((e) => " " + e).join("");
  if (freq && type === "negative") tail += ` ${freq.en}`;
  if (also) tail += type === "negative" ? ", either" : ", too";

  const tense = past ? "past" : roles.time?.word?.future ? "future" : "present";
  let en;
  if (invite) en = `Would you like to ${verb.en[0]}${tail}?`;
  else if (wh) en = `${wh[2]} ${auxEn(s, tense)} ${s.en} ${wh[0] === "object" && verb.what ? verb.what : verb.en[0]}${tail}?`;
  else en = verbEn(s, verb, type, tense, tail, freq && type !== "negative" ? ` ${freq.en}` : "");

  const verbJp = invite ? `${verb.jp.replace(/ます$/, "ません")}{か}` : conjugate(verb.jp, type, past);
  const withJp = detail?.kind === "with" ? `${detail.word.jp}{と}` : "";
  const afterObject = detail?.kind === "for" ? detail.word.jp : many ? "たくさん" : "";
  const jp = words(s.jp, roles.time?.jp, freq?.jp, withJp, roles.dest?.jp, roles.place?.jp, roles.object?.jp, afterObject, verbJp) + "。";
  return { jp, en };
}

// "つくえの うえ" and "on the desk", plus the holder so that nothing ends up inside itself.
function spot(c) {
  const holder = pick(c.from(HOLDERS));
  const on = pick(c.from(ON_THINGS, (o) => o.holders.includes(holder.jp)));
  return { jp: `${holder.jp}{の} ${on.jp}`, en: on.en.replace("{x}", holder.en), holder };
}

function thereIsEn(type, past, plural, what, tail) {
  const [is, isnt] = past ? (plural ? ["were", "weren't"] : ["was", "wasn't"]) : plural ? ["are", "aren't"] : ["is", "isn't"];
  if (type === "question") return `${cap(is)} there ${what} ${tail}?`;
  return `There ${type === "negative" ? isnt : is} ${what} ${tail}.`;
}

function haveEn(s, type, past, what) {
  const tense = past ? "past" : "present";
  return verbEn(s, { en: ["have", "has", "had"] }, type, tense, ` ${what}`);
}

// ここに ねこが います。 / つくえの うえに ほんが あります。 / メアリーさんは いぬが います。 / あした クラスが あります。
function exists(c, type) {
  if (!c.can("が")) return null;
  const past = chance(0.25);
  const exist = (alive) => conjugate(alive ? "います" : "あります", type, past) + "。";

  // "X has ___": someone or an animal, or something on the calendar.
  if (chance(0.4)) {
    const s = subject(c, type, { tooOk: false });
    const events = c.from(EVENTS);
    const days = c.from(TIMES, (t) => !t.clock && !t.hours && (t.free || c.can("に")) && tenseFits(t, past));
    if (events.length && days.length && chance(0.5)) {
      const e = pick(events);
      const t = pick(days);
      return { jp: words(s.jp, t.jp + (t.free ? "" : "{に}"), `${e.jp}{が}`, exist(false)), en: haveEn(s, type, past, `${e.en} ${t.en}`) };
    }
    const a = pick(c.from(ANIMATE, (x) => x.have));
    const lots = type !== "negative" && chance(0.25);
    return { jp: words(s.jp, `${a.jp}{が}`, lots && "たくさん", exist(true)), en: haveEn(s, type, past, lots ? `a lot of ${a.many}` : article(a.en)) };
  }

  // "There is ___ somewhere."
  if (!c.can("に")) return null;
  const heres = c.from(HERE);
  const buildings = c.from(PLACES, (p) => p.name && p.jp !== "まち");
  const town = PLACES.find((p) => p.jp === "まち");
  let where, noun, alive;
  const roll = Math.random();
  if (roll < 0.4) {
    // A small thing on, under or in something.
    where = spot(c);
    const things = c.from(THINGS, (t) => !t.big && t.jp !== where.holder.jp);
    noun = pick(things);
  } else if (roll < 0.75) {
    // Someone or an animal somewhere.
    const spots = [...heres, ...buildings.map((p) => ({ jp: p.jp, en: p.at ?? `at ${p.en}` }))];
    where = pick(spots);
    noun = pick(c.from(ANIMATE));
    alive = true;
  } else {
    // A building nearby.
    where = pick([...heres, { jp: town.jp, en: town.at }]);
    const b = pick(buildings);
    noun = { jp: b.jp, en: b.name.replace(/^the /, "") };
  }

  if (type === "question" && chance(0.3)) {
    const [word, en] = alive && !noun.animal ? ["だれ", "Who"] : ["なに", "What"];
    return { jp: words(`${where.jp}{に}`, `${word}{が}`, exist(alive)), en: `${en} ${past ? "was" : "is"} ${where.en}?` };
  }
  const also = c.can("も") && chance(0.15);
  const lots = alive && !also && type !== "negative" && chance(0.25);
  const what = lots ? `a lot of ${noun.many}` : article(noun.en);
  const tail = where.en + (also ? (type === "negative" ? ", either" : ", too") : "");
  return {
    jp: words(`${where.jp}{に}`, `${noun.jp}{${also ? "も" : "が"}}`, lots && "たくさん", exist(alive)),
    en: thereIsEn(type, past, lots, what, tail),
  };
}

// ぎんこうは としょかんの となり です。 / ほんは つくえの うえ です。 / ほんは どこに ありますか。
function nearby(c, type) {
  const particle = topicParticle(c, true);
  if (!particle || !c.can("の")) return null;
  const too = particle === "も";
  const places = c.from(PLACES, (p) => p.name);
  const other = (...used) => pick(places.filter((p) => !used.includes(p)));
  let s, where;
  if (chance(0.6)) {
    const a = pick(places);
    const b = other(a);
    s = { jp: `${a.jp}{${particle}}`, en: a.name, third: true, too };
    if (c.can("と") && chance(0.25)) {
      const d = other(a, b);
      where = { jp: `${b.jp}{と&} ${d.jp}{の} あいだ`, en: `between ${b.name} and ${d.name}` };
    } else {
      const near = pick(c.from(BESIDE));
      where = { jp: `${b.jp}{の} ${near.jp}`, en: near.en.replace("{x}", b.name) };
    }
  } else {
    where = spot(c);
    const thing = pick(c.from(THINGS, (t) => !t.big && t.jp !== where.holder.jp));
    s = { jp: `${thing.jp}{${particle}}`, en: `the ${thing.en}`, third: true, too };
  }
  if (type === "question" && !too && c.can("に") && chance(0.3)) {
    return { jp: words(s.jp, "どこ{に}", "あります{か}。"), en: `Where is ${s.en}?` };
  }
  return { jp: words(s.jp, where.jp, desu(type)), en: copulaEn(s, type, where.en) };
}

// きのうは もくようび でした。 / きょうは なんようび ですか。
function weekday(c, type) {
  if (!c.can("は")) return null;
  const day = pick(DAYS);
  const past = !!day.past;
  const s = { jp: `${day.jp}{は}`, en: day.en, third: true };
  if (type === "question" && chance(0.5)) {
    return { jp: words(s.jp, "なんようび", desu(type, past)), en: `What day ${past ? "was" : "is"} ${day.en}?` };
  }
  const d = pick(WEEKDAYS);
  return { jp: words(s.jp, d.jp, desu(type, past)), en: copulaEn(s, type, d.en, past ? "past" : "present") };
}

// ---------- adjectives (lesson 5) ----------

// たかい です / たかくない です / たかかった です / たかくなかった です, しずか です / しずか じゃないです / しずか でした
function adjPredicate(a, type, past) {
  if (a.na) return words(a.jp, desu(type, past));
  const stem = a.ii ? a.jp.slice(0, -2) + "よ" : a.jp.slice(0, -1);
  const form = type === "negative" ? `${stem}く${past ? "なかった" : "ない"}` : past ? `${stem}かった` : a.jp;
  return words(form, `です${type === "question" ? "{か}" : ""}。`);
}

// たかい かさ / しずかな まち
const adjBefore = (a) => (a.na ? `${a.jp}な` : a.jp);

// "an expensive umbrella", "delicious coffee"
const adjNounEn = (a, n) => (n.mass ? `${a.en} ${n.en}` : article(`${a.en} ${n.en.replace(/^the /, "")}`));

// The noun an adjective sentence is about. null if there's no particle for it.
function describedSubject(c, type, kind) {
  if (kind === "person") return subject(c, type);
  const particle = topicParticle(c, true);
  if (!particle) return null;
  const too = particle === "も";
  const n = pick(DESCRIBED.filter((d) => d.kind === kind));
  if (n.bare) return { jp: `${n.jp}{${particle}}`, en: n.en, third: true, too };
  if (kind === "thing" && c.can("の") && chance(0.3)) {
    const owner = pick(PEOPLE.filter((p) => !p.me && !p.lesson));
    return { jp: `${owner.jp}{の} ${n.jp}{${particle}}`, en: `${possessive(owner)} ${n.en}`, third: true, too };
  }
  const ptr = pick(POINTER_ADJ);
  return { jp: `${ptr.jp} ${n.jp}{${particle}}`, en: ptr.en.replace("{x}", n.en), third: true, too };
}

// この かさは たかい です。 / メアリーさんは げんき でした。 / きのうは さむかった です。
function describe(c, type) {
  const a = pick(ADJECTIVES);
  const kind = pick(a.of);
  if (kind === "weather" || kind === "schedule") {
    if (!c.can("は")) return null;
    const day = pick(DAYS);
    const who = kind === "weather" ? { en: "it", third: true } : { en: type === "question" ? "you" : "I", third: false };
    const tense = day.past ? "past" : day.future ? "future" : "present";
    return { jp: words(`${day.jp}{は}`, adjPredicate(a, type, !!day.past)), en: copulaEn(who, type, `${a.en} ${day.en}`, tense) };
  }
  const s = describedSubject(c, type, kind);
  if (!s) return null;
  const past = chance(0.35);
  return { jp: words(s.jp, adjPredicate(a, type, past)), en: copulaEn(s, type, a.en, past ? "past" : "present") };
}

// これは たかい かさ です。 / メアリーさんは しずかな ひと です。 / おもしろい えいがを みました。
function adjNoun(c, type) {
  const a = pick(ADJECTIVES.filter((x) => !x.predOnly));
  const kinds = a.of.filter((k) => !["subject", "weather", "schedule"].includes(k));
  if (!kinds.length) return null;
  const kind = pick(kinds);
  if (kind === "person") {
    const s = subject(c, type);
    return { jp: words(s.jp, `${adjBefore(a)} ひと`, desu(type)), en: copulaEn(s, type, article(`${a.en} person`)) };
  }
  const n = pick(DESCRIBED.filter((d) => d.kind === kind && !d.noAttr));
  if (n.verb && c.can("を") && chance(0.5)) {
    const s = subject(c, type, { tooOk: type === "positive" });
    const past = chance(0.6);
    const verb = VERBS.find((v) => v.jp === n.verb);
    return { jp: words(s.jp, `${adjBefore(a)} ${n.jp}{を}`, conjugate(verb.jp, type, past)) + "。", en: verbEn(s, verb, type, past ? "past" : "present", ` ${adjNounEn(a, n)}`) };
  }
  const particle = topicParticle(c, true);
  if (!particle) return null;
  const ptr = pick(POINTERS);
  const s = { jp: `${ptr.jp}{${particle}}`, en: ptr.en, third: true, too: particle === "も" };
  return { jp: words(s.jp, `${adjBefore(a)} ${n.jp}`, desu(type)), en: copulaEn(s, type, adjNounEn(a, n)) };
}

// メアリーさんは おんがくが すき です。 / なにが すき ですか。
function likes(c, type) {
  if (!c.can("が")) return null;
  const feeling = pick(FEELINGS.filter((f) => type !== "negative" || f.negative));
  const s = subject(c, type, { tooOk: type === "positive" });
  if (type === "question" && chance(0.3)) {
    return { jp: words(s.jp, "なに{が}", feeling.jp, desu(type)), en: `What ${auxEn(s, "present")} ${s.en} ${feeling.en[0]}?` };
  }
  const item = pick(OBJECTS.filter((o) => ["drink", "food", "reading", "music", "show", "sport", "subject", "language", "animal"].includes(o.kind)));
  return { jp: words(s.jp, `${item.jp}{が}`, feeling.jp, desu(type)), en: verbEn(s, feeling, type, "present", ` ${item.en}`) };
}

const TEMPLATES = [
  { make: identity, lessons: [1], weight: 2 },
  { make: major, lessons: [1], weight: 1 },
  { make: belongs, lessons: [2], weight: 2 },
  { make: whereIs, lessons: [2], weight: 1 },
  { make: price, lessons: [2], weight: 1 },
  { make: action, lessons: [3, 4], weight: 7 },
  { make: exists, lessons: [4], weight: 3 },
  { make: nearby, lessons: [4], weight: 2 },
  { make: weekday, lessons: [4], weight: 1 },
  { make: describe, lessons: [5], weight: 4 },
  { make: adjNoun, lessons: [5], weight: 2 },
  { make: likes, lessons: [5], weight: 2 },
];

function pickWeighted(items) {
  let r = Math.random() * items.reduce((sum, t) => sum + t.weight, 0);
  return items.find((t) => (r -= t.weight) < 0) ?? items[items.length - 1];
}

// A random sentence that fits the settings, or null if none could be found.
function generate(settings) {
  const c = context(settings);
  const templates = TEMPLATES.filter((t) => t.lessons.some((n) => c.lesson(n)));
  const [min, max] = LENGTHS[settings.length] ?? LENGTHS.any;
  if (!templates.length || !settings.types.length) return null;
  for (let i = 0; i < 500; i++) {
    const sentence = pickWeighted(templates).make(c, pick(settings.types));
    if (!sentence) continue;
    const blanks = [...sentence.jp.matchAll(/\{([^}]+)\}/g)].map((m) => blankAnswers(m[1]));
    if (blanks.length < min || blanks.length > max) continue;
    if (!blanks.every((b) => b.some((p) => p === "か" || c.can(p)))) continue;
    sentence.en = sentence.en.replace(/\.\.$/, "."); // "at 8 a.m.." -> "at 8 a.m."
    return sentence;
  }
  return null;
}
