export type Settings = {
  libraryRoots: string[];
  setsRootDir?: string;
};

export type ScanResult = {
  roots: string[];
  files: string[];
};

export type TrackId = string;
export type ClipId = string;
export type SetId = string;
export type PreparedClipId = string;

export type Track = {
  id: TrackId;
  path: string;

  title?: string;
  artist?: string;

  durationSec?: number;

  bpmDetected?: number;
  bpmOverride?: number;

  keyDetected?: string;
  keyOverride?: string;

  tags?: string[];

  createdAt: string;
  updatedAt: string;
};

export type Clip = {
  id: ClipId;
  trackId: TrackId;
  name: string;

  startSec: number;
  endSec: number;

  // Optional: useful when you later add beat snapping
  startBeat?: number;
  endBeat?: number;

  isLoop: boolean;

  createdAt: string;
  updatedAt: string;
};

export type Set = {
  id: SetId;
  name: string;

  targetBpm: number;
  targetKey?: string;

  exportDir?: string;
  clipIds: ClipId[];

  createdAt: string;
  updatedAt: string;
};

export type PreparedClip = {
  id: PreparedClipId;
  setId: SetId;
  clipId: ClipId;

  bpm: number;
  key?: string;
  format: 'wav';

  path: string;
  createdAt: string;
};
