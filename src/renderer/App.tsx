import React from 'react';
import { PreloadStatus } from './components/PreloadStatus';
import { LibraryRootsPanel } from './features/library/components/LibraryRootsPanel';
import { ScanResultPanel } from './features/library/components/ScanResultPanel';
import { useLibraryViewModel } from './features/library/useLibraryViewModel';

export const App: React.FC = () => {
  const [preloadPing, setPreloadPing] = React.useState<string>('(not checked)');
  const vm = useLibraryViewModel();

  React.useEffect(() => {
    try {
      const result = window.loopLibrary?.ping?.();
      setPreloadPing(result ?? '(preload missing)');
    } catch {
      setPreloadPing('(error calling preload)');
    }
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Loop Library</h1>
      <p>Empty Electron + React shell, ready to grow.</p>
      <PreloadStatus ping={preloadPing} />

      <hr />
      <LibraryRootsPanel
        libraryRoots={vm.settings?.libraryRoots ?? []}
        busy={vm.busy}
        onAddFolder={vm.addRoot}
        onRemoveFolder={vm.removeRoot}
        onScan={vm.scan}
      />

      <hr />
      <ScanResultPanel scanCount={vm.scanCount} scanPreview={vm.scanPreview} />
    </div>
  );
};
