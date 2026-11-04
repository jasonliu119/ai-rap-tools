import { describe, expect, it } from 'vitest';
import { generateWuTangName, sanitizeWuTangName } from '../src/tools/wu-tang-name.js';

describe('Wu-Tang-style name generator', () => {
  it('is deterministic after input normalization', () => {
    expect(generateWuTangName('  Maya  ', 'classic')).toEqual(generateWuTangName('maya', 'classic'));
  });
  it('uses the selected style in its deterministic key', () => {
    expect(generateWuTangName('Maya', 'classic')?.name).not.toBe(generateWuTangName('Maya', 'street')?.name);
  });
  it('removes unsupported input and rejects an empty name', () => {
    expect(sanitizeWuTangName('May@!a')).toBe('Maya');
    expect(generateWuTangName('@@@', 'classic')).toBeNull();
  });
});
