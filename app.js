const PARTICLES = ["は", "の", "も", "を", "で", "に", "へ", "か"];

const HINTS = {
  "は": "topic marker: \"as for X…\"",
  "の": "links nouns: X の Y = X's Y / Y of X",
  "も": "\"also / too\" (replaces は)",
  "を": "marks the direct object of the verb",
  "で": "place where an action happens",
  "に": "point in time (not after あした, まいにち, …), or destination",
  "へ": "direction / destination of movement",
  "か": "turns the sentence into a question",
};

const ORDER_NOTE = "Word order is flexible as long as each particle stays after its word and the verb comes last.";

const HELP = {
  particles: "Keys: <kbd>1</kbd>–<kbd>8</kbd> pick a particle · <kbd>Backspace</kbd> undo · <kbd>Enter</kbd> check / next",
  translate:
    `Tap the tiles in order. ${ORDER_NOTE}<br>` +
    "Keys: <kbd>1</kbd>–<kbd>9</kbd> pick a tile · <kbd>Backspace</kbd> undo · <kbd>Enter</kbd> check / next",
  type:
    "Type in kana or romaji (or a mix). Spaces, punctuation and long vowels don't matter, and わたしは can be left out. " +
    `${ORDER_NOTE}<br>Keys: <kbd>Enter</kbd> check / next`,
};

const els = {
  tabs: document.querySelectorAll(".tab"),
  english: document.getElementById("english"),
  sentence: document.getElementById("sentence"),
  choices: document.getElementById("choices"),
  action: document.getElementById("action"),
  feedback: document.getElementById("feedback"),
  score: document.getElementById("score"),
  streak: document.getElementById("streak"),
  help: document.getElementById("help"),
  settingsButton: document.getElementById("settings-button"),
  settings: document.getElementById("settings"),
  settingsForm: document.querySelector("#settings form"),
  settingsError: document.getElementById("settings-error"),
};

let mode = loadMode();
let settings = loadSettings();
const queues = {};
const stats = {};
for (const m in HELP) {
  queues[m] = [];
  stats[m] = { right: 0, total: 0, streak: 0 };
}
let card = null;
let solved = false; // answered correctly; the card is locked until "Next"

function loadMode() {
  try {
    const m = localStorage.getItem("mode");
    if (m in HELP) return m;
  } catch {}
  return "particles";
}

function saveMode() {
  try {
    localStorage.setItem("mode", mode);
  } catch {}
}

function loadSettings() {
  try {
    const s = { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("settings")) };
    if (generate(s)) return s;
  } catch {}
  return DEFAULT_SETTINGS;
}

// "わたし{は}がくせい" -> [{ text }, { answers: [...], value }, ...]
function parse(jp) {
  return jp
    .split(/(\{[^}]+\})/)
    .filter(Boolean)
    .map((s) => (s.startsWith("{") ? { answers: s.slice(1, -1).split("|"), value: null } : { text: s }));
}

const plain = (text) => text.replace(/\s+/g, "");

function fullSentence(segments) {
  return segments.map((s) => (s.answers ? s.answers[0] : plain(s.text))).join("");
}

// Word tokens for translate / type mode: text is split on spaces, punctuation dropped.
function tokenize(segments) {
  return segments.flatMap((s) =>
    s.answers
      ? [{ answers: s.answers }]
      : s.text
          .replace(/[。？?！!、]/g, "")
          .split(/\s+/)
          .filter(Boolean)
          .map((text) => ({ text }))
  );
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function permutations(arr) {
  if (arr.length <= 1) return [arr];
  return arr.flatMap((x, i) => permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p]));
}

// ---------- cards ----------

function particleCard(item) {
  const segments = parse(item.jp);
  return { item, segments, tokens: tokenize(segments), blanks: segments.filter((s) => s.answers), active: 0 };
}

function translateCard(item) {
  const segments = parse(item.jp);
  const tokens = tokenize(segments);
  const correct = new Set(tokens.flatMap((t) => t.answers ?? []));
  const distractors = shuffle(PARTICLES.filter((p) => !correct.has(p))).slice(0, 2);
  const tiles = shuffle([
    ...tokens.map((t) => ({ text: t.answers ? t.answers[0] : t.text, particle: !!t.answers })),
    ...distractors.map((p) => ({ text: p, particle: true })),
  ]);
  return { item, segments, tokens, tiles, answer: [] };
}

