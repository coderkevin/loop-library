const DEV_ALLOWED_ORIGINS = new Set(['http://localhost:5173', 'http://127.0.0.1:5173']);

export function isAllowedDevOrigin(origin: string | undefined): boolean {
  // Allow non-browser callers (no Origin header), e.g. curl, Electron.
  if (!origin) {
    return true;
  }
  return DEV_ALLOWED_ORIGINS.has(origin);
}


