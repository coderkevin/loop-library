import React from 'react';

import { SetsPanel } from '../features/sets/components/SetsPanel';
import { useSetsViewModel } from '../features/sets/useSetsViewModel';

export function SetsPage() {
  const vm = useSetsViewModel();

  return (
    <SetsPanel
      busy={vm.busy}
      sets={vm.sets}
      selectedSetId={vm.selectedSetId}
      onSelectSet={vm.setSelectedSetId}
      onCreateSet={vm.createSet}
      onPickExportDir={vm.pickExportDir}
      onExportSet={vm.exportSelectedSet}
      selectedSet={vm.selectedSet}
      selectedSetClips={vm.selectedSetClips}
      tracks={vm.tracks}
      onCreateClipAndAddToSet={vm.createClipAndAddToSet}
      onRemoveClipFromSet={vm.removeClipFromSet}
      lastExportDir={vm.lastExportDir}
    />
  );
}


