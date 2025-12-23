import type { Clip, PreparedClip, Set, Settings, Track } from '../../shared/types.js';
import { readJsonFile, writeJsonFile } from './jsonFile.js';
import { clipsFile, preparedClipsFile, setsFile, settingsFile, tracksFile } from './paths.js';

export async function loadSettingsStore(): Promise<Settings> {
  return readJsonFile(settingsFile(), { libraryRoots: [] });
}

export async function saveSettingsStore(settings: Settings): Promise<void> {
  await writeJsonFile(settingsFile(), settings);
}

export async function loadTracksStore(): Promise<Track[]> {
  return readJsonFile(tracksFile(), []);
}

export async function saveTracksStore(tracks: Track[]): Promise<void> {
  await writeJsonFile(tracksFile(), tracks);
}

export async function loadClipsStore(): Promise<Clip[]> {
  return readJsonFile(clipsFile(), []);
}

export async function saveClipsStore(clips: Clip[]): Promise<void> {
  await writeJsonFile(clipsFile(), clips);
}

export async function loadSetsStore(): Promise<Set[]> {
  return readJsonFile(setsFile(), []);
}

export async function saveSetsStore(sets: Set[]): Promise<void> {
  await writeJsonFile(setsFile(), sets);
}

export async function loadPreparedClipsStore(): Promise<PreparedClip[]> {
  return readJsonFile(preparedClipsFile(), []);
}

export async function savePreparedClipsStore(items: PreparedClip[]): Promise<void> {
  await writeJsonFile(preparedClipsFile(), items);
}
