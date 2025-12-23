import React from 'react';

import type { Clip, Set, Track } from '../../../shared/types';
import { loopLibraryHttpApi } from '../../api/loopLibraryHttpApi';
import { createLibraryController } from '../library/libraryController';

export function useSetsViewModel() {
  const controller = React.useMemo(() => createLibraryController(loopLibraryHttpApi), []);

  const [busy, setBusy] = React.useState(false);
  const [sets, setSets] = React.useState<Set[]>([]);
  const [clips, setClips] = React.useState<Clip[]>([]);
  const [tracks, setTracks] = React.useState<Track[]>([]);
  const [selectedSetId, setSelectedSetId] = React.useState<string | null>(null);
  const [lastExportDir, setLastExportDir] = React.useState<string | null>(null);

  const selectedSet = React.useMemo(
    () => sets.find((s) => s.id === selectedSetId) ?? null,
    [sets, selectedSetId],
  );

  const selectedSetClips = React.useMemo(() => {
    if (!selectedSet) return [];
    const ids = new Set(selectedSet.clipIds);
    return clips.filter((c) => ids.has(c.id));
  }, [clips, selectedSet]);

  const refresh = React.useCallback(async () => {
    const [setsRes, clipsRes, tracksRes] = await Promise.all([
      controller.listSets(),
      controller.listClips(),
      controller.listTracks(),
    ]);

    setSets(setsRes);
    setClips(clipsRes);
    setTracks(tracksRes);

    if (setsRes.length && !selectedSetId) {
      setSelectedSetId(setsRes[0].id);
    }
  }, [controller, selectedSetId]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const createSet = async (input: { name: string; targetBpm: number; targetKey?: string }) => {
    setBusy(true);
    try {
      const created = await controller.createSet(input);
      await refresh();
      setSelectedSetId(created.id);
    } finally {
      setBusy(false);
    }
  };

  const pickExportDir = async (setId: string) => {
    setBusy(true);
    try {
      await controller.pickSetExportDir(setId);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const createClipAndAddToSet = async (input: {
    setId: string;
    trackId: string;
    name: string;
    startSec: number;
    endSec: number;
    isLoop: boolean;
  }) => {
    setBusy(true);
    try {
      const clip = await controller.createClip({
        trackId: input.trackId,
        name: input.name,
        startSec: input.startSec,
        endSec: input.endSec,
        isLoop: input.isLoop,
      });
      await controller.addClipToSet({ setId: input.setId, clipId: clip.id });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const removeClipFromSet = async (input: { setId: string; clipId: string }) => {
    setBusy(true);
    try {
      await controller.removeClipFromSet(input);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const exportSelectedSet = async (setId: string) => {
    setBusy(true);
    try {
      const res = await controller.exportSet(setId);
      setLastExportDir(res.exportDir);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return {
    busy,
    sets,
    clips,
    tracks,

    selectedSetId,
    setSelectedSetId,
    selectedSet,
    selectedSetClips,
    lastExportDir,

    refresh,
    createSet,
    pickExportDir,
    createClipAndAddToSet,
    removeClipFromSet,
    exportSelectedSet,
  };
}


