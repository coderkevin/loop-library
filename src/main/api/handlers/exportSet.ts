import type { Request, Response } from 'express';

import { exportSet } from '../../export/exportSet.js';
import type { ApiDeps } from '../types.js';

type ExportSetBody = { setId?: string };

export function createExportSetHandler(
  deps: Pick<
    ApiDeps,
    'loadSets' | 'loadClips' | 'loadTracks' | 'loadPreparedClips' | 'savePreparedClips'
  >,
) {
  return async function exportSetHandler(req: Request, res: Response) {
    const body = req.body as ExportSetBody;
    if (!body.setId) {
      res.status(400).json({ error: 'setId is required' });
      return;
    }

    try {
      const [sets, clips, tracks, prepared] = await Promise.all([
        deps.loadSets(),
        deps.loadClips(),
        deps.loadTracks(),
        deps.loadPreparedClips(),
      ]);

      const out = await exportSet({ setId: body.setId, sets, clips, tracks });
      const merged = [...prepared, ...out.preparedClips];
      await deps.savePreparedClips(merged);

      res.json({ exportDir: out.exportDir, preparedClips: out.preparedClips });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  };
}