function typeCard(item) {
  const segments = parse(item.jp);
  const tokens = tokenize(segments);
  const input = document.createElement("input");
  Object.assign(input, { type: "text", className: "answer", placeholder: "Type the sentence in kana or romaji", autocomplete: "off", spellcheck: false, lang: "ja" });
  input.setAttribute("autocapitalize", "off");
  input.addEventListener("input", () => {
    card.wrong = false;
    render();
  });
  input.addEventListener("keydown", (e) => {
    // Enter while the IME is composing just confirms the kana.
    if (e.key === "Enter" && !e.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      onAction();
    }
  });
  return { item, segments, tokens, accepted: acceptedAnswers(tokens), input };
}

// A new sentence that isn't already coming up or on screen.
function freshSentence(q) {
  let s;
  for (let i = 0; i < 20; i++) {
    s = generate(settings);
    if (s && s.jp !== card?.item.jp && !q.some((x) => x.jp === s.jp)) break;
  }
  return s ?? generate(DEFAULT_SETTINGS);
}

function nextCard() {
  const q = queues[mode];
  // Keep a few sentences lined up so a missed one can be brought back a few cards later.
  while (q.length < 4) q.push(freshSentence(q));
  const item = q.shift();
  // tries: checks so far. wrong: the last check was wrong and the answer hasn't changed since. revealed: solution shown.
  card = { ...{ particles: particleCard, translate: translateCard, type: typeCard }[mode](item), tries: 0, wrong: false, revealed: false };
  solved = false;
  render();
}

// ---------- particle mode ----------

// The next blank that still needs a particle: empty, or marked wrong by the last check.
function nextOpen(start) {
  const n = card.blanks.length;
  for (let k = 0; k < n; k++) {
    const i = (start + k) % n;
    if (card.blanks[i].value === null || card.blanks[i].wrong) return i;
  }
  return -1;
}

function pickParticle(particle) {
  if (solved || card.active === -1) return;
  Object.assign(card.blanks[card.active], { value: particle, wrong: false });
  card.active = nextOpen(card.active + 1);
  render();
}

function clearBlank(i) {
  if (solved) return;
  Object.assign(card.blanks[i], { value: null, wrong: false });
  card.active = i;
  render();
}

// ---------- translate mode ----------

function pickTile(i) {
  if (solved || !card.tiles[i] || card.answer.includes(i)) return;
  card.answer.push(i);
  card.wrong = false;
  render();
}

function removeTile(pos) {
  if (solved) return;
  card.answer.splice(pos, 1);
  card.wrong = false;
  render();
}

// Split tokens into "words + particle" phrases (の keeps going to the next noun, か belongs to the verb);
// a word that takes no particle, like あした, is a phrase by itself. The rest is the predicate.
function splitPhrases(tokens) {
  const phrases = [];
  let cur = [];
  for (const t of tokens) {
    cur.push(t);
    if (t.answers ? !t.answers.some((a) => a === "の" || a === "か") : FREE_WORDS.has(t.text)) {
      phrases.push(cur);
      cur = [];
    }
  }
  return { phrases, predicate: cur };
}

const tokenMatches = (tok, text) => (tok.answers ? tok.answers.includes(text) : tok.text === text);
const seqMatches = (seq, texts, at) => seq.every((t, k) => tokenMatches(t, texts[at + k]));

// Correct if the phrases appear in any order, each intact, followed by the predicate.
function isCorrectTranslation(tokens, texts) {
  if (texts.length !== tokens.length) return false;
  const { phrases, predicate } = splitPhrases(tokens);
  const bodyLen = texts.length - predicate.length;
  if (!seqMatches(predicate, texts, bodyLen)) return false;

  const used = phrases.map(() => false);
  function fit(at) {
    if (at === bodyLen) return true;
    for (let i = 0; i < phrases.length; i++) {
      if (used[i] || !seqMatches(phrases[i], texts, at)) continue;
      used[i] = true;
      if (fit(at + phrases[i].length)) return true;
      used[i] = false;
    }
    return false;
  }
  return fit(0);
}

// ---------- type mode ----------

// わたしは is usually left out in real Japanese, so it's optional when typing.
const isWatashiWa = (phrase) => phrase.length === 2 && phrase[0].text === "わたし" && phrase[1].answers?.includes("は");

// Every accepted answer as a comparison key: all phrase orders × all ways to write each particle.
function acceptedAnswers(tokens) {
  const { phrases, predicate } = splitPhrases(tokens);
  const phraseSets = [phrases];
  const withoutWatashi = phrases.filter((p) => !isWatashiWa(p));
  if (withoutWatashi.length < phrases.length) phraseSets.push(withoutWatashi);
  const keys = new Set();
  for (const order of phraseSets.flatMap(permutations)) {
    let variants = [""];
    for (const t of [...order.flat(), ...predicate]) {
      const options = t.answers ? t.answers.flatMap(particleRomaji) : [toRomaji(t.text)];
      variants = variants.flatMap((v) => options.map((o) => v + o));
    }
    variants.forEach((v) => keys.add(canon(v)));
  }
  return keys;
}

