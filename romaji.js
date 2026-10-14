// Kana -> romaji conversion and a loose romaji comparison key.

const KANA = "あいうえおかきくけこがぎぐげごさしすせそざじずぜぞたちつてとだぢづでどなにぬねのはひふへほばびぶべぼぱぴぷぺぽまみむめもやゆよらりるれろわをんゔ";
const ROMA = (
  "a i u e o ka ki ku ke ko ga gi gu ge go sa shi su se so za ji zu ze zo ta chi tsu te to da ji zu de do " +
  "na ni nu ne no ha hi fu he ho ba bi bu be bo pa pi pu pe po ma mi mu me mo ya yu yo ra ri ru re ro wa wo n vu"
).split(" ");

// How a particle can be written in romaji (は is pronounced "wa", but "ha" is what you'd type for the kana).
const PARTICLE_ROMAJI = { "は": ["wa", "ha"], "へ": ["e", "he"], "を": ["o", "wo"] };

function particleRomaji(p) {
  return PARTICLE_ROMAJI[p] ?? [toRomaji(p)];
}

function toHiragana(ch) {
  const c = ch.charCodeAt(0);
  return c >= 0x30a1 && c <= 0x30f6 ? String.fromCharCode(c - 0x60) : ch;
}

// Hepburn romaji for kana; anything else (latin letters, spaces) passes through.
function toRomaji(text) {
  let out = "";
  let last = "";
  let sokuon = false;
  for (const raw of text.normalize("NFKC")) {
    const ch = toHiragana(raw);
    if (ch === "っ") {
      sokuon = true;
      continue;
    }
    if (ch === "ー") {
      out += out.match(/[aeiou]$/)?.[0] ?? "";
      continue;
    }
    const yoon = { "ゃ": "a", "ゅ": "u", "ょ": "o" }[ch];
    if (yoon) {
      // きゃ -> kya, しゃ -> sha
      if (/(sh|ch|j)i$/.test(out)) out = out.slice(0, -1) + yoon;
      else out = out.replace(/i$/, "") + "y" + yoon;
      continue;
    }
    const small = { "ぁ": "a", "ぃ": "i", "ぅ": "u", "ぇ": "e", "ぉ": "o" }[ch];
    if (small) {
      // ファ -> fa, ティ -> ti, ウィ -> wi
      out = /^[aeiou]$/.test(last) ? out.slice(0, -1) + "w" + small : out.replace(/[aeiou]$/, "") + small;
      continue;
    }
    const i = KANA.indexOf(ch);
    let r = i >= 0 ? ROMA[i] : ch;
    if (sokuon && /^[b-df-hj-np-tv-z]/.test(r)) r = (r.startsWith("ch") ? "t" : r[0]) + r;
    sokuon = false;
    last = r;
    out += r;
  }
  return out;
}

// Comparison key: unifies Hepburn/Kunrei spellings, ignores punctuation, spaces and vowel length.
function canon(romaji) {
  return romaji
    .toLowerCase()
    .normalize("NFD")
    .replace(/([aeiou])[̂̄]/g, "$1$1") // ō / ô -> oo
    .replace(/[^a-z]/g, "")
    .replace(/[ct]ch/g, "tch")
    .replace(/shi/g, "si")
    .replace(/sh/g, "sy")
    .replace(/chi/g, "ti")
    .replace(/ch/g, "ty")
    .replace(/tsu/g, "tu")
    .replace(/fu/g, "hu")
    .replace(/jy?/g, "zy")
    .replace(/zyi/g, "zi")
    .replace(/m(?=[bpm])/g, "n")
    .replace(/ou/g, "o")
    .replace(/ei/g, "e")
    .replace(/([aeiou])\1+/g, "$1");
}
