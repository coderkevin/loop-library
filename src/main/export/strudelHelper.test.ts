import { describe, expect, it } from 'vitest';

import type { Clip, PreparedClip } from '../../shared/types';
import { buildStrudelHelperSource } from './strudelHelper';

describe('buildStrudelHelperSource', () => {
  it('builds a JS module mapping clip keys to files', () => {
    const clip: Clip = {
      id: 'c1',
      trackId: 't1',
      name: 'Intro 4bar',
      startSec: 0,
      endSec: 4,
      isLoop: true,
      createdAt: 't',
      updatedAt: 't',
    };

    const prepared: PreparedClip = {
      id: 's:c1',
      setId: 's',
      clipId: 'c1',
      bpm: 130,
      format: 'wav',
      path: '/out/intro.wav',
      createdAt: 't',
    };

    const src = buildStrudelHelperSource({
      preparedClips: [prepared],
      clipsById: new Map([[clip.id, clip]]),
      exportDir: '/out',
    });

    expect(src).toContain('export const clips');
    expect(src).toContain('"intro_4bar"');
    expect(src).toContain('./intro.wav');
    expect(src).toContain('export const loopClips');
  });
});