function reading(tokens) {
  return tokens.map((t) => (t.answers ? particleRomaji(t.answers[0])[0] : toRomaji(t.text))).join(" ");
}

// ---------- shared ----------

function ready() {
  if (mode === "particles") return card.blanks.every((b) => b.value !== null);
  if (mode === "translate") return card.answer.length > 0;
  return card.input.value.trim() !== "";
}

function undo() {
  if (solved) return;
  if (mode === "translate") {
    if (card.answer.length) removeTile(card.answer.length - 1);
  } else if (mode === "particles") {
    const filled = card.blanks.map((b, i) => (b.value !== null ? i : -1)).filter((i) => i >= 0);
    if (filled.length) clearBlank(filled[filled.length - 1]);
  }
}

function isRight() {
  if (mode === "particles") return card.blanks.every((b) => b.answers.includes(b.value));
  if (mode === "translate") return isCorrectTranslation(card.tokens, card.answer.map((i) => card.tiles[i].text));
  return card.accepted.has(canon(toRomaji(card.input.value)));
}

// Only the first check of a sentence counts towards the score; after that it can be retried freely.
function check() {
  const right = isRight();
  if (card.tries++ === 0) {
    const s = stats[mode];
    s.total++;
    if (right) {
      s.right++;
      s.streak++;
    } else {
      s.streak = 0;
      // Bring this sentence back a few cards later.
      queues[mode].splice(Math.min(3, queues[mode].length), 0, card.item);
    }
  }
  solved = right;
  card.wrong = !right;
  if (mode === "particles" && !right) {
    card.blanks.forEach((b) => (b.wrong = !b.answers.includes(b.value)));
    card.mistakes = card.blanks.filter((b) => b.wrong).map((b) => ({ value: b.value, answers: b.answers }));
    card.active = nextOpen(0);
  }
  render();
  if (mode === "type" && !right) card.input.focus();
}

function reveal() {
  card.revealed = true;
  render();
  if (mode === "type") card.input.focus();
}

function line(tag, className, text, lang) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  if (lang) el.lang = lang;
  return el;
}

function hintItem(label, answers) {
  const li = document.createElement("li");
  li.innerHTML = `<span lang="ja">${label}<b>${answers.join(" / ")}</b></span> — ${HINTS[answers[0]] ?? ""}`;
  return li;
}

function answerLines() {
  return [line("p", "full", fullSentence(card.segments), "ja"), line("p", "romaji", reading(card.tokens))];
}

function particleMistakes() {
  const ul = document.createElement("ul");
  ul.append(...card.mistakes.map((b) => hintItem(`${b.value} → `, b.answers)));
  return [...answerLines(), ul];
}

function sentenceMistakes() {
  const yours = mode === "translate" ? card.answer.map((i) => card.tiles[i].text).join(" ") : card.input.value.trim();
  const ul = document.createElement("ul");
  card.segments.forEach((seg, i) => {
    if (!seg.answers) return;
    const prev = card.segments[i - 1];
    const word = prev?.text ? prev.text.trim().split(/\s+/).pop() : "";
    ul.append(hintItem(`${word} `, seg.answers));
  });
  return [...answerLines(), line("p", "yours", `Yours: ${yours}`, "ja"), ul];
}

function onAction() {
  if (solved) nextCard();
  else if (ready()) check();
}

function setMode(m) {
  if (m === mode) return;
  mode = m;
  saveMode();
  nextCard();
}

// ---------- settings ----------

function fillSettingsForm(s) {
  for (const input of els.settingsForm.elements) {
    if (input.type === "checkbox") input.checked = s[input.name].map(String).includes(input.value);
    if (input.type === "radio") input.checked = s[input.name] === input.value;
  }
}

function openSettings() {
  fillSettingsForm(settings);
  els.settingsError.textContent = "";
  els.settings.showModal();
}

function saveSettings(e) {
  e.preventDefault();
  const form = new FormData(els.settingsForm);
  const s = {
    lessons: form.getAll("lessons").map(Number),
    particles: form.getAll("particles"),
    types: form.getAll("types"),
    length: form.get("length"),
  };
  if (!generate(s)) {
    els.settingsError.textContent = "No sentences fit these settings. Try turning more on.";
    return;
  }
  settings = s;
  try {
    localStorage.setItem("settings", JSON.stringify(s));
  } catch {}
  for (const m in queues) queues[m] = [];
  els.settings.close();
  if (!solved) nextCard();
}

// ---------- rendering ----------

function button(className, html, onclick) {
  const b = document.createElement("button");
  b.className = className;
  b.innerHTML = html;
  b.onclick = onclick;
  return b;
}

