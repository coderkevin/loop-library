import React from 'react';

import { LibraryRootsPanel } from '../features/library/components/LibraryRootsPanel';
import { ScanResultPanel } from '../features/library/components/ScanResultPanel';
import { TracksPanel } from '../features/library/components/TracksPanel';
import { useLibraryViewModel } from '../features/library/useLibraryViewModel';

export function LibraryPage() {
  const vm = useLibraryViewModel();
  const libraryRoots = vm.settings?.libraryRoots ?? [];

  return (
    <>
      <LibraryRootsPanel
        libraryRoots={libraryRoots}
        busy={vm.busy}
        onAddFolder={vm.addRoot}
        onRemoveFolder={vm.removeRoot}
        onScan={vm.scan}
      />

      <hr />
      <ScanResultPanel scanCount={vm.scanCount} scanPreview={vm.scanPreview} />

      <hr />
      <TracksPanel tracks={vm.tracks} />
    </>
  );
}


