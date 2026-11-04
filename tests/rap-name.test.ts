import { describe, expect, it } from 'vitest';
import { buildRapNamePool, sanitizeRapNameInput, shuffledRapNames, takeRapNameBatch } from '../src/tools/rap-name.js';

describe('rap name generator', () => {
  it('creates a useful, unique deck for every style', () => {
    for (const style of ['trap', 'drill', 'boom-bap', 'melodic', 'luxury', 'underground', 'west-coast', 'futuristic'] as const) {
      const names = shuffledRapNames({ style, form: 'mixed', noNumbers: true }, () => 0.42);
      expect(names.length).toBeGreaterThanOrEqual(12);
      expect(new Set(names.map((name) => name.toLowerCase())).size).toBe(names.length);
    }
  });
  it('sanitizes the optional fragment and prefixes a two-word form', () => {
    expect(sanitizeRapNameInput('<script>Jay 123</script>')).toBe('scriptJay sc');
    expect(buildRapNamePool({ style: 'trap', form: 'two-words', mustInclude: 'Ace' }).every((name) => name.startsWith('Ace '))).toBe(true);
  });
  it('limits each final-word root to two per batch', () => {
    expect(takeRapNameBatch(['Velvet Flame', 'Neon Flame', 'Silent Flame', 'Young Wave', 'Cold Wave', 'Night Ghost'])).toEqual(['Velvet Flame', 'Neon Flame', 'Young Wave', 'Cold Wave', 'Night Ghost']);
  });
});
