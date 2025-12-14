import React from 'react';

export const App: React.FC = () => {
  const [preloadPing, setPreloadPing] = React.useState<string>('(not checked)');

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
      <p>
        Preload ping: <code>{preloadPing}</code>
      </p>
    </div>
  );
};
