import type { Express } from 'express';

export type ServerHandle = { close: () => Promise<void> };
export type ListenFn = (app: Express, port: number, host: string) => Promise<ServerHandle>;

export function createStartServer({
  host,
  port,
  listen,
}: {
  host: string;
  port: number;
  listen: ListenFn;
}) {
  let started: { url: string } | null = null;
  let serverHandle: ServerHandle | null = null;

  async function startServer({
    createApp,
  }: {
    createApp: () => Express;
  }): Promise<{ url: string }> {
    if (started) {
      return started;
    }

    const app = createApp();
    serverHandle = await listen(app, port, host);

    started = { url: `http://${host}:${port}` };
    return started;
  }

  async function stopServer(): Promise<void> {
    if (!serverHandle) {
      return;
    }
    await serverHandle.close();
    serverHandle = null;
    started = null;
  }

  return { startServer, stopServer };
}
