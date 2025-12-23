import React from 'react';
import { LibraryPage } from './pages/LibraryPage';
import { SetsPage } from './pages/SetsPage';

export const App: React.FC = () => {
  const [tab, setTab] = React.useState<'library' | 'sets'>('library');

  const isLibraryTab = tab === 'library';
  const isSetsTab = tab === 'sets';

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Loop Library</h1>
      <p>Local Strudel clip prep tool.</p>

      <hr />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setTab('library')} disabled={isLibraryTab}>
          Library
        </button>
        <button onClick={() => setTab('sets')} disabled={isSetsTab}>
          Sets
        </button>
      </div>

      <hr />
      {isLibraryTab ? <LibraryPage /> : null}
      {isSetsTab ? <SetsPage /> : null}
    </div>
  );
};
