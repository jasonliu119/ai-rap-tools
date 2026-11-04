export const RAP_STYLES = [
  'trap', 'drill', 'boom-bap', 'melodic', 'luxury', 'underground', 'west-coast', 'futuristic',
] as const;
export type RapStyle = (typeof RAP_STYLES)[number];
export type RapForm = 'mixed' | 'two-words' | 'one-word' | 'prefix' | 'mc-dj' | 'initials' | 'da-the' | 'concept';
export type NameOptions = { style: RapStyle; form: RapForm; mustInclude?: string; noNumbers?: boolean };

export const RAP_FORMS: ReadonlyArray<{ value: RapForm; label: string }> = [
  { value: 'mixed', label: 'Mixed' }, { value: 'two-words', label: 'Two words' },
  { value: 'one-word', label: 'One word' }, { value: 'prefix', label: 'Lil / Young / Big' },
  { value: 'mc-dj', label: 'MC / DJ' }, { value: 'initials', label: 'Initials' },
  { value: 'da-the', label: 'Da / The' }, { value: 'concept', label: 'Concept phrase' },
];

type WordSet = { adjectives: readonly string[]; nouns: readonly string[] };
const words = (adjectives: string, nouns: string): WordSet => ({ adjectives: adjectives.split(' '), nouns: nouns.split(' ') });
const WORDS: Record<RapStyle, WordSet> = {
  trap: words('Velvet Neon Silent Fast Heavy Purple Cold Dirty Night Gold', 'Flame Wave Bag Ghost Cash Crown Flex Code Saint Rain'),
  drill: words('Steel Grim Black Low Hard Grey Raw Cold Brick Quiet', 'Block Blade Signal Smoke Haze Rook Static Cement Riot Viper'),
  'boom-bap': words('Vinyl Golden Basement Sunday Rough Dusty Uptown Late Analog Broadway', 'Cipher Canvas Drum Poet Corner Crate Rhythm Scholar Splice Sermon'),
  melodic: words('Silver Midnight Blue Open Soft Summer Velvet Dream Rose Fallen', 'Echo Sky Chorus Rain Halo Letter Melody Bloom Moon Lullaby'),
  luxury: words('Platinum Silk Royal Diamond First Golden Private Velour Grand Rare', 'Crown Marble Champagne Palace Midas Porsche Velvet Suite Fortune Gold'),
  underground: words('Basement Broken Hidden Acid Gravel Feral Rust Secret Crooked After', 'Signal Tunnel Poet Noise Motel Wound Static Candle Shadow Basement'),
  'west-coast': words('Palm Sunset Low Pacific Chrome Coastal Golden Slick Day Blue', 'Rider Wave Boulevard Cadillac Breeze Dayton Cali Cruise Sun Ocean'),
  futuristic: words('Chrome Laser Nova Digital Quantum Neon Orbit Zero Cyber Solar', 'Signal Void Pulse Pixel Circuit Comet Syntax Vapor System Future'),
};
const CONCEPTS = ['Concrete Poet', 'Midnight Census', 'Second Hand Prophet', 'Half Moon Hustler', 'Neon Psalm', 'Cheap Velvet', 'Last Call Oracle', 'Static Saint', 'Basement Opera', 'Pocketful of Thunder', 'Chrome Confessional', 'Corner Store Comet', 'Night Shift King', 'Paper Crown', 'Cold Coffee Gospel', 'Sunset Receipt', 'Velvet Alarm', 'Broken Meter', 'Parallel Rhyme', 'Golden Hour Ghost'];
const PREFIXES = ['Lil', 'Young', 'Big', 'King', 'Jay'];
const BLOCKLIST = new Set(['drake', 'kendrick lamar', 'travis scott', 'nicki minaj', 'cardi b', 'eminem', 'jay z', 'kanye west', 'snoop dogg', 'lil wayne', 'tupac', 'notorious big']);

export function sanitizeRapNameInput(value: string): string {
  return value.replace(/[^a-zA-Z ]/g, '').replace(/\s+/g, ' ').trim().slice(0, 12);
}
const keyFor = (name: string) => name.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const mutate = (word: string) => word.length > 4 ? `${word.slice(0, -1)}zy` : `${word}o`;
const initials = (value: string) => value.split(' ').filter(Boolean).map((part) => part[0]).join('').toUpperCase();

/** Builds a finite candidate deck; it never retries random generations in a loop. */
export function buildRapNamePool(options: NameOptions): string[] {
  const deck = WORDS[options.style];
  const include = sanitizeRapNameInput(options.mustInclude ?? '');
  const forms = options.form === 'mixed' ? RAP_FORMS.filter(({ value }) => value !== 'mixed').map(({ value }) => value) : [options.form];
  const candidates: string[] = [];
  const add = (candidate: string) => {
    const name = include ? `${include} ${candidate}` : candidate;
    const key = keyFor(name);
    if (key && !BLOCKLIST.has(key) && !(options.noNumbers && /\d/.test(name))) candidates.push(name);
  };
  for (const form of forms) {
    if (form === 'concept') CONCEPTS.forEach(add);
    for (const noun of deck.nouns) {
      if (form === 'one-word') add(mutate(noun));
      if (form === 'prefix') PREFIXES.forEach((prefix) => add(`${prefix} ${noun}`));
      if (form === 'mc-dj') ['MC', 'DJ'].forEach((prefix) => add(`${prefix} ${noun}`));
      if (form === 'da-the') ['Da', 'The'].forEach((prefix) => add(`${prefix} ${noun}`));
      if (form === 'initials') add(`${include ? initials(include) || 'K' : noun[0]}-Dub`);
      if (form === 'two-words') deck.adjectives.forEach((adjective) => add(`${adjective} ${noun}`));
    }
  }
  return [...new Map(candidates.map((name) => [keyFor(name), name])).values()];
}

export function shuffledRapNames(options: NameOptions, random: () => number = Math.random): string[] {
  const pool = buildRapNamePool(options);
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [pool[index], pool[target]] = [pool[target]!, pool[index]!];
  }
  return pool;
}

/** Keeps batches varied by allowing a final-word root no more than twice. */
export function takeRapNameBatch(names: readonly string[], count = 12): string[] {
  const rootCounts = new Map<string, number>();
  const batch: string[] = [];
  for (const name of names) {
    const root = keyFor(name).split(' ').at(-1);
    if (!root || (rootCounts.get(root) ?? 0) >= 2) continue;
    batch.push(name); rootCounts.set(root, (rootCounts.get(root) ?? 0) + 1);
    if (batch.length === count) break;
  }
  return batch;
}