function renderParticles() {
  els.sentence.replaceChildren(
    ...card.segments.map((seg) => {
      if (!seg.answers) return document.createTextNode(plain(seg.text));
      const i = card.blanks.indexOf(seg);
      const b = button("blank", seg.value ?? "　", () => clearBlank(i));
      if (!solved && i === card.active) b.classList.add("active");
      if (solved) b.classList.add("right");
      if (seg.wrong) b.classList.add("wrong");
      b.disabled = solved;
      b.title = "Click to clear";
      return b;
    })
  );

  els.choices.replaceChildren(
    ...PARTICLES.map((p, i) => {
      const b = button("tile particle", `${p}<small>${i + 1}</small>`, () => pickParticle(p));
      b.disabled = solved;
      return b;
    })
  );
}

function renderTranslate() {
  const result = solved ? "right" : card.wrong ? "wrong" : "";
  els.sentence.replaceChildren(
    ...(card.answer.length
      ? card.answer.map((tileIndex, pos) => {
          const t = card.tiles[tileIndex];
          const b = button(`tile placed ${t.particle ? "particle" : ""} ${result}`, t.text, () => removeTile(pos));
          b.disabled = solved;
          return b;
        })
      : [line("span", "placeholder", "Tap the tiles below to build the sentence")])
  );

  els.choices.replaceChildren(
    ...card.tiles.map((t, i) => {
      const used = card.answer.includes(i);
      const num = i < 9 ? `<small>${i + 1}</small>` : "";
      const b = button(`tile ${t.particle ? "particle" : ""} ${used ? "used" : ""}`, `${t.text}${num}`, () => pickTile(i));
      b.disabled = solved || used;
      return b;
    })
  );
}

function renderType() {
  els.choices.replaceChildren();
  card.input.disabled = solved;
  card.input.classList.toggle("right", solved);
  card.input.classList.toggle("wrong", card.wrong);
  // Keep the same input element so typing (and IME state) isn't interrupted.
  if (els.sentence.firstChild !== card.input) {
    els.sentence.replaceChildren(card.input);
    card.input.focus();
  }
}

// Right: the solution. Wrong: a prompt to try again, and the solution only once asked for.
function renderFeedback() {
  if (solved) {
    els.feedback.className = "feedback right";
    const verdict = card.revealed ? "正解！ Correct (after seeing the solution)." : "正解！ Correct!";
    els.feedback.replaceChildren(line("p", "", verdict), ...answerLines());
  } else if (card.tries) {
    els.feedback.className = "feedback wrong";
    els.feedback.replaceChildren(
      line("p", "verdict", "Not quite. Change your answer and check again."),
      ...(card.revealed
        ? [...(mode === "particles" ? particleMistakes() : sentenceMistakes()), button("link", "Skip to the next sentence →", nextCard)]
        : [button("link", "Show solution", reveal)])
    );
  } else {
    els.feedback.className = "feedback";
    els.feedback.replaceChildren();
  }
}

function render() {
  els.tabs.forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.mode === mode)));
  document.body.dataset.mode = mode;
  els.help.innerHTML = HELP[mode];
  els.english.textContent = card.item.en;

  ({ particles: renderParticles, translate: renderTranslate, type: renderType })[mode]();
  renderFeedback();

  els.action.textContent = solved ? "Next →" : "Check";
  els.action.disabled = !solved && !ready();

  const s = stats[mode];
  els.score.textContent = `${s.right} / ${s.total}`;
  els.streak.textContent = s.streak >= 2 ? `🔥 ${s.streak}` : "";
}

function init() {
  els.tabs.forEach((t) => (t.onclick = () => setMode(t.dataset.mode)));
  els.action.onclick = onAction;
  els.settingsButton.onclick = openSettings;
  els.settingsForm.onsubmit = saveSettings;
  document.getElementById("settings-cancel").onclick = () => els.settings.close();
  document.getElementById("settings-defaults").onclick = () => fillSettingsForm(DEFAULT_SETTINGS);

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || els.settings.open) return;
    if (e.target instanceof HTMLInputElement) return; // the answer box handles its own keys
    if (e.key === "Enter" && els.feedback.contains(e.target)) return; // "Show solution" / "Skip" buttons
    const n = Number(e.key);
    if (n >= 1 && n <= 9 && mode !== "type") {
      e.preventDefault();
      if (mode === "particles") pickParticle(PARTICLES[n - 1]);
      else pickTile(n - 1);
    } else if (e.key === "Backspace" && mode !== "type") {
      e.preventDefault();
      undo();
    } else if (e.key === "Enter") {
      e.preventDefault();
      onAction();
    }
  });

  nextCard();
}

init();
