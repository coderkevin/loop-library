import { describe, expect, it, vi } from 'vitest';

import type { Express } from 'express';
import { createStartServer } from './startServer';

describe('startServer', () => {
  it('starts only once and caches the url', async () => {
    const listen = vi.fn(async () => ({ close: vi.fn(async () => undefined) }));
    const lifecycle = createStartServer({ host: '127.0.0.1', port: 3123, listen });

    const createApp = vi.fn(() => ({}) as unknown as Express);

    const a = await lifecycle.startServer({ createApp });
    const b = await lifecycle.startServer({ createApp });

    expect(a).toEqual({ url: 'http://127.0.0.1:3123' });
    expect(b).toEqual({ url: 'http://127.0.0.1:3123' });
    expect(createApp).toHaveBeenCalledTimes(1);
    expect(listen).toHaveBeenCalledTimes(1);
  });

  it('stopServer closes and allows re-start', async () => {
    const close = vi.fn(async () => undefined);
    const listen = vi.fn(async () => ({ close }));
    const lifecycle = createStartServer({ host: '127.0.0.1', port: 3123, listen });

    const createApp = vi.fn(() => ({}) as unknown as Express);

    await lifecycle.startServer({ createApp });
    await lifecycle.stopServer();
    await lifecycle.startServer({ createApp });

    expect(close).toHaveBeenCalledTimes(1);
    expect(listen).toHaveBeenCalledTimes(2);
  });
});
