import React from 'react';

import type { Clip, Set, Track } from '../../../../shared/types';

function SetOption({ s }: { s: Set }) {
  const label = `${s.name} (${s.targetBpm}${s.targetKey ? `, ${s.targetKey}` : ''})`;
  return (
    <option value={s.id}>
      {label}
    </option>
  );
}

function ClipRow({
  clip,
  onRemove,
  disabled,
}: {
  clip: Clip;
  onRemove: (clipId: string) => void;
  disabled: boolean;
}) {
  const handleRemove = React.useCallback(() => onRemove(clip.id), [clip.id, onRemove]);
  const typeLabel = clip.isLoop ? 'loop' : 'one-shot';
  const rangeLabel = `${clip.startSec.toFixed(2)}s → ${clip.endSec.toFixed(2)}s`;

  return (
    <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{ flex: 1 }}>
        <strong>{clip.name}</strong> <code>{typeLabel}</code> <span>{rangeLabel}</span>
      </span>
      <button onClick={handleRemove} disabled={disabled}>
        Remove
      </button>
    </li>
  );
}

export function SetsPanel({
  busy,
  sets,
  selectedSetId,
  onSelectSet,
  onCreateSet,
  onPickExportDir,
  onExportSet,
  selectedSet,
  selectedSetClips,
  tracks,
  onCreateClipAndAddToSet,
  onRemoveClipFromSet,
  lastExportDir,
}: {
  busy: boolean;
  sets: Set[];
  selectedSetId: string | null;
  onSelectSet: (setId: string) => void;
  onCreateSet: (input: { name: string; targetBpm: number; targetKey?: string }) => void;
  onPickExportDir: (setId: string) => void;
  onExportSet: (setId: string) => void;
  selectedSet: Set | null;
  selectedSetClips: Clip[];
  tracks: Track[];
  onCreateClipAndAddToSet: (input: {
    setId: string;
    trackId: string;
    name: string;
    startSec: number;
    endSec: number;
    isLoop: boolean;
  }) => void;
  onRemoveClipFromSet: (input: { setId: string; clipId: string }) => void;
  lastExportDir: string | null;
}) {
  const [newSetName, setNewSetName] = React.useState('My Set');
  const [newSetBpm, setNewSetBpm] = React.useState(130);
  const [newSetKey, setNewSetKey] = React.useState('');

  const hasSets = sets.length > 0;

  const handleCreateSet = React.useCallback(() => {
    const targetKey = newSetKey.trim() ? newSetKey.trim() : undefined;
    onCreateSet({ name: newSetName, targetBpm: newSetBpm, targetKey });
  }, [newSetBpm, newSetKey, newSetName, onCreateSet]);

  const handlePickExportDir = React.useCallback(() => {
    if (!selectedSet) return;
    onPickExportDir(selectedSet.id);
  }, [onPickExportDir, selectedSet]);

  const handleExportSet = React.useCallback(() => {
    if (!selectedSet) return;
    onExportSet(selectedSet.id);
  }, [onExportSet, selectedSet]);

  const handleRemoveClip = React.useCallback(
    (clipId: string) => {
      if (!selectedSet) return;
      onRemoveClipFromSet({ setId: selectedSet.id, clipId });
    },
    [onRemoveClipFromSet, selectedSet],
  );

  const [clipTrackId, setClipTrackId] = React.useState<string>('');
  const [clipName, setClipName] = React.useState('clip_1');
  const [clipStartSec, setClipStartSec] = React.useState(0);
  const [clipEndSec, setClipEndSec] = React.useState(4);
  const [clipIsLoop, setClipIsLoop] = React.useState(true);

  const trackOptions = tracks.map((t) => (
    <option key={t.id} value={t.id}>
      {t.artist ? `${t.artist} — ` : ''}
      {t.title ?? t.path}
    </option>
  ));

  const canCreateClip = Boolean(selectedSet) && Boolean(clipTrackId) && clipEndSec > clipStartSec;

  const handleCreateClip = React.useCallback(() => {
    if (!selectedSet) return;
    if (!canCreateClip) return;
    onCreateClipAndAddToSet({
      setId: selectedSet.id,
      trackId: clipTrackId,
      name: clipName,
      startSec: clipStartSec,
      endSec: clipEndSec,
      isLoop: clipIsLoop,
    });
  }, [canCreateClip, clipEndSec, clipIsLoop, clipName, clipStartSec, clipTrackId, onCreateClipAndAddToSet, selectedSet]);

  return (
    <>
      <h2>Sets</h2>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          Name:{' '}
          <input value={newSetName} onChange={(e) => setNewSetName(e.target.value)} disabled={busy} />
        </label>
        <label>
          BPM:{' '}
          <input
            type="number"
            value={newSetBpm}
            onChange={(e) => setNewSetBpm(Number(e.target.value))}
            disabled={busy}
            style={{ width: 90 }}
          />
        </label>
        <label>
          Key:{' '}
          <input value={newSetKey} onChange={(e) => setNewSetKey(e.target.value)} disabled={busy} style={{ width: 90 }} />
        </label>
        <button onClick={handleCreateSet} disabled={busy}>
          Create set
        </button>
      </div>

      <hr />

      {hasSets ? (
        <>
          <label>
            Select set:{' '}
            <select
              value={selectedSetId ?? ''}
              onChange={(e) => onSelectSet(e.target.value)}
              disabled={busy}
            >
              {sets.map((s) => (
                <SetOption key={s.id} s={s} />
              ))}
            </select>
          </label>

          {selectedSet ? (
            <>
              <p>
                Export dir:{' '}
                <code>{selectedSet.exportDir ? selectedSet.exportDir : '(not set yet)'}</code>{' '}
                <button onClick={handlePickExportDir} disabled={busy}>
                  Pick…
                </button>
                <button onClick={handleExportSet} disabled={busy || !selectedSet.exportDir}>
                  Export prepared clips
                </button>
              </p>
              {lastExportDir ? (
                <p>
                  Last export: <code>{lastExportDir}</code>
                </p>
              ) : null}

              <h3>Create clip for this set</h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <label>
                  Track:{' '}
                  <select
                    value={clipTrackId}
                    onChange={(e) => setClipTrackId(e.target.value)}
                    disabled={busy}
                  >
                    <option value="">(choose)</option>
                    {trackOptions}
                  </select>
                </label>
                <label>
                  Name:{' '}
                  <input value={clipName} onChange={(e) => setClipName(e.target.value)} disabled={busy} />
                </label>
                <label>
                  Start (s):{' '}
                  <input
                    type="number"
                    value={clipStartSec}
                    onChange={(e) => setClipStartSec(Number(e.target.value))}
                    disabled={busy}
                    style={{ width: 90 }}
                  />
                </label>
                <label>
                  End (s):{' '}
                  <input
                    type="number"
                    value={clipEndSec}
                    onChange={(e) => setClipEndSec(Number(e.target.value))}
                    disabled={busy}
                    style={{ width: 90 }}
                  />
                </label>
                <label>
                  Loop:{' '}
                  <input
                    type="checkbox"
                    checked={clipIsLoop}
                    onChange={(e) => setClipIsLoop(e.target.checked)}
                    disabled={busy}
                  />
                </label>
                <button onClick={handleCreateClip} disabled={busy || !canCreateClip}>
                  Create clip
                </button>
              </div>

              <h3>Clips in this set</h3>
              {selectedSetClips.length ? (
                <ul>
                  {selectedSetClips.map((c) => (
                    <ClipRow key={c.id} clip={c} onRemove={handleRemoveClip} disabled={busy} />
                  ))}
                </ul>
              ) : (
                <p>No clips in this set yet.</p>
              )}
            </>
          ) : null}
        </>
      ) : (
        <p>No sets yet. Create one above.</p>
      )}
    </>
  );
}


