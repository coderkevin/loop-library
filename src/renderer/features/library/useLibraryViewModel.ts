import React from 'react';

import { createLibraryController } from './libraryController';
import { loopLibraryHttpApi } from '../../api/loopLibraryHttpApi';
import type { Track } from '../../../shared/types';

type SettingsShape = { libraryRoots: string[] };

export function useLibraryViewModel() {
  const controller = React.useMemo(() => createLibraryController(loopLibraryHttpApi), []);

  const [settings, setSettings] = React.useState<SettingsShape | null>(null);
  const [tracks, setTracks] = React.useState<Track[]>([]);
  const [scanCount, setScanCount] = React.useState<number | null>(null);
  const [scanPreview, setScanPreview] = React.useState<string[]>([]);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    void controller
      .loadSettings()
      .then(setSettings)
      .catch(() => setSettings(null));

    void controller
      .listTracks()
      .then(setTracks)
      .catch(() => setTracks([]));
  }, [controller]);

  const addRoot = async () => {
    setBusy(true);
    try {
      const updatedSettings = await controller.addRootViaPicker();
      if (updatedSettings) {
        setSettings(updatedSettings);
      }
    } finally {
      setBusy(false);
    }
  };

  const removeRoot = async (root: string) => {
    setBusy(true);
    try {
      const updatedSettings = await controller.removeRoot(root);
      setSettings(updatedSettings);
    } finally {
      setBusy(false);
    }
  };

  const scan = async () => {
    setBusy(true);
    try {
      const res = await controller.scan();
      setScanCount(res.files.length);
      setScanPreview(res.files.slice(0, 10));

      const updatedTracks = await controller.listTracks();
      setTracks(updatedTracks);
    } finally {
      setBusy(false);
    }
  };

  return {
    busy,
    settings,
    tracks,
    scanCount,
    scanPreview,
    addRoot,
    removeRoot,
    scan,
  };
}
