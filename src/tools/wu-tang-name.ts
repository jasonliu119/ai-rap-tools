/**
 * An unofficial, fan-made generator. It deliberately excludes Wu-Tang Clan
 * member names and runs entirely locally; no input is sent anywhere.
 */
export type WuTangStyle = 'classic' | 'street';
export type WuTangResult = { name: string; interpretation: string; style: WuTangStyle };

type Tag = 'power' | 'stealth' | 'sacred' | 'wild' | 'agile' | 'wisdom';
type Word = { word: string; tags: readonly Tag[]; meaning: string };
const word = (value: string, tags: readonly Tag[], meaning: string): Word => ({ word: value, tags, meaning });

const CLASSIC_ADJECTIVES: readonly Word[] = [
  word('Silent', ['stealth'], 'You choose your moment instead of chasing noise.'),
  word('Jade', ['sacred', 'wisdom'], 'You keep your cool when the room gets loud.'),
  word('Crimson', ['power', 'wild'], 'You bring heat with a steady hand.'),
  word('Golden', ['sacred', 'power'], 'You carry confidence without needing a crown.'),
  word('Iron', ['power'], 'You stay firm when a path gets difficult.'),
  word('Hidden', ['stealth'], 'You notice the opening other people miss.'),
  word('Swift', ['agile'], 'You move before doubt has time to settle in.'),
  word('Ancient', ['wisdom', 'sacred'], 'You trust patience more than a quick win.'),
  word('Wild', ['wild'], 'You make your own route through the rules.'),
  word('Moonlit', ['stealth', 'wisdom'], 'You are most focused when the world quiets down.'),
  word('Ember', ['power', 'wild'], 'You keep a spark alive through the long night.'),
  word('Celestial', ['sacred', 'wisdom'], 'You look past the obvious answer.'),
  word('Silver', ['agile', 'wisdom'], 'You turn a sharp eye into clean decisions.'),
  word('Patient', ['wisdom'], 'You let timing do part of the work.'),
  word('Storm', ['power', 'wild'], 'You arrive with force and leave a mark.'),
  word('Lotus', ['sacred', 'agile'], 'You keep growing even in rough water.'),
];
const CLASSIC_NOUNS: readonly Word[] = [
  word('Dragon', ['power', 'wisdom'], 'The dragon image gives that power a watchful edge.'),
  word('Crane', ['agile', 'wisdom'], 'The crane keeps the name light, precise, and balanced.'),
  word('Tiger', ['power', 'wild'], 'The tiger makes the energy direct and fearless.'),
  word('Serpent', ['stealth', 'wisdom'], 'The serpent adds patience and a quiet surprise.'),
  word('Mantis', ['agile', 'stealth'], 'The mantis suggests fast hands and close attention.'),
  word('Phoenix', ['power', 'sacred'], 'The phoenix makes reinvention part of the story.'),
  word('Sword', ['power', 'agile'], 'The sword keeps the image clean and decisive.'),
  word('Temple', ['sacred', 'wisdom'], 'The temple gives the name a centered, deliberate weight.'),
  word('Monk', ['sacred', 'wisdom'], 'The monk brings discipline before spectacle.'),
  word('Lantern', ['wisdom', 'stealth'], 'The lantern says you can find a way in the dark.'),
  word('Falcon', ['agile', 'power'], 'The falcon makes the result feel quick and far-seeing.'),
  word('River', ['agile', 'wisdom'], 'The river keeps the force flexible rather than fixed.'),
  word('Mountain', ['power', 'sacred'], 'The mountain gives the name an unshakable scale.'),
  word('Cobra', ['stealth', 'power'], 'The cobra holds its force until it counts.'),
];
const STREET_ADJECTIVES: readonly Word[] = [
  word('Concrete', ['power', 'wild'], 'You stay solid when the pressure is real.'),
  word('Cold', ['stealth', 'power'], 'You keep your head when everyone else reacts.'),
  word('Midnight', ['stealth', 'wild'], 'You find momentum after the day clocks out.'),
  word('Raw', ['wild', 'power'], 'You would rather be honest than polished.'),
  word('Brick', ['power'], 'You build your position one move at a time.'),
  word('Shadow', ['stealth'], 'You let your work speak before you do.'),
  word('Savage', ['wild', 'power'], 'You meet a challenge with full commitment.'),
  word('Neon', ['agile', 'wild'], 'You make a signal people can spot from far away.'),
  word('Quiet', ['stealth', 'wisdom'], 'You make room for a better read of the situation.'),
  word('Steel', ['power'], 'You hold your line when it would be easier to bend.'),
  word('Rogue', ['wild', 'agile'], 'You are comfortable taking the unmarked route.'),
  word('Lowkey', ['stealth'], 'You do not need every win announced.'),
];
const STREET_NOUNS: readonly Word[] = [
  word('Cipher', ['wisdom', 'wild'], 'The cipher makes the name feel made for a circle of sharp minds.'),
  word('Ronin', ['agile', 'wild'], 'The ronin adds an independent, self-directed streak.'),
  word('Shogun', ['power', 'wisdom'], 'The shogun gives the result command and composure.'),
  word('Block', ['power', 'wild'], 'The block keeps the image grounded and lived-in.'),
  word('Signal', ['agile', 'wisdom'], 'The signal says your message cuts through the static.'),
  word('Viper', ['stealth', 'power'], 'The viper keeps the energy controlled and quick.'),
  word('Rider', ['agile', 'wild'], 'The rider gives the result motion and nerve.'),
  word('Static', ['wild', 'stealth'], 'The static makes unpredictability part of the appeal.'),
  word('Crown', ['power', 'sacred'], 'The crown frames confidence as something you earned.'),
  word('Code', ['wisdom', 'stealth'], 'The code gives the name a private set of rules.'),
  word('Wolf', ['wild', 'power'], 'The wolf adds loyal, pack-aware intensity.'),
  word('Ghost', ['stealth'], 'The ghost gives the result a vanishing, hard-to-read edge.'),
];
const SUFFIXES = ['', ' the Wise', ' of the Night', ' Supreme', ' the Swift', ' Unseen', ' Prime', ' the Bold'];
const BLACKLIST = new Set(['ghostface killah', 'method man', 'raekwon', 'inspectah deck', 'u-god', 'masta killa', 'gza', 'rza', "ol' dirty bastard", 'cappadonna']);

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) { result ^= value.charCodeAt(index); result = Math.imul(result, 16777619); }
  return result >>> 0;
}
function pickCompatible(adjective: Word, nouns: readonly Word[], seed: number): Word {
  const compatible = nouns.filter((noun) => noun.tags.some((tag) => adjective.tags.includes(tag)));
  return compatible[seed % compatible.length] ?? nouns[seed % nouns.length]!;
}

export function sanitizeWuTangName(value: string): string {
  return value.replace(/[^a-zA-Z0-9 '\-]/g, '').replace(/\s+/g, ' ').slice(0, 48);
}

/** Returns the same result for the same normalized input and selected style. */
export function generateWuTangName(rawName: string, style: WuTangStyle): WuTangResult | null {
  const input = sanitizeWuTangName(rawName).trim();
  if (!input) return null;
  const seed = hash(`${input.toLocaleLowerCase()}|${style}`);
  const [adjectives, nouns] = style === 'classic' ? [CLASSIC_ADJECTIVES, CLASSIC_NOUNS] : [STREET_ADJECTIVES, STREET_NOUNS];
  const adjective = adjectives[seed % adjectives.length]!;
  const noun = pickCompatible(adjective, nouns, seed >>> 8);
  const suffix = SUFFIXES[(seed >>> 16) % SUFFIXES.length]!;
  const name = `${adjective.word} ${noun.word}${suffix}`;
  if (BLACKLIST.has(name.toLocaleLowerCase())) return null;
  return { name, style, interpretation: `${adjective.meaning} ${noun.meaning}` };
}
