import { describe, expect, it } from 'vitest';

import { isAllowedDevOrigin } from './originAllowlist';

describe('isAllowedDevOrigin', () => {
  it('allows undefined origin (non-browser callers)', () => {
    expect(isAllowedDevOrigin(undefined)).toBe(true);
  });

  it('allows localhost and 127.0.0.1 Vite origins', () => {
    expect(isAllowedDevOrigin('http://localhost:5173')).toBe(true);
    expect(isAllowedDevOrigin('http://127.0.0.1:5173')).toBe(true);
  });

  it('rejects other origins', () => {
    expect(isAllowedDevOrigin('http://localhost:9999')).toBe(false);
    expect(isAllowedDevOrigin('http://evil.invalid')).toBe(false);
  });
});


