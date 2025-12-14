import React from 'react';

export function PreloadStatus({ ping }: { ping: string }) {
  return (
    <p>
      Preload ping: <code>{ping}</code>
    </p>
  );
}


