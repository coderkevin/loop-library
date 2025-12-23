import React from 'react';

import type { Track } from '../../../../shared/types';

function TrackRow({ track }: { track: Track }) {
  const title = track.title ?? '(untitled)';
  const artist = track.artist ?? '';
  const subtitle = artist ? `${artist} — ${title}` : title;

  return (
    <li style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <code>{track.path}</code>
      <span>{subtitle}</span>
    </li>
  );
}

export function TracksPanel({ tracks }: { tracks: Track[] }) {
  const hasTracks = tracks.length > 0;

  return (
    <>
      <h2>Tracks</h2>
      <p>
        Indexed tracks: <code>{tracks.length}</code>
      </p>

      {hasTracks ? (
        <ol>
          {tracks.slice(0, 20).map((t) => (
            <TrackRow key={t.id} track={t} />
          ))}
        </ol>
      ) : (
        <p>No tracks indexed yet. Add a library root and run Scan.</p>
      )}
    </>
  );
}


