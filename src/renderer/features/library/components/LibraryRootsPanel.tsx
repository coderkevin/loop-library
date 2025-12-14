import React from 'react';

function LibraryRootItem({
  root,
  busy,
  onRemoveFolder,
}: {
  root: string;
  busy: boolean;
  onRemoveFolder: (root: string) => void;
}) {
  const handleRemove = React.useCallback(() => {
    onRemoveFolder(root);
  }, [onRemoveFolder, root]);

  return (
    <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <code style={{ flex: 1 }}>{root}</code>
      <button onClick={handleRemove} disabled={busy}>
        Remove
      </button>
    </li>
  );
}

export function LibraryRootsPanel({
  libraryRoots,
  busy,
  onAddFolder,
  onRemoveFolder,
  onScan,
}: {
  libraryRoots: string[];
  busy: boolean;
  onAddFolder: () => void;
  onRemoveFolder: (root: string) => void;
  onScan: () => void;
}) {
  const isScanDisabled = busy || libraryRoots.length === 0;
  const hasRoots = libraryRoots.length > 0;

  return (
    <>
      <h2>Library Roots</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={onAddFolder} disabled={busy}>
          Add folder…
        </button>
        <button onClick={onScan} disabled={isScanDisabled}>
          Scan
        </button>
        {busy ? <span>Working…</span> : null}
      </div>

      <div style={{ marginTop: 12 }}>
        {hasRoots ? (
          <ul>
            {libraryRoots.map((root) => (
              <LibraryRootItem key={root} root={root} busy={busy} onRemoveFolder={onRemoveFolder} />
            ))}
          </ul>
        ) : (
          <p>No library roots yet.</p>
        )}
      </div>
    </>
  );
}
